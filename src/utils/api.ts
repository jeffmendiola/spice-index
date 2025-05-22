import { Spice, Blend, BlendWithSpices } from '../types';

const API_BASE_URL = '/api/v1';

export const api = {
  spices: {
    getAll: async (params?: {
      search?: string;
      price?: number;
      heat?: number;
    }): Promise<Spice[]> => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);
      if (params?.price) queryParams.set('price', params.price.toString());
      if (params?.heat) queryParams.set('heat', params.heat.toString());

      const url = `${API_BASE_URL}/spices${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch spices');
      }
      return response.json();
    },
    getById: async (id: number): Promise<Spice> => {
      const response = await fetch(`${API_BASE_URL}/spices/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch spice with id ${id}`);
      }
      return response.json();
    },
  },
  blends: {
    getAll: async (params?: { search?: string }): Promise<Blend[]> => {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.set('search', params.search);

      const url = `${API_BASE_URL}/blends${
        queryParams.toString() ? `?${queryParams.toString()}` : ''
      }`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch blends');
      }
      return response.json();
    },
    getById: async (id: number): Promise<BlendWithSpices> => {
      const response = await fetch(
        `${API_BASE_URL}/blends/${id}?include=spices,childBlends`,
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch blend with id ${id}`);
      }
      return response.json();
    },
    create: async (blend: Omit<Blend, 'id'>): Promise<Blend> => {
      const response = await fetch(`${API_BASE_URL}/blends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blend),
      });
      if (!response.ok) {
        throw new Error('Failed to create blend');
      }
      return response.json();
    },
    reset: async (): Promise<void> => {
      const response = await fetch(`${API_BASE_URL}/blends/reset`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to reset blends');
      }
    },
  },
};
