import React, { useState, useRef, useEffect } from "react";
import {
  Upload as UploadIcon,
  Image as ImageIcon,
  Refresh as RefreshIcon,
  AutoAwesome as AutoAwesomeIcon,
  CloudUpload as CloudUploadIcon,
  HourglassTop as HourglassTopIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import Image from "next/image";

interface ImageUploaderProps {
  setImageUrl: (url: string, showTmp?: boolean) => void;
  imageUrl: string;
  onGenerateAI?: (prompt: string) => void;
  onCloudinaryUpload?: () => void;
  generateImageLoading: boolean;
  artworkUrl: string;
  tmpFileSelected: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  setImageUrl,
  generateImageLoading,
  tmpFileSelected,
  imageUrl,
  onGenerateAI,
  onCloudinaryUpload,
  artworkUrl,
}) => {
  const [mode, setMode] = useState<"upload" | "generate">("generate");
  const [prompt, setPrompt] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const event = {
        target: {
          files: e.dataTransfer.files,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(event);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("file selected", file);
    if (!file) return;
    try {
      const fileUrl = URL.createObjectURL(file);
      setImageUrl(fileUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleClearImage = () => {
    setImageUrl(null, false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleShowImage = () => {
    if (artworkUrl) {
      setImageUrl(artworkUrl, false);
    }
  };

  const handleGenerateAI = async () => {
    if (!onGenerateAI || !prompt.trim()) {
      return;
    }
    onGenerateAI(prompt);
    // When generating a new image, update the temp URL
    // Note: This assumes onGenerateAI eventually calls setImageUrl
  };

  // Focus prompt input when switching to generate mode
  useEffect(() => {
    if (mode === "generate" && promptInputRef.current) {
      promptInputRef.current.focus();
    }
  }, [mode]);

  // Determine if tabs should be shown (no image selected)
  const showTabs = !imageUrl;

  return (
    <div className="h-full bg-white overflow-hidden mx-6 rounded-xl border-4 border-bg-primarygrey">
      {showTabs && (
        <div className="flex border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <button
            className={`bg-primarygrey flex-1 py-2 px-4 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              mode === "generate"
                ? "text-purple-600 border-b-2 border-purple-600 bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setMode("generate")}
          >
            <AutoAwesomeIcon fontSize="medium" />
            AI Generate
          </button>
          <button
            className={`bg-primarygrey border-r-2 border-r-[grey] flex-1 py-2 px-4 font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              mode === "upload"
                ? "text-blue-600 border-b-2 border-blue-600 bg-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setMode("upload")}
          >
            <UploadIcon fontSize="medium" />
            Upload Image
          </button>
        </div>
      )}
      <div className="bg-gradient-to-br from-gray-50 to-white">
        {!generateImageLoading && imageUrl ? (
          <div className="relative group overflow-hidden shadow-lg">
            <div className="relative w-full h-[42vh] overflow-hidden rounded-lg group">
              <Image
                src={imageUrl}
                alt="Uploaded content preview"
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-stretch transition-all duration-500 ease-in-out group-hover:scale-105"
                quality={85}
                priority={true}
              />

              {/* Clear button */}
              <button
                onClick={handleClearImage}
                className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all z-10"
                title="Remove image"
              >
                <CloseIcon fontSize="small" className="text-gray-700" />
              </button>

              {/* Overlay hover effect */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

              {/* Button Overlay */}
              {tmpFileSelected && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <button
                    onClick={onCloudinaryUpload}
                    className="bg-white/90 text-gray-800 px-6 py-3 rounded-full font-medium hover:bg-white transition-all transform translate-y-4 group-hover:translate-y-0 shadow-lg flex items-center gap-2"
                  >
                    <RefreshIcon fontSize="small" />
                    Upload Image
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : mode === "upload" ? (
          <div
            className={`h-[42vh] border-2 ${
              dragActive
                ? "border-blue-400 bg-blue-50"
                : "border-dashed border-gray-300"
            } flex justify-center items-center flex-col cursor-pointer transition-all duration-300 relative overflow-hidden`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {generateImageLoading ? (
              <div className="flex flex-col items-center">
                <HourglassTopIcon
                  className="animate-spin text-blue-500"
                  style={{ fontSize: "4rem" }}
                />
                <p className="text-gray-600 font-medium mt-4">
                  Processing your image...
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  This won&apos;t take long
                </p>
              </div>
            ) : (
              <>
                {artworkUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from propagating to parent
                      handleShowImage();
                    }}
                    className="absolute top-4 right-4 bg-blue-500 text-white rounded-full px-4 py-2 flex items-center gap-1 z-10 hover:bg-blue-600 transition-colors"
                  >
                    <ImageIcon fontSize="small" />
                    Show Previous Image
                  </button>
                )}
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <CloudUploadIcon className="text-3xl text-blue-500" />
                  </div>
                  <div className="absolute -right-2 -top-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                    <ImageIcon className="text-sm" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {dragActive
                    ? "Drop your image here"
                    : "Drag & drop your image"}
                </h3>
                <p className="text-gray-500 mb-6">or click to browse files</p>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
                  <UploadIcon fontSize="small" />
                  Select File
                </button>
                <div className="absolute bottom-4 text-xs text-gray-400">
                  Supports JPG, PNG, WEBP (Max 10MB)
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  ref={promptInputRef}
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="w-full px-6 py-4 border-0 rounded-xl bg-gray-100 focus:ring-2 focus:ring-purple-500 focus:bg-white text-gray-700 placeholder-gray-400 pr-24 shadow-inner transition-all duration-300"
                  onKeyDown={(e) => e.key === "Enter" && handleGenerateAI()}
                />
                <button
                  onClick={handleGenerateAI}
                  disabled={generateImageLoading || !prompt.trim()}
                  className={`absolute right-2 top-2 px-5 py-2 rounded-lg font-medium text-white flex items-center gap-2 transition-all ${
                    generateImageLoading || !prompt.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg"
                  }`}
                >
                  {generateImageLoading ? (
                    <>
                      <HourglassTopIcon
                        className="animate-spin"
                        fontSize="small"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <AutoAwesomeIcon fontSize="small" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="relative group rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-gray-100 to-gray-50 h-[30vh] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto w-28 h-28 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                  <AutoAwesomeIcon className="text-4xl text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Unleash Your Creativity
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {generateImageLoading
                    ? "Our AI is crafting your masterpiece..."
                    : "Describe what you envision and we&apos;ll generate it for you"}
                </p>
                {generateImageLoading && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-400 mt-3">
                      This usually takes 10-30 seconds
                    </p>
                  </div>
                )}
              </div>
            </div>

            {!generateImageLoading && !imageUrl && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  "Cyberpunk cityscape",
                  "Surreal forest landscape",
                  "Portrait of a futuristic samurai",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setPrompt(suggestion);
                      setTimeout(() => promptInputRef.current?.focus(), 0);
                    }}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors truncate"
                  >
                    &quot;{suggestion}&quot;
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
