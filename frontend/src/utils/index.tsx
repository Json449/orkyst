import { jwtVerify } from "jose";

export function timeAgo(timestamp: string): string {
  const now = new Date(); // Current time
  const past = new Date(timestamp); // Convert the timestamp to a Date object
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000); // Difference in seconds

  // Define time intervals in seconds
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  // Calculate the difference in years, months, days, hours, or minutes
  if (diffInSeconds >= intervals.year) {
    const years = Math.floor(diffInSeconds / intervals.year);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= intervals.month) {
    const months = Math.floor(diffInSeconds / intervals.month);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= intervals.day) {
    const days = Math.floor(diffInSeconds / intervals.day);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= intervals.hour) {
    const hours = Math.floor(diffInSeconds / intervals.hour);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds >= intervals.minute) {
    const minutes = Math.floor(diffInSeconds / intervals.minute);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
}

// src/auth/role.enum.ts
export enum Role {
  ADMIN = "admin",
  EDITOR = "editor",
  OWNER = "owner",
  // Add other roles as needed
}

export const statusMessages = [
  "🛠️ Setting up framework...",
  "🎨 Designing layout...",
  "📅 Optimizing schedule...",
  "✨ Adding final touches...",
  "✅ Finalizing...",
];

export const plurals = (value: any, name: string) => {
  if (value?.length > 1) {
    return `${name}s`;
  }
  return name;
};

export const decodeToken = async (accessTokenFromCookie: string) => {
  try {
    console.log("payload", process.env.JWT_SECRET_KEY);
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const { payload }: any = await jwtVerify(accessTokenFromCookie, secret);
    console.log("payload", payload);
    return payload;
  } catch (err) {
    console.log("decode token error", err);
  }
};
