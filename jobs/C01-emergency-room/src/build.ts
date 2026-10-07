export interface Injury {
  caseId: string;
  products: number[];
  weight: number;
}

export interface Product {
  code: number;
  label: string;
}

export interface Fixture {
  mode: 'historical-sample';
  sourceYear: number;
  requestedYear: number;
  source: string;
  injuries: Injury[];
  products: Product[];
}

export interface PackRow {
  productCode: number;
  label: string;
  sampleWeightedSum: number;
  sampleCaseCount: number;
  nationalEstimate: null;
  fact: null;
  factStatus: 'unverified';
}

export interface Pack {
  mode: 'historical-sample';
  year: number;
  requestedYear: number;
  complete: false;
  rows: PackRow[];
}

function object(value: unknown, field: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError(`${field} must be an object`);
  }
  return value as Record<string, unknown>;
}

function positiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${field} must be a positive safe integer`);
  }
  return value;
}

function nonemptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`${field} must be a nonempty string`);
  }
  return value;
}

function keys(record: Record<string, unknown>, expected: string[], field: string): void {
  if (Object.keys(record).length !== expected.length ||
      expected.some(key => !Object.hasOwn(record, key))) {
    throw new TypeError(`${field} must contain exactly the declared fields`);
  }
}

/** Validate and copy a historical sample without changing the caller's data. */
export function parseFixture(value: unknown): Fixture {
  const input = object(value, 'fixture');
  keys(input, ['mode', 'sourceYear', 'requestedYear', 'source', 'injuries', 'products'], 'fixture');
  if (input.mode !== 'historical-sample') {
    throw new TypeError('fixture mode must be historical-sample');
  }
  const sourceYear = positiveInteger(input.sourceYear, 'sourceYear');
  const requestedYear = positiveInteger(input.requestedYear, 'requestedYear');
  if (sourceYear >= requestedYear) {
    throw new RangeError('historical sample sourceYear must be before requestedYear');
  }
  const source = nonemptyString(input.source, 'source');
  if (!Array.isArray(input.products) || input.products.length < 30) {
    throw new RangeError('sample requires at least 30 declared products');
  }
  const declared = new Set<number>();
  const products = input.products.map((value: unknown, index: number): Product => {
    const product = object(value, `products[${index}]`);
    keys(product, ['code', 'label'], `products[${index}]`);
    const code = positiveInteger(product.code, `products[${index}].code`);
    if (declared.has(code)) {
      throw new RangeError('product declarations must have unique codes');
    }
    declared.add(code);
    return {code, label: nonemptyString(product.label, `products[${index}].label`)};
  });
  if (!Array.isArray(input.injuries) || input.injuries.length < 30) {
    throw new RangeError('sample requires at least 30 injury cases');
  }
  const caseIds = new Set<string>();
  const observed = new Set<number>();
  const injuries = input.injuries.map((value: unknown, index: number): Injury => {
    const injury = object(value, `injuries[${index}]`);
    keys(injury, ['caseId', 'products', 'weight'], `injuries[${index}]`);
    const caseId = nonemptyString(injury.caseId, `injuries[${index}].caseId`);
    if (caseIds.has(caseId)) {
      throw new RangeError('injury case IDs must be unique');
    }
    caseIds.add(caseId);
    if (typeof injury.weight !== 'number' || !Number.isFinite(injury.weight) || injury.weight <= 0) {
      throw new RangeError('injury weights must be finite and greater than zero');
    }
    if (!Array.isArray(injury.products) || injury.products.length === 0) {
      throw new RangeError('every injury must declare at least one product');
    }
    const codes = injury.products.map((value: unknown): number => {
      const code = positiveInteger(value, `injuries[${index}].products`);
      if (!declared.has(code)) {
        throw new RangeError('injury product code has no product declaration');
      }
      observed.add(code);
      return code;
    });
    return {caseId, products: codes, weight: injury.weight};
  });
  if (observed.size < 30) {
    throw new RangeError('sample requires at least 30 distinct observed products');
  }
  return {mode: 'historical-sample', sourceYear, requestedYear, source, injuries, products};
}

function pack(fixture: Fixture, rows: PackRow[]): Pack {
  return {
    mode: 'historical-sample',
    year: fixture.sourceYear,
    requestedYear: fixture.requestedYear,
    complete: false,
    rows,
  };
}

/** Stream cases once; each distinct product receives the case's weight once. */
export function aggregatePrimary(value: unknown): Pack {
  const fixture = parseFixture(value);
  const labels = new Map(fixture.products.map(product => [product.code, product.label]));
  const totals = new Map<number, {sum: number; count: number}>();
  for (const injury of fixture.injuries) {
    for (const code of new Set(injury.products)) {
      const total = totals.get(code) ?? {sum: 0, count: 0};
      total.sum += injury.weight;
      total.count += 1;
      if (!Number.isFinite(total.sum)) {
        throw new RangeError('sample weighted sum overflow');
      }
      totals.set(code, total);
    }
  }
  const rows = [...totals.entries()]
    .sort(([first], [second]) => first - second)
    .map(([productCode, total]): PackRow => ({
      productCode,
      label: labels.get(productCode)!,
      sampleWeightedSum: total.sum,
      sampleCaseCount: total.count,
      nationalEstimate: null,
      fact: null,
      factStatus: 'unverified',
    }));
  return pack(fixture, rows);
}

/** Independently select each product's cases before reducing its weights. */
export function aggregateReference(value: unknown): Pack {
  const fixture = parseFixture(value);
  const rows = [...fixture.products]
    .sort((first, second) => first.code - second.code)
    .flatMap((product): PackRow[] => {
      const cases = fixture.injuries.filter(injury => injury.products.includes(product.code));
      if (cases.length === 0) return [];
      const sum = cases.reduce((accumulator, injury) => accumulator + injury.weight, 0);
      if (!Number.isFinite(sum)) {
        throw new RangeError('sample weighted sum overflow');
      }
      return [{
        productCode: product.code,
        label: product.label,
        sampleWeightedSum: sum,
        sampleCaseCount: cases.length,
        nationalEstimate: null,
        fact: null,
        factStatus: 'unverified',
      }];
    });
  return pack(fixture, rows);
}

export function serializePack(value: Pack): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
