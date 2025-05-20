import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './main.css';
import Home from './home/index.tsx';
import SpiceDetail from './spice-detail/index.tsx';
import BlendDetail from './blend-detail/index.tsx';
import { CreateBlend } from './create-blend';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

async function enableMocking() {
  const { worker } = await import('./mocks/browser');

  return worker.start();
}

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      errorElement: <Home />,
    },
    {
      path: '/spices/:id',
      element: <SpiceDetail />,
    },
    {
      path: '/blends/:id',
      element: <BlendDetail />,
    },
    {
      path: '/blends/create',
      element: <CreateBlend />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </StrictMode>,
  );
});
