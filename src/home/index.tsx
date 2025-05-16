import React, { useEffect, useState } from 'react';
import type { Blend, Spice } from '../types';
import { SearchBar } from '../components/SearchBar';
import { SpicesSection } from '../components/SpicesSection';
import { BlendsSection } from '../components/BlendsSection';

function Home() {
  const [spices, setSpices] = useState<Spice[]>([]);
  const [blends, setBlends] = useState<Blend[]>([]);
  const [searchString, updateSearchString] = useState('');
  const [isLoading, setIsLoading] = useState({ spices: true, blends: true });
  const [errors, setErrors] = useState({ spices: null as string | null, blends: null as string | null });

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(prev => ({ ...prev, spices: true }));
        const spicesResponse = await fetch('/api/v1/spices');
        if (!spicesResponse.ok) {
          throw new Error(`HTTP error! status: ${spicesResponse.status}`);
        }
        const spicesData = await spicesResponse.json();
        setSpices(spicesData);
        setErrors(prev => ({ ...prev, spices: null }));
      } catch (error) {
        setErrors(prev => ({ ...prev, spices: error instanceof Error ? error.message : 'Failed to fetch spices' }));
      } finally {
        setIsLoading(prev => ({ ...prev, spices: false }));
      }
    }

    async function fetchBlends() {
      try {
        setIsLoading(prev => ({ ...prev, blends: true }));
        const blendsResponse = await fetch('/api/v1/blends');
        if (!blendsResponse.ok) {
          throw new Error(`HTTP error! status: ${blendsResponse.status}`);
        }
        const blendsData = await blendsResponse.json();
        setBlends(blendsData);
        setErrors(prev => ({ ...prev, blends: null }));
      } catch (error) {
        setErrors(prev => ({ ...prev, blends: error instanceof Error ? error.message : 'Failed to fetch blends' }));
      } finally {
        setIsLoading(prev => ({ ...prev, blends: false }));
      }
    }

    fetchData();
    fetchBlends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Spice Collection</h1>
        
        <SearchBar searchString={searchString} updateSearchString={updateSearchString} />

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
