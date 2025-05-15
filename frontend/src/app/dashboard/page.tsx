"use client";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarView from "../component/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Header from "../component/header";
import {
  useCalendarList,
  useCalendarDetails,
  useAITips,
} from "../hooks/useCalendarData";
import { useProfile } from "../hooks/useProfile";
import Image from "next/image";
import AddCollaboratorModal from "../component/AddCollaboratorModal";
import "./styles.css";
import { plurals } from "@/utils";
import AddEventModal from "../component/AddEventModal";
interface Collaborator {
  // Define properties of a collaborator (e.g., name, role, etc.)
  name: string;
  // You can add other fields if necessary
}
interface Calendar {
  theme: string;
  _id: string;
  collaborators: Collaborator[];
  events: Event[]; // Changed from string to Event[]
}

interface Event {
  title: string;
  date: string; // Should be in ISO format (e.g., "2023-01-01")
  _id: string;
  description?: string;
  type?: string;
  audienceFocus?: string;
  theme?: string;
}
interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description?: string;
  type?: string;
  audienceFocus?: string;
  theme?: string;
  _id: string;
  // Add any additional properties your calendar component expects
}

const transformDataForCalendar = (data?: Event[]): CalendarEvent[] => {
  if (!data) return [];

  return data.map((event) => {
    // Validate the date string before creating Date objects
    const date = new Date(event.date);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${event.date}`);
      // Return a default date or handle the error as needed
      return {
        title: event.title,
        start: new Date(),
        end: new Date(),
        allDay: true,
        description: event.description,
        type: event.type,
        audienceFocus: event.audienceFocus,
        theme: event.theme,
        _id: event._id,
      };
    }

    return {
      title: event.title,
      start: date,
      end: date, // For all-day events, start and end are the same
      allDay: true,
      description: event.description,
      type: event.type,
      audienceFocus: event.audienceFocus,
      theme: event.theme,
      _id: event._id,
    };
  });
};

export default function CalendarPage() {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [showModal, setShowModal] = useState(false);
  const [copyTextIndex, setCopyTextIndex] = useState(null);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
  const [collaboratorModalOpen, setCollaboratorModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const [currentCalendarId, setCurrentCalendarId] = useState<string | null>(
    null
  );

  const handleCalendarSelection = (id: string) => {
    queryClient.setQueryData(["calendarId"], id);
    setCurrentCalendarId(id);
  };

  // Data fetching
  const { data: profile } = useProfile();
  const textRef = useRef(null);

  const { data: calendarList = [], isLoading: calendarListLoading } =
    useCalendarList();
  const { data: calendar, error: calendarError } =
    useCalendarDetails(currentCalendarId);
  const { data: aiTips, error: aiTipsError } = useAITips(currentCalendarId);

  const handleCopy = (index: number) => {
    if (textRef.current) {
      setCopyTextIndex(index);
      const text = textRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {});
    }
  };

  useEffect(() => {
    if (calendarList?.length > 0) {
      const calendarId = queryClient.getQueryData(["calendarId"]);
      const calendarIdToUse = calendarId ?? calendarList[0]._id;
      handleCalendarSelection(calendarIdToUse);
    }
  }, [calendarList]);

  const transformedEvents = useMemo(
    () => transformDataForCalendar(calendar?.data?.events),
    [calendar?.data?.events]
  );

  const getAccessToken = useCallback(() => {
    return (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1] || null
    );
  }, []);
  // Event handlers
  const handleViewChange = useCallback((newView: "month" | "week" | "day") => {
    setView(newView);
  }, []);

  const handleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date }) => {
      console.log("slo", slotInfo.start.toISOString());
      setSelectedSlotInfo(slotInfo);
      setShowModal(true);
    },
    []
  );

  const handleNewEventChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewEvent((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const addEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const payload = {
        calendarId: calendar?.data?._id,
        date: selectedSlotInfo.start.toISOString(),
        ...eventData,
      };
      console.log("eee", payload);
      const response = await fetch("/api/events/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      handleCalendarSelection(calendar?.data?._id);
      setShowModal(false);
    },
  });

  const handleAddEvent = useCallback(
    (data) => {
      addEventMutation.mutate(data);
    },
    [addEventMutation]
  );

  const handleSelectEvent = useCallback(
    (event: Event) => {
      const serializedCollaborators = encodeURIComponent(
        JSON.stringify(calendar?.data?.collaborators ?? [])
      );
      // Update the URL with eventId and collaborators
      router.push(
        `/eventDetails?eventId=${event?._id}&collaborators=${serializedCollaborators}&&event_type=${event.type}`
      );
    },
    [router]
  );

  const addCalendar = useCallback(() => {
    const serializedEvent = encodeURIComponent(
      JSON.stringify({ access_token: getAccessToken() })
    );
    router.push(`/onboarding?access_token=${serializedEvent}`);
  }, [getAccessToken, router]);

  const handleModal = (value: boolean) => {
    setCollaboratorModalOpen(value);
  };

  const handleAddCalendar = () => {
    const serializedResponse = encodeURIComponent(
      JSON.stringify({
        access_token: getAccessToken(),
      })
    );
    router.replace(`/onboarding?access_token=${serializedResponse}`);
  };

  const CalendarListing = () => {
    return (
      <div className="h-[36vh] overflow-y-auto pr-2 custom-scrollbar">
        {calendarListLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg p-3 h-20"
              ></div>
            ))}
          </div>
        ) : Array.isArray(calendarList) && calendarList.length > 0 ? (
          calendarList?.map((item: Calendar) => (
            <div
              onClick={() => handleCalendarSelection(item._id)}
              key={item._id}
              className="mb-3 cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-gray-800 font-medium text-sm truncate">
                  {item.theme}
                </p>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="mb-1">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${80}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex -space-x-1.5">
                  {item?.collaborators?.map(
                    (collaborator: { _id: string; name: string }) => (
                      <div
                        key={collaborator._id}
                        className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-200 to-fuchsia-200 border-2 border-white flex items-center justify-center text-xs font-medium text-purple-800 shadow-sm"
                        title={collaborator.name}
                      >
                        {collaborator.name[0].toUpperCase()}
                      </div>
                    )
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {item.progress || 80}% complete
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">No calendars found</p>
            <button
              onClick={handleAddCalendar}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800"
            >
              Create new calendar
            </button>
          </div>
        )}
      </div>
    );
  };

  const SuggestionListing = () => {
    const tips = aiTips?.tips ?? aiTips;
    return (
      <div className="h-[35vh] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {tips?.length > 0 ? (
          tips.map((item: any, index: number) => (
            <div
              key={index}
              ref={textRef}
              className="relative bg-white p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 shadow-xs hover:shadow-md group overflow-hidden"
            >
              {/* Platform badge */}
              {item.platform && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                  {item.platform}
                </span>
              )}

              {/* Tip content with expandable animation */}
              <div className="pr-8">
                <h4 className="font-semibold text-purple-800 mb-1.5 text-sm">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {item.action}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {item.reason}
                </p>
                <p className="text-gray-600 text-sm line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {item.high}
                </p>
              </div>

              {/* Action buttons */}
              <div className="mt-3 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleCopy(index)}
                  className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center px-2.5 py-1 rounded-md hover:bg-purple-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 mr-1.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                  {copyTextIndex == index ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <div className="relative mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <div className="absolute inset-0 bg-purple-100/10 rounded-full animate-pulse" />
            </div>
            <h4 className="text-gray-500 font-medium text-sm mb-1">
              No suggestions yet
            </h4>
            <p className="text-gray-400 text-xs max-w-xs">
              {aiTips?.length
                ? "Analyzing your calendar events..."
                : "Add events to get AI optimization tips"}
            </p>
          </div>
        )}
      </div>
    );
  };

  const CollaboratorListing = () => {
    return (
      <div className="flex w-full justify-between items-center px-6">
        <button
          onClick={addCalendar}
          className="relative group overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] w-[19%] min-w-[180px]"
        >
          {/* Base layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-fuchsia-700 rounded-full shadow-lg"></div>

          {/* Animated shine layer */}
          <div className="absolute inset-0 rounded-full bg-[length:200%_200%] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>

          {/* Content container */}

          {/* Ripple effect container */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute bg-white/20 rounded-full scale-0 opacity-0 group-active:scale-100 group-active:opacity-100 transition-transform duration-500 origin-center"></span>
          </div>

          {/* Custom animations */}
          <style jsx>{`
            @keyframes shine {
              0% {
                background-position: -100% 0;
              }
              100% {
                background-position: 200% 0;
              }
            }
          `}</style>
        </button>
        <div className="flex items-center gap-4 mr-10">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 mb-1">
              {`${plurals(calendar?.data?.collaborators, "Collaborator")}`}
            </p>
            <p className="text-xs text-gray-400">
              {calendar?.data?.collaborators?.length || 0} team{" "}
              {plurals(calendar?.data?.collaborators, "member")}
            </p>
          </div>

          <div className="flex items-center">
            <div className="flex -space-x-2">
              {calendar?.data?.collaborators
                ?.slice(0, 5)
                .map((item: { _id: string; name: string }) => (
                  <div
                    key={item._id}
                    className="relative group w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium"
                    title={item.name}
                  >
                    <span className="text-sm">
                      {item.name[0].toUpperCase()}
                    </span>
                  </div>
                ))}

              {calendar?.data?.collaborators?.length > 5 && (
                <div className="relative group w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs border border-gray-200">
                  +{calendar?.data?.collaborators.length - 5}
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-80 transition-opacity"></div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleModal(true)}
              className="ml-3 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-700 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full h-full">
      {showModal && (
        <AddEventModal
          isOpen={showModal}
          onSave={handleAddEvent}
          onClose={closeModal}
        />
      )}
      <Header
        editor={false}
        handleApproveChanges={() => {}}
        profile={profile}
      />
      <div className="flex flex-1 overflow-hidden w-full h-[100%]">
        <div className="w-[22%] from-gray-50 to-gray-100 shadow-xl flex flex-col justify-start border-r border-gray-200">
          {/* AI Tips Section */}
          <div className="mb-6">
            {/* Header with animated gradient */}
            <div className="h-[57] flex p-4 bg-primary items-center justify-between mb-4">
              <div className="flex items-center">
                <Image
                  alt="Lightbulb icon"
                  src="/images/tips.svg"
                  width={20}
                  height={20}
                  priority
                  className="text-white mr-3"
                />
                <h3 className="text-xl font-bold text-white">
                  AI Optimization Tips
                </h3>
              </div>
              <span className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                {aiTips?.length || 0}{" "}
                {aiTips?.length === 1 ? "suggestion" : "suggestions"}
              </span>
            </div>
            <SuggestionListing />
          </div>
          <div>
            <div className="h-[57] flex p-4 bg-primary items-center justify-between mb-4">
              <div className="flex items-center">
                <Image
                  alt="Calendar icon"
                  src="/images/calendar.svg"
                  width={24}
                  height={24}
                  priority
                  className="mr-3"
                />
                <h3 className="text-xl font-bold text-white">
                  Brand Calendars
                </h3>
              </div>
              <span className="text-xs font-medium bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                {calendarList?.length || 0} calendars
              </span>
            </div>
          </div>
          <CalendarListing />
          <div className="w-full flex justify-center">
            <div
              onClick={handleAddCalendar}
              className="w-[70%] cursor-pointer bg-primary rounded-3xl flex items-center justify-center px-5 py-2.5"
            >
              <span className="text-white font-semibold tracking-wide text-sm uppercase flex items-center">
                Add New Calendar
              </span>
            </div>
          </div>
        </div>
        {/* Main calendar view */}
        <div className="flex flex-col flex-1 overflow-hidden w-[78%] p-6">
          <div className="text-black text-base">
            <div className="flex justify-between items-center mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-xs border border-gray-200">
                  <Image
                    alt="Calendar icon"
                    src="/images/calendarTask.svg"
                    width={24}
                    height={24}
                    priority
                    className="text-purple-600"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {calendar?.data?.theme || "My Calendar"}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                    Last updated {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">80%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Complete
                  </div>
                </div>
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E0E7FF"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#7A0860"
                      strokeWidth="3"
                      strokeDasharray="80, 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#7A0860]"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CalendarView
            events={transformedEvents}
            view={view}
            onViewChange={handleViewChange}
            onSelectSlot={handleSelectSlot}
            showModal={showModal}
            onAddEvent={handleAddEvent}
            onCloseModal={() => setShowModal(false)}
            newEvent={newEvent}
            onNewEventChange={handleNewEventChange}
            handleSelectEvent={handleSelectEvent}
          />
          <CollaboratorListing />
        </div>
      </div>
      <AddCollaboratorModal
        handleModal={(value: boolean) => handleModal(value)}
        open={collaboratorModalOpen}
        calendarId={calendar?.data?._id}
      />
    </div>
  );
}
