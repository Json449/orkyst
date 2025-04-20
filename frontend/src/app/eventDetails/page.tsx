"use client";
import { useState, useEffect, useCallback, Suspense, JSX } from "react";
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
} from "@mui/icons-material";

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
  <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
    {versionHistory.length > 0 ? (
      <div className="space-y-3 pr-2">
        {versionHistory.map((item, key) => (
          <div
            key={key}
            className="relative group flex items-start gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:border-purple-200 transition-all shadow-xs hover:shadow-sm"
          >
            {/* Avatar with version indicator */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center border border-purple-100">
                <span className="text-purple-600 font-medium text-lg">
                  {item?.updatedBy?.fullname?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-[0.65rem] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                v{item.version}
              </div>
            </div>

            {/* Version details */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {item?.updatedBy?.fullname || "Unknown User"}
                  </h4>
                  {key === 0 && (
                    <span className="text-[0.65rem] px-1.5 py-0.5 rounded-full bg-green-100 text-green-800">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                  {timeAgo(item.createdAt)}
                </span>
              </div>

              {/* Comment with fade effect */}
              {item?.changes?.comment && (
                <p className="mt-0.5 text-sm text-gray-600 group-hover:text-gray-800 line-clamp-2">
                  {item?.changes?.comment}
                </p>
              )}

              {/* Change indicators */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {item.changes?.description && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Content
                  </span>
                )}
                {item.changes?.artwork && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.65rem] font-medium bg-green-50 text-green-700 border border-green-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1 h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Artwork
                  </span>
                )}
              </div>
            </div>

            {/* Hover action */}
            <button
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-purple-500"
              onClick={() => console.log("View version", item.version)}
              title="View this version"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-purple-50 rounded-full blur-sm"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 h-16 w-16 text-purple-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-gray-500">No versions yet</h4>
        <p className="mt-1 text-sm text-gray-400 max-w-xs">
          Your first edit will create version 1 automatically
        </p>
      </div>
    )}
  </div>
);

const FeedbackSection = ({
  feedback,
  loading,
}: {
  feedback: FeedbackDocument[];
  loading: boolean;
}) => (
  <div className="flex flex-col h-full">
    <div className="p-4 flex bg-primary items-center justify-between mb-4">
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            className="p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer border border-gray-100"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {item.userId.fullname.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {item.userId.fullname}
                  </p>
                  <span className="text-xs text-gray-400">
                    {timeAgo(item.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
                  {item.comment}
                </p>
                {item?.attachments?.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {item.attachments.map((file, i) => (
                      <div
                        key={i}
                        className="p-1 border rounded text-xs text-gray-500 hover:bg-gray-50"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex gap-2 text-xs">
                  <button className="text-blue-500 hover:text-blue-700">
                    Reply
                  </button>
                  <button className="text-gray-500 hover:text-gray-700">
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
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition">
            Add Feedback
          </button>
        </div>
      )}
    </div>

    {/* Input area for new feedback */}
    <div className="p-4 border-t border-gray-100">
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
    </div>
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
  const { mutate: eventDetailMutate } = useEventDetailsMutation();
  const router = useRouter();

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
          console.log("asdsadsad", imageUrl);
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
      setGenerateImageLoading(true);
      eventDetailMutate(eventId, {
        onSuccess: (response) => {
          setGenerateImageLoading(false);
          console.log("event details:", response);
          setEventDetails((prev) => ({
            ...prev,
            ...response?.data,
            artwork: response?.data?.artwork || imageUrl?.data?.result,
          }));
          setImageUrl(response?.data?.artwork || imageUrl?.data?.result);
          fetchImage(response?.data, null, null);
        },
        onError: (error) => {
          setGenerateImageLoading(false);
          console.error("Failed:", error.message);
        },
      });
    },
    [
      eventDetailMutate,
      setGenerateImageLoading,
      setEventDetails,
      setImageUrl,
      fetchImage,
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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-white w-full">
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
        <div className="flex w-full bg-white">
          <div className="w-[22%] bg-primarygrey border-r border-gray-100 flex flex-col">
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
                <span className="font-bold text-black">
                  {eventDetails?.type}
                </span>
              </div>
              <span className="flex-shrink-0">
                {getEventIcon(eventDetails?.type)}
              </span>
            </div>
            <div className="p-4 flex bg-primary items-center justify-between mb-4">
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

            {/* Footer with current version */}
            <div className="p-3 border-t bg-primarygrey bg-white text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 border border-purple-100">
                <span className="text-xs font-medium text-purple-700">
                  Current: v{eventDetails?.version || 1}
                </span>
              </div>
            </div>
          </div>
          <div className="h-[86vh] flex-1 shadow-lg">
            <div className="flex justify-between gap-5 py-3 px-6">
              <p className="p-2 rounded-xl bg-primarygrey text-black font-bold">
                v 1.1
              </p>
              <p className="px-4 py-2 rounded-xl bg-primarygrey text-black font-bold">
                {formatDate(eventDetails?.date)}
              </p>
              <div className="flex gap-2">
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
              </div>
            </div>
            {!loading &&
              !eventDetails?.type?.toLowerCase().startsWith("blog") && (
                <ImageUploader
                  generateImageLoading={generateImageLoading}
                  setImageUrl={setImageUrl}
                  imageUrl={imageUrl}
                  onGenerateAI={(prompt) =>
                    fetchImage(eventDetails, prompt, null)
                  }
                  onCloudinaryUpload={handleImageUpload}
                />
              )}
            {eventDetails && (
              <TinyMCEEditor
                loading={loading}
                highlightContent="In today's fast-paced digital landscape, small an"
                handleFeedbackSubmit={(text: string, comment: string) =>
                  handleFeedbackSubmit(text, comment)
                }
                onChangeContent={setContent}
                value={content}
                eventType={eventDetails?.type ?? ""}
              />
            )}
          </div>
          <div className="w-[24%] bg-white ml-3 rounded-xl overflow-hidden">
            <div className="h-[86vh] shadow-lg flex flex-col">
              <FeedbackSection
                feedback={eventDetails?.feedback || []}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}

export default function EventDetails() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailForm />
    </Suspense>
  );
}
