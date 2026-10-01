import React, { useState } from 'react';
import { CalendarIcon, GaugeIcon, FuelIcon, EyeIcon } from './Icons';

export function getFuelBadgeConfig(fuelType) {
  switch (fuelType) {
    case 'ELECTRIC':
      return {
        label: 'Electric',
        classes: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/70',
        dot: 'bg-emerald-500',
      };
    case 'HYBRID':
      return {
        label: 'Hybrid',
        classes: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/70',
        dot: 'bg-blue-500',
      };
    case 'PLUGIN_HYBRID':
      return {
        label: 'Plug-in Hybrid',
        classes: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/70',
        dot: 'bg-purple-500',
      };
    case 'DIESEL':
      return {
        label: 'Diesel',
        classes: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        dot: 'bg-slate-500',
      };
    case 'GASOLINE':
    default:
      return {
        label: 'Gasoline',
        classes: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/70',
        dot: 'bg-amber-500',
      };
  }
}

export default function CarCard({ car, onSelectCar }) {
  const [imgError, setImgError] = useState(false);
  const badge = getFuelBadgeConfig(car.fuelType);

  const fallbackImage =
    'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80';

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(car.price || 0);

  const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage || 0);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgError || !car.imageUrl ? fallbackImage : car.imageUrl}
          alt={`${car.make} ${car.model}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs ${badge.classes}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
            <span>{badge.label}</span>
          </span>

          <span className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-xs">
            {car.year}
          </span>
        </div>

        {/* Hover Quick View Trigger */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={() => onSelectCar(car)}
            className="w-full py-2 px-3 bg-white/95 hover:bg-white text-slate-900 dark:bg-slate-900/95 dark:hover:bg-slate-900 dark:text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <EyeIcon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Quick View Specs</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {car.make} {car.model}
            </h3>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight text-blue-900 dark:text-blue-400 mb-4">
            {formattedPrice}
          </div>

          {/* Key Specs Row */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 py-3 border-y border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center space-x-2">
              <GaugeIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{formattedMileage} mi</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>Year {car.year}</span>
            </div>
            <div className="flex items-center space-x-2 col-span-2">
              <FuelIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span className="truncate">Fuel: {badge.label}</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onSelectCar(car)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white border border-transparent dark:border-blue-900/40 active:bg-blue-700 transition-all duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <span>View Details & Specs</span>
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
