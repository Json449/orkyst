import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 60 * 60 * 1000, // 1 hours
      retry: 2,
      refetchOnWindowFocus: true, // true in prod
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Client-side only cache persistence
if (typeof window !== "undefined") {
  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: "APP_QUERY_CACHE",
    throttleTime: 1000,
  });

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    buster: APP_VERSION,
  });
}
