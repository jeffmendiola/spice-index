import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';
import { useSpiceContext } from '../context/SpiceContext';

function Home() {
  const { spices, blends, isLoading, errors } = useSpiceContext();
  const [searchString, updateSearchString] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Spice Collection
        </h1>

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
