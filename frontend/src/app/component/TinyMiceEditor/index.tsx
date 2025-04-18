import React, { useRef, useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import "./styles.css";

interface TinyMCEEditorProps {
  value?: string;
  showEditor?: boolean;
  onChangeContent?: (content: string) => void;
  handleFeedbackSubmit: (text: string, comment: string) => void;
  loading: boolean;
  eventType: string;
  highlightContent?: string; // New prop for content to highlight
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value = "<div></div>",
  loading,
  onChangeContent,
  handleFeedbackSubmit,
  eventType,
  highlightContent,
}) => {
  const editorRef = useRef<any>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [showCommentBox, setShowCommentBox] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // Highlight content when highlightContent prop changes
  useEffect(() => {
    if (editorRef.current && highlightContent) {
      const editor = editorRef.current;

      // First remove any existing highlights
      editor.dom.removeClass(
        editor.dom.select("span.highlighted-content"),
        "highlighted-content"
      );

      // Search and highlight the content if it exists
      if (highlightContent.trim()) {
        editor.execCommand("SearchReplace", false, {
          find: highlightContent,
          replace: `<span class="highlighted-content">${highlightContent}</span>`,
          all: true,
          case_sensitive: false,
          whole_words: false,
        });
      }
    }
  }, [highlightContent]);

  const handleEditorChange = (newContent: string) => {
    onChangeContent?.(newContent);
  };

  const handleInit = (evt: any, editor: any) => {
    editorRef.current = editor;

    // Initial highlight if content is provided
    if (highlightContent) {
      editor.on("init", () => {
        editor.execCommand("SearchReplace", false, {
          find: highlightContent,
          replace: `<span class="highlighted-content">${highlightContent}</span>`,
          all: true,
        });
      });
    }

    editor.on("selectionchange", () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        const selection = editor.selection;
        const selectedText = selection.getContent();

        if (selectedText && selectedText.trim().length > 0) {
          const range = selection.getRng();
          const rect = range.getBoundingClientRect();

          setSelectedText(selectedText);
          setPopupPosition({
            top: rect.bottom + window.scrollY,
            left: rect.left + window.scrollX,
          });
          setShowCommentBox(true);
        } else {
          setShowCommentBox(false);
        }
      }, 300);
    });
  };

  const handleAddComment = () => {
    if (editorRef.current && selectedText) {
      const editor = editorRef.current;
      editor.execCommand(
        "mceInsertContent",
        false,
        `<span class="highlighted-comment" data-comment="${comment}">${selectedText}</span>`
      );
    }
    setShowCommentBox(false);
    handleFeedbackSubmit(selectedText, comment);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowCommentBox(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  console.log("checd", eventType);

  return (
    <div className="relative rounded-xl border-bg-primarygrey border-4 mx-6 mt-2">
      {loading ? (
        <p className="mt-5 text-md text-black">Content Loading...</p>
      ) : (
        <>
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_EDITOR}
            value={value}
            onInit={handleInit}
            init={{
              height: eventType == "Blog Post" ? "86vh" : "37vh",
              menubar: true,
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste code help wordcount",
                "fontselect fontsizeselect",
              ],
              toolbar: `${
                eventType == "Blog Post" && "image"
              } | formatselect | fontselect fontsizeselect | bold italic backcolor | 
                  alignleft aligncenter alignright alignjustify | 
                  bullist numlist outdent indent | undo redo | removeformat | help`,
              content_style: `
                body {
                  font-family: Arial, sans-serif;
                  font-size: 16px;
                  line-height: 1.6;
                  color: #333;
                }
                .highlighted-comment {
                  background-color: #fff9c4;
                  position: relative;
                }
                .highlighted-comment::after {
                  content: "💬";
                  font-size: 12px;
                  position: absolute;
                  right: -15px;
                  top: -8px;
                }
                .highlighted-content {
                  background-color: #d4edff;
                  padding: 0 2px;
                  border-radius: 3px;
                  box-shadow: 0 0 0 1px #b8daff;
                  animation: pulse 2s infinite;
                }
                @keyframes pulse {
                  0% { background-color: #d4edff; }
                  50% { background-color: #b8daff; }
                  100% { background-color: #d4edff; }
                }
              `,
              setup: (editor) => {
                editor.on("init", () => {
                  if (highlightContent) {
                    editor.execCommand("SearchReplace", false, {
                      find: highlightContent,
                      replace: `<span class="highlighted-content">${highlightContent}</span>`,
                      all: true,
                    });
                  }
                });
              },
            }}
            onEditorChange={handleEditorChange}
          />

          {showCommentBox && (
            <div
              ref={popupRef}
              className="absolute z-50 bg-white p-4 rounded shadow-lg border border-gray-300"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
              }}
            >
              <div className="mb-2">
                <p className="text-sm text-gray-600">{selectedText}</p>
              </div>
              <textarea
                className="w-full p-2 border rounded mb-2 text-gray-600"
                placeholder="Add your comment..."
                rows={3}
                onChange={(e: any) => setComment(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCommentBox(false)}
                  className="text-black px-3 py-1 text-sm bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                >
                  Add Comment
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TinyMCEEditor;
