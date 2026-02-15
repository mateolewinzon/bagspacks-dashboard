-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('extrusion', 'impresion', 'confeccion', 'terminado', 'entregado');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "measures" TEXT NOT NULL,
    "weightKg" DOUBLE PRECISION NOT NULL,
    "precioVenta" DOUBLE PRECISION,
    "estado" "OrderStatus" NOT NULL DEFAULT 'extrusion',
    "estadoFecha" TIMESTAMP(3),
    "extrusion" JSONB,
    "impresion" JSONB,
    "laminacion" JSONB,
    "confeccion" JSONB,
    "costoExtra" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
