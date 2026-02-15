"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OrdersProvider } from "@/lib/orders-context";

const STALE_TIME_MS = 5 * 60 * 1000; // 5 minutes

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: STALE_TIME_MS,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <OrdersProvider>{children}</OrdersProvider>
    </QueryClientProvider>
  );
}
