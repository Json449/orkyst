import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useEventDetailsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      const url = `/api/events/details?id=${eventId}`;
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch AI tips");
      }
      return data;
    },
    onSuccess: (data, eventId) => {
      queryClient.setQueryData(["events", eventId], data);
    },
    onError: (error: Error) => {
      console.log("Error fetching AI tips:", error?.message);
    },
  });
};
