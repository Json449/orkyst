import React from "react";

export default function SignupLayout({
  children, // This will be the page content
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {children}
    </div>
  );
}
