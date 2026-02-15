// ── Extrusion ──────────────────────────────────────────────
export interface ExtrusionData {
  extrusor: string;        // quien/donde (ej: "P.Online", "Julian", "Diseño Bags")
  material: string;        // ej: "PEBD", "PEBD coex", "PEAD", "PP"
  cantidadMts: string;     // metros (texto libre, ej: "1100 mts")
  ancho: number | null;    // cm
  micrones: number | null;
  tipo: string;            // ej: "Tubo", "Lamina", "F 7", "F 10"
  color: string;           // ej: "Cristal", "Blanco", "B/N", "Negro"
  kilos: number | null;    // kilos reales producidos
  precioUnitario: number | null; // Pr. Un
  costo: number | null;    // Costo extrusión
}

// ── Impresion ──────────────────────────────────────────────
export interface ImpresionData {
  imprenta: string;              // quien imprime (ej: "Juanka", "Julio", "s/imp.")
  costoImpresion: number | null;
}

// ── Laminacion (placeholder generico) ──────────────────────
export interface LaminacionData {
  responsable: string;
  notas: string;
}

// ── Confeccion ─────────────────────────────────────────────
export interface ConfeccionData {
  confeccion: string;            // quien confecciona (ej: "Julio", "Daniel", "s/conf.")
  costoConfeccion: number | null;
}

// ── Costo Extra ────────────────────────────────────────────
export interface CostoExtraData {
  costoExtra: number | null;
  descripcion: string;
}

// ── Order status ───────────────────────────────────────────
export type OrderStatus =
  | "extrusion"
  | "impresion"
  | "confeccion"
  | "terminado"
  | "entregado";

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "extrusion", label: "Extrusión" },
  { value: "impresion", label: "Impresión" },
  { value: "confeccion", label: "Confección" },
  { value: "terminado", label: "Terminado" },
  { value: "entregado", label: "Entregado" },
];

// ── Process key ────────────────────────────────────────────
export type ProcessKey =
  | "extrusion"
  | "impresion"
  | "laminacion"
  | "confeccion"
  | "costoExtra";

// ── Order ──────────────────────────────────────────────────
export interface Order {
  id: string;
  orderNumber: number;
  date: string;
  clientName: string;
  description: string;
  quantity: number;
  measures: string;
  weightKg: number;
  precioVenta?: number | null;
  estado: OrderStatus;
  estadoFecha?: string;          // ISO date string del último cambio de estado
  extrusion?: ExtrusionData;
  impresion?: ImpresionData;
  laminacion?: LaminacionData;
  confeccion?: ConfeccionData;
  costoExtra?: CostoExtraData;
}

// ── Factory helpers ────────────────────────────────────────
export function createEmptyExtrusion(): ExtrusionData {
  return {
    extrusor: "",
    material: "",
    cantidadMts: "",
    ancho: null,
    micrones: null,
    tipo: "",
    color: "",
    kilos: null,
    precioUnitario: null,
    costo: null,
  };
}

export function createEmptyImpresion(): ImpresionData {
  return { imprenta: "", costoImpresion: null };
}

export function createEmptyLaminacion(): LaminacionData {
  return { responsable: "", notas: "" };
}

export function createEmptyConfeccion(): ConfeccionData {
  return { confeccion: "", costoConfeccion: null };
}

export function createEmptyCostoExtra(): CostoExtraData {
  return { costoExtra: null, descripcion: "" };
}

// ── Labels ─────────────────────────────────────────────────
export const PROCESS_LABELS: Record<ProcessKey, string> = {
  extrusion: "Extrusión",
  impresion: "Impresión",
  laminacion: "Laminación",
  confeccion: "Confección",
  costoExtra: "Costo Extra",
};

// ── Helpers ────────────────────────────────────────────────

/** Returns true if every field in a process data object is empty ("", null, or undefined) */
export function isProcessDataEmpty(data: Record<string, unknown>): boolean {
  return Object.values(data).every(
    (v) => v === "" || v === null || v === undefined
  );
}

/** Returns true only if the process has its cost/value field filled in */
export function isProcessComplete(order: Order, key: ProcessKey): boolean {
  switch (key) {
    case "extrusion":
      return order.extrusion?.costo != null;
    case "impresion":
      return order.impresion?.costoImpresion != null;
    case "confeccion":
      return order.confeccion?.costoConfeccion != null;
    case "costoExtra":
      return order.costoExtra?.costoExtra != null;
    case "laminacion":
      return (
        (order.laminacion?.responsable ?? "") !== "" ||
        (order.laminacion?.notas ?? "") !== ""
      );
  }
}

/** Returns the responsible person name for the current order status, if applicable */
export function getResponsableForEstado(order: Order): string | null {
  switch (order.estado) {
    case "extrusion":
      return order.extrusion?.extrusor || null;
    case "impresion":
      return order.impresion?.imprenta || null;
    case "confeccion":
      return order.confeccion?.confeccion || null;
    default:
      return null;
  }
}

/** Sum of all cost fields across processes */
export function getCostoTotal(order: Order): number | null {
  const costs = [
    order.extrusion?.costo,
    order.impresion?.costoImpresion,
    order.confeccion?.costoConfeccion,
    order.costoExtra?.costoExtra,
  ];

  const filled = costs.filter((c): c is number => c != null);
  return filled.length > 0 ? filled.reduce((sum, c) => sum + c, 0) : null;
}
