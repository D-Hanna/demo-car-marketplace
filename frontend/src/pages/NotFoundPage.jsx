import React from 'react';
import { Link } from 'react-router-dom';
import { CarIcon } from '../components/Icons';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
          <CarIcon className="w-8 h-8 text-blue-600" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-3">
          Error 404
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The vehicle or page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md shadow-blue-500/20 transition-all cursor-pointer w-full sm:w-auto"
        >
          Return to Marketplace
        </Link>
      </div>
    </div>
  );
}
