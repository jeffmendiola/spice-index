import { Spice, Blend, BlendWithSpices } from '../types';

const API_BASE_URL = '/api/v1';

export const api = {
  spices: {
    getAll: async (): Promise<Spice[]> => {
      const response = await fetch(`${API_BASE_URL}/spices`);
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
    getAll: async (): Promise<Blend[]> => {
      const response = await fetch(`${API_BASE_URL}/blends`);
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
