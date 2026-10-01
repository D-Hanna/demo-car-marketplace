import React from 'react';
import { CarIcon, PlusIcon } from './Icons';

export default function Navbar({ isDemoMode, onOpenCreateModal, onRetryConnection, isConnecting }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <CarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  AutoMarket
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  OpenAPI 3.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Premium Verified Vehicle Marketplace
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* Status indicator badge */}
            <div className="flex items-center">
              {isDemoMode ? (
                <div
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70"
                  title="Backend at localhost:8080 not reached. Operating in Demo Fallback Mode."
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="font-medium hidden md:inline">Demo Mode</span>
                  <button
                    onClick={onRetryConnection}
                    disabled={isConnecting}
                    className="ml-1 text-[11px] underline text-amber-700 hover:text-amber-900 cursor-pointer disabled:opacity-50"
                  >
                    {isConnecting ? 'Checking...' : 'Retry API'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-medium hidden sm:inline">API Connected</span>
                </div>
              )}
            </div>

            {/* List a Car Action Button */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>List a Car</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
