import type { Blend, Spice } from '../../types';
import { data as spicesData } from '../../mocks/data/spices';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { ItemList } from '../ItemList';
import { getBlendColors, formatColorsForGradient } from '../../utils/colors';

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
  const spices = spicesData() as Spice[];

  if (error) {
    return <ErrorState title="Blends" message={error} />;
  }

  if (isLoading) {
    return <LoadingState title="Blends" />;
  }

  const filteredBlends = blends.filter((blend) =>
    blend.name.toLowerCase().includes(searchString.toLowerCase()),
  );

  return (
    <ItemList
      items={filteredBlends}
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
