import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { Ajv } from "ajv";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const jobRoot = [resolve(testDirectory, ".."), resolve(testDirectory, "../..")]
  .find((candidate) => existsSync(join(candidate, "package.json")));
assert.ok(jobRoot, "the image test must run inside its package");
const python = process.env.PARTYBOX_PORTRAIT_PYTHON || (
  existsSync("/workspace/.partybox-source-venv/bin/python")
    ? "/workspace/.partybox-source-venv/bin/python"
    : "python"
);
const tool = join(jobRoot, "tools", "prepare_image.py");
// These fictitious record/media URLs identify synthetic test input only.
// Generated patterns are never attached to museum objects or published as object photographs.
const source = "https://museum.example/records/synthetic-test-pattern-only-not-a-real-object";
const author = "Synthetic test image generator (no real object photograph)";
const allowedQualities = [85, 75, 65, 55, 45, 35, 25, 15, 5, 0];
const validAttribution = ["--license", "CC0", "--author", author, "--source", source];

interface Pattern {
  name: string;
  input: string;
  // Dimensions describe the source after applying its EXIF orientation.
  width: number;
  height: number;
}

interface Inspection {
  path: string;
  format: string;
  width: number;
  height: number;
  alphaExtrema: [number, number] | null;
  cornerAlpha: number[] | null;
  centerAlpha: number | null;
  partialAlpha: number | null;
  exifPresent: boolean;
  iccPresent: boolean;
  xmpPresent: boolean;
}

interface Metadata {
  source: string;
  author: string;
  license: string;
  width: number;
  height: number;
  bytes: number;
  sha256: string;
  quality: number;
  mediaType: string;
  provenanceStatus: string;
}

let temporaryDirectory: string;
let patterns: Pattern[];

function runPython(script: string, arguments_: string[] = [], input?: string): string {
  const result = spawnSync(python, ["-c", script, ...arguments_], {
    encoding: "utf8",
    timeout: 30_000,
    ...(input === undefined ? {} : { input }),
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function convert(input: string, output: string, arguments_ = validAttribution) {
  const result = spawnSync(python, [tool, input, output, ...arguments_], {
    cwd: jobRoot,
    encoding: "utf8",
    timeout: 30_000,
  });
  assert.equal(result.error, undefined, `Python conversion failed for ${input}: ${result.error?.message}`);
  return result;
}

function readMetadata(path: string): Metadata {
  return JSON.parse(readFileSync(path, "utf8")) as Metadata;
}

function expectRejection(input: string, output: string, arguments_ = validAttribution): void {
  const result = convert(input, output, arguments_);
  assert.notEqual(result.status, 0, `invalid request succeeded: ${JSON.stringify(arguments_)}`);
  assert.ok(result.stderr.trim(), "rejected requests explain their failure on stderr");
}

function rejectedWithoutWrites(name: string, input: string, arguments_: string[]): void {
  const directory = join(temporaryDirectory, name);
  mkdirSync(directory, { recursive: true });
  const output = join(directory, "existing.webp");
  const metadata = `${output}.json`;
  const outputSentinel = Buffer.from("existing image must survive a rejected request");
  const metadataSentinel = Buffer.from("existing metadata must survive a rejected request");
  const sourceBytes = readFileSync(input);
  writeFileSync(output, outputSentinel);
  writeFileSync(metadata, metadataSentinel);
  expectRejection(input, output, arguments_);
  assert.deepEqual(readFileSync(input), sourceBytes, "rejection preserves the input");
  assert.deepEqual(readFileSync(output), outputSentinel, "rejection preserves existing output");
  assert.deepEqual(readFileSync(metadata), metadataSentinel, "rejection preserves existing metadata");
}

before(() => {
  temporaryDirectory = mkdtempSync(join(tmpdir(), "partybox-synthetic-image-test-"));
  patterns = JSON.parse(runPython(String.raw`
import json
import random
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageCms, PngImagePlugin

directory = Path(sys.argv[1])
manifest = []
for index in range(30):
    if index == 0:
        width, height = 17, 11
    elif index == 1:
        width, height = 1024, 512
    elif index == 2:
        width, height = 512, 1024
    elif index == 3:
        width, height = 512, 512
    elif index == 4:
        width, height = 384, 384
    elif index == 5:
        width, height = 512, 512
    else:
        width = 320 + (index % 6) * 64
        height = 240 + (index % 5) * 64
    rgba = index in (0, 3, 4)
    mode = "RGBA" if rgba else "RGB"
    if index == 4:
        pixels = random.Random(2700 + index).randbytes(width * height * 4)
        image = Image.frombytes("RGBA", (width, height), pixels)
    elif index == 5:
        pixels = random.Random(2700 + index).randbytes(width * height * 3)
        image = Image.frombytes("RGB", (width, height), pixels)
    else:
        image = Image.new(mode, (width, height))
        draw = ImageDraw.Draw(image)
        for row in range(height):
            color = ((row * 3 + index * 11) % 256,
                     (row + index * 29) % 256,
                     (row // 3 + index * 17) % 256)
            draw.line((0, row, width - 1, row), fill=color + ((255,) if rgba else ()))
        for shape in range(8):
            left = (shape * 37 + index * 13) % max(1, width - 20)
            top = (shape * 23 + index * 7) % max(1, height - 20)
            color = ((shape * 41) % 256, (index * 19) % 256, (shape * 73) % 256)
            draw.rectangle((left, top, min(width - 1, left + 19), min(height - 1, top + 19)),
                           fill=color + ((255,) if rgba else ()))
    if index in (3, 4):
        draw = ImageDraw.Draw(image)
        for left, top in ((0, 0), (width - 32, 0), (0, height - 32), (width - 32, height - 32)):
            draw.rectangle((left, top, left + 31, top + 31), fill=(40, 90, 130, 0))
        draw.rectangle((width // 2 - 32, height // 2 - 32,
                        width // 2 + 32, height // 2 + 32), fill=(60, 120, 180, 255))
    if index == 3:
        draw.rectangle((width // 4 - 16, height // 2 - 16,
                        width // 4 + 16, height // 2 + 16), fill=(60, 120, 180, 128))
    if index == 6:
        image = image.convert("P", palette=Image.Palette.ADAPTIVE, colors=255)
        palette = image.getpalette()
        image.putpalette((palette + [0] * 768)[:768])
        draw = ImageDraw.Draw(image)
        for left, top in ((0, 0), (width - 32, 0), (0, height - 32), (width - 32, height - 32)):
            draw.rectangle((left, top, left + 31, top + 31), fill=255)
        draw.rectangle((width // 2 - 32, height // 2 - 32,
                        width // 2 + 32, height // 2 + 32), fill=1)
        image.info["transparency"] = 255
    name = f"synthetic-pattern-{index:02d}"
    path = directory / f"{name}.png"
    if index == 7:
        exif = Image.Exif()
        exif[274] = 6
        exif[270] = "Synthetic test orientation metadata only"
        metadata = PngImagePlugin.PngInfo()
        metadata.add_itxt("XML:com.adobe.xmp",
            '<x:xmpmeta xmlns:x="adobe:ns:meta/"><synthetic>test-only</synthetic></x:xmpmeta>')
        profile = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
        image.save(path, format="PNG", exif=exif, icc_profile=profile, pnginfo=metadata)
        with Image.open(path) as saved:
            assert saved.getexif()[274] == 6
            assert saved.info.get("icc_profile")
            assert saved.info.get("XML:com.adobe.xmp")
    else:
        image.save(path, format="PNG")
    displayed_width, displayed_height = (height, width) if index == 7 else (width, height)
    manifest.append({"name": name, "input": str(path), "width": displayed_width, "height": displayed_height})
print(json.dumps(manifest))
`, [temporaryDirectory])) as Pattern[];
  assert.equal(patterns.length, 30, "generate 30 original synthetic PNGs");
});

after(() => {
  if (temporaryDirectory) rmSync(temporaryDirectory, { recursive: true, force: true });
});

test("30 synthetic inputs produce deterministic bounded WebP images and accurate provenance", () => {
  const schema = JSON.parse(readFileSync(join(jobRoot, "tools", "image-metadata.schema.json"), "utf8"));
  const validate = new Ajv({ allErrors: true }).compile(schema);
  const artifacts: { pattern: Pattern; first: string; second: string; original: Buffer }[] = [];
  for (const pattern of patterns) {
    const first = join(temporaryDirectory, `${pattern.name}-first.webp`);
    const second = join(temporaryDirectory, `${pattern.name}-second.webp`);
    const original = readFileSync(pattern.input);
    for (const output of [first, second]) {
      const result = convert(pattern.input, output);
      assert.equal(result.status, 0, `${pattern.name}: ${result.stderr}`);
    }
    artifacts.push({ pattern, first, second, original });
  }

  const inspected = JSON.parse(runPython(String.raw`
import json
import sys
from PIL import Image

results = []
for path in json.load(sys.stdin):
    with Image.open(path) as image:
        image.load()
        alpha = image.getchannel("A") if "A" in image.getbands() else None
        width, height = image.size
        results.append({
            "path": path, "format": image.format, "width": width, "height": height,
            "alphaExtrema": list(alpha.getextrema()) if alpha else None,
            "cornerAlpha": [alpha.getpixel(point) for point in
                ((0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1))] if alpha else None,
            "centerAlpha": alpha.getpixel((width // 2, height // 2)) if alpha else None,
            "partialAlpha": alpha.getpixel((width // 4, height // 2)) if alpha else None,
            "exifPresent": bool(image.getexif()),
            "iccPresent": bool(image.info.get("icc_profile")),
            "xmpPresent": bool(image.info.get("xmp")),
        })
print(json.dumps(results))
`, [], JSON.stringify(artifacts.flatMap(({ first, second }) => [first, second])))) as Inspection[];
  const inspectionByPath = new Map(inspected.map((inspection) => [inspection.path, inspection]));
  assert.equal(inspected.length, 60, "independently decode both runs of every image");

  for (const { pattern, first, second, original } of artifacts) {
    const firstBytes = readFileSync(first);
    assert.deepEqual(firstBytes, readFileSync(second), `${pattern.name}: deterministic image bytes`);
    assert.deepEqual(readFileSync(`${first}.json`), readFileSync(`${second}.json`),
      `${pattern.name}: deterministic metadata bytes`);
    assert.deepEqual(readFileSync(pattern.input), original, `${pattern.name}: source remains unchanged`);
    const firstMetadata = readMetadata(`${first}.json`);
    for (const output of [first, second]) {
      const imageBytes = readFileSync(output);
      const metadata = readMetadata(`${output}.json`);
      const inspection = inspectionByPath.get(output);
      assert.ok(inspection, `${pattern.name}: Pillow inspected output`);
      assert.ok(validate(metadata), `${pattern.name}: ${JSON.stringify(validate.errors)}`);
      assert.equal(inspection.format, "WEBP");
      assert.equal(inspection.exifPresent, false, "output strips EXIF metadata after applying orientation");
      assert.equal(inspection.iccPresent, false, "output strips embedded ICC metadata");
      assert.equal(inspection.xmpPresent, false, "output strips embedded XMP metadata");
      assert.ok(imageBytes.length > 0 && imageBytes.length < 40_000,
        `${pattern.name}: WebP must be strictly below 40,000 bytes`);
      assert.equal(metadata.source, source);
      assert.equal(metadata.author, author);
      assert.equal(metadata.license, "CC0");
      assert.equal(metadata.mediaType, "image/webp");
      assert.equal(metadata.provenanceStatus, "caller-supplied");
      assert.equal(metadata.bytes, imageBytes.length);
      assert.equal(metadata.sha256, createHash("sha256").update(imageBytes).digest("hex"));
      assert.equal(metadata.width, inspection.width);
      assert.equal(metadata.height, inspection.height);
      assert.ok(Number.isInteger(metadata.width) && metadata.width > 0);
      assert.ok(Number.isInteger(metadata.height) && metadata.height > 0);
      assert.ok(metadata.width <= Math.min(512, pattern.width), `${pattern.name}: width does not upscale`);
      assert.ok(metadata.height <= Math.min(512, pattern.height), `${pattern.name}: height does not upscale`);
      assert.ok(Math.abs(metadata.width * pattern.height - metadata.height * pattern.width)
        <= Math.max(pattern.width, pattern.height), `${pattern.name}: preserve aspect ratio within a pixel`);
      assert.ok(allowedQualities.includes(metadata.quality), `${pattern.name}: use the documented quality ladder`);
    }
    if (pattern.name === "synthetic-pattern-00") {
      assert.equal(firstMetadata.width, 17);
      assert.equal(firstMetadata.height, 11);
      assert.equal(firstMetadata.quality, 85, "tiny input fits at the first quality");
    }
    if (pattern.name === "synthetic-pattern-01") {
      assert.equal(firstMetadata.width, 512);
      assert.equal(firstMetadata.height, 256);
    }
    if (pattern.name === "synthetic-pattern-02") {
      assert.equal(firstMetadata.width, 256);
      assert.equal(firstMetadata.height, 512);
    }
    if (["synthetic-pattern-03", "synthetic-pattern-04", "synthetic-pattern-06"].includes(pattern.name)) {
      const inspection = inspectionByPath.get(first);
      assert.ok(inspection);
      assert.deepEqual(inspection.alphaExtrema, [0, 255], `${pattern.name}: retain transparency and opaque content`);
      assert.deepEqual(inspection.cornerAlpha, [0, 0, 0, 0], `${pattern.name}: retain transparent corners`);
      assert.equal(inspection.centerAlpha, 255, `${pattern.name}: retain opaque center content`);
      if (pattern.name === "synthetic-pattern-03") {
        assert.equal(firstMetadata.width, 512);
        assert.equal(firstMetadata.height, 512);
        assert.equal(inspection.partialAlpha, 128, "retain partial transparency in an unresized image");
      }
    }
    if (pattern.name === "synthetic-pattern-04") {
      assert.ok(Math.max(firstMetadata.width, firstMetadata.height) < 384,
        "high-entropy alpha exercises dimension fallback after the quality ladder");
    }
    if (pattern.name === "synthetic-pattern-07") {
      assert.equal(firstMetadata.width, pattern.width, "apply EXIF orientation before sizing");
      assert.equal(firstMetadata.height, pattern.height, "apply EXIF orientation before sizing");
    }
    if (pattern.name === "synthetic-pattern-05") {
      assert.ok(firstMetadata.quality < 85, "RGB noise exercises quality fallback");
    }
  }
});

test("all supported licences and an explicit metadata destination retain caller attribution", () => {
  const input = patterns[0]!.input;
  const suppliedSources = [
    ["CC0", source],
    ["CC-BY", "https://media.example/images/synthetic-test-pattern-only.png"],
    ["public-domain", "https://commons.wikimedia.org/wiki/File:Synthetic_test_pattern_only_not_a_real_object.png"],
    ["CC0", "HTTPS://museum.example/records/synthetic-test-pattern-only"],
    ["CC-BY", "https://museum.example./records/synthetic-test-pattern-only"],
    ["CC0", "https://192.0.2.10/images/synthetic-test-pattern-only.png"],
    ["CC-BY", "https://[2001:db8::10]/images/synthetic-test-pattern-only.png"],
    ["public-domain", "https://museum.example/images/synthetic%20test%3Fpattern%23only.png"],
    ["CC0", "https://museum.example"],
    ["public-domain", "https://muse\u00e9.example/images/synthetic-test-pattern-only.png"],
  ] as const;
  for (const [index, [license, suppliedSource]] of suppliedSources.entries()) {
    const output = join(temporaryDirectory, `${index}-${license}-custom.webp`);
    const metadata = join(temporaryDirectory, `${index}-${license}-custom-metadata.json`);
    const result = convert(input, output, [
      "--license", license, "--author", author, "--source", suppliedSource,
      "--metadata-output", metadata,
    ]);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(existsSync(output));
    assert.ok(!existsSync(`${output}.json`), "an explicit metadata path replaces the default sidecar");
    assert.equal(readMetadata(metadata).license, license);
    assert.equal(readMetadata(metadata).source, suppliedSource);
    assert.equal(readMetadata(metadata).author, author);
  }
});

test("corrupt input is rejected without altering input, output, or metadata", () => {
  const input = join(temporaryDirectory, "corrupt.png");
  writeFileSync(input, "This is deliberately not an image.\n");
  rejectedWithoutWrites("corrupt-output", input, validAttribution);
});

test("animated PNG input is rejected without replacing existing artifacts", () => {
  const input = join(temporaryDirectory, "synthetic-animation.png");
  runPython(String.raw`
import sys
from PIL import Image
first = Image.new("RGB", (17, 11), (40, 80, 120))
second = Image.new("RGB", (17, 11), (120, 80, 40))
first.save(sys.argv[1], format="PNG", save_all=True, append_images=[second], duration=50, loop=0)
`, [input]);
  rejectedWithoutWrites("animated-output", input, validAttribution);
});

test("missing or invalid attribution and unsafe or malformed HTTPS source URLs are rejected before writes", () => {
  const input = patterns[0]!.input;
  const invalidArguments: string[][] = [
    ["--author", author, "--source", source],
    ["--license", "CC0", "--source", source],
    ["--license", "CC0", "--author", author],
    ...["", "cc0", "CC-BY-SA", "CC-BY-NC", "public domain", "CC0 "].map((license) => [
      "--license", license, "--author", author, "--source", source,
    ]),
    ...["", " \t\n "].map((invalidAuthor) => [
      "--license", "CC0", "--author", invalidAuthor, "--source", source,
    ]),
    ...[
      "",
      "http://museum.example/images/synthetic-test-pattern.png",
      "https:///synthetic-test-pattern.png",
      "https://",
      "//museum.example/images/synthetic-test-pattern.png",
      "file:///tmp/synthetic-test-pattern.png",
      "javascript:synthetic-test-pattern",
      "https://museum example/images/synthetic-test-pattern.png",
      "https://museum.example/images/synthetic\ttest-pattern.png",
      "https://museum.example/images/synthetic\u007ftest-pattern.png",
      "https://museum.example/images/synthetic\u0080test-pattern.png",
      "https://museum.example\\evil/images/synthetic-test-pattern.png",
      "https://@museum.example/images/synthetic-test-pattern.png",
      "https://:@museum.example/images/synthetic-test-pattern.png",
      "https://synthetic:test@museum.example/images/synthetic-test-pattern.png",
      "https://museum.example@evil.example/images/synthetic-test-pattern.png",
      "https://museum.example:443/images/synthetic-test-pattern.png",
      "https://museum.example:444/images/synthetic-test-pattern.png",
      "https://museum.example:/images/synthetic-test-pattern.png",
      "https://museum.example/images/synthetic-test-pattern.png?synthetic=1",
      "https://museum.example/images/synthetic-test-pattern.png?",
      "https://museum.example/images/synthetic-test-pattern.png#synthetic",
      "https://museum.example/images/synthetic-test-pattern.png#",
      "https://museum..example/images/synthetic-test-pattern.png",
      "https://-museum.example/images/synthetic-test-pattern.png",
      "https://museum-.example/images/synthetic-test-pattern.png",
      "https://museum_.example/images/synthetic-test-pattern.png",
      "https://museum%2eexample/images/synthetic-test-pattern.png",
      "https://./images/synthetic-test-pattern.png",
      "https://999.1.1.1/images/synthetic-test-pattern.png",
      "https://999。1。1。1/images/synthetic-test-pattern.png",
      "https://[not-an-ip]/images/synthetic-test-pattern.png",
      "https://[2001:db8::1]junk/images/synthetic-test-pattern.png",
      "https://[2001:db8::1]:443/images/synthetic-test-pattern.png",
      "https://2001:db8::1/images/synthetic-test-pattern.png",
      "https://[192.0.2.10]/images/synthetic-test-pattern.png",
      "https://museum.example/images/synthetic%ZZtest-pattern.png",
    ].map((invalidSource) => [
      "--license", "CC0", "--author", author, "--source", invalidSource,
    ]),
  ];
  for (const [index, arguments_] of invalidArguments.entries()) {
    rejectedWithoutWrites(`invalid-attribution-${index}`, input, arguments_);
  }
});

test("source-root accepts contained sources and rejects direct, traversal, prefix, and symlink escapes", () => {
  const root = join(temporaryDirectory, "source-root");
  const nested = join(root, "nested");
  mkdirSync(nested, { recursive: true });
  const contained = join(nested, "contained.png");
  copyFileSync(patterns[0]!.input, contained);
  const insideAlias = join(root, "inside-alias.png");
  symlinkSync(contained, insideAlias);
  for (const [index, input] of [contained, insideAlias].entries()) {
    const output = join(temporaryDirectory, `scoped-valid-${index}.webp`);
    const result = convert(input, output, [...validAttribution, "--source-root", root]);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(existsSync(output));
  }

  const outside = join(temporaryDirectory, "outside-root.png");
  copyFileSync(patterns[0]!.input, outside);
  const prefixSibling = `${root}-sibling`;
  mkdirSync(prefixSibling);
  const prefixInput = join(prefixSibling, "outside.png");
  copyFileSync(patterns[0]!.input, prefixInput);
  const escapedSymlink = join(root, "escaped-alias.png");
  symlinkSync(outside, escapedSymlink);
  const escapes = [outside, `${root}/../outside-root.png`, prefixInput, escapedSymlink];
  for (const [index, input] of escapes.entries()) {
    rejectedWithoutWrites(`source-root-escape-${index}`, input,
      [...validAttribution, "--source-root", root]);
  }
});

test("image output cannot overwrite the input through exact, normalized, symlink, or hard-link aliases", () => {
  for (const kind of ["exact", "normalized", "symlink", "hardlink"] as const) {
    const directory = join(temporaryDirectory, `output-input-alias-${kind}`);
    mkdirSync(directory);
    const input = join(directory, "original.png");
    copyFileSync(patterns[0]!.input, input);
    const original = readFileSync(input);
    let output = input;
    if (kind === "normalized") output = `${directory}/./original.png`;
    if (kind === "symlink" || kind === "hardlink") {
      output = join(directory, "alias.webp");
      if (kind === "symlink") symlinkSync(input, output);
      else linkSync(input, output);
    }
    expectRejection(input, output);
    assert.deepEqual(readFileSync(input), original, `${kind}: preserve original source bytes`);
    assert.deepEqual(readFileSync(output), original, `${kind}: preserve alias bytes`);
    assert.ok(!existsSync(`${output}.json`), `${kind}: rejected collision writes no sidecar`);
  }
});

test("metadata cannot overwrite the input through exact, normalized, symlink, or hard-link aliases", () => {
  for (const kind of ["exact", "normalized", "symlink", "hardlink"] as const) {
    const directory = join(temporaryDirectory, `metadata-input-alias-${kind}`);
    mkdirSync(directory);
    const input = join(directory, "original.png");
    copyFileSync(patterns[0]!.input, input);
    const original = readFileSync(input);
    const output = join(directory, "existing.webp");
    const sentinel = Buffer.from("existing output must survive metadata alias rejection");
    writeFileSync(output, sentinel);
    let metadata = input;
    if (kind === "normalized") metadata = `${directory}/./original.png`;
    if (kind === "symlink" || kind === "hardlink") {
      metadata = join(directory, "alias.json");
      if (kind === "symlink") symlinkSync(input, metadata);
      else linkSync(input, metadata);
    }
    expectRejection(input, output, [...validAttribution, "--metadata-output", metadata]);
    assert.deepEqual(readFileSync(input), original, `${kind}: preserve original source bytes`);
    assert.deepEqual(readFileSync(metadata), original, `${kind}: preserve metadata alias bytes`);
    assert.deepEqual(readFileSync(output), sentinel, `${kind}: reject before replacing output`);
  }
  const directory = join(temporaryDirectory, "metadata-input-alias-default-sidecar");
  mkdirSync(directory);
  const output = join(directory, "existing.webp");
  const input = `${output}.json`;
  copyFileSync(patterns[0]!.input, input);
  const original = readFileSync(input);
  const sentinel = Buffer.from("existing output must survive default sidecar input collision");
  writeFileSync(output, sentinel);
  expectRejection(input, output);
  assert.deepEqual(readFileSync(input), original, "the default sidecar cannot replace a source image");
  assert.deepEqual(readFileSync(output), sentinel, "reject a default sidecar alias before replacing output");
});

test("image and metadata destinations cannot collide through exact, normalized, symlink, or hard-link aliases", () => {
  for (const kind of ["exact", "normalized", "symlink", "hardlink"] as const) {
    const directory = join(temporaryDirectory, `artifact-alias-${kind}`);
    mkdirSync(directory);
    const input = join(directory, "original.png");
    copyFileSync(patterns[0]!.input, input);
    const original = readFileSync(input);
    const output = join(directory, "existing.webp");
    const sentinel = Buffer.from("existing output must survive output/metadata collision");
    writeFileSync(output, sentinel);
    let metadata = output;
    if (kind === "normalized") metadata = `${directory}/./existing.webp`;
    if (kind === "symlink" || kind === "hardlink") {
      metadata = join(directory, "alias.json");
      if (kind === "symlink") symlinkSync(output, metadata);
      else linkSync(output, metadata);
    }
    expectRejection(input, output, [...validAttribution, "--metadata-output", metadata]);
    assert.deepEqual(readFileSync(input), original, `${kind}: preserve original source bytes`);
    assert.deepEqual(readFileSync(output), sentinel, `${kind}: preserve existing output bytes`);
    assert.deepEqual(readFileSync(metadata), sentinel, `${kind}: preserve metadata alias bytes`);
  }
});

test("directory destinations are rejected before replacing either existing artifact", () => {
  for (const directoryDestination of ["image", "metadata"] as const) {
    const directory = join(temporaryDirectory, `directory-destination-${directoryDestination}`);
    mkdirSync(directory);
    const input = join(directory, "original.png");
    copyFileSync(patterns[0]!.input, input);
    const original = readFileSync(input);
    const output = join(directory, "existing.webp");
    const metadata = join(directory, "existing.json");
    const imageSentinel = Buffer.from("existing image must survive invalid directory destination");
    const metadataSentinel = Buffer.from("existing metadata must survive invalid directory destination");
    const imageSentinelPath = directoryDestination === "image" ? join(output, "retained.txt") : output;
    const metadataSentinelPath = directoryDestination === "metadata" ? join(metadata, "retained.txt") : metadata;
    mkdirSync(directoryDestination === "image" ? output : metadata);
    writeFileSync(imageSentinelPath, imageSentinel);
    writeFileSync(metadataSentinelPath, metadataSentinel);
    expectRejection(input, output, [...validAttribution, "--metadata-output", metadata]);
    assert.deepEqual(readFileSync(input), original, "preserve original source bytes");
    assert.deepEqual(readFileSync(imageSentinelPath), imageSentinel, "preserve existing image or directory contents");
    assert.deepEqual(readFileSync(metadataSentinelPath), metadataSentinel, "preserve existing metadata or directory contents");
  }
});
