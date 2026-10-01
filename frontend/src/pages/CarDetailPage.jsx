import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCarById, ProblemDetailError } from '../api/carApi';
import { getFuelBadgeConfig } from '../components/CarCard';
import {
  CalendarIcon,
  GaugeIcon,
  FuelIcon,
  CheckCircleIcon,
  SparklesIcon,
  AlertCircleIcon,
  CarIcon,
} from '../components/Icons';

export default function CarDetailPage() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchCar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCarById(id);
      setCar(res.data);
    } catch (err) {
      if (err instanceof ProblemDetailError || err.name === 'ProblemDetailError') {
        setError({
          status: err.status || 500,
          title: err.title || 'Error Loading Vehicle',
          detail: err.detail || 'Could not load vehicle details.',
          errors: err.errors || [],
        });
      } else {
        setError({
          status: 500,
          title: 'Network Error',
          detail: err.message || 'Unable to connect to the server.',
          errors: [],
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCar();
  }, [fetchCar]);

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div data-testid="car-detail-skeleton" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded-md w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-[16/10] bg-slate-200 rounded-3xl" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-200 rounded-2xl" />
              <div className="h-24 bg-slate-200 rounded-2xl" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-10 bg-slate-200 rounded-xl w-3/4" />
            <div className="h-12 bg-slate-200 rounded-xl w-1/2" />
            <div className="h-40 bg-slate-200 rounded-2xl" />
            <div className="h-12 bg-slate-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 404 Not Found State
  if (error && error.status === 404) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
            <CarIcon className="w-8 h-8 text-amber-500" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-3">
            Error 404
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
            Vehicle Not Found
          </h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            {error.detail || `We could not find any vehicle matching catalog ID #${id}. It may have been sold or removed.`}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/20 transition-all cursor-pointer w-full sm:w-auto"
            >
              Return to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // General Server / Network Error State
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-6 rounded-3xl bg-red-50 border border-red-200 text-red-900 shadow-sm">
          <div className="flex items-start space-x-4">
            <AlertCircleIcon className="w-7 h-7 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-lg">
                {error.title} {error.status ? `(Status ${error.status})` : ''}
              </h3>
              <p className="text-sm text-red-700 mt-1">{error.detail}</p>
              {error.errors && error.errors.length > 0 && (
                <ul className="mt-3 list-disc list-inside text-xs space-y-1 text-red-800">
                  {error.errors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex items-center space-x-4">
                <button
                  onClick={fetchCar}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Retry Request
                </button>
                <Link
                  to="/"
                  className="text-xs font-semibold text-red-800 hover:text-red-950 underline"
                >
                  Back to Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) return null;

  const badge = getFuelBadgeConfig(car.fuelType);
  const fallbackImage =
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80';

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(car.price || 0);

  const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage || 0);
  const estimatedMonthly = Math.round(((car.price || 0) * 1.1) / 60);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-500">
        <Link to="/" className="text-blue-600 hover:text-blue-800 hover:underline">
          &larr; Back to Listings
        </Link>
        <span>&bull;</span>
        <Link to="/" className="hover:text-slate-800">
          Home
        </Link>
        <span>/</span>
        <Link to="/" className="hover:text-slate-800">
          Inventory
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold truncate max-w-xs">
          {car.year} {car.make} {car.model}
        </span>
      </nav>

      {/* Main Detail Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media & Highlights */}
        <div className="lg:col-span-8 space-y-8">
          {/* Showcase Hero Image */}
          <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-md">
            <img
              src={imgError || !car.imageUrl ? fallbackImage : car.imageUrl}
              alt={`${car.make} ${car.model}`}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            {/* Badges in image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span
                className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${badge.classes}`}
              >
                <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                <span>{badge.label}</span>
              </span>

              <span className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Catalog ID #{car.id}
              </span>
            </div>

            <div className="absolute bottom-4 left-6 right-6 text-white hidden sm:block">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                Certified Pre-Owned
              </span>
              <p className="text-lg font-bold">
                {car.year} {car.make} {car.model}
              </p>
            </div>
          </div>

          {/* Key Metric Highlights Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <CalendarIcon className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-[11px] uppercase font-bold text-slate-400">Model Year</span>
              <span className="text-lg font-extrabold text-slate-800">{car.year}</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <GaugeIcon className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-[11px] uppercase font-bold text-slate-400">Mileage</span>
              <span className="text-lg font-extrabold text-slate-800">{formattedMileage} mi</span>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <FuelIcon className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-[11px] uppercase font-bold text-slate-400">Powertrain</span>
              <span className="text-lg font-extrabold text-slate-800 truncate max-w-full">
                {badge.label}
              </span>
            </div>
          </div>

          {/* Technical Specifications Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <span>Technical Specifications</span>
              <span className="text-xs font-normal text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
                OpenAPI Contract
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Make</span>
                <span className="text-slate-900 font-bold">{car.make}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Model</span>
                <span className="text-slate-900 font-bold">{car.model}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Model Year</span>
                <span className="text-slate-900 font-bold">{car.year}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Odometer Mileage</span>
                <span className="text-slate-900 font-bold">{formattedMileage} mi</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Powertrain / Fuel</span>
                <span className="text-slate-900 font-bold">{badge.label}</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Catalog ID</span>
                <span className="text-slate-900 font-mono font-bold">#{car.id}</span>
              </div>
            </div>
          </div>

          {/* Overview & Inspection Highlights */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Overview & Vehicle Highlights</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                This {car.year} {car.make} {car.model} has been thoroughly inspected according to our
                150-point certified checklist. Guaranteed accident-free frame, clear title history, and
                meticulously maintained powertrain ready for immediate delivery.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Inspection & Protection Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="flex items-center space-x-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>150-Point Certified Mechanical Inspection</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Clean Title & Odometer Verification</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>CARFAX Verified History Report Included</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>7-Day / 250-Mile Full Money-Back Guarantee</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>12-Month / 12,000-Mile Powertrain Warranty</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Complimentary Nationwide Transport Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-md space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                Listing Details
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                {car.year} {car.make} {car.model}
              </h1>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Cash Purchase Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-blue-900 font-mono tracking-tight mt-1">
                {formattedPrice}
              </div>
            </div>

            {/* Estimated Financing */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <SparklesIcon className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">
                  Est. Financing: <span className="text-blue-700">${estimatedMonthly}/mo</span>
                </p>
                <p className="text-slate-500 mt-0.5">
                  Based on 60-mo term at 5.5% APR. Zero down payment options available.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() =>
                  alert(`Inquiry sent for ${car.year} ${car.make} ${car.model}! Our concierge will contact you shortly.`)
                }
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Contact Dealer / Buy</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 transition-colors cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{copied ? '✓ Link Copied to Clipboard!' : 'Copy Share Link'}</span>
              </button>
            </div>

            {/* Guarantees Footnote */}
            <p className="text-[11px] text-center text-slate-400">
              No hidden dealer fees &bull; 100% transparent pricing guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
