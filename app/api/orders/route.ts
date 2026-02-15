import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { prismaOrderToAppOrder } from "@/lib/db-orders";
import type { OrderStatus } from "@/lib/types";

export async function GET() {
  try {
    const rows = await prisma.order.findMany({
      orderBy: [{ orderNumber: "desc" }],
    });
    const orders = rows.map(prismaOrderToAppOrder);
    return NextResponse.json(orders);
  } catch (e) {
    console.error("GET /api/orders", e);
    return NextResponse.json(
      { error: "Error al listar pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      orderNumber,
      date,
      clientName,
      description,
      quantity,
      measures,
      weightKg,
      precioVenta,
      estado,
      extrusion,
      impresion,
      laminacion,
      confeccion,
      costoExtra,
    } = body;

    const row = await prisma.order.create({
      data: {
        orderNumber: Number(orderNumber),
        date: String(date),
        clientName: String(clientName),
        description: String(description),
        quantity: Number(quantity),
        measures: String(measures),
        weightKg: Number(weightKg),
        precioVenta: precioVenta != null ? Number(precioVenta) : null,
        estado: (estado ?? "extrusion") as OrderStatus,
        extrusion: extrusion ?? undefined,
        impresion: impresion ?? undefined,
        laminacion: laminacion ?? undefined,
        confeccion: confeccion ?? undefined,
        costoExtra: costoExtra ?? undefined,
      },
    });
    return NextResponse.json(prismaOrderToAppOrder(row));
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json(
      { error: "Error al crear pedido" },
      { status: 500 }
    );
  }
}
