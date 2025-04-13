// components/FullScreenLoader.tsx
import { ReactNode } from 'react';

export const FullScreenLoader = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex flex-col items-center">
        {/* Customize with your preferred spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
        {children && (
          <p className="mt-4 text-white text-lg font-medium">{children}</p>
        )}
      </div>
    </div>
  );
};