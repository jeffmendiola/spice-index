import React from 'react';

interface SearchBarProps {
  searchString: string;
  updateSearchString: (value: string) => void;
}

export function SearchBar({
  searchString,
  updateSearchString,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      updateSearchString('');
      e.currentTarget.blur();
    }
  };

  return (
    <div role="search" aria-label="Search spices and blends">
      <input
        type="search"
        value={searchString}
        onChange={(e) => updateSearchString(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search spices and blends..."
        aria-label="Search spices and blends"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}
