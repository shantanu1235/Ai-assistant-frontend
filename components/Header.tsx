'use client';

import React from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({
  title = 'JARVIS AI',
  subtitle = 'VOICE LAPTOP CONTROLLER'
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between w-full py-4 px-6 md:px-10 border-b border-cyan-500/15 bg-slate-950/40 backdrop-blur-xl">
      {/* Brand & Glowing Icon */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
        </div>

        <div className="flex flex-col">
          <h1 className="text-base md:text-lg font-black tracking-[0.2em] text-slate-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
            {title}
          </h1>
          <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase">
            {subtitle}
          </span>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/20 text-[11px] font-mono text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span>GEMINI CORE: ONLINE</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          <span>SYS PORT: 5000</span>
        </div>
      </div>
    </header>
  );
}
