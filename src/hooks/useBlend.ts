import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

export const useBlend = (id: number) => {
  return useQuery({
    queryKey: ['blend', id],
    queryFn: () => api.blends.getById(id),
  });
};

export const useBlends = () => {
  return useQuery({
    queryKey: ['blends'],
    queryFn: api.blends.getAll,
  });
};
