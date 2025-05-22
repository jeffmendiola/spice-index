import type { Blend, Spice } from '../../types';
import { data as spicesData } from '../../mocks/data/spices';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { ItemList } from '../ItemList';
import { getBlendColors, formatColorsForGradient } from '../../utils/colors';

interface BlendsSectionProps {
  blends: Blend[];
  isLoading: boolean;
  error: string | null;
}

export function BlendsSection({
  blends,
  isLoading,
  error,
}: BlendsSectionProps) {
  const spices = spicesData() as Spice[];

  if (error) {
    return <ErrorState title="Blends" message={error} />;
  }

  if (isLoading) {
    return <LoadingState title="Blends" />;
  }

  if (blends.length === 0) {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blends</h2>
        <p className="text-gray-500 text-center py-8">No blends available.</p>
      </section>
    );
  }

  return (
    <ItemList
      items={blends}
      title="Blends"
      getItemLink={(blend) => `/blends/${blend.id}`}
      renderItem={(blend) => (
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded mr-2 border border-gray-200 overflow-hidden"
            data-testid="blend-color"
            style={{
              background: `linear-gradient(to right, ${formatColorsForGradient(
                getBlendColors(blend, spices, blends),
              )})`,
            }}
          />
          <span className="text-gray-800 font-medium">{blend.name}</span>
        </div>
      )}
    />
  );
}
