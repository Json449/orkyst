"use client";
import { Role } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface AddCollaboratorModalProps {
  open: boolean;
  handleModal: (open: boolean) => void;
  calendarId: string | undefined;
}

interface ApiResponse {
  success: boolean;
  data?: {
    error?: string;
  };
}

export default function AddCollaboratorModal({
  open,
  handleModal,
  calendarId,
}: AddCollaboratorModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>(Role.EDITOR);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/addCollaborator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role, calendarId }),
      });

      const result: ApiResponse = await response.json();

      if (!result.success) {
        setMessage(result.data?.error || "Failed to add collaborator");
      } else {
        setEmail("");
        setRole(Role.EDITOR);
        handleModal(false);
        queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
      }
    } catch (error) {
      console.error("Error adding collaborator:", error);
      setMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Add Collaborator
              </h2>
              <button
                onClick={() => handleModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-black w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a0860]"
                  placeholder="user@example.com"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="text-black w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a0860]"
                >
                  <option value={Role.EDITOR}>Editor</option>
                  <option value={Role.OWNER}>Viewer</option>
                </select>
                {message && (
                  <p className="text-red-500 mt-2 text-sm">{message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => handleModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#7a0860] text-white rounded-md hover:bg-[#5d064a] disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? "Adding..." : "Add Collaborator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
