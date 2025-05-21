import React from 'react';

interface ErrorStateProps {
  title: string;
  message: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title, message }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="text-red-600">
        Error loading {title.toLowerCase()}: {message}
      </div>
    </div>
  );
};
