import { Link } from 'react-router-dom';
import type { Blend } from '../types';
import { data as spicesData } from '../mocks/data/spices';

interface BlendsSectionProps {
  blends: Blend[];
  searchString: string;
  isLoading: boolean;
  error: string | null;
}

export function BlendsSection({
  blends,
  searchString,
  isLoading,
  error,
}: BlendsSectionProps) {
  const spices = spicesData();

  const getBlendColors = (blend: Blend): string[] => {
    const spiceColors = blend.spices
      .map((spiceId) => {
        const spice = spices.find((s) => s.id === spiceId);
        return spice?.color ?? null;
      })
      .filter((color): color is string => color !== null);

    if (spiceColors.length > 0) return spiceColors;

    const blendColors = blend.blends
      .map((blendId) => {
        const childBlend = blends.find((b) => b.id === blendId);
        if (!childBlend) return null;
        return getBlendColors(childBlend);
      })
      .filter((colors): colors is string[] => colors !== null)
      .flat();

    if (blendColors.length > 0) return blendColors;

    return ['7e7ac'];
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blends</h2>
        <div className="text-red-600">Error loading blends: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blends</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  const filteredBlends = blends.filter((blend) =>
    blend.name.toLowerCase().includes(searchString.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Blends {filteredBlends.length > 0 && `(${filteredBlends.length})`}
      </h2>
      {filteredBlends.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          No blends found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredBlends.map((blend) => (
            <Link
              key={blend.id}
              to={`/blends/${blend.id}`}
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-indigo-500"
            >
              <div className="flex items-center">
                <div
                  className="w-4 h-4 rounded mr-2 border border-gray-200 overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, ${getBlendColors(
                      blend,
                    )
                      .map((color) => `#${color}`)
                      .join(', ')})`,
                  }}
                />
                <span className="text-gray-800 font-medium">{blend.name}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
