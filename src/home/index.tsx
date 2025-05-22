import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { SearchBar } from '../components/SearchBar';
import { FilterControls } from '../components/FilterControls';
import { useSpiceFilters } from '../hooks/useFilterItems';
import { useBlendFilters } from '../hooks/useFilterItems';
import { ErrorState } from '../components/ErrorState';

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

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  };

  if (spiceError) {
    return <ErrorState title="Spices" message={getErrorMessage(spiceError)} />;
  }

  if (blendError) {
    return <ErrorState title="Blends" message={getErrorMessage(blendError)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            searchString={spiceSearchString}
            updateSearchString={setSpiceSearchString}
          />
          <SearchBar
            searchString={blendSearchString}
            updateSearchString={setBlendSearchString}
          />
        </div>

        <FilterControls
          priceRating={priceRating}
          heatLevel={heatLevel}
          onReset={handleResetFilters}
          setPriceRating={setPriceRating}
          setHeatLevel={setHeatLevel}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpicesSection
            spices={filteredSpices}
            isLoading={isLoadingSpices}
            error={spiceError ? getErrorMessage(spiceError) : null}
          />
          <BlendsSection
            blends={filteredBlends}
            isLoading={isLoadingBlends}
            error={blendError ? getErrorMessage(blendError) : null}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
