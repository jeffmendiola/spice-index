import { http, HttpResponse } from 'msw';
import { data as mockSpices } from './data/spices';
import { data as mockBlends } from './data/blends';

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
    return HttpResponse.json(mockBlends());
  }),
  http.post('/api/v1/blends', async ({ request }) => {
    const newBlend = (await request.json()) as {
      name: string;
      description: string;
      spices: number[];
      blends: number[];
    };
    const createdBlend = {
      ...newBlend,
      id: Math.floor(Math.random() * 1000),
    };
    return HttpResponse.json(createdBlend);
  }),
  http.get('/api/v1/blends/:id', ({ params }) => {
    const blend = mockBlends().find((blend) => blend.id === Number(params.id));

    if (!blend) {
      return new HttpResponse('Not found', { status: 404 });
    }

    return HttpResponse.json(blend);
  }),
];
