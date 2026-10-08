'use client';

import React from 'react';

export interface TranscriptItem {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp?: string;
  action?: string | null;
}

interface TranscriptPanelProps {
  transcripts: TranscriptItem[];
  liveTranscript?: string;
  isListening?: boolean;
  onClear?: () => void;
}

export default function TranscriptPanel({
  transcripts,
  liveTranscript = '',
  isListening = false,
  onClear
}: TranscriptPanelProps) {
  return (
    <div className="flex flex-col w-full h-[400px] md:h-[480px] rounded-3xl bg-slate-950/75 border border-cyan-500/20 backdrop-blur-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-cyan-500/15 bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
          <h3 className="text-xs font-bold tracking-[0.2em] text-cyan-300 uppercase">
            Live Voice Transcript
          </h3>
        </div>

        {onClear && transcripts.length > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] text-slate-400 hover:text-cyan-300 transition-colors uppercase tracking-wider"
          >
            Clear
          </button>
        )}
      </div>

      {/* Content Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {transcripts.length === 0 && !liveTranscript && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 text-xs py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 mb-2 opacity-40 text-cyan-400"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <p>No voice commands yet.</p>
            <p className="text-[10px] text-slate-600 mt-1">
              Press the core or mic button and speak.
            </p>
          </div>
        )}

        {/* Previous Transcripts */}
        {transcripts.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-2xl border transition-all ${
              item.role === 'user'
                ? 'bg-cyan-950/30 border-cyan-500/25 ml-4 text-cyan-100'
                : 'bg-slate-900/60 border-slate-700/40 mr-4 text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-400/80">
                {item.role === 'user' ? 'You' : 'Jarvis'}
              </span>
              {item.timestamp && (
                <span className="text-[9px] text-slate-500">{item.timestamp}</span>
              )}
            </div>

            <p className="text-sm font-medium leading-relaxed">{item.text}</p>

            {item.action && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-900/40 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
                <span>⚡ Action:</span>
                <span>{item.action}</span>
              </div>
            )}
          </div>
        ))}

        {/* Real-time Streaming Voice Text */}
        {isListening && liveTranscript && (
          <div className="p-3 rounded-2xl bg-cyan-950/50 border border-cyan-400/50 ml-4 animate-pulse">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-cyan-300">
                Listening Live...
              </span>
            </div>
            <p className="text-sm text-cyan-200 italic font-mono">{liveTranscript}</p>
          </div>
        )}
      </div>
    </div>
  );
}
