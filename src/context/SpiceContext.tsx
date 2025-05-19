import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import type { Spice, Blend } from '../types';

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
}

const SpiceContext = createContext<SpiceContextType | undefined>(undefined);

export function SpiceProvider({ children }: { children: ReactNode }) {
  const [spices, setSpices] = useState<Spice[]>([]);
  const [blends, setBlends] = useState<Blend[]>([]);
  const [isLoading, setIsLoading] = useState({ spices: true, blends: true });
  const [errors, setErrors] = useState({
    spices: null as string | null,
    blends: null as string | null,
  });

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
        setBlends(blendsData);
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

  return (
    <SpiceContext.Provider value={{ spices, blends, isLoading, errors }}>
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
