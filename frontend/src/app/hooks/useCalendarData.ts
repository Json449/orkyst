// hooks/useCalendarData.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useAITips = (calendarId: string) => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  return useQuery({
    queryKey: ["aiTips", calendarId, currentUser?.id], // Composite cache key
    queryFn: async () => {
      const res = await fetch(
        `/api/calendarSuggestions?id=${encodeURIComponent(calendarId)}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            "X-Request-ID": Date.now().toString(), // Cache busting
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch AI tips");
      }

      const data = await res.json();
      return data?.data?.result || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes until stale
    gcTime: 60 * 60 * 1000, // 1 hour cache retention
    refetchOnWindowFocus: false,
    enabled: !!calendarId, // Only run when calendarId exists
  });
};

export const useCalendarList = () => {
  const queryClient = useQueryClient();
  const currentUser: any = queryClient.getQueryData(["currentUser"]);

  return useQuery({
    queryKey: ["calendarList", currentUser?.id],
    queryFn: async () => {
      const res = await fetch("/api/calendarList", {
        headers: {
          "Cache-Control": "no-cache", // Bypass browser cache
          "X-Request-ID": Date.now().toString(), // Cache buster
        },
      });
      const data = await res.json();
      return data?.data || [];
    },
    // Cache configuration
    staleTime: 5 * 60 * 1000, // 5 minutes (data stays fresh)
    gcTime: 30 * 60 * 1000, // 30 minutes (cache retention)
    // Refetch behavior
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    networkMode: "online", // Prefer fresh data but allow cache fallback
  });
};

export const useCalendarDetails = (calendarId: string) => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);

  return useQuery({
    queryKey: ["calendarDetails", calendarId, currentUser?.id],
    queryFn: async () => {
      if (!calendarId) throw new Error("No calendar selected");

      const res = await fetch(
        `/api/calendarDetails?id=${encodeURIComponent(calendarId)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "X-Request-ID": Date.now().toString(),
          },
        }
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch calendar details");
      }
      return res.json();
    },
    enabled: !!calendarId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
