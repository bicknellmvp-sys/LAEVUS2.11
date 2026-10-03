import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Hero } from './components/Hero';
import { LaevusChat } from './components/LaevusChat';
import { VoiceSettings } from './components/VoiceSettings';
import { UploadSpread } from './components/UploadSpread';
import { AuthModal } from './components/AuthModal';
import { User } from 'firebase/auth';

const App: React.FC = () => {
  const [isPremium, setIsPremium] = useState(true);
  const [freeQuestionsCount, setFreeQuestionsCount] = useState(999);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [sessionId, setSessionId] = useState('8829-X');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalRegisterMode, setAuthModalRegisterMode] = useState(false);
  
  // API key & AI provider state
  const [apiKey, setApiKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('auto');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  
  // Controls which view is active from the menu ('chat' is default)
  const [activeView, setActiveView] = useState<string>('chat');
  const [isEmbedMode, setIsEmbedMode] = useState<boolean>(false);

  // Reference to call clear history in LaevusChat
  const clearHistoryFnRef = useRef<() => void>(() => {});
  const rootScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootScrollRef.current) {
      rootScrollRef.current.scrollTop = 0;
    }
  }, [activeView]);

  useEffect(() => {
    const storedKey = localStorage.getItem('CUSTOM_AI_KEY') || localStorage.getItem('GEMINI_API_KEY') || localStorage.getItem('laevus_gemini_api_key');
    const storedProvider = localStorage.getItem('CUSTOM_AI_PROVIDER') || 'auto';
    if (storedKey) {
      setApiKey(storedKey);
      setKeyInput(storedKey);
      setIsKeySaved(true);
    }
    setSelectedProvider(storedProvider);

    fetch('/api/gemini/status')
      .then(res => res.json())
      .then(data => {
        if (data.hasKey) {
          setHasServerKey(true);
        }
      })
      .catch(() => {});

    // Dynamic but persistent session ID per tab session
    let savedSession = sessionStorage.getItem('laevus_session_id');
    if (!savedSession) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const char = chars[Math.floor(Math.random() * chars.length)];
      savedSession = `${rand}-${char}`;
      sessionStorage.setItem('laevus_session_id', savedSession);
    }
    setSessionId(savedSession);

    // Deep link, query params & Shopify Embed support
    const searchParams = new URLSearchParams(window.location.search);
    const embedParam = searchParams.get('embed');
    const viewParam = searchParams.get('view');
    
    if (embedParam === 'shopify' || embedParam === 'true') {
      setIsEmbedMode(true);
    }

    const validViews = ['divination', 'account', 'voice-settings', 'upload-spread', 'tarot', 'transcripts', 'inner-work', 'chat'];

    if (viewParam && validViews.includes(viewParam)) {
      setActiveView(viewParam);
    } else {
      const path = window.location.pathname.replace(/^\//, '');
      if (validViews.includes(path)) {
        setActiveView(path);
      }
    }

    // Auto-report height to parent Shopify frame
    const handleResize = () => {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'LAEVUS_FRAME_RESIZE',
          height: document.body.scrollHeight
        }, '*');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRegisterClearHistory = useCallback((handler: () => void) => {
    clearHistoryFnRef.current = handler;
  }, []);

  const openAuthModal = useCallback((registerMode: boolean) => {
    setAuthModalRegisterMode(registerMode);
    setIsAuthModalOpen(true);
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    const cleanKey = keyInput.trim();
    localStorage.setItem('CUSTOM_AI_KEY', cleanKey);
    localStorage.setItem('GEMINI_API_KEY', cleanKey);
    localStorage.setItem('laevus_gemini_api_key', cleanKey);
    localStorage.setItem('CUSTOM_AI_PROVIDER', selectedProvider);
    setApiKey(cleanKey);
    setIsKeySaved(true);
    window.location.reload();
  };

  const handleClearKey = () => {
    localStorage.removeItem('CUSTOM_AI_KEY');
    localStorage.removeItem('CUSTOM_AI_PROVIDER');
    localStorage.removeItem('GEMINI_API_KEY');
    localStorage.removeItem('laevus_gemini_api_key');
    setApiKey('');
    setKeyInput('');
    setSelectedProvider('auto');
    setIsKeySaved(false);
    window.location.reload();
  };

  return (
    <div 
      ref={rootScrollRef}
      className={`w-screen bg-transparent text-[#F8F7F4] selection:bg-purple-900/50 selection:text-purple-200 relative flex flex-col font-mono ${
        activeView === 'chat' ? 'h-screen overflow-hidden' : 'min-h-screen overflow-y-auto'
      }`}
    >
      
      {/* Centered Content Container */}
      <div className={`flex-1 flex flex-col w-full relative z-10 ${activeView === 'chat' ? 'min-h-0' : 'min-h-screen'}`}>
        
        {/* Main Workspace Wrapper */}
        <main className={`flex-1 flex flex-col justify-start items-center w-full ${activeView === 'chat' ? 'min-h-0 overflow-hidden' : 'min-h-screen overflow-y-auto pb-16'}`}>
          
          {/* 1. Hero Section holding the integrated THELEFT.ONE menu controls OR Minimal Embed Bar */}
          <div className="w-full flex-shrink-0">
            {isEmbedMode ? (
              <div className="w-full max-w-5xl mx-auto px-3 py-2 flex items-center justify-between border-b border-zinc-900/60 bg-black/40 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-syne font-extrabold text-[#F8F7F4] tracking-tight">LAEVUS</span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-[10px] text-[#DC143C] uppercase font-bold tracking-wider">
                    {activeView === 'divination' ? 'Divination' : activeView === 'account' ? 'Account Hub' : activeView === 'tarot' ? '3-Card Oracle' : activeView}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={`${window.location.origin}/?view=${activeView}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-[#DC143C] transition-colors flex items-center gap-1"
                  >
                    <span>Full Sanctuary ↗</span>
                  </a>
                  <a
                    href="https://theleft.one"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-ruthie text-zinc-400 hover:text-white"
                  >
                    the<span className="text-[#DC143C]">left</span>.one
                  </a>
                </div>
              </div>
            ) : (
              <Hero 
                activeView={activeView}
                setActiveView={setActiveView}
                currentUser={currentUser}
                onOpenAuth={openAuthModal}
              />
            )}
          </div>

          {/* 2. DYNAMIC WORKSPACE LAYER */}
          <div className={`w-full flex-1 flex flex-col px-2 sm:px-4 ${activeView === 'chat' ? 'min-h-0 overflow-hidden' : 'h-auto overflow-y-auto'}`}>
            
            {/* DEDICATED VIEW: VOICE SETTINGS */}
            {activeView === 'voice-settings' && (
              <VoiceSettings onReturnToChat={() => setActiveView('chat')} />
            )}

            {/* DEDICATED VIEW: MANUAL TAROT SPREAD UPLOAD */}
            {activeView === 'upload-spread' && (
              <UploadSpread 
                onReturnToChat={() => setActiveView('chat')}
                onCompleteReading={() => {}} 
              />
            )}

            {/* CORE CHAT & DIVINATION WORKSPACE */}
            {activeView !== 'voice-settings' && activeView !== 'upload-spread' && (
              <LaevusChat 
                activeView={activeView}
                setActiveView={setActiveView}
                isPremium={isPremium}
                setIsPremium={setIsPremium}
                freeQuestionsCount={freeQuestionsCount}
                setFreeQuestionsCount={setFreeQuestionsCount}
                showUpgradeModal={showUpgradeModal}
                setShowUpgradeModal={setShowUpgradeModal}
                onRegisterClearHistory={handleRegisterClearHistory}
                currentUser={currentUser}
                onOpenAuth={openAuthModal}
              />
            )}

          </div>

        </main>

        {/* Identity Authorization Overlay */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onUserChanged={setCurrentUser}
          initialRegisterMode={authModalRegisterMode}
        />

      </div>
    </div>
  );
};

export default App;
