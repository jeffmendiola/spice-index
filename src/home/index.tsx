import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { SearchBar } from '../components/SearchBar';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { api } from '../utils/api';
import { data as defaultBlends } from '../mocks/data/blends';

function Home() {
  const queryClient = useQueryClient();
  const [searchString, updateSearchString] = useState('');
  const {
    data: spices = [],
    isLoading: isLoadingSpices,
    error: spicesError,
  } = useQuery({
    queryKey: ['spices'],
    queryFn: api.spices.getAll,
  });
  const {
    data: blends = [],
    isLoading: isLoadingBlends,
    error: blendsError,
  } = useQuery({
    queryKey: ['blends'],
    queryFn: api.blends.getAll,
  });

  const resetMutation = useMutation({
    mutationFn: api.blends.reset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blends'] });
    },
  });

  const hasUserCreatedBlends = blends.length > defaultBlends().length;

  const handleClearCache = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all saved blends? This cannot be undone.',
      )
    ) {
      resetMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Spice Index</h1>
          <div className="flex gap-4">
            <Link
              to="/blends/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Blend
            </Link>
            {hasUserCreatedBlends && (
              <button
                onClick={handleClearCache}
                disabled={resetMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {resetMutation.isPending ? 'Clearing...' : 'Clear Saved Blends'}
              </button>
            )}
          </div>
        </div>
        <div className="mb-8">
          <SearchBar
            searchString={searchString}
            updateSearchString={updateSearchString}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpicesSection
            spices={spices}
            searchString={searchString}
            isLoading={isLoadingSpices}
            error={spicesError?.message || null}
          />
          <BlendsSection
            blends={blends}
            searchString={searchString}
            isLoading={isLoadingBlends}
            error={blendsError?.message || null}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
