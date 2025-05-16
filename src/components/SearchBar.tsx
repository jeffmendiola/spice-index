import React from 'react';

interface SearchBarProps {
  searchString: string;
  updateSearchString: (value: string) => void;
}

export function SearchBar({ searchString, updateSearchString }: SearchBarProps) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search spices and blends..."
          value={searchString}
          onChange={(e) => updateSearchString(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>   
  );
} 