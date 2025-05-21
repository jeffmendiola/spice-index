import type { Spice } from '../../types';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { ItemList } from '../ItemList';

interface SpicesSectionProps {
  spices: Spice[];
  searchString: string;
  isLoading: boolean;
  error: string | null;
}

export function SpicesSection({
  spices,
  searchString,
  isLoading,
  error,
}: SpicesSectionProps) {
  if (error) {
    return <ErrorState title="Spices" message={error} />;
  }

  if (isLoading) {
    return <LoadingState title="Spices" />;
  }

  const filteredSpices = spices.filter((spice) =>
    spice.name.toLowerCase().includes(searchString.toLowerCase()),
  );

  if (filteredSpices.length === 0) {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Spices</h2>
        <p className="text-gray-500 text-center py-8">
          No spices found matching your search.
        </p>
      </section>
    );
  }

  if (spices.length === 0) {
    return (
      <section className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Spices</h2>
        <p className="text-gray-500 text-center py-8">No spices available.</p>
      </section>
    );
  }

  return (
    <ItemList
      items={filteredSpices}
      title="Spices"
      getItemLink={(spice) => `/spices/${spice.id}`}
      renderItem={(spice) => (
        <div className="flex items-center">
          <div
            data-testid={`spice-color-${spice.id}`}
            className="w-4 h-4 rounded mr-2 border border-gray-200"
            style={{ backgroundColor: `#${spice.color}` }}
          />
          <span className="text-gray-800 font-medium">{spice.name}</span>
        </div>
      )}
    />
  );
}
