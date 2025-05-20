import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { useSpiceContext } from '../context/SpiceContext';
import { data as defaultBlends } from '../mocks/data/blends';

function Home() {
  const { spices, blends, isLoading, errors, clearLocalStorage } =
    useSpiceContext();
  const [searchString, updateSearchString] = useState('');

  const hasUserCreatedBlends = blends.length > defaultBlends().length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Spice Index</h1>
          <div className="flex gap-4">
            <button
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you want to clear all saved blends? This cannot be undone.',
                  )
                ) {
                  clearLocalStorage();
                }
              }}
              disabled={!hasUserCreatedBlends}
              className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                hasUserCreatedBlends
                  ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  : 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
              }`}
              title={
                hasUserCreatedBlends ? '' : 'No user-created blends to clear'
              }
            >
              Clear Saved Blends
            </button>
            <Link
              to="/blends/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Blend
            </Link>
          </div>
        </div>

        <SearchBar
          searchString={searchString}
          updateSearchString={updateSearchString}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpicesSection
            spices={spices}
            searchString={searchString}
            isLoading={isLoading.spices}
            error={errors.spices}
          />
          <BlendsSection
            blends={blends}
            searchString={searchString}
            isLoading={isLoading.blends}
            error={errors.blends}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
