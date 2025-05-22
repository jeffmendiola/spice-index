import type { Blend, Spice } from '../../types';
import { data as spicesData } from '../../mocks/data/spices';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { ItemList } from '../ItemList';

interface BlendsSectionProps {
  blends: Blend[];
  searchString: string;
  isLoading: boolean;
  error: string | null;
}

const calculateBlendColors = (
  blend: Blend,
  allBlends: Blend[],
  spices: Spice[],
): string[] => {
  const spiceColors = blend.spices
    .map((spiceId) => {
      const spice = spices.find((s) => s.id === spiceId);
      return spice?.color ?? null;
    })
    .filter((color): color is string => color !== null);

  if (spiceColors.length > 0) return spiceColors;

  const blendColors = blend.blends
    .map((blendId) => {
      const childBlend = allBlends.find((b) => b.id === blendId);
      if (!childBlend) return null;
      return calculateBlendColors(childBlend, allBlends, spices);
    })
    .filter((colors): colors is string[] => colors !== null)
    .flat();

  if (blendColors.length > 0) return blendColors;

  return ['7e7ac0'];
};

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
              background: `linear-gradient(to right, ${calculateBlendColors(
                blend,
                blends,
                spices,
              )
                .map((color) => `#${color}`)
                .join(', ')})`,
            }}
          />
          <span className="text-gray-800 font-medium">{blend.name}</span>
        </div>
      )}
    />
  );
}
