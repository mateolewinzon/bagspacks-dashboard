import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { prismaOrderToAppOrder } from "@/lib/db-orders";
import type { OrderStatus } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const row = await prisma.order.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    return NextResponse.json(prismaOrderToAppOrder(row));
  } catch (e) {
    console.error("GET /api/orders/[id]", e);
    return NextResponse.json(
      { error: "Error al obtener pedido" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();

    const data: Record<string, unknown> = {};
    if (body.orderNumber != null) data.orderNumber = Number(body.orderNumber);
    if (body.date != null) data.date = String(body.date);
    if (body.clientName != null) data.clientName = String(body.clientName);
    if (body.description != null) data.description = String(body.description);
    if (body.quantity != null) data.quantity = Number(body.quantity);
    if (body.measures != null) data.measures = String(body.measures);
    if (body.weightKg != null) data.weightKg = Number(body.weightKg);
    if (body.precioVenta !== undefined) data.precioVenta = body.precioVenta == null ? null : Number(body.precioVenta);
    if (body.estado != null) {
      data.estado = body.estado as OrderStatus;
      data.estadoFecha = new Date();
    }
    if (body.extrusion !== undefined) data.extrusion = body.extrusion;
    if (body.impresion !== undefined) data.impresion = body.impresion;
    if (body.laminacion !== undefined) data.laminacion = body.laminacion;
    if (body.confeccion !== undefined) data.confeccion = body.confeccion;
    if (body.costoExtra !== undefined) data.costoExtra = body.costoExtra;

    const row = await prisma.order.update({
      where: { id },
      data,
    });
    return NextResponse.json(prismaOrderToAppOrder(row));
  } catch (e) {
    console.error("PATCH /api/orders/[id]", e);
    return NextResponse.json(
      { error: "Error al actualizar pedido" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.order.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("DELETE /api/orders/[id]", e);
    return NextResponse.json(
      { error: "Error al eliminar pedido" },
      { status: 500 }
    );
  }
}
