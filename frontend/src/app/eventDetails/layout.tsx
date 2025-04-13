import React from "react";

export default function EventDetails({
  children, // This will be the page content
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen flex w-full bg-white">{children}</div>;
}
