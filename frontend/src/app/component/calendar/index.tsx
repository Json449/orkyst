import React, { JSX, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  LinkedIn,
  Article,
  Poll,
  Videocam,
  Event,
  Chat,
  Mic,
  CameraAlt,
  VideoLibrary,
  X,
  Facebook,
} from "@mui/icons-material";
import { Tooltip, Chip } from "@mui/material";
import "./styles.css";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

interface Event {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  description?: string;
  type?: string;
  audienceFocus?: string;
  theme?: string;
}

interface ToolbarProps {
  onNavigate: (view: string) => void;
  date: Date;
  onView: (view: string) => void;
  view: unknown;
}

interface CalendarViewProps {
  events: Event[];
  view: string;
  onViewChange: (view: string) => void;
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  showModal: boolean;
  onSelectEvent: (event: Event) => void;
  handleSelectEvent: () => void;
}

const eventTypeStyles = {
  facebook: {
    backgroundColor: "rgba(24, 119, 242, 0.12)", // Facebook blue with 12% opacity
    color: "#1877f2", // Official Facebook blue
    borderColor: "#1877f2",
    iconColor: "#1877f2",
  },
  linkedin: {
    backgroundColor: "rgba(0, 119, 181, 0.12)", // Deep LinkedIn blue
    color: "#0077b5",
    borderColor: "#0077b5",
    iconColor: "#0077b5",
  },
  blog: {
    backgroundColor: "rgba(52, 168, 83, 0.12)", // Google green
    color: "#34a853",
    borderColor: "#34a853",
    iconColor: "#34a853",
  },
  "social media": {
    backgroundColor: "rgba(13, 148, 136, 0.12)", // Teal
    color: "#0d9488",
    borderColor: "#0d9488",
    iconColor: "#0d9488",
  },
  dvc: {
    backgroundColor: "rgba(106, 64, 150, 0.12)", // Royal purple
    color: "#6a4096",
    borderColor: "#6a4096",
    iconColor: "#6a4096",
  },
  twitter: {
    backgroundColor: "rgba(23, 23, 23, 0.12)", // Twitter's original black
    color: "#171717",
    borderColor: "#171717",
    iconColor: "#171717",
  },
  Podcast: {
    backgroundColor: "rgba(173, 0, 255, 0.12)", // Electric purple
    color: "#ad00ff",
    borderColor: "#ad00ff",
    iconColor: "#ad00ff",
  },
  instagram: {
    backgroundColor: "rgba(193, 53, 132, 0.12)", // Instagram pink
    color: "#c13584",
    borderColor: "#c13584",
    iconColor: "#c13584",
  },
  youtube: {
    backgroundColor: "rgba(255, 0, 0, 0.12)", // YouTube red
    color: "#ff0000",
    borderColor: "#ff0000",
    iconColor: "#ff0000",
  },
};

const eventTypeIcons = {
  linkedin: <LinkedIn style={{ fontSize: "14px" }} />,
  blog: <Article style={{ fontSize: "14px" }} />,
  poll: <Poll style={{ fontSize: "14px" }} />,
  dvc: <Videocam style={{ fontSize: "14px" }} />,
  social: <Chat style={{ fontSize: "14px" }} />,
  event: <Event style={{ fontSize: "14px" }} />,
  twitter: <X style={{ fontSize: "14px" }} />,
  podcast: <Mic style={{ fontSize: "14px" }} />,
  instagram: <CameraAlt style={{ fontSize: "14px" }} />,
  youtube: <VideoLibrary style={{ fontSize: "14px" }} />,
  facebook: <Facebook style={{ fontSize: "14px" }} />,
  // Add any exact match exceptions here
  "twitter space": <X style={{ fontSize: "14px" }} />,
  "twitter thread": <X style={{ fontSize: "14px" }} />,
};

export default function CalendarView({
  events,
  view,
  onViewChange,
  onSelectSlot,
  showModal,
  handleSelectEvent,
}: CalendarViewProps) {
  const [date, setDate] = useState(new Date());

  const priorityOrder = [
    "facebook",
    "twitter", // Highest priority
    "instagram",
    "youtube",
    "linkedin",
    "podcast",
    "blog",
    "social",
    "poll",
    "dvc",
  ];

  const getEventIcon = (eventType?: string): JSX.Element => {
    if (!eventType) return eventTypeIcons.event; // Default to event icon if no eventType

    const lowerType = eventType.toLowerCase();

    // 1. First check for exact matches (case insensitive)
    const exactMatch = Object.entries(eventTypeIcons).find(
      ([key]) => key.toLowerCase() === lowerType
    );
    if (exactMatch) return exactMatch[1]; // Return the icon for the exact match

    // 2. Check for partial matches in priority order
    for (const key of priorityOrder) {
      if (lowerType.includes(key)) {
        return eventTypeIcons[key as keyof typeof eventTypeIcons]; // Assert key is one of the valid keys in eventTypeIcons
      }
    }

    // 3. Fallback to default
    return eventTypeIcons.event; // Return the default icon
  };

  const getEventStyles = (eventType?: string) => {
    if (!eventType) return eventTypeStyles.twitter; // Default to twitter style

    const lowerType = eventType.toLowerCase();

    // 1. First check for exact matches (case insensitive)
    const exactMatch = Object.entries(eventTypeStyles).find(
      ([key]) => key.toLowerCase() === lowerType
    );
    if (exactMatch) return exactMatch[1]; // Return the style for the exact match

    // 2. Check for partial matches in priority order
    for (const key of priorityOrder) {
      if (lowerType.includes(key)) {
        return eventTypeStyles[key as keyof typeof eventTypeStyles]; // Assert key is one of the valid keys in eventTypeStyles
      }
    }

    // 3. Fallback to default
    return eventTypeStyles.twitter; // Return the default style (twitter)
  };

  // Usage in your events mapping
  const customizedEvents = events.map((event: Event) => {
    const eventType = event.type?.toLowerCase();
    return {
      ...event,
      icon: getEventIcon(eventType),
      styles: getEventStyles(eventType),
    };
  });

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const CustomEvent = ({
    event,
  }: {
    event: Event & {
      icon?: JSX.Element;
      styles?: { backgroundColor: string; color: string; borderColor: string };
    };
  }) => {
    return (
      <Tooltip
        title={
          <div className="p-2">
            <div className="font-bold text-sm mb-1">{event.title}</div>
            <div className="flex flex-wrap gap-1">
              <Chip
                label={event.type}
                size="small"
                className="text-xs"
                style={{
                  backgroundColor: event.styles?.backgroundColor,
                  color: event.styles?.color,
                }}
              />
              <Chip
                label={event.audienceFocus}
                size="small"
                className="text-xs bg-gray-100"
              />
            </div>
            {event.description && (
              <div className="mt-2 text-xs text-gray-600">
                {event.description}
              </div>
            )}
          </div>
        }
        placement="top"
        arrow
      >
        <div
          className="p-1 h-full w-full flex flex-col"
          style={{
            backgroundColor: event.styles?.backgroundColor,
            color: event.styles?.color,
            borderLeft: `4px solid ${event.styles?.borderColor}`,
            borderRadius: "4px",
          }}
        >
          <div className="flex items-center gap-1 mb-1">
            <span className="flex-shrink-0">{event.icon}</span>
            <span className="text-xs font-medium truncate">{event.type}</span>
          </div>
          <div className="text-sm font-semibold line-clamp-2 leading-tight">
            {event.title}
          </div>
          {!event.allDay && (
            <div className="mt-auto text-xs opacity-80">
              {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
            </div>
          )}
        </div>
      </Tooltip>
    );
  };

  const CustomToolbar = (toolbar: ToolbarProps) => {
    const goToToday = () => {
      toolbar.onNavigate("TODAY");
      setDate(new Date());
    };

    return (
      <div className="flex flex-col mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => toolbar.onNavigate("PREV")}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="grey"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              {format(toolbar.date, "MMMM yyyy")}
            </h2>
            <button
              onClick={() => toolbar.onNavigate("NEXT")}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="grey"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="text-black ml-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Today
            </button>
          </div>
          <div className="flex space-x-1">
            {["month", "week", "day", "agenda"].map((viewType) => (
              <button
                key={viewType}
                onClick={() => toolbar.onView(viewType)}
                className={`text-black px-3 py-1 text-sm rounded-lg transition-colors ${
                  toolbar.view === viewType
                    ? "bg-[#7a0860] text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {/* <div className="flex flex-wrap gap-2">
          {Object.entries(eventTypeStyles).map(([type, style]) => (
            <div key={type} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: style.borderColor }}
              />
              <span className="text-xs text-gray-600 capitalize">{type}</span>
            </div>
          ))}
        </div> */}
      </div>
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 ${
        showModal ? "pointer-events-none opacity-90" : ""
      }`}
    >
      <div className="h-[70vh]">
        <Calendar
          localizer={localizer}
          events={customizedEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={onViewChange}
          date={date}
          onNavigate={handleNavigate}
          selectable
          onSelectSlot={onSelectSlot}
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar,
          }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "transparent",
              border: "none",
              borderRadius: "4px",
              boxShadow: "none",
            },
          })}
        />
      </div>
    </div>
  );
}
