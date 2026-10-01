import React, { useState, useEffect } from 'react';
import { CloseIcon, AlertCircleIcon, PlusIcon, SparklesIcon } from './Icons';

const FUEL_TYPES = [
  { value: 'GASOLINE', label: 'Gasoline' },
  { value: 'DIESEL', label: 'Diesel' },
  { value: 'ELECTRIC', label: 'Electric' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'PLUGIN_HYBRID', label: 'Plug-in Hybrid' },
];

const PRESETS = [
  {
    label: 'EV Sample (Lucid Air)',
    data: {
      make: 'Lucid',
      model: 'Air Pure AWD',
      year: 2024,
      mileage: 3200,
      price: 69900,
      fuelType: 'ELECTRIC',
      imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    label: 'Sports Sample (BMW M4)',
    data: {
      make: 'BMW',
      model: 'M4 Competition',
      year: 2023,
      mileage: 8500,
      price: 76500,
      fuelType: 'GASOLINE',
      imageUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    label: 'Hybrid SUV (Lexus RX)',
    data: {
      make: 'Lexus',
      model: 'RX 500h F Sport',
      year: 2023,
      mileage: 11000,
      price: 58900,
      fuelType: 'HYBRID',
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    },
  },
];

export default function CreateCarModal({ isOpen, onClose, onSubmitCar }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: '',
    price: '',
    fuelType: 'ELECTRIC',
    imageUrl: '',
  });

  const [clientErrors, setClientErrors] = useState({});
  const [serverProblem, setServerProblem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (clientErrors[field]) {
      setClientErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (field === 'imageUrl') {
      setPreviewError(false);
    }
  }

  function applyPreset(preset) {
    setFormData(preset.data);
    setClientErrors({});
    setServerProblem(null);
    setPreviewError(false);
  }

  function validate() {
    const errors = {};
    if (!formData.make.trim()) {
      errors.make = 'Make is required (e.g. Porsche)';
    } else if (formData.make.length > 100) {
      errors.make = 'Make cannot exceed 100 characters';
    }

    if (!formData.model.trim()) {
      errors.model = 'Model is required (e.g. 911 Carrera)';
    } else if (formData.model.length > 100) {
      errors.model = 'Model cannot exceed 100 characters';
    }

    const yearNum = Number(formData.year);
    if (!formData.year || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
      errors.year = 'Year must be between 1900 and 2100';
    }

    const mileageNum = Number(formData.mileage);
    if (formData.mileage === '' || isNaN(mileageNum) || mileageNum < 0) {
      errors.mileage = 'Mileage is required and must be ≥ 0';
    }

    const priceNum = Number(formData.price);
    if (formData.price === '' || isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price is required and must be > 0';
    }

    if (!formData.fuelType) {
      errors.fuelType = 'Fuel Type is required';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerProblem(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmitCar({
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        mileage: Number(formData.mileage),
        price: Number(formData.price),
        fuelType: formData.fuelType,
        imageUrl: formData.imageUrl.trim() || undefined,
      });
      onClose();
    } catch (err) {
      // Capture RFC 7807 ProblemDetail error
      if (err.name === 'ProblemDetailError') {
        setServerProblem({
          title: err.title || 'Validation Error',
          detail: err.detail || 'The request could not be processed.',
          errors: err.errors || [],
          status: err.status,
        });
      } else {
        setServerProblem({
          title: 'Request Failed',
          detail: err.message || 'Unable to submit listing. Please try again.',
          errors: [],
          status: 500,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 dark:border-slate-800 transform transition-all my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <PlusIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">List a Vehicle</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Publish a new car listing to the marketplace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-6 sm:px-8 py-3 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-400 dark:text-slate-400 font-medium flex items-center shrink-0">
            <SparklesIcon className="w-3.5 h-3.5 mr-1 text-amber-500" />
            Quick fill:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-700 dark:hover:text-blue-300 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-medium whitespace-nowrap transition-colors cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* RFC 7807 Server ProblemDetail Error Banner */}
        {serverProblem && (
          <div className="mx-6 sm:mx-8 mt-4 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-800 dark:text-red-200 animate-fadeIn">
            <div className="flex items-start space-x-2">
              <AlertCircleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block text-sm">
                  {serverProblem.title} {serverProblem.status ? `(${serverProblem.status})` : ''}
                </span>
                <p className="mt-0.5 text-red-700 dark:text-red-300">{serverProblem.detail}</p>
                {serverProblem.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside space-y-0.5 font-medium text-red-800 dark:text-red-300">
                    {serverProblem.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Make */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Make <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Tesla"
                value={formData.make}
                onChange={(e) => handleChange('make', e.target.value)}
                className={`block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  clientErrors.make
                    ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {clientErrors.make && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{clientErrors.make}</p>
              )}
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="e.g. Model 3"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                className={`block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  clientErrors.model
                    ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {clientErrors.model && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{clientErrors.model}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1900"
                max="2100"
                required
                placeholder="2023"
                value={formData.year}
                onChange={(e) => handleChange('year', e.target.value)}
                className={`block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  clientErrors.year
                    ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {clientErrors.year && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{clientErrors.year}</p>
              )}
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fuel Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.fuelType}
                onChange={(e) => handleChange('fuelType', e.target.value)}
                className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {FUEL_TYPES.map((ft) => (
                  <option key={ft.value} value={ft.value}>
                    {ft.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price ($) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Price (USD $) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 dark:text-slate-500 text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="38990.00"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className={`block w-full rounded-xl border pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    clientErrors.price
                      ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-500/20'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                />
              </div>
              {clientErrors.price && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{clientErrors.price}</p>
              )}
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mileage (miles) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                placeholder="12500"
                value={formData.mileage}
                onChange={(e) => handleChange('mileage', e.target.value)}
                className={`block w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  clientErrors.mileage
                    ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/30 text-red-900 dark:text-red-200 focus:ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-blue-500 focus:ring-blue-500/20'
                }`}
              />
              {clientErrors.mileage && (
                <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{clientErrors.mileage}</p>
              )}
            </div>
          </div>

          {/* Image URL Input & Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Image URL <span className="text-slate-400 dark:text-slate-500 font-normal">(optional photo link)</span>
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            {/* Live Preview Container */}
            {formData.imageUrl && (
              <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center space-x-3">
                <div className="w-16 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    onError={() => setPreviewError(true)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                    {previewError ? 'Image preview unavailable' : 'Image loaded successfully'}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs block">
                    {previewError ? 'Will use standard marketplace placeholder' : formData.imageUrl}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center space-x-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Listing...</span>
                </>
              ) : (
                <>
                  <PlusIcon className="w-4 h-4" />
                  <span>Publish Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
