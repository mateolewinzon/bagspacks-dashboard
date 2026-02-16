export interface ParsedMeasures {
  ancho: number;
  largo: number;
  espesor: number;
}

/**
 * Parse a measures string in the format "ANCHO x LARGO / ESPESOR".
 * Tolerates optional whitespace around separators.
 * Returns null if the string doesn't match the expected pattern.
 */
export function parseMeasures(measures: string): ParsedMeasures | null {
  const re = /^\s*(\d+(?:[.,]\d+)?)\s*[xX×]\s*(\d+(?:[.,]\d+)?)\s*\/\s*(\d+(?:[.,]\d+)?)\s*$/;
  const m = re.exec(measures);
  if (!m) return null;

  const ancho = Number(m[1].replace(",", "."));
  const largo = Number(m[2].replace(",", "."));
  const espesor = Number(m[3].replace(",", "."));

  if (isNaN(ancho) || isNaN(largo) || isNaN(espesor)) return null;
  if (ancho <= 0 || largo <= 0 || espesor <= 0) return null;

  return { ancho, largo, espesor };
}

/**
 * Format measures into the canonical "ANCHO x LARGO / ESPESOR" string.
 */
export function formatMeasures(
  ancho: number,
  largo: number,
  espesor: number
): string {
  return `${ancho} x ${largo} / ${espesor}`;
}

/**
 * Compute the total weight in kg for a bag order.
 *
 * Formula (weight of 1000 bags):
 *   ANCHO(m) × LARGO(m) × ESPESOR(µm) × 1.84
 *
 * Total weight:
 *   (ancho_cm * largo_cm * espesor_µm * 1.84 * quantity) / 10_000_000
 *
 * Returns the result rounded to 2 decimal places.
 */
export function computeWeightKg(
  anchoCm: number,
  largoCm: number,
  espesorMicrones: number,
  quantity: number
): number {
  const kg =
    (anchoCm * largoCm * espesorMicrones * 1.84 * quantity) / 10_000_000;
  return Math.round(kg * 100) / 100;
}
