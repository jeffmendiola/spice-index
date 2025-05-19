import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { Spice, Blend } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { data as defaultBlends } from '../mocks/data/blends';

interface SpiceContextType {
  spices: Spice[];
  blends: Blend[];
  isLoading: {
    spices: boolean;
    blends: boolean;
  };
  errors: {
    spices: string | null;
    blends: string | null;
  };
  addBlend: (blend: Omit<Blend, 'id'>) => Promise<void>;
  clearLocalStorage: () => void;
}

const SpiceContext = createContext<SpiceContextType | undefined>(undefined);

export function SpiceProvider({ children }: { children: ReactNode }) {
  const [spices, setSpices] = useState<Spice[]>([]);
  const [blends, setBlends] = useState<Blend[]>(() => {
    // Initialize blends from localStorage if available
    try {
      const savedBlends = localStorage.getItem(STORAGE_KEYS.BLENDS);
      return savedBlends ? JSON.parse(savedBlends) : defaultBlends();
    } catch (error) {
      console.error('Error loading blends from localStorage:', error);
      return defaultBlends();
    }
  });
  const [isLoading, setIsLoading] = useState({ spices: true, blends: true });
  const [errors, setErrors] = useState({
    spices: null as string | null,
    blends: null as string | null,
  });

  // Save blends to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLENDS, JSON.stringify(blends));
    } catch (error) {
      console.error('Error saving blends to localStorage:', error);
    }
  }, [blends]);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading((prev) => ({ ...prev, spices: true }));
        const spicesResponse = await fetch('/api/v1/spices');
        if (!spicesResponse.ok) {
          throw new Error(`HTTP error! status: ${spicesResponse.status}`);
        }
        const spicesData = await spicesResponse.json();
        setSpices(spicesData);
        setErrors((prev) => ({ ...prev, spices: null }));
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          spices:
            error instanceof Error ? error.message : 'Failed to fetch spices',
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, spices: false }));
      }
    }

    async function fetchBlends() {
      try {
        setIsLoading((prev) => ({ ...prev, blends: true }));
        const blendsResponse = await fetch('/api/v1/blends');
        if (!blendsResponse.ok) {
          throw new Error(`HTTP error! status: ${blendsResponse.status}`);
        }
        const blendsData = await blendsResponse.json();
        // Merge API blends with localStorage blends
        const localBlends = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.BLENDS) || '[]',
        );
        const mergedBlends = [...blendsData, ...localBlends];
        // Remove duplicates based on id
        const uniqueBlends = Array.from(
          new Map(mergedBlends.map((blend) => [blend.id, blend])).values(),
        );
        setBlends(uniqueBlends);
        setErrors((prev) => ({ ...prev, blends: null }));
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          blends:
            error instanceof Error ? error.message : 'Failed to fetch blends',
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, blends: false }));
      }
    }

    fetchData();
    fetchBlends();
  }, []);

  const addBlend = async (newBlend: Omit<Blend, 'id'>) => {
    try {
      const response = await fetch('/api/v1/blends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlend),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdBlend = await response.json();
      setBlends((prev) => [...prev, createdBlend]);
    } catch (error) {
      throw error instanceof Error
        ? error
        : new Error('Failed to create blend');
    }
  };

  const clearLocalStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.BLENDS);
      setBlends(defaultBlends());
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  return (
    <SpiceContext.Provider
      value={{
        spices,
        blends,
        isLoading,
        errors,
        addBlend,
        clearLocalStorage,
      }}
    >
      {children}
    </SpiceContext.Provider>
  );
}

export function useSpiceContext() {
  const context = useContext(SpiceContext);
  if (context === undefined) {
    throw new Error('useSpiceContext must be used within a SpiceProvider');
  }
  return context;
}
