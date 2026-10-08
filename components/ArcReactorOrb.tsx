'use client';

import React from 'react';

export type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking';

interface ArcReactorOrbProps {
  status: AssistantState;
  onClick?: () => void;
  statusText?: string;
}

export default function ArcReactorOrb({
  status = 'idle',
  onClick,
  statusText
}: ArcReactorOrbProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'from-cyan-400 via-sky-500 to-indigo-500 shadow-[0_0_60px_rgba(6,182,212,0.45)] border-cyan-400';
      case 'processing':
        return 'from-amber-400 via-orange-500 to-cyan-500 shadow-[0_0_60px_rgba(245,158,11,0.45)] border-amber-400';
      case 'speaking':
        return 'from-emerald-400 via-teal-400 to-cyan-500 shadow-[0_0_60px_rgba(45,212,191,0.5)] border-emerald-400';
      default:
        return 'from-cyan-500/40 via-blue-600/30 to-indigo-700/30 shadow-[0_0_40px_rgba(6,182,212,0.25)] border-cyan-500/30';
    }
  };

  const getSubLabel = () => {
    if (statusText) return statusText;
    switch (status) {
      case 'listening':
        return 'LISTENING TO VOICE...';
      case 'processing':
        return 'PROCESSING COMMAND...';
      case 'speaking':
        return 'SPEAKING RESPONSE...';
      default:
        return 'TAP TO ACTIVATE';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-8">
      {/* Outer Glow Halo */}
      <div
        className={`absolute w-72 h-72 md:w-88 md:h-88 rounded-full blur-3xl opacity-30 transition-all duration-700 bg-gradient-to-tr ${
          status === 'listening'
            ? 'from-cyan-500 to-blue-500'
            : status === 'speaking'
            ? 'from-emerald-400 to-cyan-500'
            : status === 'processing'
            ? 'from-amber-400 to-cyan-400'
            : 'from-blue-600/50 to-cyan-600/30'
        }`}
      />

      {/* Main Interactive Orb Body */}
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="group relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 rounded-full cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
      >
        {/* Ring 1 - Outermost Rotating Dashed Arc */}
        <div
          className={`absolute inset-0 rounded-full border border-dashed border-cyan-400/30 ${
            status === 'processing'
              ? 'animate-spin'
              : status === 'listening'
              ? 'animate-[spin_4s_linear_infinite]'
              : 'animate-[spin_16s_linear_infinite]'
          }`}
        />

        {/* Ring 2 - Counter-Rotating Segmented Tech Ring */}
        <div
          className={`absolute inset-2 rounded-full border border-t-cyan-400/80 border-r-transparent border-b-cyan-500/40 border-l-transparent ${
            status === 'processing'
              ? 'animate-[spin_2s_linear_infinite_reverse]'
              : 'animate-[spin_8s_linear_infinite_reverse]'
          }`}
        />

        {/* Ring 3 - Glowing Core Container */}
        <div
          className={`relative flex items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-full bg-slate-950/90 border-2 backdrop-blur-2xl transition-all duration-500 ${getStatusColor()}`}
        >
          {/* Inner holographic glass shine */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

          {/* Sound Frequency Wave Bars in Center */}
          <div className="flex items-center justify-center gap-1.5 md:gap-2 h-16 z-10 px-4">
            {[45, 80, 55, 95, 60, 100, 75, 50, 85].map((height, i) => {
              const isWaveActive = status === 'listening' || status === 'speaking';
              return (
                <div
                  key={i}
                  className={`w-1 md:w-1.5 rounded-full transition-all duration-200 ${
                    status === 'listening'
                      ? 'bg-cyan-300 shadow-[0_0_8px_#67e8f9]'
                      : status === 'speaking'
                      ? 'bg-emerald-300 shadow-[0_0_8px_#6ee7b7]'
                      : status === 'processing'
                      ? 'bg-amber-300 shadow-[0_0_8px_#fcd34d]'
                      : 'bg-cyan-500/40'
                  }`}
                  style={{
                    height: isWaveActive
                      ? `${Math.max(12, (height * (i % 2 === 0 ? 0.9 : 1.1)) * 0.55)}px`
                      : '14px',
                    animation: isWaveActive
                      ? `pulse ${0.4 + (i % 4) * 0.15}s ease-in-out infinite alternate`
                      : 'none'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Status Text Below Orb */}
      <div className="mt-6 flex flex-col items-center text-center">
        <span className="text-[11px] tracking-[0.25em] font-bold text-cyan-400/90 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)] uppercase">
          {getSubLabel()}
        </span>
        <span className="text-xs text-slate-400 mt-1">
          {status === 'listening'
            ? 'Speak your command now...'
            : 'Click the core to begin voice control'}
        </span>
      </div>
    </div>
  );
}
