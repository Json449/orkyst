import { useMutation } from "@tanstack/react-query";

export const useUpdateTokenMutation = () => {
  return useMutation({
    mutationFn: async (access_token: { access_token: string }) => {
      const res = await fetch("/api/updateToken", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token.access_token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update token");
      }
      return await res.json();
    },
  });
};
