import { useMutation } from "@tanstack/react-query";

export const useJobStatusPollingMutation = (access_token: {
  access_token: string;
}) => {
  return useMutation({
    mutationFn: async (jobId: string) => {
      console.log("Accc", access_token.access_token);
      const url = `/api/jobStatus?jobId=${jobId}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token.access_token}`,
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
