import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useSpiceFilters = () => {
  const [searchString, setSearchString] = useState('');
  const [priceRating, setPriceRating] = useState<number | null>(null);
  const [heatLevel, setHeatLevel] = useState<number | null>(null);

  const {
    data: spices = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['spices', searchString, priceRating, heatLevel],
    queryFn: () =>
      api.spices.getAll({
        search: searchString || undefined,
        price: priceRating || undefined,
        heat: heatLevel || undefined,
      }),
  });

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
    spices,
    isLoading,
    error,
    resetFilters,
  };
};

export const useBlendFilters = () => {
  const [searchString, setSearchString] = useState('');

  const {
    data: blends = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blends', searchString],
    queryFn: () => api.blends.getAll({ search: searchString || undefined }),
  });

  const resetFilters = () => {
    setSearchString('');
  };

  return {
    searchString,
    setSearchString,
    blends,
    isLoading,
    error,
    resetFilters,
  };
};
