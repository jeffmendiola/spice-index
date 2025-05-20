import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useSpice = (id: number) => {
  return useQuery({
    queryKey: ['spice', id],
    queryFn: () => api.spices.getById(id),
  });
};

export const useSpices = () => {
  return useQuery({
    queryKey: ['spices'],
    queryFn: api.spices.getAll,
  });
};

export const useSpicesByIds = (ids: number[]) => {
  return useQuery({
    queryKey: ['spices', ids],
    queryFn: async () => {
      const spices = await Promise.all(ids.map((id) => api.spices.getById(id)));
      return spices;
    },
  });
};
