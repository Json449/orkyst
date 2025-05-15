// hooks/useCalendarData.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const currentUser = queryClient.getQueryData(["currentUser"]);
  return useQuery({
    queryKey: ["profile", currentUser?.id],
    queryFn: async () => {
      const res = await fetch("/api/profile", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      const data = await res.json();
      return data?.data?.result || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour (data stays fresh)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours (cache retention)
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: false, // Smarter refetching
    retry: 2,
    retryDelay: 1000,
  });
};
