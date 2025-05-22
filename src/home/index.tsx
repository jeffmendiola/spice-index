import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/SearchBar';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { FilterControls } from '../components/FilterControls';
import { api } from '../utils/api';
import { useSpiceFilters, useBlendFilters } from '../hooks/useFilterItems';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    searchString: spiceSearchString,
    setSearchString: setSpiceSearchString,
    priceRating,
    setPriceRating,
    heatLevel,
    setHeatLevel,
    filterSpices,
    resetFilters: resetSpiceFilters,
  } = useSpiceFilters();

  const {
    searchString: blendSearchString,
    setSearchString: setBlendSearchString,
    filterBlends,
    resetFilters: resetBlendFilters,
  } = useBlendFilters();

  // Initialize state from URL params
  useEffect(() => {
    setSpiceSearchString(searchParams.get('search') || '');
    setBlendSearchString(searchParams.get('search') || '');
    setPriceRating(searchParams.get('price') || null);
    setHeatLevel(
      searchParams.get('heat') ? parseInt(searchParams.get('heat')!) : null,
    );
  }, []);

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (spiceSearchString) params.set('search', spiceSearchString);
    if (priceRating) params.set('price', priceRating);
    if (heatLevel !== null) params.set('heat', heatLevel.toString());
    setSearchParams(params);
  };

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [spiceSearchString, priceRating, heatLevel, setSearchParams]);

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

  const filteredSpices = filterSpices(spices);
  const filteredBlends = filterBlends(blends);

  const handleResetFilters = () => {
    resetSpiceFilters();
    resetBlendFilters();
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
          </div>
        </div>
        <div className="mb-8 space-y-4">
          <SearchBar
            searchString={spiceSearchString}
            updateSearchString={setSpiceSearchString}
          />
          <FilterControls
            searchString={spiceSearchString}
            priceRating={priceRating}
            heatLevel={heatLevel}
            onReset={handleResetFilters}
            setPriceRating={setPriceRating}
            setHeatLevel={setHeatLevel}
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpicesSection
            spices={filteredSpices}
            searchString={spiceSearchString}
            isLoading={isLoadingSpices}
            error={spicesError?.message || null}
          />
          <BlendsSection
            blends={filteredBlends}
            searchString={blendSearchString}
            isLoading={isLoadingBlends}
            error={blendsError?.message || null}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
