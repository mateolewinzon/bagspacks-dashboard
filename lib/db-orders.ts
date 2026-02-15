import type { Order as AppOrder, OrderStatus } from "./types";
import type { Order as PrismaOrder } from "@prisma/client";

function parseJson<T>(value: unknown): T | undefined {
  if (value == null) return undefined;
  return value as T;
}

export function prismaOrderToAppOrder(row: PrismaOrder): AppOrder {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    date: row.date,
    clientName: row.clientName,
    description: row.description,
    quantity: row.quantity,
    measures: row.measures,
    weightKg: row.weightKg,
    precioVenta: row.precioVenta ?? undefined,
    estado: row.estado as OrderStatus,
    estadoFecha: row.estadoFecha?.toISOString(),
    extrusion: parseJson(row.extrusion),
    impresion: parseJson(row.impresion),
    laminacion: parseJson(row.laminacion),
    confeccion: parseJson(row.confeccion),
    costoExtra: parseJson(row.costoExtra),
  };
}
