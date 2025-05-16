import React from 'react';
import { Link } from 'react-router-dom';
import type { Spice } from '../types';

interface SpicesSectionProps {
  spices: Spice[];
  searchString: string;
  isLoading: boolean;
  error: string | null;
}

export function SpicesSection({ spices, searchString, isLoading, error }: SpicesSectionProps) {
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Spices</h2>
        <div className="text-red-600">Error loading spices: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Spices</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  const filteredSpices = spices.filter((spice) =>
    spice.name.toLowerCase().includes(searchString.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Spices {filteredSpices.length > 0 && `(${filteredSpices.length})`}
      </h2>
      {filteredSpices.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No spices found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredSpices.map((spice) => (
            <Link
              key={spice.id}
              to={`/spices/${spice.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-indigo-500"
            >
              <span className="text-gray-800 font-medium">{spice.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 