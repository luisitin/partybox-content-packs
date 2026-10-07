export interface DateRange {start: number; end: number}
export interface ImageReference {url: string; width: number; height: number; is_primary: '0' | '1'; image_id: string}
export interface BaseFixtureRow {
  museum: string; id: string; title: string; date_display: string;
  date_start: number | null; date_end: number | null;
  image_bytes_downloaded: false; image_license: string; metadata_license: string;
  metadata_license_source: string; source_url: string; source_sha256: string;
  snapshot_commit: string; independent_facts_checked: false;
}
export interface CooperHewittRow extends BaseFixtureRow {
  museum: 'Cooper Hewitt, Smithsonian Design Museum';
  date_start: null; date_end: null;
  image_references: Record<string, ImageReference>[];
  snapshot_committed_utc: string;
}
export interface AicRow extends BaseFixtureRow {
  museum: 'Art Institute of Chicago';
  date_start: number; date_end: number;
  image_id: string; source_is_public_domain: true;
  data_snapshot_updated_utc: string; source_record_timestamp: string;
}
export type FixtureRow = CooperHewittRow | AicRow;
export type Fixture = FixtureRow[];
export interface SampleRow {
  id: string; museum: string; title: string; dateDisplay: string;
  dateRange: DateRange | null; centuries: number[] | null;
  dateEvidence: 'catalogue-range' | 'unstructured-label';
  image: null; fact: null; factStatus: 'unverified';
  sourceUrl: string; sourceSha256: string; sourceSnapshot: string;
  metadataLicense: 'CC0-1.0'; imageLicenseVerified: false;
}
export interface SamplePack {mode: 'metadata-sample'; complete: false; rows: SampleRow[]}

export const CH_MUSEUM = 'Cooper Hewitt, Smithsonian Design Museum';
export const AIC_MUSEUM = 'Art Institute of Chicago';
export const CH_COMMIT = '4272b8fa73697845507ff40cafeb19310218c896';
export const AIC_COMMIT = '8936f25879fd688fc2412436e5df4e30402bd081';
export const PINNED_HASHES: Readonly<Record<string, string>> = {
  "cooperhewitt-18382603": "55114a5a92c567299cac64e10063c90688a2a0fcf53f49b672df9b6b3ea6f569",
  "cooperhewitt-18382605": "b7abf62b3b994765e3a0b2bd442357c04fd9b43ef055353d5215c72a863d7a2f",
  "cooperhewitt-18382607": "67a42128da91e38d2d277269ccceed9460bff5bbf0ff4e5d7225b76a6d61fb22",
  "cooperhewitt-18382609": "8780742f99073a4c7ce5752371f7619e92992e3050f6471b27087a1a1d25864a",
  "cooperhewitt-18382611": "340122fd62c634b4f2f719f3adbe563068d109bc6fa3b3233754dc7370729d58",
  "cooperhewitt-18382613": "e3f63a47fbfadea1bd7e619883ab22851baddd2374c9a8cfe1a7718f9ad5abc8",
  "cooperhewitt-18382615": "43b5d3a7386b3fc11ef413cade12132d0c9f69d64072257d795878607742c6f2",
  "cooperhewitt-18382617": "ebc7c67c8b3c8eac470a410ae1819dcbdcb2cf1c3bf6b2ed2704d8e7352a8e34",
  "cooperhewitt-18382619": "161e5c82e4f212c74ef5a6fba5c49dc687f1248836bd38ef3487b8f2b9d0ddcd",
  "cooperhewitt-18382623": "4f865f5b2e5b3d023e8f4b4e2f73870a67b74487d75fbca1122133b29a2f65b9",
  "cooperhewitt-18382625": "c8e34c45ba5bf79e35ab9eaf900594a10ce57c27aaf41827e9d3c11b1f1340ad",
  "cooperhewitt-18382629": "f1cc7593fd5c522caf0039fd026d5befcea923e487bf7ace62e06b6951a0f65e",
  "cooperhewitt-18382633": "ccff4ad07b0f0b4e51bc917766ba6921ade5e67e9e1d901b2d0bac9829018d02",
  "cooperhewitt-18382635": "8fe3c246477602c421980059a505c1df4355bff22758e9a3112a2328e38dc495",
  "cooperhewitt-18382637": "dc727c174d1ed429e8730acf94484c6ac741ddfa0c57c2469762becaacff94c2",
  "cooperhewitt-18382641": "d6f4b14e8f2de21b2061f2a6f4bf80e9273cff9138a67de300ca59c9f56772e6",
  "cooperhewitt-18382685": "d1d1ca9d91f7f75fd4407ac15b9a76898f884bd6edc27bf873ca54ca0e00d649",
  "cooperhewitt-18382689": "cb572a74cc8a8ab390819e62cbb935a6bd240b79e58a54077efbbf1a62703546",
  "cooperhewitt-18382693": "161fe9b01be129cf324b87be50290282bf94c8f44fefd93ade577dcb981705b5",
  "cooperhewitt-18382695": "2d589a7e0d4873a49c64792458cf3270e42cdc6c3c61bb750bc95b049e687dce",
  "cooperhewitt-18382697": "ba0ffed36751541cc30b6fa42ac0277b42fa8092e8f37162bbc576e3c7c05fea",
  "cooperhewitt-18382699": "47073224be5bd80040eab82d0ccd623a82f399564a47b0c5f9456a04b749d3a5",
  "cooperhewitt-18400103": "b3b0952aa3c614c2902ac545031c83c998796b0de4ec92a1bfc680b455f34dfd",
  "cooperhewitt-18400107": "6b2732da1a9ff57a923b31dc00de65442b24e0be1a41da11be9380bc3bb7fa5e",
  "aic-4": "eb66315722f2b27b1297a968f5612a8b514344a39bf57213b0c3e6ede00d1c86",
  "aic-9": "c1ad3d45b6dcdcbc1cb8732d611e6873c570352e7ed22f81558bc3b432fb60bc",
  "aic-11": "8405add34122c27099f46af11ebe7583133ee9ac3ce48c34df570cae61c06b69",
  "aic-16": "e1756c73b5050e1e2efffaceb20593a747e5f13763cad41cf47f5e6f60636dee",
  "aic-19": "1d6986dbc934c036c8986b072cb03a7a5edfdfcc17799d548398dee952fb8b7f",
  "aic-20": "7e9dbb11257d5fd9924a6c9afa5932e02e81e7861fbb67121093eab26f89ffe0"
};

function object(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new TypeError(`${field} must be an object`);
  return value as Record<string, unknown>;
}
function keys(value: Record<string, unknown>, expected: string[], field: string): void {
  if (Object.keys(value).length !== expected.length || expected.some(key => !Object.hasOwn(value, key))) {
    throw new TypeError(`${field} must contain exactly the declared fields`);
  }
}
function text(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0 || /[\u0000-\u001f\u007f-\u009f]/.test(value)) {
    throw new TypeError(`${field} must be nonempty text without controls`);
  }
  return value;
}
function year(value: number): number {
  if (!Number.isInteger(value) || value === 0 || value < -9999 || value > 9999) {
    throw new RangeError('historical year must be an integer in -9999..-1 or 1..9999');
  }
  return value;
}
function range(start: number, end: number): DateRange {
  year(start); year(end);
  if (start > end) throw new RangeError('date range must be ordered');
  return {start, end};
}

/** Signed century indices, in chronological order, excluding century zero. */
export function centuriesPrimary(start: number, end: number): number[] {
  range(start, end);
  const first = start > 0 ? Math.ceil(start / 100) : -Math.ceil(-start / 100);
  const last = end > 0 ? Math.ceil(end / 100) : -Math.ceil(-end / 100);
  const result: number[] = [];
  for (let century = first; century <= last; century++) {
    if (century !== 0) result.push(century);
  }
  return result;
}

/** Independently intersect all supported century year bounds with the range. */
export function centuriesReference(start: number, end: number): number[] {
  range(start, end);
  const result: number[] = [];
  for (let century = -100; century <= 100; century++) {
    if (century === 0) continue;
    const lower = century < 0 ? century * 100 : (century - 1) * 100 + 1;
    const upper = century < 0 ? (century + 1) * 100 - 1 : century * 100;
    if (lower <= end && upper >= start) result.push(century);
  }
  return result;
}

function timestamp(value: unknown, field: string, utcOnly: boolean): string {
  const source = text(value, field);
  const matched = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/.exec(source);
  if (matched === null || (utcOnly && matched[7] !== 'Z')) throw new RangeError(`${field} requires an ISO timestamp with the declared timezone`);
  const y = Number(matched[1]); const month = Number(matched[2]); const day = Number(matched[3]);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const zone = matched[7]!;
  if (y < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]! ||
      Number(matched[4]) > 23 || Number(matched[5]) > 59 || Number(matched[6]) > 59 ||
      (zone !== 'Z' && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4, 6)) > 59))) {
    throw new RangeError(`${field} contains an invalid calendar timestamp`);
  }
  return source;
}
function positiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) throw new RangeError(`${field} must be a positive safe integer`);
  return value;
}
function imageReferences(value: unknown): Record<string, ImageReference>[] {
  if (!Array.isArray(value) || value.length === 0) throw new TypeError('image_references must retain source image-pointer groups');
  return value.map((value: unknown) => {
    const group = object(value, 'image pointer group');
    const entries = Object.entries(group);
    if (entries.length === 0) throw new TypeError('image pointer group cannot be empty');
    const result: Record<string, ImageReference> = {};
    for (const [size, value] of entries) {
      if (!/^(o|b|z|n|d|sq|x)$/.test(size)) throw new TypeError('unknown source image size key');
      const pointer = object(value, 'image pointer');
      keys(pointer, ['url', 'width', 'height', 'is_primary', 'image_id'], 'image pointer');
      const url = text(pointer.url, 'image pointer url');
      if (!/^https:\/\/images\.collection\.cooperhewitt\.org\/[a-zA-Z0-9_.-]+$/.test(url)) throw new TypeError('image pointer must retain its official source host');
      const image_id = text(pointer.image_id, 'image pointer id');
      if (!/^[1-9][0-9]*$/.test(image_id) || (pointer.is_primary !== '0' && pointer.is_primary !== '1')) throw new TypeError('invalid source image pointer identity');
      result[size] = {url, width: positiveInteger(pointer.width, 'image width'), height: positiveInteger(pointer.height, 'image height'), is_primary: pointer.is_primary, image_id};
    }
    return result;
  });
}

export function parseFixture(value: unknown): Fixture {
  if (!Array.isArray(value) || value.length !== 30) throw new RangeError('metadata fixture requires exactly 30 records');
  const ids = new Set<string>();
  let numericRanges = 0;
  let unstructuredLabels = 0;
  const baseFields = ['museum', 'id', 'title', 'date_display', 'date_start', 'date_end', 'image_bytes_downloaded',
    'image_license', 'metadata_license', 'metadata_license_source', 'source_url', 'source_sha256', 'snapshot_commit', 'independent_facts_checked'];
  const rows = value.map((value: unknown): FixtureRow => {
    const row = object(value, 'museum record');
    if (row.museum !== CH_MUSEUM && row.museum !== AIC_MUSEUM) throw new TypeError('museum must be a supported official metadata source');
    const cooper = row.museum === CH_MUSEUM;
    keys(row, [...baseFields, ...(cooper ? ['image_references', 'snapshot_committed_utc'] :
      ['image_id', 'source_is_public_domain', 'data_snapshot_updated_utc', 'source_record_timestamp'])], 'museum record');
    const id = text(row.id, 'id');
    if (!/^[1-9][0-9]*$/.test(id) || (cooper && id.length !== 8)) throw new TypeError('invalid catalogue id');
    const prefixedId = `${cooper ? 'cooperhewitt' : 'aic'}-${id}`;
    if (ids.has(prefixedId)) throw new RangeError('museum and catalogue id must be unique');
    ids.add(prefixedId);
    const title = text(row.title, 'title');
    const date_display = text(row.date_display, 'date_display');
    const source_sha256 = text(row.source_sha256, 'source_sha256');
    if (!/^[0-9a-f]{64}$/.test(source_sha256) || source_sha256 !== PINNED_HASHES[prefixedId]) throw new TypeError('record source hash must match its pinned source');
    const commit = cooper ? CH_COMMIT : AIC_COMMIT;
    const base = cooper ? `https://raw.githubusercontent.com/cooperhewitt/collection/${commit}/` :
      `https://raw.githubusercontent.com/art-institute-of-chicago/api-data/${commit}/`;
    const source_url = cooper ? `${base}objects/${id.slice(0, 3)}/${id.slice(3, 6)}/${id.slice(6)}/${id}.json` : `${base}json/artworks/${id}.json`;
    const metadata_license_source = `${base}${cooper ? 'README.md' : 'json/info.json'}`;
    const metadata_license = cooper ? 'CC0-1.0' : 'CC0-1.0 (description deliberately omitted)';
    const image_license = cooper ? 'unverified; explicitly excluded from metadata CC0 grant' :
      'unverified exact media permission; artwork is tagged public domain in official snapshot';
    if (row.source_url !== source_url || row.snapshot_commit !== commit || row.metadata_license_source !== metadata_license_source ||
        row.metadata_license !== metadata_license || row.image_license !== image_license ||
        row.image_bytes_downloaded !== false || row.independent_facts_checked !== false) {
      throw new TypeError('record must retain source provenance and unverified image/fact flags');
    }
    const common = {id, title, date_display, image_bytes_downloaded: false as const, image_license, metadata_license,
      metadata_license_source, source_url, source_sha256, snapshot_commit: commit, independent_facts_checked: false as const};
    if (cooper) {
      if (row.date_start !== null || row.date_end !== null) throw new TypeError('freeform Cooper Hewitt date labels must retain null numeric bounds');
      unstructuredLabels++;
      return {museum: CH_MUSEUM, ...common, date_start: null, date_end: null,
        image_references: imageReferences(row.image_references), snapshot_committed_utc: timestamp(row.snapshot_committed_utc, 'snapshot_committed_utc', true)};
    }
    if (typeof row.date_start !== 'number' || typeof row.date_end !== 'number') throw new TypeError('AIC source must retain both structured numeric date bounds');
    range(row.date_start, row.date_end);
    numericRanges++;
    const image_id = text(row.image_id, 'image_id');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(image_id) || row.source_is_public_domain !== true) throw new TypeError('AIC source artwork/media identifiers must retain source metadata');
    return {museum: AIC_MUSEUM, ...common, date_start: row.date_start, date_end: row.date_end, image_id,
      source_is_public_domain: true, data_snapshot_updated_utc: timestamp(row.data_snapshot_updated_utc, 'data_snapshot_updated_utc', true),
      source_record_timestamp: timestamp(row.source_record_timestamp, 'source_record_timestamp', false)};
  });
  if (numericRanges !== 6 || unstructuredLabels !== 24) throw new RangeError('sample must retain six structured ranges and twenty-four unstructured labels');
  return rows;
}

export function buildSample(value: unknown): SamplePack {
  const fixture = parseFixture(value);
  const rows = fixture.sort((first, second) => first.museum < second.museum ? -1 : first.museum > second.museum ? 1 :
    first.id < second.id ? -1 : first.id > second.id ? 1 : 0).map((row): SampleRow => {
    const structured = row.museum === AIC_MUSEUM;
    const dateRange = structured ? {start: row.date_start, end: row.date_end} : null;
    return {id: `${structured ? 'aic' : 'cooperhewitt'}-${row.id}`, museum: row.museum, title: row.title, dateDisplay: row.date_display,
      dateRange, centuries: dateRange === null ? null : centuriesPrimary(dateRange.start, dateRange.end),
      dateEvidence: structured ? 'catalogue-range' : 'unstructured-label', image: null, fact: null, factStatus: 'unverified',
      sourceUrl: row.source_url, sourceSha256: row.source_sha256,
      sourceSnapshot: structured ? row.data_snapshot_updated_utc : row.snapshot_committed_utc,
      metadataLicense: 'CC0-1.0', imageLicenseVerified: false};
  });
  return {mode: 'metadata-sample', complete: false, rows};
}
export function serializeSample(value: SamplePack): string {return `${JSON.stringify(value, null, 2)}\n`}
