import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { store } from './data/store';
import type { Blend, BlendWithSpices, Spice } from '../types';

// Helper to recursively get all spices from a blend and its child blends
const getAllSpices = (blend: Blend, allBlends: Blend[]): Spice[] => {
  const directSpices = blend.spices
    .map((spiceId) => mockSpices().find((s) => s.id === spiceId))
    .filter((spice): spice is Spice => spice !== undefined);

  const childBlendSpices = blend.blends.flatMap((blendId) => {
    const childBlend = allBlends.find((b) => b.id === blendId);
    return childBlend ? getAllSpices(childBlend, allBlends) : [];
  });

  return [...new Set([...directSpices, ...childBlendSpices])];
};

export const handlers = [
  http.get('/api/v1/spices', () => {
    return HttpResponse.json(mockSpices());
  }),
  http.get('/api/v1/spices/:id', ({ params }) => {
    const spice = mockSpices().find((spice) => spice.id === Number(params.id));

    if (!spice) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json(spice);
  }),
  http.get('/api/v1/blends', () => {
    return HttpResponse.json(store.getBlends());
  }),
  http.post('/api/v1/blends', async ({ request }) => {
    const newBlend = (await request.json()) as Omit<Blend, 'id'>;
    const createdBlend = store.addBlend(newBlend);
    return HttpResponse.json(createdBlend);
  }),
  http.get('/api/v1/blends/:id', ({ params, request }) => {
    const blend = store
      .getBlends()
      .find((blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    const url = new URL(request.url);
    const include = url.searchParams.get('include');

    if (include?.includes('spices')) {
      const allBlends = store.getBlends();
      const spiceDetails = blend.spices
        .map((spiceId) => mockSpices().find((s) => s.id === spiceId))
        .filter((spice): spice is Spice => spice !== undefined);

      const childBlends = blend.blends
        .map((blendId) => allBlends.find((b) => b.id === blendId))
        .filter((b): b is Blend => b !== undefined)
        .map((childBlend) => ({
          ...childBlend,
          childBlends: [],
          allSpices: getAllSpices(childBlend, allBlends),
        }));

      const enhancedBlend: BlendWithSpices = {
        ...blend,
        spiceDetails,
        childBlends,
        allSpices: getAllSpices(blend, allBlends),
      };

      return HttpResponse.json(enhancedBlend);
    }

    return HttpResponse.json(blend);
  }),
  http.post('/api/v1/blends/reset', () => {
    store.resetBlends();
    return new HttpResponse(null, { status: 200 });
  }),
];
