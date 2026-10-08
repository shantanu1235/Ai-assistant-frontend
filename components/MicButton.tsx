'use client';

import React from 'react';

interface MicButtonProps {
  isListening: boolean;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MicButton({
  isListening,
  onClick,
  disabled = false,
  size = 'md'
}: MicButtonProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  }[size];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Start voice command'}
      className={`relative group flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${
        isListening
          ? 'bg-gradient-to-tr from-cyan-400 to-sky-500 text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.7)] scale-105'
          : 'bg-slate-900/90 text-cyan-400 border border-cyan-500/40 hover:border-cyan-300 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
      }`}
    >
      {/* Outer Pulse Ping when listening */}
      {isListening && (
        <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-60 pointer-events-none" />
      )}

      {/* SVG Microphone Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`relative z-10 transition-transform group-hover:scale-110 ${iconSizes}`}
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    </button>
  );
}
