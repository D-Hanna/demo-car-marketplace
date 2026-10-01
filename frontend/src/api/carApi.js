/**
 * API client for the Car Marketplace.
 * Strictly adheres to the OpenAPI 3.0 specification in /specs/car-marketplace-api.yaml.
 * Handles RFC 7807 ProblemDetail error responses and provides graceful fallback demo data.
 */

const API_BASE = '/api/v1/cars';

export class ProblemDetailError extends Error {
  constructor(problem) {
    super(problem.detail || problem.title || 'An API error occurred');
    this.name = 'ProblemDetailError';
    this.status = problem.status || 500;
    this.title = problem.title || 'Error';
    this.detail = problem.detail || 'An unexpected error occurred.';
    this.instance = problem.instance || '';
    this.type = problem.type || 'about:blank';
    this.errors = Array.isArray(problem.errors) ? problem.errors : [];
  }
}

export const INITIAL_DEMO_CARS = [
  {
    id: 1,
    make: 'Tesla',
    model: 'Model 3 Long Range',
    year: 2023,
    mileage: 12500,
    price: 38990.0,
    fuelType: 'ELECTRIC',
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    make: 'BMW',
    model: '330e M Sport',
    year: 2022,
    mileage: 24000,
    price: 34500.0,
    fuelType: 'PLUGIN_HYBRID',
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    make: 'Porsche',
    model: '911 Carrera 4S',
    year: 2021,
    mileage: 15200,
    price: 114900.0,
    fuelType: 'GASOLINE',
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    make: 'Toyota',
    model: 'RAV4 Hybrid XSE',
    year: 2024,
    mileage: 6100,
    price: 33250.0,
    fuelType: 'HYBRID',
    imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    make: 'Audi',
    model: 'Q7 TDI Quattro',
    year: 2020,
    mileage: 48000,
    price: 39800.0,
    fuelType: 'DIESEL',
    imageUrl: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    make: 'Hyundai',
    model: 'Ioniq 5 AWD',
    year: 2023,
    mileage: 9800,
    price: 41500.0,
    fuelType: 'ELECTRIC',
    imageUrl: 'https://images.unsplash.com/photo-1669894452140-547e627f12e1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7,
    make: 'Mercedes-Benz',
    model: 'C300 4MATIC',
    year: 2022,
    mileage: 21400,
    price: 37900.0,
    fuelType: 'GASOLINE',
    imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8,
    make: 'Volvo',
    model: 'XC60 Recharge Ultimate',
    year: 2023,
    mileage: 14300,
    price: 49700.0,
    fuelType: 'PLUGIN_HYBRID',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
];

const LOCAL_STORAGE_KEY = 'car_marketplace_demo_cars';

function getDemoStore() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_CARS));
      return [...INITIAL_DEMO_CARS];
    }
    return JSON.parse(raw);
  } catch {
    return [...INITIAL_DEMO_CARS];
  }
}

function saveDemoStore(cars) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cars));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}

export function resetDemoStore() {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {}
  return [...INITIAL_DEMO_CARS];
}

/**
 * Handle API responses and extract RFC 7807 ProblemDetail if error occurred.
 */
async function handleResponse(response) {
  if (response.ok) {
    if (response.status === 204) return null;
    return await response.json();
  }

  let problem;
  try {
    problem = await response.json();
  } catch {
    problem = {
      status: response.status,
      title: response.statusText || 'Request Error',
      detail: `Server returned status ${response.status}`,
    };
  }

  throw new ProblemDetailError(problem);
}

/**
 * Retrieve a list of cars matching optional filters.
 * Query params: make, maxPrice, minYear
 */
export async function getCars({ make, maxPrice, minYear } = {}) {
  const params = new URLSearchParams();
  if (make && make.trim()) params.append('make', make.trim());
  if (maxPrice !== undefined && maxPrice !== '' && maxPrice !== null) {
    params.append('maxPrice', maxPrice);
  }
  if (minYear !== undefined && minYear !== '' && minYear !== null) {
    params.append('minYear', minYear);
  }

  const url = params.toString() ? `${API_BASE}?${params.toString()}` : API_BASE;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await handleResponse(res);
    return { data, isDemo: false };
  } catch (error) {
    // If backend connection fails, provide graceful fallback demo data
    if (error.name !== 'ProblemDetailError') {
      console.info('Backend unreachable, falling back to demo data mode.');
      let cars = getDemoStore();

      if (make && make.trim()) {
        const query = make.trim().toLowerCase();
        cars = cars.filter(
          (c) =>
            c.make.toLowerCase().includes(query) ||
            c.model.toLowerCase().includes(query)
        );
      }
      if (maxPrice !== undefined && maxPrice !== '' && maxPrice !== null) {
        const max = Number(maxPrice);
        if (!isNaN(max) && max > 0) {
          cars = cars.filter((c) => c.price <= max);
        }
      }
      if (minYear !== undefined && minYear !== '' && minYear !== null) {
        const min = Number(minYear);
        if (!isNaN(min) && min > 0) {
          cars = cars.filter((c) => c.year >= min);
        }
      }

      return { data: cars, isDemo: true, originalError: error };
    }
    throw error;
  }
}

/**
 * Retrieve car details by ID
 */
export async function getCarById(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    const data = await handleResponse(res);
    return { data, isDemo: false };
  } catch (error) {
    if (error.name !== 'ProblemDetailError') {
      const cars = getDemoStore();
      const car = cars.find((c) => String(c.id) === String(id));
      if (!car) {
        throw new ProblemDetailError({
          status: 404,
          title: 'Not Found',
          detail: `Car with ID ${id} not found in demo catalog`,
          instance: `${API_BASE}/${id}`,
        });
      }
      return { data: car, isDemo: true };
    }
    throw error;
  }
}

/**
 * Create a new car listing.
 * Payload: { make, model, year, mileage, price, fuelType, imageUrl }
 */
export async function createCar(carData) {
  const payload = {
    make: carData.make?.trim(),
    model: carData.model?.trim(),
    year: Number(carData.year),
    mileage: Number(carData.mileage),
    price: Number(carData.price),
    fuelType: carData.fuelType,
    ...(carData.imageUrl?.trim() ? { imageUrl: carData.imageUrl.trim() } : {}),
  };

  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, application/problem+json',
      },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse(res);
    return { data, isDemo: false };
  } catch (error) {
    if (error.name !== 'ProblemDetailError') {
      // Offline fallback: validate and save in demo store
      const errors = [];
      if (!payload.make) errors.push('make is required');
      if (!payload.model) errors.push('model is required');
      if (!payload.year || payload.year < 1900 || payload.year > 2100) {
        errors.push('year must be between 1900 and 2100');
      }
      if (payload.mileage === undefined || payload.mileage < 0) {
        errors.push('mileage must be greater than or equal to 0');
      }
      if (payload.price === undefined || payload.price < 0) {
        errors.push('price must be greater than or equal to 0');
      }
      if (!payload.fuelType) {
        errors.push('fuelType is required');
      }

      if (errors.length > 0) {
        throw new ProblemDetailError({
          status: 400,
          title: 'Bad Request',
          detail: 'Invalid input parameters',
          instance: API_BASE,
          errors,
        });
      }

      const cars = getDemoStore();
      const newCar = {
        ...payload,
        id: cars.length > 0 ? Math.max(...cars.map((c) => c.id || 0)) + 1 : 1,
        imageUrl:
          payload.imageUrl ||
          'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      };
      cars.unshift(newCar);
      saveDemoStore(cars);
      return { data: newCar, isDemo: true };
    }
    throw error;
  }
}

/**
 * Health check helper to test backend connection.
 */
export async function checkBackendConnection() {
  try {
    const res = await fetch(API_BASE, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}
