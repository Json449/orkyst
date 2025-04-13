// hooks/useCalendarData.ts
import { useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      return data?.data?.result || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
