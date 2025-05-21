import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SpiceDetail from './index';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const originalRouter = await vi.importActual('react-router-dom');
  return {
    ...originalRouter,
    useParams: () => ({
      id: '1',
    }),
    useNavigate: () => vi.fn(),
  };
});

// Mock useSpice hook
vi.mock('../hooks/useSpice', () => ({
  useSpice: () => ({
    data: {
      id: 1,
      name: 'Adobo',
      color: 'FF5733',
      price: '$$',
      heat: 3,
    },
    isLoading: false,
    error: null,
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe('SpiceDetail', () => {
  it('renders spice detail page with correct data', () => {
    renderWithQueryClient(<SpiceDetail />);

    expect(screen.getByText('Adobo')).toBeInTheDocument();
    expect(screen.getByText('#FF5733')).toBeInTheDocument();
    expect(screen.getByText('2 / 5')).toBeInTheDocument();
    expect(screen.getByText('3 / 5')).toBeInTheDocument();
    expect(screen.getByText('← Back')).toBeInTheDocument();
  });
});
