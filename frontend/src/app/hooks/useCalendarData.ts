// hooks/useCalendarData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAITipsMutation = () => {
  const queryClient = useQueryClient();
  const currentUser: any = queryClient.getQueryData(["currentUser"]);

  return useMutation({
    mutationFn: async (calendarId: string) => {
      const res = await fetch(`/api/calendarSuggestions?id=${calendarId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch AI tips");
      }
      return data?.data?.result || [];
    },
    onSuccess: (tips, calendarId) => {
      queryClient.setQueryData(
        ["aiTips", `${calendarId + currentUser?.id}`],
        tips
      );
    },
    onError: (error: Error) => {
      console.error("Error fetching AI tips:", error.message);
    },
  });
};

export const useCalendarList = () => {
  const queryClient = useQueryClient();
  const currentUser: any = queryClient.getQueryData(["currentUser"]);
  console.log("query now", currentUser?.id);
  return useQuery({
    queryKey: ["calendarList", currentUser?.id],
    queryFn: async () => {
      const res = await fetch("/api/calendarList");
      const data = await res.json();
      return data?.data || [];
    },
    staleTime: 3 * 60 * 1000, // 1 hour
  });
};

export const useCalendarDetails = () => {
  const queryClient = useQueryClient();
  const currentUser: any = queryClient.getQueryData(["currentUser"]);

  return useMutation({
    mutationFn: async (calendarId: string) => {
      const res = await fetch(`/api/calendarDetails?id=${calendarId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch calendar details");
      }
      return res.json();
    },
    onSuccess: (response, calendarId) => {
      queryClient.setQueryData(
        ["calendar", `${calendarId + currentUser?.id}`],
        response
      ); // Cache the response
    },
    onError: (error) => {
      console.error("Error fetching calendar details:", error);
    },
  });
};
