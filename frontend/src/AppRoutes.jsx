import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateCarModal from './components/CreateCarModal';
import CarListPage from './pages/CarListPage';
import CarDetailPage from './pages/CarDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { createCar, checkBackendConnection } from './api/carApi';
import { CheckCircleIcon, SparklesIcon } from './components/Icons';

export default function AppRoutes() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-blue-600 selection:text-white">
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
      />

      {/* Demo Mode Notice Bar (if in demo mode) */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 border-b border-amber-200/60 py-2.5 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2 text-xs text-amber-900 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block"></span>
            <span>
              <strong>Demo Fallback Active:</strong> Backend API at{' '}
              <code className="bg-amber-100/80 px-1 py-0.5 rounded text-[11px] font-mono">
                http://localhost:8080/api/v1/cars
              </code>{' '}
              is not responding. Serving realistic demo data with local storage simulation.
            </span>
            <button
              onClick={handleRetryConnection}
              disabled={isConnecting}
              className="underline text-amber-800 hover:text-amber-950 font-bold ml-1 cursor-pointer disabled:opacity-50"
            >
              {isConnecting ? 'Checking...' : 'Reconnect Now'}
            </button>
          </div>
        </div>
      )}

      {/* Route Views */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={<CarListPage onOpenCreateModal={() => setIsCreateModalOpen(true)} />}
          />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Add New Car Modal */}
      <CreateCarModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitCar={handleCreateCar}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">AutoMarket PoC</span>
            <span>&bull;</span>
            <span>Contract-First Architecture</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Specification: OpenAPI 3.0.3</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px]">
              /specs/car-marketplace-api.yaml
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
