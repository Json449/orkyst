"use client";
import React, { useEffect, useRef, useState } from "react";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useLogout } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Profile {
  avatar?: string;
  fullname?: string;
  email?: string;
}
interface HeaderProps {
  profile?: Profile;
  editor?: boolean;
  handleApproveChanges?: () => void;
  contentType?: string; // Add contentType here
}

const Header = ({ profile, editor, handleApproveChanges }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-primarygrey backdrop-blur-md border-b border-bg-primarygrey shadow-sm">
      <div className="mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo and Title Section */}
        <div className="flex items-center space-x-4">
          <Image
            src="/logo.svg"
            alt="Login Banner"
            width={144}
            height={54}
            priority
          />
          {editor && (
            <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Artwork Editor
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          {editor && handleApproveChanges && (
            <button
              onClick={handleApproveChanges}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:opacity-90 active:scale-95"
            >
              Save Changes
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none group"
            >
              <div className="relative">
                {profile?.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt={profile.fullname || "User avatar"}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <AccountCircle
                    sx={{
                      fontSize: 36,
                      color: "action.active",
                      backgroundColor: "#f3f4f6",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.fullname}
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <ArrowDropDown
                sx={{
                  fontSize: 20,
                  color: "action.active",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in">
                <div className="py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {profile?.fullname}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile?.email}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    {isPending ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Logging out...
                      </>
                    ) : (
                      "Logout"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
