import { Link } from 'react-router-dom';
import type { Blend, Spice } from '../types';
import { useEffect, useState } from 'react';

function SearchBar({ searchString, updateSearchString }: { searchString: string, updateSearchString: (value: string) => void }) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search spices and blends..."
          value={searchString}
          onChange={(e) => updateSearchString(e.target.value)}
          className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>   
  )
}

function SpicesSection({ spices, searchString }: { spices: Spice[], searchString: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Spices</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {spices
          .filter((spice) =>
            spice.name.toLowerCase().includes(searchString.toLowerCase())
          )
          .map((spice) => (
            <Link
              key={spice.id}
              to={`/spices/${spice.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-indigo-500"
            >
              <span className="text-gray-800 font-medium">{spice.name}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

function BlendsSection({ blends, searchString }: { blends: Blend[], searchString: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blends</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
        {blends
          .filter((blend) =>
            blend.name.toLowerCase().includes(searchString.toLowerCase())
          )
          .map((blend) => (
            <Link
              key={blend.id}
              to={`/blends/${blend.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-indigo-500"
            >
              <span className="text-gray-800 font-medium">{blend.name}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}

function Home() {
  const [spices, setSpices] = useState<Spice[]>([]);
  const [blends, setBlends] = useState<Blend[]>([]);
  const [searchString, updateSearchString] = useState('');

  useEffect(() => {
    async function fetchSpices() {
      const spicesResponse = await fetch('/api/v1/spices');
      const spices = await spicesResponse.json();
      setSpices(spices);
    }

    async function fetchBlends() {
      const blendsResponse = await fetch('/api/v1/blends');
      const blends = await blendsResponse.json();
      setBlends(blends);
    }

    fetchSpices();
    fetchBlends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Spice Collection</h1>
        
        <SearchBar searchString={searchString} updateSearchString={updateSearchString} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpicesSection spices={spices} searchString={searchString} />
          <BlendsSection blends={blends} searchString={searchString} />
        </div>
      </div>
    </div>
  );
}

export default Home;
