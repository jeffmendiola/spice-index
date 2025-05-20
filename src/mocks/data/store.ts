import { Blend } from '../../types';
import { data as defaultBlends } from './blends';
import { STORAGE_KEYS } from '../../utils/constants';

// Initialize store with blends from localStorage or default blends
let blends: Blend[] = (() => {
  const storedBlends = localStorage.getItem(STORAGE_KEYS.BLENDS);
  return storedBlends ? JSON.parse(storedBlends) : [...defaultBlends()];
})();

export const store = {
  getBlends: () => blends,
  addBlend: (blend: Omit<Blend, 'id'>) => {
    const newBlend = {
      ...blend,
      id: Math.max(...blends.map((b) => b.id)) + 1,
    };
    blends = [...blends, newBlend];
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.BLENDS, JSON.stringify(blends));
    return newBlend;
  },
  resetBlends: () => {
    blends = [...defaultBlends()];
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEYS.BLENDS, JSON.stringify(blends));
  },
};
