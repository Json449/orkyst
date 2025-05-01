import { useMutation } from "@tanstack/react-query";

export const useEventDetailsMutation = () => {
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
    onSuccess: () => {
      // queryClient.setQueryData(["events", eventId], data);
    },
    onError: (error: Error) => {
      console.log("Error fetching AI tips:", error?.message);
    },
  });
};
