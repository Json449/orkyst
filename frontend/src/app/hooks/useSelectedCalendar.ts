// hooks/useCalendarSelection.ts
import { useQueryClient } from '@tanstack/react-query';

export const useCalendarSelection = () => {
  const queryClient = useQueryClient();

  const setSelectedCalendarId = (calendarId: string) => {
    queryClient.setQueryData(['selectedCalendarId'], calendarId);
  };

  const getSelectedCalendarId = (): string | undefined => {
    return queryClient.getQueryData(['selectedCalendarId']);
  };

  return { setSelectedCalendarId, getSelectedCalendarId };
};