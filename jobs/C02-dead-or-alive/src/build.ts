export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export interface EligibilityCandidate {
  sitelinks: number | null;
  deathDate: string | null;
  verifiedAsOf: string | null;
  portraitVerified: boolean;
}

export type Eligibility = 'unverified' | 'not-famous' | 'recent-death' | 'alive' | 'dead';

export interface FixtureRow {
  id: string;
  name: string;
  birth_date: string;
  death_date: string | null;
  snapshot_status: 'death-recorded' | 'no-death-recorded';
  current_status_verified: false;
  prize_year: number;
  prize_category: string;
  wikidata_id: null;
  sitelinks_count: null;
  portrait: null;
}

export interface Fixture {
  kind: 'historical-offline-pipeline-sample';
  source_url: string;
  source_sha256: string;
  source_repository_license: string;
  upstream_provenance: string;
  upstream_license_independently_verified: false;
  repository_sample_date: string;
  max_prize_year: number;
  current_status_verified: false;
  sitelinks_verified: false;
  portrait_licenses_verified: false;
  rows: FixtureRow[];
}

export interface SampleRow {
  id: string;
  name: string;
  birthDate: string;
  recordedDeathDate: string | null;
  status: null;
  sitelinks: null;
  portrait: null;
  fact: null;
  factStatus: 'unverified';
}

export interface SamplePack {
  mode: 'historical-sample';
  buildDate: string;
  sourceSnapshot: string;
  complete: false;
  rows: SampleRow[];
}

function object(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function keys(value: Record<string, unknown>, expected: string[], field: string): void {
  if (Object.keys(value).length !== expected.length || expected.some(key => !Object.hasOwn(value, key))) {
    throw new TypeError(`${field} must contain exactly the declared fields`);
  }
}

function string(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${field} must be a nonempty string`);
  }
  return value;
}

function positiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${field} must be a positive safe integer`);
  }
  return value;
}

/** Strict proleptic Gregorian calendar; year zero is outside the input domain. */
export function parseDatePrimary(value: string): DateParts {
  if (typeof value !== 'string') throw new TypeError('date must be a string');
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match === null) throw new RangeError('date must be YYYY-MM-DD');
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) throw new RangeError('invalid Gregorian date');
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const lengths = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (day < 1 || day > lengths[month - 1]!) throw new RangeError('invalid Gregorian date');
  return {year, month, day};
}

/** Epoch-day number using calendar arithmetic, without a Date constructor. */
export function dateToDayPrimary(value: string): number {
  const {year, month, day} = parseDatePrimary(value);
  const priorYear = year - 1;
  const daysBeforeYear = 365 * priorYear + Math.floor(priorYear / 4)
    - Math.floor(priorYear / 100) + Math.floor(priorYear / 400);
  const starts = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const leapOffset = month > 2 && year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 1 : 0;
  return daysBeforeYear + starts[month - 1]! + leapOffset + day - 1 - 719162;
}

/** Independent UTC conversion; roundtrip rejects JavaScript's date rollover. */
export function dateToDayReference(value: string): number {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-')) {
    throw new RangeError('date must be YYYY-MM-DD with a positive year');
  }
  const utc = new Date(`${value}T00:00:00.000Z`);
  const milliseconds = utc.getTime();
  if (!Number.isFinite(milliseconds) || utc.toISOString().slice(0, 10) !== value) {
    throw new RangeError('invalid Gregorian date');
  }
  return milliseconds / 86400000;
}

function checkedCandidate(
  value: EligibilityCandidate,
  asOf: string,
  dateToDay: (value: string) => number,
): {candidate: EligibilityCandidate; asOfDay: number; deathDay: number | null} {
  const asOfDay = dateToDay(asOf);
  const input = object(value, 'candidate');
  keys(input, ['sitelinks', 'deathDate', 'verifiedAsOf', 'portraitVerified'], 'candidate');
  if (input.sitelinks !== null && (typeof input.sitelinks !== 'number' ||
      !Number.isSafeInteger(input.sitelinks) || input.sitelinks < 0)) {
    throw new RangeError('sitelinks must be null or a nonnegative safe integer');
  }
  if (typeof input.portraitVerified !== 'boolean') {
    throw new TypeError('portraitVerified must be a boolean');
  }
  const deathDate = input.deathDate === null ? null : string(input.deathDate, 'deathDate');
  const verifiedAsOf = input.verifiedAsOf === null ? null : string(input.verifiedAsOf, 'verifiedAsOf');
  if (verifiedAsOf !== null) dateToDay(verifiedAsOf);
  const deathDay = deathDate === null ? null : dateToDay(deathDate);
  if (deathDay !== null && deathDay > asOfDay) {
    throw new RangeError('deathDate cannot be after asOf');
  }
  const candidate: EligibilityCandidate = {
    sitelinks: input.sitelinks as number | null,
    deathDate,
    verifiedAsOf,
    portraitVerified: input.portraitVerified,
  };
  return {candidate, asOfDay, deathDay};
}

export function evaluateEligibilityPrimary(value: EligibilityCandidate, asOf: string): Eligibility {
  const {candidate, asOfDay, deathDay} = checkedCandidate(value, asOf, dateToDayPrimary);
  if (candidate.sitelinks === null || candidate.verifiedAsOf !== asOf || !candidate.portraitVerified) {
    return 'unverified';
  }
  if (candidate.sitelinks < 60) return 'not-famous';
  if (deathDay !== null && asOfDay - deathDay < 30) return 'recent-death';
  return candidate.deathDate === null ? 'alive' : 'dead';
}

export function evaluateEligibilityReference(value: EligibilityCandidate, asOf: string): Eligibility {
  const checked = checkedCandidate(value, asOf, dateToDayReference);
  const candidate = checked.candidate;
  if (!candidate.portraitVerified) return 'unverified';
  if (candidate.verifiedAsOf !== asOf) return 'unverified';
  if (candidate.sitelinks === null) return 'unverified';
  if (candidate.sitelinks <= 59) return 'not-famous';
  if (candidate.deathDate === null) return 'alive';
  const elapsedDays = checked.asOfDay - checked.deathDay!;
  return elapsedDays >= 30 ? 'dead' : 'recent-death';
}

/** Preserve supplied historical provenance and never infer present living status. */
export function parseFixture(value: unknown): Fixture {
  const input = object(value, 'fixture');
  keys(input, ['kind', 'source_url', 'source_sha256', 'source_repository_license', 'upstream_provenance',
    'upstream_license_independently_verified', 'repository_sample_date', 'max_prize_year',
    'current_status_verified', 'sitelinks_verified', 'portrait_licenses_verified', 'rows'], 'fixture');
  if (input.kind !== 'historical-offline-pipeline-sample') throw new TypeError('unsupported fixture kind');
  for (const field of ['upstream_license_independently_verified', 'current_status_verified',
    'sitelinks_verified', 'portrait_licenses_verified']) {
    if (input[field] !== false) throw new TypeError(`${field} must be false for a historical sample`);
  }
  const source_url = string(input.source_url, 'source_url');
  const source_sha256 = string(input.source_sha256, 'source_sha256');
  if (!/^[0-9a-f]{64}$/.test(source_sha256)) throw new TypeError('source_sha256 must be lowercase SHA256 hex');
  const source_repository_license = string(input.source_repository_license, 'source_repository_license');
  const upstream_provenance = string(input.upstream_provenance, 'upstream_provenance');
  const repository_sample_date = string(input.repository_sample_date, 'repository_sample_date');
  const snapshotDay = dateToDayPrimary(repository_sample_date);
  const max_prize_year = positiveInteger(input.max_prize_year, 'max_prize_year');
  if (max_prize_year > parseDatePrimary(repository_sample_date).year) {
    throw new RangeError('max_prize_year cannot be after the source snapshot year');
  }
  if (!Array.isArray(input.rows) || input.rows.length !== 30) {
    throw new RangeError('historical sample requires exactly 30 rows');
  }
  const ids = new Set<string>();
  const rows = input.rows.map((value: unknown, index: number): FixtureRow => {
    const row = object(value, `rows[${index}]`);
    keys(row, ['id', 'name', 'birth_date', 'death_date', 'snapshot_status', 'current_status_verified',
      'prize_year', 'prize_category', 'wikidata_id', 'sitelinks_count', 'portrait'], `rows[${index}]`);
    const id = string(row.id, 'row.id');
    if (ids.has(id)) throw new RangeError('sample IDs must be unique');
    ids.add(id);
    const name = string(row.name, 'row.name');
    const birth_date = string(row.birth_date, 'birth_date');
    const birthDay = dateToDayPrimary(birth_date);
    const death_date = row.death_date === null ? null : string(row.death_date, 'death_date');
    const deathDay = death_date === null ? null : dateToDayPrimary(death_date);
    if (birthDay > snapshotDay || (deathDay !== null && (deathDay < birthDay || deathDay > snapshotDay))) {
      throw new RangeError('birth/death dates must be chronological and within the source snapshot');
    }
    const snapshot_status = death_date === null ? 'no-death-recorded' : 'death-recorded';
    if (row.snapshot_status !== snapshot_status) throw new TypeError('snapshot_status conflicts with death_date');
    if (row.current_status_verified !== false || row.wikidata_id !== null ||
        row.sitelinks_count !== null || row.portrait !== null) {
      throw new TypeError('historical sample cannot contain verified current status, Wikidata, sitelinks, or portraits');
    }
    const prize_year = positiveInteger(row.prize_year, 'prize_year');
    if (prize_year > max_prize_year) throw new RangeError('prize_year exceeds source max_prize_year');
    const prize_category = string(row.prize_category, 'prize_category');
    return {id, name, birth_date, death_date, snapshot_status, current_status_verified: false,
      prize_year, prize_category, wikidata_id: null, sitelinks_count: null, portrait: null};
  });
  return {kind: 'historical-offline-pipeline-sample', source_url, source_sha256, source_repository_license,
    upstream_provenance, upstream_license_independently_verified: false, repository_sample_date,
    max_prize_year, current_status_verified: false, sitelinks_verified: false, portrait_licenses_verified: false, rows};
}

export function buildSample(input: unknown, buildDate: string): SamplePack {
  const buildDay = dateToDayPrimary(buildDate);
  const fixture = parseFixture(input);
  if (buildDay < dateToDayPrimary(fixture.repository_sample_date)) {
    throw new RangeError('buildDate cannot be before the source snapshot');
  }
  const rows = fixture.rows
    .sort((first, second) => first.id < second.id ? -1 : first.id > second.id ? 1 : 0)
    .map((row): SampleRow => ({
      id: row.id,
      name: row.name,
      birthDate: row.birth_date,
      recordedDeathDate: row.death_date,
      status: null,
      sitelinks: null,
      portrait: null,
      fact: null,
      factStatus: 'unverified',
    }));
  return {mode: 'historical-sample', buildDate, sourceSnapshot: fixture.repository_sample_date, complete: false, rows};
}

export function serializeSample(value: SamplePack): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
