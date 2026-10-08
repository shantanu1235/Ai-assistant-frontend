'use client';

import React, { useState } from 'react';
import MicButton from './MicButton';

interface CommandInputProps {
  onSendCommand: (command: string) => void;
  isListening: boolean;
  onToggleListen: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function CommandInput({
  onSendCommand,
  isListening,
  onToggleListen,
  disabled = false,
  placeholder = 'Type a command (e.g. "Open Chrome", "Calculator")...'
}: CommandInputProps) {
  const [inputVal, setInputVal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || disabled) return;
    onSendCommand(inputVal.trim());
    setInputVal('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-2xl mx-auto p-1.5 rounded-full bg-slate-950/80 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.15)] focus-within:border-cyan-400 focus-within:shadow-[0_0_35px_rgba(34,211,238,0.3)] transition-all duration-300"
    >
      {/* Mic Trigger */}
      <div className="pl-1">
        <MicButton
          isListening={isListening}
          onClick={onToggleListen}
          disabled={disabled}
          size="md"
        />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        disabled={disabled || isListening}
        placeholder={isListening ? 'Listening to voice...' : placeholder}
        className="flex-1 bg-transparent px-4 py-2 text-sm md:text-base text-slate-100 placeholder-slate-500 focus:outline-none disabled:opacity-50"
      />

      {/* Submit / Send Button */}
      <button
        type="submit"
        disabled={!inputVal.trim() || disabled}
        className="flex items-center justify-center w-11 h-11 mr-1 rounded-full bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/40 hover:text-cyan-100 border border-cyan-500/30 transition-all duration-200 disabled:opacity-30 disabled:hover:bg-cyan-500/20 disabled:cursor-not-allowed"
        title="Send command"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 ml-0.5"
        >
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      </button>
    </form>
  );
}
