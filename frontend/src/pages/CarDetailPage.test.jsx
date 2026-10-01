import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CarDetailPage from './CarDetailPage';
import * as carApi from '../api/carApi';

vi.mock('../api/carApi', async () => {
  const actual = await vi.importActual('../api/carApi');
  return {
    ...actual,
    getCarById: vi.fn(),
  };
});

describe('CarDetailPage Component', () => {
  const mockCar = {
    id: 1,
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    mileage: 12500,
    price: 38990,
    fuelType: 'ELECTRIC',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  const renderComponent = (id = '1') => {
    return render(
      <MemoryRouter initialEntries={[`/cars/${id}`]}>
        <Routes>
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/" element={<div>Marketplace Home</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('displays loading skeleton when fetching car details', async () => {
    carApi.getCarById.mockImplementation(() => new Promise(() => {})); // Never resolves
    renderComponent('1');

    expect(screen.getByTestId('car-detail-skeleton')).toBeInTheDocument();
  });

  it('renders full vehicle details on successful fetch', async () => {
    carApi.getCarById.mockResolvedValue({ data: mockCar, isDemo: false });
    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('2023 Tesla Model 3 Long Range');
    });

    expect(screen.getByText('$38,990')).toBeInTheDocument();
    expect(screen.getByText(/12,500\s*mi/i)).toBeInTheDocument();
    expect(screen.getByText('Electric')).toBeInTheDocument();
    expect(screen.getByText('Tesla')).toBeInTheDocument();
    expect(screen.getByText('Model 3 Long Range')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });

  it('renders 404 Vehicle Not Found state when car ID does not exist', async () => {
    carApi.getCarById.mockRejectedValue(
      new carApi.ProblemDetailError({
        status: 404,
        title: 'Not Found',
        detail: 'Car with ID 999 not found',
      })
    );

    renderComponent('999');

    await waitFor(() => {
      expect(screen.getByText(/vehicle not found/i)).toBeInTheDocument();
    });

    const backHomeBtn = screen.getByRole('link', { name: /back to marketplace|return to marketplace|back to listings/i });
    expect(backHomeBtn).toHaveAttribute('href', '/');
  });

  it('provides breadcrumb back navigation link pointing to /', async () => {
    carApi.getCarById.mockResolvedValue({ data: mockCar, isDemo: false });
    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByText('2023 Tesla Model 3 Long Range')).toBeInTheDocument();
    });

    const backLink = screen.getByRole('link', { name: /back to listings/i });
    expect(backLink).toHaveAttribute('href', '/');
  });

  it('triggers copy share link and shows feedback', async () => {
    carApi.getCarById.mockResolvedValue({ data: mockCar, isDemo: false });
    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByText('2023 Tesla Model 3 Long Range')).toBeInTheDocument();
    });

    const shareBtn = screen.getByRole('button', { name: /share link|copy share link/i });
    fireEvent.click(shareBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
    await waitFor(() => {
      expect(screen.getByText(/link copied/i)).toBeInTheDocument();
    });
  });

  it('renders RFC 7807 error banner and supports retry on server error', async () => {
    carApi.getCarById
      .mockRejectedValueOnce(
        new carApi.ProblemDetailError({
          status: 500,
          title: 'Internal Server Error',
          detail: 'Database unreachable',
        })
      )
      .mockResolvedValueOnce({ data: mockCar, isDemo: false });

    renderComponent('1');

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument();
      expect(screen.getByText(/database unreachable/i)).toBeInTheDocument();
    });

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(screen.getByText('2023 Tesla Model 3 Long Range')).toBeInTheDocument();
    });
  });
});
