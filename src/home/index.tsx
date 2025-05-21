import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/SearchBar';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { FilterControls } from '../components/FilterControls';
import { api } from '../utils/api';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchString, updateSearchString] = useState(
    searchParams.get('search') || '',
  );
  const [priceRating, setPriceRating] = useState<string | null>(
    searchParams.get('price') || null,
  );
  const [heatLevel, setHeatLevel] = useState<number | null>(
    searchParams.get('heat') ? parseInt(searchParams.get('heat')!) : null,
  );

  const updateUrlParams = () => {
    const params = new URLSearchParams();
    if (searchString) params.set('search', searchString);
    if (priceRating) params.set('price', priceRating);
    if (heatLevel !== null) params.set('heat', heatLevel.toString());
    setSearchParams(params);
  };

  // Update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [searchString, priceRating, heatLevel, setSearchParams]);

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

  const filterItems = <T extends { name: string }>(
    items: T[],
    searchString: string,
    additionalFilters?: (item: T) => boolean,
  ) => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchString.toLowerCase());
      return matchesSearch && (!additionalFilters || additionalFilters(item));
    });
  };

  const filteredSpices = filterItems(spices, searchString, (spice) => {
    const matchesPrice = priceRating === null || spice.price === priceRating;
    const matchesHeat = heatLevel === null || spice.heat === heatLevel;
    return matchesPrice && matchesHeat;
  });

  const filteredBlends = filterItems(blends, searchString);

  const handleResetFilters = () => {
    updateSearchString('');
    setPriceRating(null);
    setHeatLevel(null);
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
            searchString={searchString}
            updateSearchString={updateSearchString}
          />
          <FilterControls
            searchString={searchString}
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
            searchString={searchString}
            isLoading={isLoadingSpices}
            error={spicesError?.message || null}
          />
          <BlendsSection
            blends={filteredBlends}
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
