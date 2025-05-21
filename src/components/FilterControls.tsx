import React from 'react';

const selectTagStyles = `rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-1.5 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10`;

interface FilterControlsProps {
  searchString: string;
  priceRating: string | null;
  heatLevel: number | null;
  onReset: () => void;
  setPriceRating: (value: string | null) => void;
  setHeatLevel: (value: number | null) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchString,
  priceRating,
  heatLevel,
  onReset,
  setPriceRating,
  setHeatLevel,
}) => {
  const hasActiveFilters = searchString || priceRating || heatLevel !== null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <label
            htmlFor="price-rating"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Spice Price:
          </label>
          <select
            id="price-rating"
            value={priceRating || ''}
            onChange={(e) => setPriceRating(e.target.value || null)}
            className={selectTagStyles}
          >
            <option value="">Any</option>
            <option value="$">$ (1/5)</option>
            <option value="$$">$$ (2/5)</option>
            <option value="$$$">$$$ (3/5)</option>
            <option value="$$$$">$$$$ (4/5)</option>
            <option value="$$$$$">$$$$$ (5/5)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label
            htmlFor="heat-level"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Spice Heat Level:
          </label>
          <select
            id="heat-level"
            value={heatLevel === null ? '' : heatLevel}
            onChange={(e) =>
              setHeatLevel(e.target.value ? parseInt(e.target.value) : null)
            }
            className={selectTagStyles}
          >
            <option value="">Any</option>
            <option value="0">No Heat (0/5)</option>
            <option value="1">Mild (1/5)</option>
            <option value="2">Medium (2/5)</option>
            <option value="3">Hot (3/5)</option>
            <option value="4">Very Hot (4/5)</option>
            <option value="5">Extreme (5/5)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
