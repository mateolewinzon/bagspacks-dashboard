"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchOrders();
      setOrders(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar pedidos");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addOrder = useCallback(async (order: Omit<Order, "id">) => {
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
    setOrders((prev) => [...prev, created]);
  }, []);

  const updateOrder = useCallback(async (id: string, data: Partial<Order>) => {
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
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? updated : o))
    );
  }, []);

  const deleteOrder = useCallback(async (id: string) => {
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? "Error al eliminar pedido");
    }
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

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
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updated : o))
      );
    },
    []
  );

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
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
