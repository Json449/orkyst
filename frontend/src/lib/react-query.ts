import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || "1.0";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes (data becomes stale after this)
      gcTime: 24 * 60 * 60 * 1000, // 24 hours (cache duration)
      retry: 2,
      refetchOnWindowFocus: true, // Smart refetch when tab regains focus
      refetchOnReconnect: true, // Refetch when network recovers
      refetchOnMount: true, // Refetch when component mounts
      networkMode: "online", // Try network first, fallback to cache
    },
    mutations: {
      retry: 1,
      networkMode: "online",
    },
  },
});

// Client-side cache persistence (1 week)
if (typeof window !== "undefined") {
  const persister = createAsyncStoragePersister({
    storage: window.localStorage,
    key: `APP_QUERY_CACHE_v${APP_VERSION}`, // Versioned cache key
    throttleTime: 500, // Faster cache writes
    serialize: (data) => JSON.stringify(data),
    deserialize: (cached) => {
      try {
        return JSON.parse(cached);
      } catch {
        return null; // Clear corrupt cache
      }
    },
  });

  persistQueryClient({
    queryClient,
    persister,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    buster: APP_VERSION,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) =>
        // Skip persisting sensitive or large data
        !query.queryKey.includes("auth") && query.state.status === "success",
    },
  });
}
