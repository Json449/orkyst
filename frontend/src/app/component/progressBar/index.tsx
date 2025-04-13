// components/ProgressBar.tsx
"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  animated?: boolean;
  showPercentage?: boolean;
}

export const ProgressBar = ({
  progress = 0,
  color = "#7a0860",
  height = 10,
  animated = true,
  showPercentage = false,
}: ProgressBarProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    if (animated) {
      // Smooth animation effect
      const timer = setTimeout(() => {
        setDisplayProgress(Math.min(progress, 100));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  return (
    <div className="w-full">
      <div
        className="relative rounded-full bg-gray-200 overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${displayProgress}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showPercentage && (
        <div className="text-right mt-1 text-sm text-gray-600">
          {Math.round(displayProgress)}%
        </div>
      )}
    </div>
  );
};
