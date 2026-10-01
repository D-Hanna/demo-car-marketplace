import React from 'react';
import { render, screen } from '@testing-library/react';
import CarCard, { getFuelBadgeConfig } from './CarCard';

describe('CarCard component and fuel badge configuration', () => {
  it('returns appropriate badge configuration for each fuel type', () => {
    const electric = getFuelBadgeConfig('ELECTRIC');
    expect(electric.label).toBe('Electric');
    expect(electric.classes).toContain('dark:bg-emerald-950/60');

    const hybrid = getFuelBadgeConfig('HYBRID');
    expect(hybrid.label).toBe('Hybrid');
    expect(hybrid.classes).toContain('dark:bg-blue-950/60');

    const phev = getFuelBadgeConfig('PLUGIN_HYBRID');
    expect(phev.label).toBe('Plug-in Hybrid');
    expect(phev.classes).toContain('dark:bg-purple-950/60');

    const diesel = getFuelBadgeConfig('DIESEL');
    expect(diesel.label).toBe('Diesel');
    expect(diesel.classes).toContain('dark:bg-slate-800');

    const gas = getFuelBadgeConfig('GASOLINE');
    expect(gas.label).toBe('Gasoline');
    expect(gas.classes).toContain('dark:bg-amber-950/60');
  });

  it('renders car details properly', () => {
    const car = {
      id: 1,
      make: 'Porsche',
      model: 'Taycan',
      year: 2023,
      price: 95000,
      mileage: 4500,
      fuelType: 'ELECTRIC',
      imageUrl: '',
    };

    render(<CarCard car={car} onSelectCar={vi.fn()} />);
    expect(screen.getByText('Porsche Taycan')).toBeDefined();
    expect(screen.getByText('2023')).toBeDefined();
  });
});
