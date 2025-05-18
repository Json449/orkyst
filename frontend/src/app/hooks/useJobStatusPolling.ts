import { useMutation } from "@tanstack/react-query";

export const useJobStatusPollingMutation = () => {
  return useMutation({
    mutationFn: async (jobId: string) => {
      const url = `/api/jobStatus?jobId=${jobId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch job status");
      }

      return await res.json();
    },
  });
};
