import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { SearchBar } from '../components/SearchBar';
import { FilterControls } from '../components/FilterControls';
import { useSpiceFilters } from '../hooks/useFilterItems';
import { useBlendFilters } from '../hooks/useFilterItems';

export const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const spiceSearch = searchParams.get('spiceSearch') || '';
  const blendSearch = searchParams.get('blendSearch') || '';
  const priceRatingParam = searchParams.get('price');
  const heatLevelParam = searchParams.get('heat');

  const {
    searchString: spiceSearchString,
    setSearchString: setSpiceSearchString,
    priceRating,
    setPriceRating,
    heatLevel,
    setHeatLevel,
    spices: filteredSpices,
    isLoading: isLoadingSpices,
    error: spiceError,
  } = useSpiceFilters();

  const {
    searchString: blendSearchString,
    setSearchString: setBlendSearchString,
    blends: filteredBlends,
    isLoading: isLoadingBlends,
    error: blendError,
  } = useBlendFilters();

  // Initialize state from URL params
  useEffect(() => {
    if (spiceSearch) {
      setSpiceSearchString(spiceSearch);
    }
    if (blendSearch) {
      setBlendSearchString(blendSearch);
    }
    if (priceRatingParam) {
      setPriceRating(parseInt(priceRatingParam));
    }
    if (heatLevelParam) {
      setHeatLevel(parseInt(heatLevelParam));
    }
  }, [
    spiceSearch,
    blendSearch,
    priceRatingParam,
    heatLevelParam,
    setSpiceSearchString,
    setBlendSearchString,
    setPriceRating,
    setHeatLevel,
  ]);

  // Update URL params when filters change
  useEffect(() => {
    const updateUrlParams = () => {
      const newParams = new URLSearchParams(searchParams);
      if (spiceSearchString) {
        newParams.set('spiceSearch', spiceSearchString);
      } else {
        newParams.delete('spiceSearch');
      }
      if (blendSearchString) {
        newParams.set('blendSearch', blendSearchString);
      } else {
        newParams.delete('blendSearch');
      }
      if (priceRating !== null) {
        newParams.set('price', priceRating.toString());
      } else {
        newParams.delete('price');
      }
      if (heatLevel !== null) {
        newParams.set('heat', heatLevel.toString());
      } else {
        newParams.delete('heat');
      }
      setSearchParams(newParams);
    };

    updateUrlParams();
  }, [
    spiceSearchString,
    blendSearchString,
    priceRating,
    heatLevel,
    searchParams,
    setSearchParams,
  ]);

  const handleResetFilters = () => {
    setSpiceSearchString('');
    setBlendSearchString('');
    setPriceRating(null);
    setHeatLevel(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 lg:px-6">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 w-full">
            <span className="text-lg font-semibold text-gray-800 whitespace-nowrap">
              Spice Index 🌶️
            </span>
            <div className="flex-1 flex justify-center items-center">
              <SearchBar
                searchString={spiceSearchString}
                updateSearchString={(value) => {
                  setSpiceSearchString(value);
                  setBlendSearchString(value);
                }}
              />
            </div>
            <div className="flex gap-2 ml-auto">
              <Link
                to="/blends/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-[140px] justify-center flex-shrink-0"
              >
                Create Blend
              </Link>
            </div>
          </div>
        </div>
        {/* Filters and content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <FilterControls
            priceRating={priceRating}
            heatLevel={heatLevel}
            onReset={handleResetFilters}
            setPriceRating={setPriceRating}
            setHeatLevel={setHeatLevel}
          />
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <SpicesSection
            spices={filteredSpices}
            isLoading={isLoadingSpices}
            error={spiceError?.message || null}
          />
          <BlendsSection
            blends={filteredBlends}
            isLoading={isLoadingBlends}
            error={blendError?.message || null}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
