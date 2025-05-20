import { Blend } from '../../types';
import { data as defaultBlends } from './blends';

// Initialize store with default blends
let blends: Blend[] = [...defaultBlends()];

export const store = {
  getBlends: () => blends,
  addBlend: (blend: Omit<Blend, 'id'>) => {
    const newBlend = {
      ...blend,
      id: Math.max(...blends.map((b) => b.id)) + 1,
    };
    blends = [...blends, newBlend];
    return newBlend;
  },
  resetBlends: () => {
    blends = [...defaultBlends()];
  },
};
