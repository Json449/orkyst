"use client";
import { useState, useEffect, useCallback, JSX, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { timeAgo } from "@/utils";
import ImageUploader from "../component/imageUploader";
import Header from "../component/header";
import { useProfile } from "../hooks/useProfile";
import { FullScreenLoader } from "../component/FullScreenLoader";
import { VersionSaveModal } from "../component/VersionControlModal";
import { useEventDetailsMutation } from "../hooks/useEventDetails";
import TinyMCEEditor from "../component/TinyMiceEditor";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  MoreVert,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import AddEventModal from "../component/AddEventModal";
import { useMutation } from "@tanstack/react-query";
import DeleteEventModal from "../component/DeleteEventModal";

const eventTypeIcons = {
  linkedin: <LinkedIn style={{ fontSize: "44px", color: "black" }} />,
  blog: <Article style={{ fontSize: "44px", color: "black" }} />,
  poll: <Poll style={{ fontSize: "44px", color: "black" }} />,
  dvc: <Videocam style={{ fontSize: "44px", color: "black" }} />,
  social: <Chat style={{ fontSize: "44px", color: "black" }} />,
  event: <Event style={{ fontSize: "44px", color: "black" }} />,
  twitter: <X style={{ fontSize: "44px", color: "black" }} />,
  podcast: <Mic style={{ fontSize: "44px", color: "black" }} />,
  instagram: <CameraAlt style={{ fontSize: "44px", color: "black" }} />,
  youtube: <VideoLibrary style={{ fontSize: "44px", color: "black" }} />,
  // Add any exact match exceptions here
  "twitter space": <X style={{ fontSize: "44px", color: "black" }} />,
  "twitter thread": <X style={{ fontSize: "44px", color: "black" }} />,
};

const priorityOrder = [
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long", // 'long' will give the full month name like "April"
    day: "numeric",
    year: "numeric",
  });
}

interface Version {
  eventId: number;
  version: number;
  changes: { comment: string; description: string; artwork: string };
  updatedBy: { fullname: string };
  updatedAt: Date;
  createdAt: string;
}
// Interfaces
interface Event {
  title: string;
  date: Date;
  _id: string;
  description?: string;
  type: string;
  audienceFocus: string;
  theme: string;
  start: Date;
  end: Date;
  feedback: FeedbackDocument[];
  calendarId: string;
  artwork: string;
  version: number;
  versionHistory: Version[];
}

interface PendingChanges {
  description: string;
}

interface FeedbackDocument {
  _id: string;
  comment: string;
  userId: { fullname: string };
  createdAt: string;
  attachments: [{ name: string }];
}

// Utility Functions
const fetchData = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  return response.json();
};

const VersionHistory = ({ versionHistory }: { versionHistory: Version[] }) => (
  <div className="pb-4 px-2 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {versionHistory.length > 0 ? (
      <div className="space-y-3">
        {versionHistory.map((item, key) => (
          <div
            key={key}
            className="flex items-start gap-4 p-2 rounded-xl border border-gray-100 bg-white transition-all duration-200 shadow-xs"
          >
            {/* Avatar with version indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center border-2 border-purple-50">
                <span className="text-purple-600 font-medium text-xl tracking-tight">
                  {item?.updatedBy?.fullname?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              {key === 0 && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Version details */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-semibold text-gray-900 truncate">
                    {item?.updatedBy?.fullname || "Unknown User"}
                  </h4>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {timeAgo(item.createdAt)}
                </span>
              </div>

              {/* Comment */}
              {item?.changes?.comment && (
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                  {item?.changes?.comment}
                </p>
              )}

              {/* Change indicators */}
              <div className="mt-2 flex flex-wrap gap-2">
                {item.changes?.description && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50/80 text-blue-700 border border-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Content updated
                  </span>
                )}
                {item.changes?.artwork && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50/80 text-green-700 border border-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Artwork changed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h4 className="mt-2 text-sm font-medium text-gray-700">
          No versions yet
        </h4>
        <p className="mt-1 text-xs text-gray-500">
          Be the first to edit the content
        </p>
      </div>
    )}
  </div>
);

const FeedbackSection = ({
  feedback,
  loading,
  collaborators,
}: {
  feedback: FeedbackDocument[];
  loading: boolean;
  collaborators: any;
}) => (
  <div className="flex flex-col h-[calc(100vh-4rem)]">
    <div className="p-4 h-[76] flex bg-primary items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-white flex items-center">
        <Image
          alt="Version icon"
          src="/images/feedback.svg"
          width={24}
          height={24}
          priority
          className="mr-3"
        />
        Feedback
      </h3>
    </div>
    {/* Feedback list with better scrolling */}
    <div className="flex-1 overflow-y-auto px-2 space-y-4">
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6 mt-1"></div>
            </div>
          ))}
        </div>
      ) : feedback.length > 0 ? (
        feedback.map((item) => (
          <div
            key={item._id}
            className="p-2 rounded-xl bg-white hover:bg-gray-50/80 transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-blue-600 font-medium border border-blue-100 group-hover:border-blue-200 transition-colors">
                  {item.userId.fullname.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                {/* Header with user and timestamp */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {item.userId.fullname}
                    </p>
                    {item.userId.role === "admin" && (
                      <span className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>

                {/* Comment Text */}
                <p className="text-sm text-gray-700 mt-1.5 whitespace-pre-line leading-relaxed">
                  {item.comment}
                </p>

                {/* Attachments */}
                {item?.attachments?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.attachments.map((file, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs text-gray-700 flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="truncate max-w-[120px]">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-3 flex gap-3 text-xs">
                  <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 group transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-blue-400 group-hover:text-blue-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    Reply
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1 group transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <h4 className="mt-2 text-sm font-medium text-gray-700">
            No feedback yet
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            Be the first to share your thoughts
          </p>
        </div>
      )}
    </div>
    <div className="flex items-center gap-4 mb-8 justify-center">
      <div className="text-right">
        <p className="text-sm font-medium text-gray-500 mb-1">Collaborators</p>
        <p className="text-xs text-gray-400">
          {collaborators?.length || 0} team members
        </p>
      </div>
      <div className="flex items-center">
        <div className="flex space-x-2">
          {collaborators
            ?.slice(0, 5)
            .map((item: { _id: string; name: string }) => (
              <div
                key={item._id}
                onClick={() => handleModal(true)}
                className="relative group cursor-pointer w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium hover:z-10 hover:ring-2 hover:ring-purple-500 transition-all"
                title={item.name}
              >
                <span className="text-sm">{item.name[0].toUpperCase()}</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 opacity-0 group-hover:opacity-70 transition-opacity"></div>
              </div>
            ))}

          {collaborators?.length > 5 && (
            <div className="relative group w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-xs border border-gray-200">
              +{collaborators.length - 5}
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
    {/* Input area for new feedback */}
    {/* <div className="p-4 border-t border-gray-100">
      <div className="relative">
        <input
          type="text"
          placeholder="Add your feedback..."
          className="text-black w-full p-3 pr-12 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
        <button className="absolute right-3 top-3 text-blue-500 hover:text-blue-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div> */}
  </div>
);

// Main Component
function DetailForm() {
  const searchParams = useSearchParams();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [generateImageLoading, setGenerateImageLoading] = useState(false);
  const [content, setContent] = useState("");
  const [eventDetails, setEventDetails] = useState<Event | null>(null);
  const { data: profile = [] } = useProfile();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChanges>();
  const { mutate: eventDetailMutate, isPending: isEventLoading } =
    useEventDetailsMutation();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditEvent = (event) => {
    event.stopPropagation();
    setShowModal(true);
    handleClose();
  };

  const handleDeleteEvent = (event) => {
    event.stopPropagation();
    handleClose();
    setShowDeleteModal(true);
  };

  const router = useRouter();
  const serializedEvent = searchParams.get("collaborators");
  const event_type = searchParams.get("event_type");
  const collaborators: Event | null = serializedEvent
    ? JSON.parse(decodeURIComponent(serializedEvent))
    : null;

  const eventId = searchParams.get("eventId");
  useEffect(() => {
    setContent(eventDetails?.description ?? "");
  }, [eventDetails?.description]);

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

  const fetchImage = useCallback(
    async (
      response: Event,
      aiPrompt: string | null,
      cloudinaryUrl: string | null
    ) => {
      try {
        setGenerateImageLoading(true);
        if (!response?.artwork || aiPrompt != null || cloudinaryUrl != null) {
          const imgUrl = `/api/events/generateImage?id=${eventId}`;
          const body = {
            theme: response?.theme,
            audience: response?.audienceFocus,
            contentType: response?.type,
            aiPrompt: aiPrompt,
            cloudinaryUrl: cloudinaryUrl,
          };
          const imageUrl = await fetchData(imgUrl, {
            method: "PUT",
            body: JSON.stringify(body),
          });
          setEventDetails((prev) => ({
            ...prev,
            artwork: imageUrl?.data?.result,
          }));
          setImageUrl(imageUrl?.data?.result);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setGenerateImageLoading(false);
      }
    },
    [eventId, setGenerateImageLoading, setEventDetails, setImageUrl] // Removed fetchData from dependencies
  );

  const handleEventDetail = useCallback(
    (eventId: string) => {
      eventDetailMutate(eventId, {
        onSuccess: (response) => {
          setEventDetails((prev) => ({
            ...prev,
            ...response?.data,
            artwork: response?.data?.artwork || imageUrl?.data?.result,
          }));
          setImageUrl(response?.data?.artwork || imageUrl?.data?.result);
        },
        onError: (error) => {
          console.error("Failed:", error.message);
        },
      });
    },
    [
      eventDetailMutate,
      setEventDetails,
      setImageUrl,
      imageUrl?.data?.result, // Added missing dependency
    ]
  );

  useEffect(() => {
    if (eventId) {
      handleEventDetail(eventId);
    }
  }, [eventId, handleEventDetail]);

  const handleSaveChanges = async (
    versionChoice: "current" | "new",
    comment?: string
  ) => {
    if (!eventId || !pendingChanges) return;

    const url = "/api/events/content";
    const body = {
      eventId: eventId,
      changes: { ...pendingChanges, comment: comment || "No comment provided" },
      versionAction: versionChoice,
    };

    try {
      setLoading(true);
      await fetchData(url, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setShowSaveModal(false);
      handleEventDetail(eventId);
      // toggleEditor(false);
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveChanges = async () => {
    const payload: { description: string } = {
      description: content,
    };
    setPendingChanges(payload);
    setShowSaveModal(true);
  };

  const handleFeedbackSubmit = async (text: string, comment: string) => {
    if (!eventId) return;
    const url = "/api/events/feedback";
    const body = { eventId: eventId, comment, text };
    try {
      setLoading(true);
      await fetchData(url, { method: "POST", body: JSON.stringify(body) });
      handleEventDetail(eventId);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageUrl) {
      console.error("No file selected");
      return;
    }

    // Fetch the file from the temporary URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "uploaded-image", { type: blob.type });

    const formData = new FormData();
    formData.append("file", file); // Append the File object, not the URL
    setGenerateImageLoading(true);
    try {
      const res = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json(); // Define the type of `result` if needed
      if (result.success) {
        fetchImage(eventDetails, null, result.url);
        return result.url; // Return the uploaded image URL
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setGenerateImageLoading(false);
    }
  };

  const goBack = () => {
    router.replace("/dashboard");
  };

  const editEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const payload = {
        calendarId: eventDetails.calendarId,
        date: eventDetails.date,
        eventId: eventDetails._id,
        description: null,
        ...eventData,
      };
      console.log("eee", payload);
      const response = await fetch("/api/events/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: (result) => {
      setShowModal(false);
      console.log("dsadasd", result.data.data);
      const serializedCollaborators = encodeURIComponent(
        JSON.stringify(collaborators ?? [])
      );
      router.push(
        `/eventDetails?eventId=${result.data.data?._id}&collaborators=${serializedCollaborators}&&event_type=${result.data.data.type}`
      );
      handleEventDetail(result.data.data?._id);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        calendarId: eventDetails.calendarId,
        eventId: eventDetails._id,
      };
      console.log("eee", payload);
      const response = await fetch("/api/events/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return response.json();
    },
    onSuccess: () => {
      setShowModal(false);
      router.back();
    },
  });

  const handleEditEventAPI = async (data) => {
    editEventMutation.mutate(data);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white w-full">
      <DeleteEventModal
        isOpen={showDeleteModal}
        onConfirm={() => deleteEventMutation.mutate()}
        onCancel={() => setShowDeleteModal(false)}
        eventTitle={eventDetails?.title}
      />
      {showModal && (
        <AddEventModal
          isOpen={showModal}
          onSave={handleEditEventAPI}
          isEdit={true}
          onClose={closeModal}
          state={{
            title: eventDetails.title,
            audienceFocus: eventDetails.audienceFocus,
            type: eventDetails.type,
            theme: eventDetails.theme,
          }}
        />
      )}
      <Header
        handleApproveChanges={handleApproveChanges}
        // editor={true}
        // contentType={eventDetails?.type}
        profile={profile}
      />
      <VersionSaveModal
        isOpen={showSaveModal}
        currentVersion={eventDetails?.version || 1}
        onSave={handleSaveChanges}
        onCancel={() => setShowSaveModal(false)}
      />
      {loading && <FullScreenLoader />}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[22%] bg-primarygrey border-r border-gray-100 flex flex-col overflow-hidden">
          <div className="flex gap-2 items-center justify-between px-4 py-4 text-2xl">
            <div className="flex items-center">
              <span className="cursor-pointer" onClick={goBack}>
                <Image
                  alt="Version icon"
                  src="/images/back.svg"
                  width={19}
                  height={38}
                  priority
                  className="mr-3"
                />
              </span>
              {!isEventLoading && (
                <span className="font-bold text-black">
                  {eventDetails?.type}
                </span>
              )}
            </div>
            {!isEventLoading && (
              <span className="flex-shrink-0">
                {getEventIcon(eventDetails?.type)}
              </span>
            )}
          </div>
          <div className="h-[57] p-4 flex bg-primary items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Image
                alt="Version icon"
                src="/images/version.svg"
                width={24}
                height={24}
                priority
                className="mr-3"
              />
              Version History
            </h3>
          </div>

          {/* Version list with subtle pattern */}
          <div className="flex-1 overflow-hidden bg-primarygrey">
            <VersionHistory
              versionHistory={eventDetails?.versionHistory || []}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex justify-between gap-5 py-3 px-6">
            <div className="flex items-center gap-4">
              <p className="p-2 rounded-xl bg-primarygrey text-black font-bold">
                v 1.1
              </p>
              {!isEventLoading && (
                <p className="px-4 py-2 rounded-xl bg-primarygrey text-black font-bold">
                  {formatDate(eventDetails?.date)}
                </p>
              )}
            </div>
            <div className="flex gap-4 items-center">
              <button className="w-[157px] h-[40px] bg-[#7a0860] text-white text-[16px] font-medium rounded-xl hover:bg-[#5c0648] transition-colors disabled:opacity-70">
                <span className="flex items-center justify-center">
                  Approve
                </span>
              </button>
              <button
                onClick={handleApproveChanges}
                className="w-[157px] h-[40px] bg-white text-[#7a0860] text-[16px] font-medium rounded-xl border-2 border-[#7a0860] hover:bg-[#F8F7F7] transition-colors"
              >
                Save Changes
              </button>
              <MoreVert
                style={{
                  cursor: "pointer",
                  color: "black",
                  height: "30px",
                  width: "30px",
                }}
                onClick={handleClick}
              />
              <Menu
                onClick={(e) => e.stopPropagation()}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleEditEvent}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteEvent}>Delete</MenuItem>
              </Menu>
            </div>
          </div>
          {!event_type?.toLowerCase().startsWith("blog") && (
            <ImageUploader
              generateImageLoading={generateImageLoading}
              setImageUrl={setImageUrl}
              imageUrl={imageUrl}
              onGenerateAI={(prompt) => fetchImage(eventDetails, prompt, null)}
              onCloudinaryUpload={handleImageUpload}
            />
          )}
          <TinyMCEEditor
            loading={isEventLoading}
            highlightContent="In today's fast-paced digital landscape, small an"
            handleFeedbackSubmit={(text: string, comment: string) =>
              handleFeedbackSubmit(text, comment)
            }
            onChangeContent={setContent}
            value={content}
            eventType={eventDetails?.type ?? ""}
          />
        </div>
        <div className="w-[24%] bg-primarygrey overflow-hidden">
          <div className="shadow-lg flex flex-col">
            <FeedbackSection
              feedback={eventDetails?.feedback || []}
              loading={loading}
              collaborators={collaborators}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EventDetails() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailForm />
    </Suspense>
  );
}
