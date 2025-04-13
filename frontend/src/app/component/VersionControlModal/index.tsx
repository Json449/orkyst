// components/VersionSaveModal.tsx
"use client";
import { useState } from "react";

interface VersionSaveModalProps {
  isOpen: boolean;
  currentVersion: number;
  onSave: (versionChoice: "current" | "new", comment?: string) => void;
  onCancel: () => void;
}

export const VersionSaveModal = ({
  isOpen,
  currentVersion,
  onSave,
  onCancel,
}: VersionSaveModalProps) => {
  const [comment, setComment] = useState("");
  const [versionChoice, setVersionChoice] = useState<"current" | "new">(
    "current"
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-black text-xl font-bold mb-4">Save Changes</h3>

        <div className="mb-4">
          <p className="mb-2 text-black">Current Version: v{currentVersion}</p>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              id="currentVersion"
              checked={versionChoice === "current"}
              onChange={() => setVersionChoice("current")}
              className="mr-2"
            />
            <label htmlFor="currentVersion" className="text-gray-600">
              Update current version
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="newVersion"
              checked={versionChoice === "new"}
              onChange={() => setVersionChoice("new")}
              className="mr-2"
            />
            <label htmlFor="newVersion" className="text-gray-600">
              Create new version
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="text-gray-600 block mb-2">
            Version Comment (Optional):
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded text-gray-600"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-400 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(versionChoice, comment)}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
