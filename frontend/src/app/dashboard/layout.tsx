import React from "react";

export default function Dashboard({
  children, // This will be the page content
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-screen w-full bg-white overflow-hidden">{children}</div>;
}
