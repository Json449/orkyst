// hooks/useAuth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type LoginCredentials = {
  email: string;
  password: string;
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Login Mutation
  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (response) => {
      // queryClient.setQueryData(["currentUser"], {
      //   id: response.data.result.sub,
      //   isVerified: response.data.result.isVerified,
      // });
      // Handle verification flow
      if (response.data.result.isVerified) {
        router.push("/dashboard");
      } else {
        // More secure approach - just pass user ID if verification is needed
        const serializedEvent = encodeURIComponent(
          JSON.stringify({
            access_token: response.data.result.access_token,
          })
        );
        router.push(`/account_verification?access_token=${serializedEvent}`);
      }
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
      // toast.error(error.message); // Show error to user
    },
  });

  // Logout Mutation (Enhanced)
  const logout = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include", // Ensures cookies are sent
      });

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: async () => {
      // Clear user-specific queries
      queryClient.removeQueries();
      queryClient.clear();
      // Clear all storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("APP_QUERY_CACHE");
        sessionStorage.clear();

        try {
          await Promise.allSettled([
            indexedDB.deleteDatabase("tanstack-query-sync"),
            indexedDB.deleteDatabase("APP_QUERY_CACHE"),
          ]);
        } catch (e) {
          console.error("Storage cleanup error:", e);
        }
      }

      router.push("/"); // Redirect to login
    },
    onError: (error: Error) => {
      console.error("Logout error:", error.message);
      // toast.error("Failed to logout. Please try again.");
    },
  });

  return {
    login,
    logout: {
      mutate: logout.mutate,
      mutateAsync: logout.mutateAsync,
      isPending: logout.isPending, // The loading state
      isSuccess: logout.isSuccess,
      isError: logout.isError,
      error: logout.error,
    },
  };
};
