import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from '../components/FilterBar';
import CarCard from '../components/CarCard';
import CarDetailModal from '../components/CarDetailModal';
import { getCars } from '../api/carApi';
import { AlertCircleIcon, CarIcon } from '../components/Icons';

export default function CarListPage({ onOpenCreateModal }) {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    make: '',
    maxPrice: '',
    minYear: '',
  });

  // Load cars with current filters
  const loadCars = useCallback(async (activeFilters = filters) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await getCars(activeFilters);
      setCars(res.data);
    } catch (err) {
      if (err.name === 'ProblemDetailError') {
        setApiError({
          title: err.title || 'Error Loading Vehicles',
          detail: err.detail || 'Could not retrieve vehicle list from server.',
          status: err.status,
          errors: err.errors || [],
        });
      } else {
        setApiError({
          title: 'Connection Error',
          detail: err.message || 'Failed to load vehicles from marketplace API.',
          status: 500,
          errors: [],
        });
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    loadCars(filters);
  }, [loadCars]);

  // Filter change handlers
  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
  };

  const handleResetFilters = () => {
    const cleared = { make: '', maxPrice: '', minYear: '' };
    setFilters(cleared);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Headline */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Find Your Next Vehicle
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Explore certified premium vehicles, filter by powertrain & pricing, and list new cars
          in seconds adhering directly to the OpenAPI 3.0 specification.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalResults={cars.length}
      />

      {/* RFC 7807 Error Banner */}
      {apiError && (
        <div className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-200 text-red-900 shadow-xs">
          <div className="flex items-start space-x-3">
            <AlertCircleIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base">
                {apiError.title} {apiError.status ? `(Status ${apiError.status})` : ''}
              </h3>
              <p className="text-xs text-red-700 mt-1">{apiError.detail}</p>
              {apiError.errors && apiError.errors.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-xs space-y-1 text-red-800">
                  {apiError.errors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => loadCars()}
                className="mt-3 text-xs font-semibold px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cars Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs animate-pulse flex flex-col space-y-3"
            >
              <div className="w-full aspect-[16/10] bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded-md w-3/4" />
              <div className="h-6 bg-slate-200 rounded-md w-1/2" />
              <div className="h-8 bg-slate-100 rounded-lg w-full mt-2" />
            </div>
          ))}
        </div>
      ) : cars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelectCar={(c) => setSelectedCar(c)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <CarIcon className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No vehicles match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Try adjusting your price range, year minimum, or search keyword to see more results.
          </p>
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
            {onOpenCreateModal && (
              <button
                onClick={onOpenCreateModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                List a New Car
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quick View Detail Modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  );
}
