import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import CarCard from './components/CarCard';
import CarDetailModal from './components/CarDetailModal';
import CreateCarModal from './components/CreateCarModal';
import { getCars, createCar, checkBackendConnection } from './api/carApi';
import { AlertCircleIcon, CheckCircleIcon, CarIcon, SparklesIcon } from './components/Icons';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [toast, setToast] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    make: '',
    maxPrice: '',
    minYear: '',
  });

  // Modal states
  const [selectedCar, setSelectedCar] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Load cars with current filters
  const loadCars = useCallback(async (activeFilters = filters) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await getCars(activeFilters);
      setCars(res.data);
      setIsDemoMode(res.isDemo);
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

  // Retry connecting to live backend API
  const handleRetryConnection = async () => {
    setIsConnecting(true);
    try {
      const isUp = await checkBackendConnection();
      if (isUp) {
        setIsDemoMode(false);
        setToast({
          type: 'success',
          message: 'Connected to live Spring Boot backend API at localhost:8080!',
        });
        loadCars();
      } else {
        setToast({
          type: 'info',
          message: 'Backend API is still offline. Continuing with demo dataset.',
        });
      }
    } catch {
      setToast({
        type: 'info',
        message: 'Could not connect to backend server. Operating in Demo Mode.',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Submit new car handler
  const handleCreateCar = async (newCarData) => {
    const res = await createCar(newCarData);
    setToast({
      type: 'success',
      message: `Successfully listed ${res.data.year} ${res.data.make} ${res.data.model}!`,
    });
    // Refresh list
    await loadCars();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-md animate-bounce-short">
          <div
            className={`p-4 rounded-2xl shadow-xl border flex items-center space-x-3 ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 text-white border-emerald-700 backdrop-blur-md'
                : 'bg-slate-900/90 text-white border-slate-700 backdrop-blur-md'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <SparklesIcon className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <p className="text-xs font-semibold flex-1">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white text-xs cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        isDemoMode={isDemoMode}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRetryConnection={handleRetryConnection}
        isConnecting={isConnecting}
        isDark={isDark}
        theme={theme}
        onToggleTheme={toggleTheme}
        toggleTheme={toggleTheme}
      />

      {/* Demo Mode Notice Bar (if in demo mode) */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 dark:from-amber-500/20 dark:via-amber-500/10 dark:to-amber-500/20 border-b border-amber-200/60 dark:border-amber-800/60 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-xs text-amber-900 dark:text-amber-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block"></span>
            <span>
              <strong>Demo Fallback Active:</strong> Backend API at{' '}
              <code className="bg-amber-100/80 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 px-1 py-0.5 rounded text-[11px] font-mono text-amber-950 dark:text-amber-200">
                http://localhost:8080/api/v1/cars
              </code>{' '}
              is not responding. Serving realistic demo data with local storage simulation.
            </span>
            <button
              onClick={handleRetryConnection}
              disabled={isConnecting}
              className="underline text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 font-bold ml-1 cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? 'Checking...' : 'Reconnect Now'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Headline */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Find Your Next Vehicle
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
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

        {/* RFC 7807 Error Banner (if error occurred during query) */}
        {apiError && (
          <div className="mb-8 p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 shadow-xs">
            <div className="flex items-start space-x-3">
              <AlertCircleIcon className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base text-red-900 dark:text-red-100">
                  {apiError.title} {apiError.status ? `(Status ${apiError.status})` : ''}
                </h3>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">{apiError.detail}</p>
                {apiError.errors && apiError.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-xs space-y-1 text-red-800 dark:text-red-300">
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
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs animate-pulse flex flex-col space-y-3"
              >
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-full mt-2" />
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
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
              <CarIcon className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No vehicles match your criteria</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
              Try adjusting your price range, year minimum, or search keyword to see more results.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
              >
                List a New Car
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Quick View Detail Modal */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}

      {/* Add New Car Modal */}
      <CreateCarModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitCar={handleCreateCar}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">AutoMarket PoC</span>
            <span>&bull;</span>
            <span>Contract-First Architecture</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400 dark:text-slate-500">Specification: OpenAPI 3.0.3</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              /specs/car-marketplace-api.yaml
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
