import React from "react";

export default function EventDetails({
  children, // This will be the page content
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      {children}
    </div>
  );
}
