import React from 'react';

interface FilterControlsProps {
  searchString: string;
  priceRating: number | null;
  heatLevel: number | null;
  onReset: () => void;
  setPriceRating: (value: number | null) => void;
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

  const priceOptions = [
    { value: 1, label: '$' },
    { value: 2, label: '$$' },
    { value: 3, label: '$$$' },
    { value: 4, label: '$$$$' },
    { value: 5, label: '$$$$$' },
  ];

  const heatOptions = [
    { value: 0, label: 'No Heat' },
    { value: 1, label: <span className="whitespace-nowrap">🔥</span> },
    { value: 2, label: <span className="whitespace-nowrap">🔥🔥</span> },
    { value: 3, label: <span className="whitespace-nowrap">🔥🔥🔥</span> },
    { value: 4, label: <span className="whitespace-nowrap">🔥🔥🔥🔥</span> },
    { value: 5, label: <span className="whitespace-nowrap">🔥🔥🔥🔥🔥</span> },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Filters side by side on mobile/tablet, stacked on desktop */}
      <div className="flex flex-row gap-4 md:flex-col w-full">
        {/* Spice Price Radio Group */}
        <div className="flex flex-col gap-2 items-start w-1/2">
          <span className="text-sm font-bold text-gray-800 mb-1">
            Spice Price
          </span>
          <div className="flex flex-col gap-1 w-full">
            {priceOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="radio"
                  name="spice-price"
                  value={option.value}
                  checked={priceRating === option.value}
                  onChange={() => setPriceRating(option.value)}
                  className="accent-indigo-600 w-4 h-4"
                />
                <span
                  className={
                    priceRating === option.value
                      ? 'font-bold text-gray-900'
                      : 'font-normal text-gray-700'
                  }
                >
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Spice Heat Level Pills */}
        <div className="flex flex-col gap-2 items-start w-1/2">
          <span className="text-sm font-bold text-gray-800 mb-1">
            Spice Heat Level
          </span>
          <div className="flex flex-wrap gap-2 w-full">
            {heatOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() =>
                  setHeatLevel(heatLevel === option.value ? null : option.value)
                }
                className={`px-4 py-1 rounded-full border text-base font-medium transition-colors whitespace-nowrap
                  ${
                    heatLevel === option.value
                      ? 'bg-red-100 text-red-700 border-red-400'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                  }
                `}
                aria-pressed={heatLevel === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors w-fit mt-2"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};
