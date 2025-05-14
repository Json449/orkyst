import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Immediately stale (no caching)
      gcTime: 0, // No garbage collection (no cache storage)
      retry: 2,
      refetchOnWindowFocus: false, // No refetch on window focus
      refetchOnReconnect: false, // No refetch on reconnect
      refetchOnMount: true, // Always refetch on mount
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
