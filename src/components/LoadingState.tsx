import React from 'react';

interface LoadingStateProps {
  title: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ title }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div
        className="flex justify-center items-center h-32"
        role="status"
        aria-live="polite"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  );
};
