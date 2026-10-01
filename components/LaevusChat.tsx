import React, { useState, useEffect, useRef, useMemo } from 'react';
import { metaphysicalConsultation } from '../services/gemini';
import { voiceEngine, getSavedVoiceSettings } from '../services/voiceSynthesis';
import { speechToTextEngine } from '../services/speechToText';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { DivinationHub } from './DivinationHub';
import { AdvisorsHub } from './AdvisorsHub';
import { KnowledgeBase } from './KnowledgeBase';
import { AccountHub, TranscriptRecord } from './AccountHub';
import { SocialShareModal, ShareContent } from './SocialShareModal';
import { TAROT_DATABASE, TarotCardData as UniversalTarotCardData } from '../data/tarotCards';
import { useChatSync } from '../src/hooks/useChatSync';
import { ThinkingIndicator } from './ThinkingIndicator';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  mode?: 'laevus' | 'tarot' | 'tarot-persona' | 'tarot-physical';
}

interface TarotCard {
  name: string;
  position: 'Past' | 'Present' | 'Future';
  description: string;
  symbol: string;
  meaning: string;
  image: string;
}

const TAROT_DECK: Omit<TarotCard, 'position'>[] = TAROT_DATABASE.map(card => ({
  name: card.name,
  symbol: card.symbol || (card.arcana === 'major' ? 'Major' : 'Minor'),
  description: card.description || card.symbolism || card.keywords.slice(0, 3).join(', '),
  meaning: card.meaning,
  image: card.image
}));

// Helper: Typing/Typewriter Effect for Snappy & Cinematic responses
const autoLinkSupplies = (inputText: string): string => {
  let result = inputText;
  
  const replacements = [
    {
      pattern: /(?<!\[)(?:the )?cyber-spiritual scrying deck(?!\])/gi,
      replacement: '[The Cyber-Spiritual Scrying Deck](https://theleft.one/products/scrying-deck)'
    },
    {
      pattern: /(?<!\[)(?:the )?left-hand portal mirror(?!\])/gi,
      replacement: '[The Left-Hand Portal Mirror](https://theleft.one/products/portal-mirror)'
    },
    {
      pattern: /(?<!\[)sovereign aura cleanser(?!\])/gi,
      replacement: '[Sovereign Aura Cleanser](https://theleft.one/products/aura-cleanser)'
    },
    {
      pattern: /(?<!\[)obsidian keyboard talisman(?!\])/gi,
      replacement: '[Obsidian Keyboard Talisman](https://theleft.one/products/keyboard-talisman)'
    },
    {
      pattern: /(?<!\[)metaphysical circuit board patch(?!\])/gi,
      replacement: '[Metaphysical Circuit Board Patch](https://theleft.one/products/circuit-board-patch)'
    },
    {
      pattern: /(?<!\[)(?:the )?digital seance candle(?!\])/gi,
      replacement: '[The Digital Seance Candle](https://theleft.one/products/seance-candle)'
    },
    {
      pattern: /(?<!\[)seance candle(?!\])/gi,
      replacement: '[The Digital Seance Candle](https://theleft.one/products/seance-candle)'
    },
    {
      pattern: /(?<!\[)portal mirror(?!\])/gi,
      replacement: '[The Left-Hand Portal Mirror](https://theleft.one/products/portal-mirror)'
    },
    {
      pattern: /(?<!\[)aura cleanser(?!\])/gi,
      replacement: '[Sovereign Aura Cleanser](https://theleft.one/products/aura-cleanser)'
    },
    {
      pattern: /(?<!\[)keyboard talisman(?!\])/gi,
      replacement: '[Obsidian Keyboard Talisman](https://theleft.one/products/keyboard-talisman)'
    },
    {
      pattern: /(?<!\[)scrying deck(?!\])/gi,
      replacement: '[The Cyber-Spiritual Scrying Deck](https://theleft.one/products/scrying-deck)'
    },
    {
      pattern: /(?<!\[)circuit board patch(?!\])/gi,
      replacement: '[Metaphysical Circuit Board Patch](https://theleft.one/products/circuit-board-patch)'
    },
    {
      pattern: /(?<!\[)theleft\.one(?!\])/gi,
      replacement: '[theleft.one](https://theleft.one)'
    }
  ];

  for (const r of replacements) {
    result = result.replace(r.pattern, r.replacement);
  }

  return result;
};

interface TextToken {
  type: 'text' | 'link';
  text: string;
  url?: string;
}

const parseTokens = (text: string): TextToken[] => {
  const tokens: TextToken[] = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)|(https?:\/\/[^\s\),]+)/g;
  let match;
  let lastIndex = 0;
  
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', text: text.substring(lastIndex, match.index) });
    }
    if (match[1] && match[2]) {
      tokens.push({ type: 'link', text: match[1], url: match[2] });
    } else if (match[3]) {
      let rawUrl = match[3];
      let trailing = '';
      if (/[.,;!?]$/.test(rawUrl)) {
        trailing = rawUrl.slice(-1);
        rawUrl = rawUrl.slice(0, -1);
      }
      tokens.push({ type: 'link', text: rawUrl, url: rawUrl });
      if (trailing) {
        tokens.push({ type: 'text', text: trailing });
      }
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: 'text', text: text.substring(lastIndex) });
  }
  return tokens;
};

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const processedText = useMemo(() => autoLinkSupplies(text), [text]);
  const tokens = useMemo(() => parseTokens(processedText), [processedText]);

  const renderedElements = useMemo(() => {
    return tokens.map((token, idx) => {
      if (token.type === 'link') {
        return (
          <a 
            key={`typewriter-link-${idx}`} 
            href={token.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#DC143C] hover:underline font-bold transition-all relative z-20 inline-flex items-center gap-0.5"
          >
            {token.text}
          </a>
        );
      } else {
        return <span key={`typewriter-text-${idx}`}>{token.text}</span>;
      }
    });
  }, [tokens]);

  return (
    <div className="relative group flex flex-col w-full">
      <p className="whitespace-pre-wrap font-google-sans leading-relaxed relative z-10">{renderedElements}</p>
    </div>
  );
};

interface LaevusChatProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isPremium: boolean;
  setIsPremium: React.Dispatch<React.SetStateAction<boolean>>;
  freeQuestionsCount: number;
  setFreeQuestionsCount: React.Dispatch<React.SetStateAction<number>>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: React.Dispatch<React.SetStateAction<boolean>>;
  onRegisterClearHistory?: (handler: () => void) => void;
  currentUser: User | null;
  onOpenAuth: (registerMode: boolean) => void;
  onPersonaChange?: (persona: string | null) => void;
}

export const LaevusChat: React.FC<LaevusChatProps> = ({
  activeView,
  setActiveView,
  onRegisterClearHistory,
  currentUser,
  onOpenAuth,
  onPersonaChange
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [readingCount, setReadingCount] = useState<number>(0);
  
  const [activeTarotPersona, setActiveTarotPersona] = useState<string | null>(null);
  const [activeCustomPersona, setActiveCustomPersona] = useState<string | null>(null);
  
  // Tarot State
  const [tarotQuestion, setTarotQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [flippedCount, setFlippedCount] = useState(0);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [tarotMode, setTarotMode] = useState<'digital' | 'physical'>('digital');
  const [physicalPastCard, setPhysicalPastCard] = useState<string>('');
  const [physicalPresentCard, setPhysicalPresentCard] = useState<string>('');
  const [physicalFutureCard, setPhysicalFutureCard] = useState<string>('');

  // Stats / Streak states
  const [streakCount, setStreakCount] = useState(1);
  const [daysRegistered, setDaysRegistered] = useState(1);

  // Sentiment Analysis and Transcripts state
  const [sentimentScores, setSentimentScores] = useState<number[]>([35, 45, 40, 60, 50]);
  const [transcripts, setTranscripts] = useState<TranscriptRecord[]>([]);

  // Periodically sync chat history to Firestore so users can resume conversations across sessions
  useChatSync({
    currentUser,
    messages,
    setMessages,
    transcripts,
    setTranscripts,
    sentimentScores,
    setSentimentScores,
    readingCount,
    setReadingCount
  });

  // Social Share & Copy state
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareContent, setShareContent] = useState<ShareContent | null>(null);

  // Voice Input (STT) state
  const [isListening, setIsListening] = useState(false);

  const activePersonaName = getSavedVoiceSettings().persona;

  const handleToggleVoiceInput = () => {
    if (isListening) {
      speechToTextEngine.stop();
      setIsListening(false);
    } else {
      const started = speechToTextEngine.start({
        onResult: (text, isFinal) => {
          setInput(text);
          const currentSettings = getSavedVoiceSettings();
          if (isFinal && currentSettings.autoSendVoice && text.trim()) {
            handleSend(text);
            speechToTextEngine.stop();
            setIsListening(false);
          }
        },
        onError: (err) => {
          console.warn('Voice recognition:', err);
          setIsListening(false);
        },
        onEnd: () => {
          setIsListening(false);
        }
      });
      setIsListening(started);
    }
  };


  const handleCopyText = async (text: string, id?: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      if (id) {
        setCopiedMessageId(id);
        setTimeout(() => setCopiedMessageId(null), 2000);
      }
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const handleShareEntireConversation = () => {
    const currentPersona = activeTarotPersona || activePersonaName;
    const userNameDisplay = currentUser 
      ? (currentUser.displayName ? currentUser.displayName.split(' ')[0] : currentUser.email ? currentUser.email.split('@')[0] : 'YOU')
      : 'YOU';
    const fullConversation = messages.map(m => `${m.role === 'user' ? userNameDisplay.toUpperCase() : currentPersona.toUpperCase()}:\n${m.text}`).join('\n\n---\n\n');
    setShareContent({
      title: `${currentPersona.toUpperCase()} Conversation • LAEVUS`,
      text: `Dialogue with ${currentPersona} on LAEVUS:\n\n${fullConversation.length > 1000 ? fullConversation.substring(0, 1000) + '...' : fullConversation}`,
      category: 'oracle'
    });
    setShareModalOpen(true);
  };

  const handleShareTarotReading = (question: string, cards: TarotCard[]) => {
    const cardsSummary = cards.map(c => `${c.position}: ${c.name}`).join(' | ');
    setShareContent({
      title: 'Tarot Divination • LAEVUS',
      text: `My Tarot Reading on LAEVUS:\nQuestion: "${question || 'Personal guidance'}"\nCards: ${cardsSummary}`,
      category: 'tarot'
    });
    setShareModalOpen(true);
  };

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const currentUserRef = useRef<User | null>(null);
  const activeTarotPersonaRef = useRef<string | null>(null);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    activeTarotPersonaRef.current = activeTarotPersona;
  }, [activeTarotPersona]);

  // Mount logic: Load statistics, streak, and default welcome phrases
  useEffect(() => {
    const savedReadings = localStorage.getItem('laevus_readings_count_v1');
    if (savedReadings) {
      setReadingCount(parseInt(savedReadings, 10) || 0);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let joinedDateStr = localStorage.getItem('laevus_vessel_joined_date');
    if (!joinedDateStr) {
      joinedDateStr = new Date().toISOString();
      localStorage.setItem('laevus_vessel_joined_date', joinedDateStr);
    }

    const joinedDate = new Date(joinedDateStr);
    const todayDate = new Date(todayStr);
    const diffTime = Math.abs(todayDate.getTime() - joinedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    setDaysRegistered(diffDays);

    const lastActive = localStorage.getItem('laevus_vessel_last_active_date');
    let currentStreak = parseInt(localStorage.getItem('laevus_vessel_streak_count') || '1', 10);

    if (lastActive) {
      const lastActiveDate = new Date(lastActive);
      const diffSinceLastActive = Math.floor((todayDate.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffSinceLastActive === 1) {
        currentStreak += 1;
        localStorage.setItem('laevus_vessel_streak_count', currentStreak.toString());
      } else if (diffSinceLastActive > 1) {
        currentStreak = 1;
        localStorage.setItem('laevus_vessel_streak_count', '1');
      }
    } else {
      localStorage.setItem('laevus_vessel_streak_count', '1');
    }
    setStreakCount(currentStreak);
    localStorage.setItem('laevus_vessel_last_active_date', todayStr);

    const savedSentiment = localStorage.getItem('laevus_sentiment_timeline');
    if (savedSentiment) {
      try {
        setSentimentScores(JSON.parse(savedSentiment));
      } catch (e) {}
    }

    const savedTranscripts = localStorage.getItem('laevus_transcripts_v1');
    if (savedTranscripts) {
      try {
        setTranscripts(JSON.parse(savedTranscripts));
      } catch (e) {}
    }

    const savedChat = localStorage.getItem('laevus_chat_history_v3');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setMessages(parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        })));
      } catch (e) {
        loadDefaultWelcome();
      }
    } else {
      loadDefaultWelcome();
    }
  }, []);

  // Sync with Firestore on user login
  useEffect(() => {
    const syncUserHistory = async () => {
      if (!currentUser) return;
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const cloudData = docSnap.data();
          if (cloudData.messages && cloudData.messages.length > 0) {
            setMessages(cloudData.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp)
            })));
          }
          if (cloudData.transcripts && cloudData.transcripts.length > 0) {
            setTranscripts(cloudData.transcripts);
            localStorage.setItem('laevus_transcripts_v1', JSON.stringify(cloudData.transcripts));
          }
          if (cloudData.sentimentScores && cloudData.sentimentScores.length > 0) {
            setSentimentScores(cloudData.sentimentScores);
            localStorage.setItem('laevus_sentiment_timeline', JSON.stringify(cloudData.sentimentScores));
          }
        } else {
          const savedLocal = localStorage.getItem('laevus_chat_history_v3');
          const savedTransLocal = localStorage.getItem('laevus_transcripts_v1');
          const savedSentimentLocal = localStorage.getItem('laevus_sentiment_timeline');

          let initialMessages: any[] = [];
          let initialTranscripts: any[] = [];
          let initialSentiment: number[] = [35, 45, 40, 60, 50];

          if (savedLocal) {
            try {
              const parsed = JSON.parse(savedLocal);
              initialMessages = parsed.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp).toISOString()
              }));
            } catch (e) {}
          }

          if (savedTransLocal) {
            try {
              initialTranscripts = JSON.parse(savedTransLocal);
            } catch (e) {}
          }

          if (savedSentimentLocal) {
            try {
              initialSentiment = JSON.parse(savedSentimentLocal);
            } catch (e) {}
          }

          await setDoc(userDocRef, {
            email: currentUser.email,
            uid: currentUser.uid,
            messages: initialMessages,
            transcripts: initialTranscripts,
            sentimentScores: initialSentiment,
            lastLoginAt: new Date().toISOString()
          }, { merge: true });
        }
      } catch (err) {
        console.error("Firestore sync failed:", err);
      }
    };

    syncUserHistory();
  }, [currentUser]);

  // Sync transcripts with Firestore when active
  useEffect(() => {
    if (currentUser && transcripts.length > 0) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { transcripts }, { merge: true }).catch(err => {
        console.error("Failed to mirror transcripts to cloud:", err);
      });
    }
  }, [transcripts, currentUser]);

  // Sync sentiment scores with Firestore when active
  useEffect(() => {
    if (currentUser && sentimentScores.length > 0) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      setDoc(userDocRef, { sentimentScores }, { merge: true }).catch(err => {
        console.error("Failed to mirror sentiment scores to cloud:", err);
      });
    }
  }, [sentimentScores, currentUser]);

  // Register the clear history callback so parent dropdown can trigger it
  useEffect(() => {
    if (onRegisterClearHistory) {
      onRegisterClearHistory(async () => {
        localStorage.removeItem('laevus_chat_history_v3');
        localStorage.removeItem('laevus_transcripts_v1');
        localStorage.removeItem('laevus_sentiment_timeline');
        setTranscripts([]);
        setSentimentScores([35, 45, 40, 60, 50]);
        setActiveCustomPersona(null);
        setActiveTarotPersona(null);
        if (onPersonaChange) {
          onPersonaChange(null);
        }
        const currUser = currentUserRef.current;
        if (currUser) {
          try {
            const userDocRef = doc(db, 'users', currUser.uid);
            await setDoc(userDocRef, { messages: [], transcripts: [], sentimentScores: [] }, { merge: true });
          } catch (err) {
            console.error("Failed to clear Firestore history:", err);
          }
        }
        loadDefaultWelcome();
      });
    }
  }, [onRegisterClearHistory]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('laevus_chat_history_v3', JSON.stringify(messages));
      
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const serialized = messages.map(m => ({
          ...m,
          timestamp: m.timestamp.toISOString()
        }));
        setDoc(userDocRef, { messages: serialized }, { merge: true }).catch(err => {
          console.error("Failed to mirror messages to Firestore:", err);
        });
      }
    }
  }, [messages, currentUser]);

  useEffect(() => {
    if (activeView === 'chat' && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeView]);

  const loadDefaultWelcome = () => {
    const WELCOME_PHRASES = [
      "Listen closely to the echoes of the spring.\n\nWelcome to The Pythia of Fountain, a sanctuary of ancient foresight. Like the oracles of old, this section offers a quiet space to consult the signs, divine the future, and find direction in uncertain times.",
      "Wisdom flows for those who ask.\n\nWelcome to The Pythia of Fountain, your space for genuine perspective and deep insight. Bring your burning questions, release your doubts, and let the guidance here illuminate your path forward.",
      "Beyond the surface lies the truth.\n\nWelcome to The Pythia of Fountain, where the unseen becomes known. Step through the veil to uncover hidden truths, receive spiritual clarity, and explore the mysteries waiting just beneath the surface of everyday life.",
      "Seek, and the waters shall speak.\n\nWelcome to The Pythia of Fountain, your portal for insight, clarity, and guidance. Drawing from the deep well of ancient wisdom and modern intuition, step forward with your questions and let the answers reveal themselves."
    ];

    let indexStr = sessionStorage.getItem('laevus_welcome_index');
    let idx = 0;
    if (indexStr === null) {
      idx = 0;
      sessionStorage.setItem('laevus_welcome_index', '1');
    } else {
      idx = (parseInt(indexStr, 10) || 0) % WELCOME_PHRASES.length;
      sessionStorage.setItem('laevus_welcome_index', ((idx + 1) % WELCOME_PHRASES.length).toString());
    }

    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: WELCOME_PHRASES[idx],
        timestamp: new Date()
      }
    ]);
  };

  const computeSentiment = (text: string): number => {
    const positiveWords = ['love', 'light', 'peace', 'happy', 'healing', 'harmony', 'growth', 'joy', 'blessed', 'wisdom', 'angels', 'serene', 'elevate', 'spirit', 'revelation', 'guide', 'future'];
    const negativeWords = ['sad', 'dark', 'pain', 'anger', 'hate', 'death', 'fear', 'broken', 'lost', 'shadow', 'trapped', 'bound', 'chaos', 'tower', 'devil', 'hell', 'suffering'];
    
    let score = 50;
    const words = text.toLowerCase().split(/\s+/);
    words.forEach(w => {
      const cleanWord = w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      if (positiveWords.includes(cleanWord)) score += 12;
      if (negativeWords.includes(cleanWord)) score -= 12;
    });
    return Math.max(15, Math.min(85, score));
  };

  const addTranscriptRecord = (
    category: 'tarot' | 'madam',
    title: string,
    content: string,
    extraFields?: {
      querentPrompt?: string;
      drawnCards?: TarotCard[];
      madamBlavatskyReply?: string;
    }
  ) => {
    const newRecord: TranscriptRecord = {
      id: crypto.randomUUID(),
      category,
      title,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      content,
      ...extraFields
    };
    const updated = [newRecord, ...transcripts];
    setTranscripts(updated);
    localStorage.setItem('laevus_transcripts_v1', JSON.stringify(updated));
  };

  const handleSend = async (
    textToSend: string, 
    forceMode?: 'laevus' | 'tarot' | 'tarot-persona' | 'tarot-physical', 
    customCards?: TarotCard[],
    extraInfo?: { followUpQuestion?: string; primaryQuestion?: string; persona?: string }
  ) => {
    if (!textToSend.trim() && !customCards) return;
    if (isTyping) return;

    let currentMode = forceMode || (activeTarotPersona ? 'tarot-persona' : 'laevus');
    let trimmedText = textToSend.trim();

    // Support auto-detecting [MODE 1] Card: <Name>. User Question: <Question>
    const mode1Match = trimmedText.match(/^\[MODE\s*1\]\s*Card:\s*(.+?)\.\s*User\s*Question:\s*(.+)$/i);
    if (mode1Match && !forceMode) {
      const parsedCardName = mode1Match[1].trim();
      const questionText = mode1Match[2].trim();

      const cardExists = TAROT_DECK.some(c => c.name.toLowerCase() === parsedCardName.toLowerCase());
      const normalizedCardName = cardExists 
        ? (TAROT_DECK.find(c => c.name.toLowerCase() === parsedCardName.toLowerCase())?.name || parsedCardName)
        : parsedCardName;

      setActiveTarotPersona(normalizedCardName);
      currentMode = 'tarot-persona';
      trimmedText = questionText;

      const summonMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: `[ Embodied the live archetype of ${normalizedCardName.toUpperCase()} ]\n\nI have aligned my energy with this physical layer. Ask me of my secrets or seek my guidance.`,
        timestamp: new Date(),
        mode: 'tarot-persona'
      };

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        text: questionText,
        timestamp: new Date(),
        mode: 'tarot-persona'
      };

      setMessages([
        {
          id: 'welcome',
          role: 'model',
          text: `You have crossed the threshold. Speak directly to the living soul of ${normalizedCardName}.`,
          timestamp: new Date(),
          mode: 'tarot-persona'
        },
        summonMsg,
        userMsg
      ]);
      setInput('');
      setIsTyping(true);

      const nextCount = readingCount + 1;
      setReadingCount(nextCount);
      localStorage.setItem('laevus_readings_count_v1', nextCount.toString());

      const score = computeSentiment(questionText);
      const newScores = [...sentimentScores, score];
      setSentimentScores(newScores);
      localStorage.setItem('laevus_sentiment_timeline', JSON.stringify(newScores));

      try {
        const reply = await metaphysicalConsultation(
          questionText,
          [],
          {
            mode: 'tarot-persona',
            personaCardName: normalizedCardName,
            readingCount: nextCount
          }
        );

        const modelMsg: Message = {
          id: crypto.randomUUID(),
          role: 'model',
          text: reply,
          timestamp: new Date(),
          mode: 'tarot-persona'
        };

        setMessages(prev => [...prev, modelMsg]);
        voiceEngine.speak(reply);

        addTranscriptRecord(
          'madam',
          `Conversed with ${normalizedCardName}`,
          `User: ${questionText}\n\n${normalizedCardName}: ${reply}`,
          {
            querentPrompt: questionText,
            madamBlavatskyReply: reply
          }
        );
      } catch (err) {
        console.error(err);
        const errText = "An error occurred with the AI service. Please verify that your GEMINI_API_KEY environment variable is configured correctly.";
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'model',
          text: errText,
          timestamp: new Date()
        }]);
      } finally {
        setIsTyping(false);
      }
      return;
    }

    const nextCount = readingCount + 1;
    setReadingCount(nextCount);
    localStorage.setItem('laevus_readings_count_v1', nextCount.toString());

    const score = computeSentiment(trimmedText);
    const newScores = [...sentimentScores, score];
    setSentimentScores(newScores);
    localStorage.setItem('laevus_sentiment_timeline', JSON.stringify(newScores));

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: trimmedText || (currentMode === 'tarot-physical' ? `Synthesize Tarot: "${tarotQuestion || "General alignment"}"` : `Draw Tarot: "${tarotQuestion || "General life alignment"}"`),
      timestamp: new Date(),
      mode: currentMode
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const formattedHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const currentVoiceSettings = getSavedVoiceSettings();
      let reply = "";
      const effectiveQuestion = extraInfo?.primaryQuestion || tarotQuestion || "General alignment";
      const effectiveFollowUp = extraInfo?.followUpQuestion;

      if (currentMode === 'tarot' && customCards) {
        const promptText = effectiveFollowUp
          ? `Tailor a tarot reading for inquiry: "${effectiveQuestion}" and follow-up question: "${effectiveFollowUp}"`
          : `Tailor a tarot reading for my question: "${effectiveQuestion}"`;

        reply = await metaphysicalConsultation(
          promptText,
          formattedHistory,
          {
            mode: 'tarot',
            tarotCards: customCards,
            tarotQuestion: effectiveQuestion,
            followUpQuestion: effectiveFollowUp,
            readingCount: nextCount,
            persona: currentVoiceSettings.persona
          }
        );
      } else if (currentMode === 'tarot-physical' && customCards) {
        const promptText = effectiveFollowUp
          ? `Synthesize an Offline reading for inquiry: "${effectiveQuestion}" and follow-up question: "${effectiveFollowUp}"`
          : `Synthesize an Offline reading for my question: "${effectiveQuestion}"`;

        reply = await metaphysicalConsultation(
          promptText,
          formattedHistory,
          {
            mode: 'tarot-physical',
            tarotCards: customCards,
            tarotQuestion: effectiveQuestion,
            followUpQuestion: effectiveFollowUp,
            readingCount: nextCount,
            persona: currentVoiceSettings.persona
          }
        );
      } else if (currentMode === 'tarot-persona' && activeTarotPersona) {
        reply = await metaphysicalConsultation(
          trimmedText,
          formattedHistory,
          {
            mode: 'tarot-persona',
            personaCardName: activeTarotPersona,
            readingCount: nextCount,
            persona: currentVoiceSettings.persona
          }
        );
      } else {
        const activePersona = extraInfo?.persona || activeCustomPersona || currentVoiceSettings.persona;
        reply = await metaphysicalConsultation(
          trimmedText,
          formattedHistory,
          {
            mode: 'laevus',
            readingCount: nextCount,
            persona: activePersona
          }
        );
      }
      
      const modelMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: reply,
        timestamp: new Date(),
        mode: currentMode
      };

      setMessages(prev => [...prev, modelMsg]);
      voiceEngine.speak(reply);

      // Save to transcripts
      if ((currentMode === 'tarot' || currentMode === 'tarot-physical') && customCards) {
        const cardsDesc = customCards.map(c => `[${c.position}] ${c.symbol} ${c.name} - ${c.meaning}`).join('\n');
        addTranscriptRecord(
          'tarot',
          `${currentMode === 'tarot-physical' ? 'Physical Synthesis' : 'Digital Draw'}: ${tarotQuestion || 'Life Alignment'}`,
          `Question: ${tarotQuestion}\n\nCards Drawn:\n${cardsDesc}\n\nInterpretation:\n${reply}`,
          {
            querentPrompt: tarotQuestion || "General alignment",
            drawnCards: customCards,
            madamBlavatskyReply: reply
          }
        );
      } else if (currentMode === 'tarot-persona' && activeTarotPersona) {
        addTranscriptRecord(
          'madam',
          `Conversed with ${activeTarotPersona}`,
          `User: ${trimmedText}\n\n${activeTarotPersona}: ${reply}`,
          {
            querentPrompt: trimmedText,
            madamBlavatskyReply: reply
          }
        );
      } else {
        const activePersona = extraInfo?.persona || activeCustomPersona || currentVoiceSettings.persona;
        addTranscriptRecord(
          'madam',
          `Consultation with ${activePersona}`,
          `User: ${trimmedText}\n\n${activePersona}: ${reply}`,
          {
            querentPrompt: trimmedText,
            madamBlavatskyReply: reply
          }
        );
      }

    } catch (err) {
      console.error(err);
      const errText = "An error occurred with the AI service. Please verify that your GEMINI_API_KEY environment variable is configured correctly.";
      
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'model',
        text: errText,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get('card');
    const questionParam = params.get('question');
    
    if (cardParam && questionParam) {
      const timer = setTimeout(() => {
        handleSend(`Card: ${cardParam}. User Question: ${questionParam}`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSummonTarotPersona = (cardName: string) => {
    setActiveTarotPersona(cardName);
    if (onPersonaChange) {
      onPersonaChange(cardName);
    }
    const summonMsg: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      text: `[ Embodied the live archetype of ${cardName.toUpperCase()} ]\n\nI have aligned my energy with this physical layer. Ask me of my secrets or seek my guidance.`,
      timestamp: new Date(),
      mode: 'tarot-persona'
    };
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `You have crossed the threshold. Speak directly to the living soul of ${cardName}.`,
        timestamp: new Date(),
        mode: 'tarot-persona'
      },
      summonMsg
    ]);
    setActiveView('chat');
  };

  const handleReleaseTarotPersona = () => {
    if (!activeTarotPersona) return;
    const releaseMsg: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      text: `[ Ended session with ${activeTarotPersona}. LAEVUS returns as your primary guide. ]`,
      timestamp: new Date(),
      mode: 'laevus'
    };
    setActiveTarotPersona(null);
    if (onPersonaChange) {
      onPersonaChange(null);
    }
    setMessages(prev => [...prev, releaseMsg]);
  };

  const handleStartPersonaConversation = (promptText: string, personaName: string) => {
    setActiveCustomPersona(personaName);
    setActiveTarotPersona(null);
    if (onPersonaChange) {
      onPersonaChange(personaName);
    }
    
    const summonMsg: Message = {
      id: crypto.randomUUID(),
      role: 'model',
      text: `[ Summoned advisor: ${personaName.toUpperCase()} ]\n\nI have aligned my energy with this realm to guide you. Speak your query.`,
      timestamp: new Date()
    };
    
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: `You have entered the counsel of ${personaName}. Speak your truth.`,
        timestamp: new Date()
      },
      summonMsg
    ]);
    
    setActiveView('chat');
    
    setTimeout(() => {
      handleSend(promptText, 'laevus', undefined, { persona: personaName });
    }, 500);
  };

  const handleDrawTarot = async () => {
    if (!tarotQuestion.trim()) {
      alert("Please define the question you wish the cards to answer.");
      return;
    }

    setIsDrawing(true);
    setFlippedCount(0);
    setDrawnCards([]);

    const shuffled = [...TAROT_DECK].sort(() => 0.5 - Math.random());
    const drawn: TarotCard[] = [
      { ...shuffled[0], position: 'Past' },
      { ...shuffled[1], position: 'Present' },
      { ...shuffled[2], position: 'Future' }
    ];

    setDrawnCards(drawn);

    for (let i = 1; i <= 3; i++) {
      await new Promise(res => setTimeout(res, 600));
      setFlippedCount(i);
    }

    await new Promise(res => setTimeout(res, 400));
    setIsDrawing(false);
    setActiveView('chat');
    
    handleSend(`Perform a tailored Tarot reading regarding: "${tarotQuestion}"`, 'tarot', drawn);
    setTarotQuestion('');
  };

  const handlePhysicalSynthesis = async () => {
    if (!tarotQuestion.trim()) {
      alert("Please define the question you wish the cards to answer.");
      return;
    }
    if (!physicalPastCard || !physicalPresentCard || !physicalFutureCard) {
      alert("Please select cards for all three positions (Past, Present, and Future).");
      return;
    }

    const pastObj = TAROT_DECK.find(c => c.name === physicalPastCard);
    const presentObj = TAROT_DECK.find(c => c.name === physicalPresentCard);
    const futureObj = TAROT_DECK.find(c => c.name === physicalFutureCard);

    if (!pastObj || !presentObj || !futureObj) {
      alert("An error occurred. Please select valid cards.");
      return;
    }

    const physicalCards: TarotCard[] = [
      { ...pastObj, position: 'Past' },
      { ...presentObj, position: 'Present' },
      { ...futureObj, position: 'Future' }
    ];

    setIsDrawing(true);
    setFlippedCount(0);
    setDrawnCards([]);

    setDrawnCards(physicalCards);

    for (let i = 1; i <= 3; i++) {
      await new Promise(res => setTimeout(res, 500));
      setFlippedCount(i);
    }

    await new Promise(res => setTimeout(res, 400));
    setIsDrawing(false);
    setActiveView('chat');

    handleSend(`Perform a Physical Realm Synthesis reading regarding: "${tarotQuestion}"`, 'tarot-physical', physicalCards);
    setTarotQuestion('');
    setPhysicalPastCard('');
    setPhysicalPresentCard('');
    setPhysicalFutureCard('');
  };

  return (
    <div className={`w-full px-2 sm:px-4 md:px-6 py-1 flex flex-col relative font-google-sans text-zinc-300 ${activeView === 'chat' ? 'flex-1 min-h-0 h-full overflow-hidden' : 'h-auto overflow-y-auto'}`}>

      {/* VIEW: PRIMARY ORACLE CHAT */}
      {activeView === 'chat' && (
        <div className="flex-1 min-h-0 flex flex-col p-1 pb-1 relative animate-fadeIn w-full max-w-5xl mx-auto overflow-hidden font-google-sans justify-between">
          
          {/* Active Tarot Persona Banner */}
          {activeTarotPersona && (
            <div className="px-4 py-2 bg-black flex items-center justify-between text-xs mb-2 rounded-lg border border-amber-500/25 flex-shrink-0 font-google-sans text-amber-300">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Archetype</span>
                <div className="font-google-sans text-left">
                  <div className="flex items-center">
                    <span className="font-bold text-zinc-200 font-google-sans">{activeTarotPersona} Persona</span>
                    <span className="mx-2 text-zinc-700">|</span>
                    <span className="text-zinc-500 text-[10px] font-google-sans">Living archetype of the Major Arcana</span>
                  </div>
                </div>
              </div>
              
              {/* No depart button */}
            </div>
          )}

          {/* Active Custom Persona Banner */}
          {activeCustomPersona && (
            <div className="px-4 py-2 bg-black flex items-center justify-between text-xs mb-2 rounded-lg border border-red-500/25 flex-shrink-0 font-google-sans text-red-400">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold">Advisor</span>
                <div className="font-google-sans text-left">
                  <div className="flex items-center">
                    <span className="font-bold text-zinc-200 font-google-sans">{activeCustomPersona}</span>
                    <span className="mx-2 text-zinc-700">|</span>
                    <span className="text-zinc-500 text-[10px] font-google-sans">Sovereign counsel of power & desire</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const releaseMsg: Message = {
                    id: crypto.randomUUID(),
                    role: 'model',
                    text: `[ Ended consultation with ${activeCustomPersona}. LAEVUS returns as your primary guide. ]`,
                    timestamp: new Date()
                  };
                  setActiveCustomPersona(null);
                  if (onPersonaChange) {
                    onPersonaChange(null);
                  }
                  setMessages(prev => [...prev, releaseMsg]);
                }}
                className="px-2.5 py-1 rounded bg-black text-red-400 text-[9px] uppercase hover:bg-red-500/10 transition-colors cursor-pointer border border-zinc-900 font-google-sans"
              >
                Depart
              </button>
            </div>
          )}


          {/* Top Header Bar outside the chat box */}
          <div className="w-full flex items-center justify-between px-2 mb-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 shrink-0">
            <span className="text-zinc-500 font-bold">
              {activeTarotPersona ? activeTarotPersona.toUpperCase() : activeCustomPersona ? activeCustomPersona.toUpperCase() : (getSavedVoiceSettings().enabled === false ? 'LAEVUS' : activePersonaName.toUpperCase())}
            </span>
            {messages.length > 0 && (
              <button
                onClick={handleShareEntireConversation}
                className="px-0 py-0 text-zinc-500 hover:text-[#DC143C] transition-all cursor-pointer text-[9px] uppercase tracking-wider font-mono"
                title="Share Conversation"
              >
                Share
              </button>
            )}
          </div>

          {/* Enlarged AI Chat Box (Messages Container) */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 min-h-0 py-6 px-2 sm:px-4 overflow-y-auto space-y-6 text-[#F8F7F4] flex flex-col relative my-1"
          >
            <div className="flex-1 space-y-6 w-full max-w-5xl mx-auto text-xs leading-relaxed">
              {messages.map((m) => {
                 const isUser = m.role === 'user';
                 const userDisplay = currentUser 
                   ? (currentUser.displayName ? currentUser.displayName.split(' ')[0] : currentUser.email ? currentUser.email.split('@')[0] : 'YOU')
                   : 'YOU';
                 return (
                   <div 
                     key={m.id}
                     className={`w-full flex my-3 animate-fadeIn px-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                   >
                     {isUser ? (
                       <div className="flex flex-col items-end max-w-[90%] sm:max-w-[80%]">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1 mr-1">
                           {userDisplay.toUpperCase()}
                         </div>
                         <div className="text-zinc-100 px-1 py-1 text-left font-google-sans text-xs">
                           <p className="whitespace-pre-wrap font-google-sans text-xs text-[#DC143C] font-bold tracking-wide">
                             {m.text}
                           </p>
                         </div>
                       </div>
                     ) : (
                       <div className="flex flex-col items-start max-w-[90%] sm:max-w-[80%]">
                         <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-1 ml-1">
                           {activeTarotPersona ? activeTarotPersona.toUpperCase() : activeCustomPersona ? activeCustomPersona.toUpperCase() : activePersonaName.toUpperCase()}
                         </div>
                         <div className="text-[#F8F7F4] px-1 py-1 text-left font-google-sans text-xs leading-relaxed">
                           <TypewriterText text={m.text} />
                         </div>
                       </div>
                     )}
                   </div>
                 );
              })}
              
              {isTyping && (
                <ThinkingIndicator personaName={activeTarotPersona || activeCustomPersona || activePersonaName} />
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* User Chat Bar positioned just above footer */}
          <div className="pt-2 pb-1 bg-transparent shrink-0 w-full">
            {/* Text input form */}
            <div className="relative flex items-center rounded-xl bg-black border border-zinc-800 focus-within:ring-1 focus-within:ring-[#DC143C]/40 transition-all p-2 gap-2 shadow-2xl">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                disabled={isTyping}
                placeholder="Type your message here..."
                rows={2}
                className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none px-2.5 py-1.5 resize-none font-google-sans"
              />
              <button
                type="button"
                onClick={handleToggleVoiceInput}
                className={isListening 
                  ? 'p-2.5 rounded-lg text-xs transition-all cursor-pointer border flex items-center justify-center shrink-0 bg-[#DC143C] text-white border-[#DC143C] animate-pulse shadow-[0_0_12px_rgba(220,20,60,0.5)]' 
                  : 'p-2.5 rounded-lg text-xs transition-all cursor-pointer border flex items-center justify-center shrink-0 bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-[#DC143C] hover:border-[#DC143C]/60 hover:bg-zinc-850 active:text-[#DC143C] active:border-[#DC143C]'
                }
                title="Dictate with voice"
                aria-label="Dictate with voice"
              >
                <svg className="w-4 h-4 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
              </button>
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className={input.trim() && !isTyping 
                  ? 'p-2.5 rounded-lg transition-all flex items-center justify-center shrink-0 bg-[#DC143C] hover:bg-[#B81132] text-white cursor-pointer shadow-[0_0_12px_rgba(220,20,60,0.5)] border border-[#DC143C]' 
                  : 'p-2.5 rounded-lg transition-all flex items-center justify-center shrink-0 bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-[#DC143C] hover:border-[#DC143C]/60 hover:bg-zinc-850 active:text-[#DC143C] active:border-[#DC143C] cursor-pointer'
                }
                title="Send message"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW: CONSOLIDATED DIVINATION HUB */}
      {(activeView === 'divination' || activeView === 'tarot') && (
        <DivinationHub
          initialTab={activeView === 'tarot' ? 'tarot' : 'oracle'}
          onReturnToChat={() => setActiveView('chat')}
          onStartPersonaReading={handleStartPersonaConversation}
          onStartReading={(prompt, mode, cards, extra) => {
            setActiveView('chat');
            handleSend(prompt, mode, cards, extra);
          }}
          onShareTarotReading={handleShareTarotReading}
        />
      )}

      {/* VIEW: CONSOLIDATED ACCOUNT & INSIGHTS HUB */}
      {(activeView === 'account' || activeView === 'inner-work' || activeView === 'transcripts') && (
        <AccountHub
          initialTab={activeView === 'inner-work' ? 'inner-work' : activeView === 'transcripts' ? 'transcripts' : 'account'}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onReturnToChat={() => setActiveView('chat')}
          streakCount={streakCount}
          daysRegistered={daysRegistered}
          sentimentScores={sentimentScores}
          transcripts={transcripts}
        />
      )}



      {/* VIEW: SOVEREIGN ADVISORS */}
      {activeView === 'advisors' && (
        <AdvisorsHub
          onReturnToChat={() => setActiveView('chat')}
          onStartPersonaReading={handleStartPersonaConversation}
        />
      )}

      {/* VIEW: KNOWLEDGE BASE */}
      {activeView === 'knowledge-base' && (
        <KnowledgeBase
          onReturnToChat={() => setActiveView('chat')}
          onStartPersonaReading={handleStartPersonaConversation}
        />
      )}

      {/* MINIMAL FOOTER */}
      <footer className="w-full border-t border-[#F8F7F4]/5 pt-2 pb-1 mt-3 flex flex-col justify-between items-center text-[9px] tracking-[0.15em] font-mono text-zinc-600 uppercase shrink-0 gap-2">
        <div className="flex flex-col sm:flex-row justify-center items-center w-full gap-2">
          <button 
            onClick={() => setShowAboutModal(true)}
            className="hover:text-[#DC143C] text-center transition-colors duration-300 focus:outline-none cursor-pointer border border-zinc-900 hover:border-[#DC143C]/40 pb-1 font-bold bg-black px-3 py-1.5 rounded-xl font-google-sans text-zinc-400 shadow-md"
          >
            All rights reserved "Left Hand Products LLC" 2026
          </button>
        </div>
      </footer>

      {/* ESOTERIC ABOUT US MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 select-text animate-fadeIn">
          <div className="bg-black border border-zinc-900 rounded-xl max-w-lg w-full p-6 relative shadow-2xl text-center font-google-sans">
            
            <button 
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-[#DC143C] transition-colors cursor-pointer text-xs font-mono uppercase tracking-wider"
            >
              Close
            </button>

            <h3 className="font-google-sans text-sm sm:text-base font-extrabold uppercase tracking-[0.1em] text-[#F8F7F4] mb-3 mt-2">
              ABOUT ME
            </h3>
            
            <div className="text-left font-google-sans text-xs sm:text-[12px] text-zinc-300 leading-relaxed space-y-3.5 max-h-[350px] overflow-y-auto pr-2 scrollbar-thin select-text">
              <p>
                Hi, I'm <span className="text-[#F8F7F4] font-bold">Andrew Bicknell</span>, founder of <a href="https://theleft.one" target="_blank" rel="noopener noreferrer" className="font-ruthie text-2xl sm:text-3xl text-zinc-200 hover:text-white inline-flex items-center gap-0.5 transition-colors mx-1 leading-none align-middle">the<span className="text-[#DC143C]">left</span>.one</a> and <span className="text-[#F8F7F4] font-bold">Left Hand Products, LLC</span>.
              </p>
              
              <p>
                My background is in business and entrepreneurship. Over the years, I taught myself to code and embraced modern AI technologies so I could build the software ideas and creative platforms I'm passionate about from the ground up.
              </p>
              
              <p>
                Outside of building software, I have a genuine appreciation for diverse traditions. I enjoy celebrating holidays like Christmas and Easter with family just as much as observing the natural turning of the seasons and Pagan holidays. To me, celebrating life and connection doesn't require boxing yourself into just one tradition.
              </p>

              <p>
                I've also spent years reading and exploring esoteric philosophy, hermetic traditions, and unconventional ideas. I don't subscribe rigidly to any one dogma—I just have an open mind and a deep curiosity for history, symbolism, and how people throughout history have sought meaning.
              </p>

              <p>
                Today, I live on our family's property in Fountain, Colorado, enjoying life alongside my sister Candace, my nephew Noah, and my cat Tiger Lily Woods.
              </p>

              <p className="border-t border-zinc-800/50 pt-3 text-[9px] text-zinc-600 italic">
                "As above, so below; as within, so without. The left hand holds the secret of the first division."
              </p>
            </div>

            <div className="mt-6 font-google-sans">
              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-colors cursor-pointer font-google-sans"
              >
                RETURN TO CHAT
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Social Media Sharing Modal */}
      <SocialShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        content={shareContent}
      />

    </div>
  );
};
