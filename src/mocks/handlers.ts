import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { data as defaultBlends } from './data/blends';
import type { Blend, BlendWithSpices, Spice } from '../types';

// Helper function to get all spices in a blend (including nested blends)
const getAllSpices = (blend: Blend, allBlends: Blend[]): Spice[] => {
  const spiceIds = new Set<number>(blend.spices);

  blend.blends.forEach((blendId) => {
    const childBlend = allBlends.find((b) => b.id === blendId);
    if (childBlend) {
      getAllSpices(childBlend, allBlends).forEach((spice) =>
        spiceIds.add(spice.id),
      );
    }
  });

  return mockSpices()
    .filter((spice) => spiceIds.has(spice.id))
    .map((spice) => ({
      ...spice,
      price: spice.price || '$', // Ensure all spices have a price
    }));
};

// In-memory storage for blends
let blends = (() => {
  const storedBlends = localStorage.getItem('mockBlends');
  return storedBlends ? JSON.parse(storedBlends) : [...defaultBlends()];
})();

// Helper function to save blends to localStorage
const saveBlends = (newBlends: Blend[]) => {
  localStorage.setItem('mockBlends', JSON.stringify(newBlends));
  blends = newBlends;
};

export const handlers = [
  http.get('/api/v1/spices', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const price = url.searchParams.get('price');
    const heat = url.searchParams.get('heat');

    let spices = mockSpices().map((spice) => ({
      ...spice,
      price: spice.price || '$', // Ensure all spices have a price
    }));

    // Apply filters
    if (search) {
      spices = spices.filter((spice) =>
        spice.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (price) {
      const priceValue = parseInt(price);
      spices = spices.filter((spice) => spice.price?.length === priceValue);
    }
    if (heat) {
      const heatValue = parseInt(heat);
      spices = spices.filter((spice) => spice.heat === heatValue);
    }

    return HttpResponse.json(spices);
  }),

  http.get('/api/v1/spices/:id', ({ params }) => {
    const spice = mockSpices().find((spice) => spice.id === Number(params.id));

    if (!spice) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json({
      ...spice,
      price: spice.price || '$', // Ensure all spices have a price
    });
  }),

  http.get('/api/v1/blends', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search');

    let filteredBlends = [...blends];

    if (search) {
      filteredBlends = filteredBlends.filter((blend) =>
        blend.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return HttpResponse.json(filteredBlends);
  }),

  http.post('/api/v1/blends', async ({ request }) => {
    const newBlend = (await request.json()) as Omit<Blend, 'id'>;
    const createdBlend = {
      ...newBlend,
      id: Math.max(...blends.map((b: Blend) => b.id)) + 1,
    };
    saveBlends([...blends, createdBlend]);
    return HttpResponse.json(createdBlend);
  }),

  http.get('/api/v1/blends/:id', ({ params, request }) => {
    const blend = blends.find((blend: Blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    const url = new URL(request.url);
    const include = url.searchParams.get('include');

    if (include?.includes('spices')) {
      const enhancedBlend: BlendWithSpices = {
        ...blend,
        allSpices: getAllSpices(blend, blends),
      };

      return HttpResponse.json(enhancedBlend);
    }

    return HttpResponse.json(blend);
  }),

  http.post('/api/v1/blends/reset', () => {
    saveBlends([...defaultBlends()]);
    return new HttpResponse(null, { status: 200 });
  }),
];
