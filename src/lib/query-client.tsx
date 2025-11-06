"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 2 * 60 * 1000, // 2 минуты - увеличиваем для уменьшения запросов
            gcTime: 15 * 60 * 1000, // 15 минут - увеличиваем время хранения в кеше
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: true,
            // Не отменяем запросы при размонтировании, если они почти завершены
            // Это уменьшит количество canceled запросов
            networkMode: "online",
          },
          mutations: {
            retry: 1,
            // Не отменяем мутации при размонтировании
            networkMode: "online",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
