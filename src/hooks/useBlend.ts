import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';
import type { Blend, BlendWithSpices } from '../types';

export const useBlend = (id: number) => {
  return useQuery<BlendWithSpices, Error>({
    queryKey: ['blend', id],
    queryFn: () => api.blends.getById(id),
  });
};

export const useBlends = () => {
  return useQuery<Blend[], Error>({
    queryKey: ['blends'],
    queryFn: () => api.blends.getAll(),
  });
};
