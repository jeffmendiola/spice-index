import { useState } from 'react';
import type { Spice, Blend } from '../types';

export const useSpiceFilters = () => {
  const [searchString, setSearchString] = useState('');
  const [priceRating, setPriceRating] = useState<number | null>(null);
  const [heatLevel, setHeatLevel] = useState<number | null>(null);

  const filterSpices = (spices: Spice[]) => {
    return spices.filter((spice) => {
      const matchesSearch = spice.name
        .toLowerCase()
        .includes(searchString.toLowerCase());
      const matchesPrice =
        priceRating === null ||
        (spice.price && spice.price.length === priceRating);
      const matchesHeat = heatLevel === null || spice.heat === heatLevel;
      return matchesSearch && matchesPrice && matchesHeat;
    });
  };

  const resetFilters = () => {
    setSearchString('');
    setPriceRating(null);
    setHeatLevel(null);
  };

  return {
    searchString,
    setSearchString,
    priceRating,
    setPriceRating,
    heatLevel,
    setHeatLevel,
    filterSpices,
    resetFilters,
  };
};

export const useBlendFilters = () => {
  const [searchString, setSearchString] = useState('');

  const filterBlends = (blends: Blend[]) => {
    return blends.filter((blend) => {
      return blend.name.toLowerCase().includes(searchString.toLowerCase());
    });
  };

  const resetFilters = () => {
    setSearchString('');
  };

  return {
    searchString,
    setSearchString,
    filterBlends,
    resetFilters,
  };
};
