import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CreateBlendForm } from '../index';
import { api } from '../../../utils/api';
import { VALIDATION } from '../../../utils/constants';

// Mock the API
vi.mock('../../../utils/api', () => ({
  api: {
    spices: {
      getAll: vi.fn().mockResolvedValue([
        { id: 1, name: 'Cinnamon', color: 'D2691E', price: '$', heat: 0 },
        { id: 2, name: 'Turmeric', color: 'FFA500', price: '$', heat: 0 },
      ]),
    },
    blends: {
      getAll: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Basic Blend',
          description: 'A basic blend',
          spices: [1],
          blends: [],
        },
      ]),
      create: vi.fn().mockResolvedValue({
        id: 2,
        name: 'New Blend',
        description: 'A new blend',
        spices: [1, 2],
        blends: [],
      }),
    },
  },
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

describe('CreateBlendForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', async () => {
    renderWithQueryClient(<CreateBlendForm />);

    // Check for required form elements
    expect(screen.getByLabelText(/blend name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByText(/select spices/i)).toBeInTheDocument();
    expect(screen.getByText(/select at least/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderWithQueryClient(<CreateBlendForm />);

    const submitButton = screen.getByRole('button', { name: /create blend/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
      expect(screen.getByText(/select at least 2 spices/i)).toBeInTheDocument();
    });
  });

  it('allows selecting spices', async () => {
    renderWithQueryClient(<CreateBlendForm />);

    // Wait for spices to load
    await waitFor(() => {
      expect(screen.getByLabelText(/select cinnamon/i)).toBeInTheDocument();
    });

    // Select a spice
    const cinnamonCheckbox = screen.getByLabelText(/select cinnamon/i);
    fireEvent.click(cinnamonCheckbox);

    expect(cinnamonCheckbox).toBeChecked();
  });

  it('creates a new blend successfully', async () => {
    const onSuccess = vi.fn();
    renderWithQueryClient(<CreateBlendForm onSuccess={onSuccess} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/blend name/i), {
      target: { value: 'New Blend' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'A new blend' },
    });

    // Select spices
    await waitFor(() => {
      expect(screen.getByLabelText(/select cinnamon/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText(/select cinnamon/i));
    fireEvent.click(screen.getByLabelText(/select turmeric/i));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create blend/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.blends.create).toHaveBeenCalledWith({
        name: 'New Blend',
        description: 'A new blend',
        spices: [1, 2],
        blends: [],
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('shows error message when API call fails', async () => {
    const error = new Error('Failed to create blend');
    vi.mocked(api.blends.create).mockRejectedValueOnce(error);

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderWithQueryClient(<CreateBlendForm />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/blend name/i), {
      target: { value: 'New Blend' },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'A new blend' },
    });

    // Select spices
    await waitFor(() => {
      expect(screen.getByLabelText(/select cinnamon/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select turmeric/i)).toBeInTheDocument();
    });
    fireEvent.click(screen.getByLabelText(/select cinnamon/i));
    fireEvent.click(screen.getByLabelText(/select turmeric/i));

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create blend/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.blends.create).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to create blend:',
        error,
      );
    });

    // Restore the original implementation
    consoleErrorSpy.mockRestore();
  });
});
