'use client';

import React from 'react';

export interface ActionInfo {
  action?: string | null;
  target?: string | null;
  reply?: string;
  success?: boolean;
}

interface ActionBadgeProps {
  actionInfo: ActionInfo | null;
  onDismiss?: () => void;
}

export default function ActionBadge({ actionInfo, onDismiss }: ActionBadgeProps) {
  if (!actionInfo || !actionInfo.action) return null;

  const isSuccess = actionInfo.success !== false;

  const getFriendlyText = () => {
    const action = actionInfo.action;
    const target = actionInfo.target || 'Task';

    switch (action) {
      case 'OPEN_APP':
        return `${target.toUpperCase()} opened`;
      case 'CLOSE_APP':
        return `${target.toUpperCase()} closed`;
      case 'OPEN_FOLDER':
        return `Folder ${target} opened`;
      case 'OPEN_WEBSITE':
        return `Opened ${target}`;
      default:
        return `${action}: ${target}`;
    }
  };

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 border border-cyan-400/40 backdrop-blur-xl shadow-[0_0_20px_rgba(34,211,238,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Status Icon */}
      <div
        className={`flex items-center justify-center w-5 h-5 rounded-full ${
          isSuccess
            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
            : 'bg-rose-500/20 text-rose-300 border border-rose-400/50'
        }`}
      >
        {isSuccess ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3 h-3"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        )}
      </div>

      {/* Action Title */}
      <span className="text-xs font-semibold tracking-wide text-slate-100">
        {getFriendlyText()}
      </span>

      {/* Dismiss cross if provided */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
