import React, { useState, useEffect, useRef } from 'react';
import { getSavedVoiceSettings } from '../services/voiceSynthesis';

interface HeroProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: any;
  onOpenAuth: (registerMode: boolean) => void;
  activeChatPersona?: string | null;
}

export const Hero: React.FC<HeroProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenAuth,
  activeChatPersona
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentPersona, setCurrentPersona] = useState<string>(() => {
    return getSavedVoiceSettings().persona || 'The Pythia of Fountain';
  });

  useEffect(() => {
    const handleVoiceSettingsChange = () => {
      const settings = getSavedVoiceSettings();
      if (settings?.persona) {
        setCurrentPersona(settings.persona);
      }
    };

    window.addEventListener('laevus-voice-settings-changed', handleVoiceSettingsChange);
    window.addEventListener('storage', handleVoiceSettingsChange);
    return () => {
      window.removeEventListener('laevus-voice-settings-changed', handleVoiceSettingsChange);
      window.removeEventListener('storage', handleVoiceSettingsChange);
    };
  }, []);

  // Click outside handler to dismiss dropdown smoothly
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (view: string) => {
    setActiveView(view);
    setIsOpen(false);
  };

  const [isDripping, setIsDripping] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDripping(true);
    setTimeout(() => {
      setIsDripping(false);
    }, 1400);
    setActiveView('chat');
    window.history.pushState({}, '', '/');
  };

  const isDivinationView = activeView === 'divination' || activeView === 'tarot' || activeView === 'upload-spread';

  const getDropdownLabel = () => {
    if (isDivinationView) return 'DIVINATION';
    if (activeView === 'advisors') return 'SOVEREIGN ADVISORS';
    if (activeView === 'knowledge-base') return 'KNOWLEDGE BASE';
    if (activeView === 'encyclopedia') return 'TAROT ENCYCLOPEDIA';
    if (activeView === 'voice-settings') return 'VOICE SETTINGS';
    if (activeView === 'account' || activeView === 'inner-work' || activeView === 'transcripts') return 'ACCOUNT & INSIGHTS';
    if (activeView === 'chat' && activeChatPersona) {
      return activeChatPersona.toUpperCase();
    }
    return currentPersona.toUpperCase();
  };

  return (
    <header className="relative z-40 max-w-4xl mx-auto px-4 pt-4 pb-4 mb-4 border-b border-zinc-900/40">
      <div className="flex flex-col items-center justify-center text-center relative">
        <div className="relative inline-flex flex-col items-end">
          {/* Universal Persistent Home Link */}
          <h1 className="font-syne text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-[-0.06em] uppercase leading-none selection:bg-purple-900/50 selection:text-purple-200 relative select-text">
            <a
              href="/"
              onClick={handleHomeClick} 
              className={`transition-all uppercase font-syne text-center tracking-[-0.06em] leading-none font-extrabold focus:outline-none cursor-pointer bg-transparent border-none p-0 outline-none inline-block ${
                isDripping 
                  ? 'animate-drip-black drop-shadow-[0_0_20px_rgba(0,0,0,0.9)]' 
                  : 'text-[#DC143C] drop-shadow-[0_0_15px_rgba(220,20,60,0.5)] hover:drop-shadow-[0_0_22px_rgba(220,20,60,0.8)]'
              }`}
              title="Return to The Pythia of Fountain Home"
            >
              Laevus
            </a>
          </h1>
          
          {/* Navigation dropdown box placed directly under the VUS of LAEVUS */}
          <div 
            ref={dropdownRef}
            className="relative z-50 mt-1.5 self-end"
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-black/90 border border-zinc-800 hover:border-[#DC143C]/60 rounded-md transition-all duration-200 cursor-pointer shadow-md group origin-right"
              id="navigation-dropdown-trigger"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="text-[11px] sm:text-[12px] font-bold tracking-widest uppercase text-zinc-300 group-hover:text-[#DC143C] group-active:text-[#DC143C] transition-colors font-google-sans">
                {getDropdownLabel()}
              </span>
              <span className={`text-[9px] text-zinc-400 group-hover:text-[#DC143C] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#DC143C]' : ''}`}>
                ▾
              </span>
            </button>

            {/* Dropdown Menu Categories - aligned right below the trigger */}
            {isOpen && (
              <div 
                className="absolute right-0 top-full mt-2 w-60 bg-black/95 backdrop-blur-md border border-zinc-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(220,20,60,0.15)] p-2 z-50 normal-case tracking-normal text-zinc-300 animate-fadeIn border-t-2 border-t-[#DC143C]"
              >
              <div className="space-y-1 font-mono">
                {/* Sign up / Log in with custom pulsing glow style block */}
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes crimson-pulse {
                    0%, 100% {
                      box-shadow: 0 0 4px rgba(220, 20, 60, 0.4), inset 0 0 2px rgba(220, 20, 60, 0.2);
                      border-color: rgba(220, 20, 60, 0.4);
                    }
                    50% {
                      box-shadow: 0 0 14px rgba(220, 20, 60, 0.95), inset 0 0 4px rgba(220, 20, 60, 0.45);
                      border-color: rgba(220, 20, 60, 0.95);
                    }
                  }
                  .crimson-pulsing-glow {
                    animation: crimson-pulse 2s infinite ease-in-out;
                  }
                `}} />
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-200 uppercase font-google-sans cursor-pointer group bg-black hover:bg-zinc-950 mb-1 border border-[#DC143C]/40 crimson-pulsing-glow"
                >
                  <span className="font-bold text-[11px] tracking-wider text-white group-hover:text-zinc-200 transition-colors">Sign up / Log in</span>
                  <span className="text-[#DC143C] text-[10px] group-hover:translate-x-0.5 transition-transform">→</span>
                </button>

                {/* 0. LAEVUS */}
                <button
                  onClick={() => handleSelect('chat')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-200 uppercase font-google-sans cursor-pointer group ${
                    activeView === 'chat'
                      ? 'bg-zinc-900 text-[#DC143C] font-bold shadow-sm' 
                      : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-[#DC143C] active:text-[#DC143C]'
                  }`}
                >
                  <span className="font-bold text-[11px] tracking-wider group-hover:text-[#DC143C] group-active:text-[#DC143C] transition-colors">{currentPersona.toUpperCase()}</span>
                  {activeView === 'chat' && <span className="text-[#DC143C] text-[10px]">●</span>}
                </button>

                {/* 1. DIVINATION */}
                <button
                  onClick={() => handleSelect('divination')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-200 uppercase font-google-sans cursor-pointer group ${
                    isDivinationView
                      ? 'bg-zinc-900 text-[#DC143C] font-bold shadow-sm' 
                      : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-[#DC143C] active:text-[#DC143C]'
                  }`}
                >
                  <span className="font-bold text-[11px] tracking-wider group-hover:text-[#DC143C] group-active:text-[#DC143C] transition-colors">DIVINATION</span>
                  {isDivinationView && (
                    <span className="text-[#DC143C] text-[10px]">●</span>
                  )}
                </button>

                {/* 4. Knowledge Base */}
                <button
                  onClick={() => handleSelect('knowledge-base')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-200 uppercase font-google-sans cursor-pointer group ${
                    activeView === 'knowledge-base'
                      ? 'bg-zinc-900 text-[#DC143C] font-bold shadow-sm' 
                      : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-[#DC143C] active:text-[#DC143C]'
                  }`}
                >
                  <span className="font-bold text-[11px] tracking-wider group-hover:text-[#DC143C] group-active:text-[#DC143C] transition-colors font-google-sans font-bold">Knowledge Base</span>
                  {activeView === 'knowledge-base' && <span className="text-[#DC143C] text-[10px]">●</span>}
                </button>

                {/* 2. Voice Settings */}
                <button
                  onClick={() => handleSelect('voice-settings')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-200 uppercase font-google-sans cursor-pointer group ${
                    activeView === 'voice-settings' 
                      ? 'bg-zinc-900 text-[#DC143C] font-bold shadow-sm' 
                      : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-[#DC143C] active:text-[#DC143C]'
                  }`}
                >
                  <span className="font-bold text-[11px] tracking-wider group-hover:text-[#DC143C] group-active:text-[#DC143C] transition-colors">Voice Settings</span>
                  {activeView === 'voice-settings' && <span className="text-[#DC143C] text-[10px]">●</span>}
                </button>

                {/* 5. Unified Account & Insights Hub */}
                <button
                  onClick={() => handleSelect('account')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all duration-200 uppercase font-google-sans cursor-pointer group ${
                    activeView === 'account' || activeView === 'inner-work' || activeView === 'transcripts'
                      ? 'bg-zinc-900 text-[#DC143C] font-bold shadow-sm' 
                      : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-[#DC143C] active:text-[#DC143C]'
                  }`}
                >
                  <span className="font-bold text-[11px] tracking-wider group-hover:text-[#DC143C] group-active:text-[#DC143C] transition-colors">Account & Insights</span>
                  {(activeView === 'account' || activeView === 'inner-work' || activeView === 'transcripts') && (
                    <span className="text-[#DC143C] text-[10px]">●</span>
                  )}
                </button>

                {/* Divider */}
                <div className="h-px bg-zinc-800/80 my-1.5" />

                {/* 6. External link to theleft.one with readable cursive */}
                <a
                  href="https://theleft.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-left px-2.5 py-1.5 hover:bg-zinc-900/60 rounded-lg flex items-center justify-between transition-all duration-200 text-zinc-300 hover:text-white group"
                >
                  <span className="font-ruthie text-[18px] sm:text-[21.6px] leading-none pt-0.5">
                    the<span className="text-[#DC143C]">left</span>.one
                  </span>
                  <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 font-mono">↗</span>
                </a>

              </div>
            </div>
          )}
        </div>
      </div>
      </div>
    </header>
  );
};
