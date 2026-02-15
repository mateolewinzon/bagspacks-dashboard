"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Order,
  ProcessKey,
  ExtrusionData,
  ImpresionData,
  LaminacionData,
  ConfeccionData,
  CostoExtraData,
} from "./types";
import { isProcessDataEmpty } from "./types";

export const ORDERS_QUERY_KEY = ["orders"] as const;

type ProcessDataFor<K extends ProcessKey> = K extends "extrusion"
  ? ExtrusionData
  : K extends "impresion"
    ? ImpresionData
    : K extends "laminacion"
      ? LaminacionData
      : K extends "confeccion"
        ? ConfeccionData
        : K extends "costoExtra"
          ? CostoExtraData
          : never;

interface OrdersContextValue {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (order: Omit<Order, "id">) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  updateOrderProcess: <K extends ProcessKey>(
    orderId: string,
    processKey: K,
    data: ProcessDataFor<K>
  ) => Promise<void>;
  refetch: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Error al cargar pedidos");
  return res.json();
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch: queryRefetch } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: fetchOrders,
  });

  const orders = data ?? [];
  const loading = isLoading;
  const errorMessage =
    error != null
      ? error instanceof Error
        ? error.message
        : "Error al cargar pedidos"
      : null;

  const refetch = useCallback(async () => {
    await queryRefetch();
  }, [queryRefetch]);

  const addOrder = useCallback(
    async (order: Omit<Order, "id">) => {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al crear pedido");
      }
      const created: Order = await res.json();
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) => [
        ...(old ?? []),
        created,
      ]);
    },
    [queryClient]
  );

  const updateOrder = useCallback(
    async (id: string, data: Partial<Order>) => {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al actualizar pedido");
      }
      const updated: Order = await res.json();
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        (old ?? []).map((o) => (o.id === id ? updated : o))
      );
    },
    [queryClient]
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al eliminar pedido");
      }
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        (old ?? []).filter((o) => o.id !== id)
      );
    },
    [queryClient]
  );

  const updateOrderProcess = useCallback(
    async <K extends ProcessKey>(
      orderId: string,
      processKey: K,
      data: ProcessDataFor<K>
    ) => {
      const payload = isProcessDataEmpty(
        data as unknown as Record<string, unknown>
      )
        ? { [processKey]: null }
        : { [processKey]: data };
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al actualizar proceso");
      }
      const updated: Order = await res.json();
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        (old ?? []).map((o) => (o.id === orderId ? updated : o))
      );
    },
    [queryClient]
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error: errorMessage,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderProcess,
        refetch,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
