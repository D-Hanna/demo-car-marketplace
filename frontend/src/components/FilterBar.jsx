import React from 'react';
import { SearchIcon, ResetIcon, FilterIcon } from './Icons';

export default function FilterBar({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { label: 'All Years', value: '' },
    { label: '2024 or newer', value: '2024' },
    { label: '2023 or newer', value: '2023' },
    { label: '2022 or newer', value: '2022' },
    { label: '2020 or newer', value: '2020' },
    { label: '2018 or newer', value: '2018' },
    { label: '2015 or newer', value: '2015' },
    { label: '2010 or newer', value: '2010' },
  ];

  const hasActiveFilters = Boolean(
    (filters.make && filters.make.trim()) ||
    filters.maxPrice ||
    filters.minYear
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-5 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-200">
          <FilterIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Filter Inventory</h2>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium px-2 py-0.5 rounded-full ml-1 border border-slate-200 dark:border-slate-700">
            {totalResults} {totalResults === 1 ? 'vehicle' : 'vehicles'} found
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 space-x-1.5 transition-colors cursor-pointer self-start md:self-auto"
          >
            <ResetIcon className="w-3.5 h-3.5" />
            <span>Reset all filters</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
        {/* Make Search Input */}
        <div className="lg:col-span-4">
          <label htmlFor="make-search" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Make / Manufacturer
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="make-search"
              placeholder="e.g. Tesla, BMW, Porsche..."
              value={filters.make || ''}
              onChange={(e) => onFilterChange('make', e.target.value)}
              className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {filters.make && (
              <button
                type="button"
                onClick={() => onFilterChange('make', '')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Max Price Slider & Value */}
        <div className="lg:col-span-5">
          <div className="flex justify-between items-center mb-1.5">
            <label htmlFor="max-price-range" className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              Max Price
            </label>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-400 font-mono">
              {filters.maxPrice
                ? `$${Number(filters.maxPrice).toLocaleString()}`
                : 'Any Price'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              id="max-price-range"
              type="range"
              min="10000"
              max="150000"
              step="2500"
              value={filters.maxPrice || '150000'}
              onChange={(e) => onFilterChange('maxPrice', e.target.value)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="relative w-28 shrink-0">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-xs text-slate-400 dark:text-slate-500">
                $
              </span>
              <input
                type="number"
                min="0"
                step="1000"
                placeholder="150,000"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-6 pr-2 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>

        {/* Min Year Dropdown */}
        <div className="lg:col-span-3">
          <label htmlFor="min-year-select" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Minimum Year
          </label>
          <select
            id="min-year-select"
            value={filters.minYear || ''}
            onChange={(e) => onFilterChange('minYear', e.target.value)}
            className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {yearOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
