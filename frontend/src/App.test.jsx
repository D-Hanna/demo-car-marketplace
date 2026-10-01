import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import * as carApi from './api/carApi';

vi.mock('./api/carApi', async () => {
  const actual = await vi.importActual('./api/carApi');
  return {
    ...actual,
    getCars: vi.fn(),
    getCarById: vi.fn(),
  };
});

describe('App Routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders marketplace listing at route "/"', async () => {
    carApi.getCars.mockResolvedValue({
      data: [
        {
          id: 1,
          make: 'Tesla',
          model: 'Model 3',
          year: 2023,
          mileage: 12500,
          price: 38990,
          fuelType: 'ELECTRIC',
        },
      ],
      isDemo: false,
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/Find Your Next Vehicle/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Tesla Model 3')).toBeInTheDocument();
    });
  });

  it('renders dedicated car detail page at "/cars/:id"', async () => {
    carApi.getCarById.mockResolvedValue({
      data: {
        id: 2,
        make: 'BMW',
        model: '330e',
        year: 2022,
        mileage: 24000,
        price: 34500,
        fuelType: 'PLUGIN_HYBRID',
      },
      isDemo: false,
    });

    render(
      <MemoryRouter initialEntries={['/cars/2']}>
        <AppRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('2022 BMW 330e')).toBeInTheDocument();
    });
  });

  it('renders 404 page for unknown routes', async () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to marketplace/i })).toHaveAttribute('href', '/');
  });
});
