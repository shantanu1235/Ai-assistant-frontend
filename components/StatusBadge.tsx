'use client';

import React from 'react';

interface StatusBadgeProps {
  isConnected?: boolean;
  label?: string;
  sublabel?: string;
}

export default function StatusBadge({
  isConnected = true,
  label = 'PC CONTROL:',
  sublabel = 'CONNECTED'
}: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-slate-900/70 border border-cyan-500/25 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300 hover:border-cyan-400/40">
      {/* Laptop / Monitor Icon Container */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[inset_0_0_12px_rgba(6,182,212,0.25)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5"
        >
          <rect width="20" height="14" x="2" y="3" rx="2" />
          <line x1="8" x2="16" y1="21" y2="21" />
          <line x1="12" x2="12" y1="17" y2="21" />
        </svg>

        {/* Pulse Dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          {isConnected && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${
              isConnected ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-rose-500'
            }`}
          ></span>
        </span>
      </div>

      {/* Status Details */}
      <div className="flex flex-col">
        <span className="text-[10px] tracking-wider font-semibold text-slate-400 uppercase">
          {label}
        </span>
        <span
          className={`text-sm font-bold tracking-widest ${
            isConnected
              ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
              : 'text-rose-400'
          }`}
        >
          {sublabel}
        </span>
      </div>
    </div>
  );
}
