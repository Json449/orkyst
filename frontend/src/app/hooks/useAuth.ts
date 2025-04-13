// hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "GET",
      });
      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: () => {
      // Clear ALL React Query cache
      queryClient.removeQueries();
      queryClient.clear();
      // Clear persisted cache from storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("APP_QUERY_CACHE");
        sessionStorage.clear();
      }
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};
