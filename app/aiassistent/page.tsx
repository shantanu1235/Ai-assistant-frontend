'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import StatusBadge from '@/components/StatusBadge';
import ArcReactorOrb, { AssistantState } from '@/components/ArcReactorOrb';
import CommandInput from '@/components/CommandInput';
import TranscriptPanel, { TranscriptItem } from '@/components/TranscriptPanel';
import ActionBadge, { ActionInfo } from '@/components/ActionBadge';

const BACKEND_URL = 'http://localhost:5000';

export default function AssistantPage() {
  const [status, setStatus] = useState<AssistantState>('idle');
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [latestAction, setLatestAction] = useState<ActionInfo | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  // Check Backend Connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/`);
        setIsConnected(res.ok);
      } catch (err) {
        setIsConnected(false);
      }
    };
    checkConnection();
  }, []);

  // Text-To-Speech (Laptop Speaker)
  const speakResponse = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick a natural English/Hindi voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.includes('en-IN') || v.name.includes('Google') || v.lang.includes('en-US'));
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      setStatus('speaking');
    };

    utterance.onend = () => {
      setStatus('idle');
    };

    utterance.onerror = () => {
      setStatus('idle');
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Send Command to Backend API & execute on laptop
  const sendCommandToBackend = useCallback(
    async (commandText: string) => {
      if (!commandText.trim()) return;

      const userItemId = Date.now().toString();
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Add user transcript
      setTranscripts((prev) => [
        ...prev,
        {
          id: userItemId,
          text: commandText,
          role: 'user',
          timestamp
        }
      ]);

      setStatus('processing');
      setLiveTranscript('');

      try {
        const response = await fetch(`${BACKEND_URL}/api/assistant/command`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ command: commandText })
        });

        const data = await response.json();

        if (data.success) {
          setIsConnected(true);

          // Update action badge if PC action occurred
          if (data.action) {
            setLatestAction({
              action: data.action,
              target: data.target,
              reply: data.reply,
              success: data.systemResult ? data.systemResult.success : true
            });
          }

          // Add assistant response to history
          setTranscripts((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              text: data.reply || 'Task executed.',
              role: 'assistant',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              action: data.action ? `${data.action} (${data.target})` : null
            }
          ]);

          // Voice speak response
          if (data.reply) {
            speakResponse(data.reply);
          } else {
            setStatus('idle');
          }
        } else {
          throw new Error(data.message || 'Execution failed');
        }
      } catch (error: any) {
        setIsConnected(false);
        const errMsg = error.message || 'Unable to connect to backend server';
        setTranscripts((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: `⚠️ Error: ${errMsg}`,
            role: 'assistant',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setStatus('idle');
      }
    },
    [speakResponse]
  );

  // Setup Web Speech Recognition (Microphone)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // Supports English / Hinglish accents

    recognition.onstart = () => {
      isListeningRef.current = true;
      setStatus('listening');
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      setLiveTranscript(interim || final);

      if (final.trim()) {
        recognition.stop();
        sendCommandToBackend(final.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      isListeningRef.current = false;
      setStatus('idle');
      setLiveTranscript('');
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      if (status === 'listening') {
        setStatus('idle');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [sendCommandToBackend, status]);

  // Toggle Voice Recognition
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Your browser does not support Speech Recognition. Please use Chrome/Edge or text input.');
      return;
    }

    if (isListeningRef.current) {
      recognitionRef.current.stop();
      isListeningRef.current = false;
      setStatus('idle');
    } else {
      window.speechSynthesis?.cancel(); // Stop talking if previously speaking
      setLiveTranscript('');
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Background Holographic Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top HUD Header */}
      <Header title="JARVIS AI" subtitle="VOICE LAPTOP CONTROLLER" />

      {/* Main Workspace Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col justify-between z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Status & Quick Commands */}
          <div className="lg:col-span-3 flex flex-col gap-5 order-2 lg:order-1">
            <StatusBadge
              isConnected={isConnected}
              label="PC CONTROL:"
              sublabel={isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            />

            {/* Executed Action Badge */}
            {latestAction && (
              <div className="animate-in fade-in">
                <ActionBadge
                  actionInfo={latestAction}
                  onDismiss={() => setLatestAction(null)}
                />
              </div>
            )}

            {/* Quick Action Suggestion Buttons */}
            <div className="p-4 rounded-3xl bg-slate-900/40 border border-cyan-500/15 backdrop-blur-xl">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase block mb-3">
                QUICK VOICE COMMANDS
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Open Chrome',
                  'Open Notepad',
                  'Calculator kholo',
                  'Open Downloads',
                  'Close Notepad',
                  'Open YouTube'
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => sendCommandToBackend(cmd)}
                    disabled={status === 'processing'}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-950/60 border border-cyan-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/50 hover:bg-cyan-950/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column: Iconic Arc Reactor Voice Orb */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center order-1 lg:order-2">
            <ArcReactorOrb
              status={status}
              onClick={toggleListening}
            />
          </div>

          {/* Right Column: Live Voice Transcript Panel */}
          <div className="lg:col-span-4 order-3">
            <TranscriptPanel
              transcripts={transcripts}
              liveTranscript={liveTranscript}
              isListening={status === 'listening'}
              onClear={() => setTranscripts([])}
            />
          </div>
        </div>

        {/* Bottom Command Bar with Mic & Text input */}
        <div className="w-full mt-6 pb-2">
          <CommandInput
            onSendCommand={sendCommandToBackend}
            isListening={status === 'listening'}
            onToggleListen={toggleListening}
            disabled={status === 'processing'}
          />
        </div>
      </main>
    </div>
  );
}
