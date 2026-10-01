import React, { useEffect, useState } from 'react';
import { CloseIcon, CalendarIcon, GaugeIcon, FuelIcon, CheckCircleIcon, SparklesIcon } from './Icons';
import { getFuelBadgeConfig } from './CarCard';

export default function CarDetailModal({ car, onClose }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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

  // Simple estimated monthly payment (60-mo term at 5.5% interest)
  const estimatedMonthly = Math.round((car.price * 1.1) / 60);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200/90 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
          <img
            src={imgError || !car.imageUrl ? fallbackImage : car.imageUrl}
            alt={`${car.make} ${car.model}`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          {/* Overlay info */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-md ${badge.classes}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                  <span>{badge.label}</span>
                </span>
                <span className="text-xs text-white/80 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full font-medium">
                  VIN ID #{car.id}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {car.year} {car.make} {car.model}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-300 block uppercase tracking-wider font-semibold">
                Cash Price
              </span>
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {formattedPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <CalendarIcon className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[11px] uppercase font-bold text-slate-500">Model Year</span>
              <span className="text-base font-extrabold text-slate-800">{car.year}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <GaugeIcon className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[11px] uppercase font-bold text-slate-500">Mileage</span>
              <span className="text-base font-extrabold text-slate-800">{formattedMileage} mi</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
              <FuelIcon className="w-5 h-5 text-blue-600 mb-1" />
              <span className="text-[11px] uppercase font-bold text-slate-500">Powertrain</span>
              <span className="text-base font-extrabold text-slate-800 truncate max-w-full">
                {badge.label}
              </span>
            </div>
          </div>

          {/* Financing & Inspection Guarantee Box */}
          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-2xl p-4 border border-blue-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Est. Financing: <span className="text-blue-700">${estimatedMonthly}/mo</span>
                </p>
                <p className="text-[11px] text-slate-600">
                  Includes 150-Point Certified Pre-Purchase Inspection & 12-Month Powertrain Warranty.
                </p>
              </div>
            </div>
          </div>

          {/* Included Features List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Marketplace Guarantees
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Clean Title Guaranteed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>CARFAX Vehicle History Report</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>7-Day / 250-Mile Return Policy</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Complimentary Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end space-x-3 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert(`Inquiry sent for ${car.year} ${car.make} ${car.model}! Our concierge will contact you.`);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Contact Dealer / Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
