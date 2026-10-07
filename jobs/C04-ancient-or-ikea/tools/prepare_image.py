"""Prepare a local, single-frame raster image; never fetch or verify licences."""
from __future__ import annotations

import argparse
import hashlib
import ipaddress
from io import BytesIO
import json
import math
import os
from pathlib import Path
import re
import tempfile
from urllib.parse import urlsplit
import warnings

from PIL import Image, ImageOps

MAX_DIMENSION = 512
MAX_BYTES = 40_000
MAX_SOURCE_BYTES = 32 * 1024 * 1024
QUALITIES = (85, 75, 65, 55, 45, 35, 25, 15, 5, 0)
LICENCES = ('CC0', 'CC-BY', 'public-domain')
Image.MAX_IMAGE_PIXELS = 40_000_000


def validate_provenance(author: str, licence: str, source: str) -> str:
    author = author.strip()
    if not author or len(author) > 1000:
        raise ValueError('A nonempty author of at most 1000 characters is required')
    if licence not in LICENCES:
        raise ValueError('Licence must be CC0, CC-BY or public-domain')
    # urlsplit removes some control characters; check the supplied URL first.
    if (not source or len(source) > 4096
            or any(c.isspace() or ord(c) < 32 or 127 <= ord(c) <= 159 for c in source)
            or any(c in source for c in ('\\', '?', '#'))
            or re.search(r'%(?![0-9a-fA-F]{2})', source)):
        raise ValueError('Source must be a well-formed HTTPS URL without whitespace, controls, query or fragment')
    parsed = urlsplit(source)
    authority = parsed.netloc
    if parsed.scheme != 'https' or not authority or not parsed.hostname:
        raise ValueError('Source must be an absolute HTTPS record or media URL')
    if '@' in authority or '%' in authority:
        raise ValueError('Source URL must not contain credentials or escaped host characters')
    # Validate the complete authority, including empty ports and text after ].
    if authority.startswith('['):
        if not authority.endswith(']'):
            raise ValueError('Source URL must not contain an explicit port or malformed IPv6 host')
        ipaddress.IPv6Address(authority[1:-1])
    else:
        if any(c in authority for c in (':', '[', ']')):
            raise ValueError('Source URL must not contain an explicit port or malformed host')
        ascii_hostname = authority.encode('idna').decode('ascii').removesuffix('.')
        if re.fullmatch(r'[0-9.]+', ascii_hostname):
            ipaddress.IPv4Address(ascii_hostname)
        else:
            labels = ascii_hostname.split('.')
            if len(ascii_hostname) > 253 or any(
                not re.fullmatch(r'[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?', label)
                for label in labels
            ):
                raise ValueError('Source URL must have a valid DNS or IP hostname')
    return author


def same_file(first: Path, second: Path) -> bool:
    if first.resolve() == second.resolve():
        return True
    return first.exists() and second.exists() and os.path.samefile(first, second)


def validate_paths(source: Path, output: Path, metadata: Path, source_root: Path | None) -> Path:
    resolved = source.resolve(strict=True)
    if not resolved.is_file():
        raise ValueError('Input must be a regular file')
    if resolved.stat().st_size > MAX_SOURCE_BYTES:
        raise ValueError('Input exceeds the 32 MiB source limit')
    if source_root is not None:
        root = source_root.resolve(strict=True)
        if not root.is_dir() or not resolved.is_relative_to(root):
            raise ValueError('Input must resolve inside the source root')
    for first, second in ((source, output), (source, metadata), (output, metadata)):
        if same_file(first, second):
            raise ValueError('Input, output and metadata paths must be different files, including aliases')
    for destination in (output, metadata):
        if os.path.lexists(destination) and not destination.is_file():
            raise ValueError('Existing output and metadata destinations must be regular files')
    return resolved


def load_image(path: Path) -> Image.Image:
    with warnings.catch_warnings():
        warnings.simplefilter('error', Image.DecompressionBombWarning)
        with Image.open(path) as probe:
            if getattr(probe, 'n_frames', 1) != 1:
                raise ValueError('Animated images are not supported')
            probe.verify()
        with Image.open(path) as loaded:
            loaded.load()
            transparent = 'A' in loaded.getbands() or 'transparency' in loaded.info
            oriented = ImageOps.exif_transpose(loaded)
            result = oriented.convert('RGBA' if transparent else 'RGB')
    # Encoding carries no EXIF, location, embedded thumbnails, XMP or ICC bytes.
    result.info.clear()
    return result


def encode(image: Image.Image) -> tuple[bytes, int, int, int]:
    width, height = image.size
    side = min(MAX_DIMENSION, max(width, height))
    while side >= 1:
        scale = min(1.0, side / max(width, height))
        size = (max(1, round(width * scale)), max(1, round(height * scale)))
        resized = image.copy() if size == image.size else image.resize(size, Image.Resampling.LANCZOS)
        for quality in QUALITIES:
            buffer = BytesIO()
            resized.save(buffer, format='WEBP', quality=quality, method=4,
                         lossless=False, exact=True, alpha_quality=100,
                         exif=b'', xmp=b'', icc_profile=b'')
            content = buffer.getvalue()
            if len(content) < MAX_BYTES:
                return content, size[0], size[1], quality
        if side == 1:
            break
        side = max(1, math.floor(side * 0.85))
    raise ValueError('Unable to encode below the strict 40000-byte limit')


def stage(path: Path, content: bytes) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(prefix='.image-', suffix='.tmp',
                                     dir=path.parent, delete=False) as temporary:
        temporary.write(content)
        return Path(temporary.name)


def prepare(source: Path, output: Path, metadata_path: Path, author: str,
            licence: str, original_url: str, source_root: Path | None) -> dict[str, object]:
    author = validate_provenance(author, licence, original_url)
    resolved = validate_paths(source, output, metadata_path, source_root)
    image = load_image(resolved)
    content, width, height, quality = encode(image)
    metadata: dict[str, object] = {
        'source': original_url,
        'author': author,
        'license': licence,
        'width': width,
        'height': height,
        'bytes': len(content),
        'sha256': hashlib.sha256(content).hexdigest(),
        'quality': quality,
        'mediaType': 'image/webp',
        'provenanceStatus': 'caller-supplied',
    }
    metadata_bytes = (json.dumps(metadata, ensure_ascii=False, sort_keys=True,
                                 indent=2, allow_nan=False) + '\n').encode('utf-8')
    staged = []
    try:
        staged.append(stage(output, content))
        staged.append(stage(metadata_path, metadata_bytes))
        # Recheck aliases immediately before replacing destinations.
        validate_paths(source, output, metadata_path, source_root)
        os.replace(staged[0], output)
        os.replace(staged[1], metadata_path)
    finally:
        for temporary in staged:
            temporary.unlink(missing_ok=True)
    return metadata


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('output', type=Path)
    parser.add_argument('--license', required=True, choices=LICENCES)
    parser.add_argument('--author', required=True)
    parser.add_argument('--source', required=True)
    parser.add_argument('--source-root', type=Path)
    parser.add_argument('--metadata-output', type=Path)
    args = parser.parse_args()
    metadata = args.metadata_output or Path(str(args.output) + '.json')
    try:
        result = prepare(args.input, args.output, metadata, args.author,
                         args.license, args.source, args.source_root)
    except Exception as error:
        parser.exit(1, f'Image preparation failed: {error}\n')
    print(json.dumps(result, ensure_ascii=False, sort_keys=True, allow_nan=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
