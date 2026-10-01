import React, { useState } from 'react';
import { TAROT_DATABASE } from '../data/tarotCards';
import { RUNE_DATABASE, RuneData } from '../data/runes';
import { UploadSpread } from './UploadSpread';

interface TarotCard {
  name: string;
  position: 'Past' | 'Present' | 'Future';
  description: string;
  symbol: string;
  meaning: string;
  image: string;
}

interface DivinationHubProps {
  initialTab?: 'oracle' | 'private_pull' | 'runes';
  onReturnToChat?: () => void;
  onStartSeanceWithCard?: (cardName: string, query?: string) => void;
  onStartReading?: (prompt: string, mode: string, cards: TarotCard[], extra?: any) => void;
  onShareTarotReading?: (reading: any) => void;
  onStartPersonaReading?: (prompt: string, persona: string) => void;
}

export const DivinationHub: React.FC<DivinationHubProps> = ({
  initialTab = 'oracle',
  onReturnToChat,
  onStartSeanceWithCard,
  onStartReading,
  onShareTarotReading,
  onStartPersonaReading
}) => {
  const [activeTab, setActiveTab] = useState<'oracle' | 'private_pull' | 'cast_your_lot'>(() => {
    if (initialTab === 'private_pull') return 'private_pull';
    if (initialTab === 'runes') return 'cast_your_lot';
    return 'oracle';
  });

  // Rune state
  const [drawnRunes, setDrawnRunes] = useState<RuneData[]>([]);

  const handleDrawRunes = () => {
    const shuffled = [...RUNE_DATABASE].sort(() => 0.5 - Math.random());
    setDrawnRunes(shuffled.slice(0, 3));
  };

  const [question, setQuestion] = useState('');

  // Oracle 3-card spread state
  const [isDrawing, setIsDrawing] = useState(false);
  const [flippedCount, setFlippedCount] = useState(0);
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);

  const handleDrawCards = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setFlippedCount(0);
    setDrawnCards([]);

    // Pick 3 random distinct cards from TAROT_DATABASE
    setTimeout(() => {
      const shuffled = [...TAROT_DATABASE].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      
      const positions: Array<'Past' | 'Present' | 'Future'> = ['Past', 'Present', 'Future'];
      const newCards: TarotCard[] = selected.map((c, idx) => ({
        name: c.name,
        position: positions[idx],
        description: c.description || c.symbolism || c.keywords.slice(0, 3).join(', '),
        symbol: c.symbol || (c.arcana === 'major' ? 'Major' : 'Minor'),
        meaning: c.meaning,
        image: c.image
      }));

      setDrawnCards(newCards);
      setIsDrawing(false);
      // Automatically reveal cards one by one
      setTimeout(() => setFlippedCount(1), 300);
      setTimeout(() => setFlippedCount(2), 700);
      setTimeout(() => setFlippedCount(3), 1100);
    }, 600);
  };

  const handleConsultOracle = () => {
    if (drawnCards.length === 0 || !onStartReading) return;
    const promptText = question.trim() 
      ? `Conduct a profound 3-card Tarot reading for my question: "${question}". Past: ${drawnCards[0].name}, Present: ${drawnCards[1].name}, Future: ${drawnCards[2].name}.`
      : `Conduct a profound 3-card Tarot reading. Past: ${drawnCards[0].name}, Present: ${drawnCards[1].name}, Future: ${drawnCards[2].name}.`;
    
    onStartReading(promptText, 'tarot', drawnCards, { question });
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto font-google-sans text-zinc-200">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-[10px] font-mono font-bold uppercase tracking-widest">
              Sanctuary Hub
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Divination & Grimoire
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-syne text-[#F8F7F4] uppercase tracking-tight mt-1">
            Divination Sanctuary
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onReturnToChat && (
            <button
              onClick={onReturnToChat}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono uppercase text-zinc-300 hover:text-[#DC143C] hover:border-[#DC143C]/50 transition-colors cursor-pointer"
            >
              Return to Chat
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-black p-1.5 rounded-xl border border-zinc-900 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('oracle')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'oracle'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          3-Card Oracle Spread
        </button>
        <button
          onClick={() => setActiveTab('private_pull')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'private_pull'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Private Pull
        </button>
        <button
          onClick={() => setActiveTab('cast_your_lot')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'cast_your_lot'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Cast your lot
        </button>
      </div>

      {/* TAB CONTENT: ORACLE SPREAD */}
      {activeTab === 'oracle' && (
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-2">
              Past, Present & Future Oracle
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Focus your intent, enter your question or inquiry (optional), and draw three cards from the cyber-spiritual deck to reveal your path.
            </p>

            <div className="mb-4">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                Your Inquiry / Question (Optional)
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., What guidance do I need for my creative journey?"
                className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDrawCards}
                disabled={isDrawing}
                className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(220,20,60,0.4)] disabled:opacity-50"
              >
                {isDrawing ? 'Shuffling Deck...' : drawnCards.length > 0 ? 'Draw New Spread' : 'Draw 3-Card Spread'}
              </button>
            </div>
          </div>

          {drawnCards.length === 3 && flippedCount === 3 && (
            <div className="flex justify-center pt-2">
              <button
                onClick={handleConsultOracle}
                className="px-6 py-3 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(220,20,60,0.5)]"
              >
                Consult Laevus Oracle with this Spread
              </button>
            </div>
          )}
        </div>
      )}


      {/* TAB CONTENT: RUNES */}
      {activeTab === 'cast_your_lot' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-4">
              Cast your lot
            </h3>
            <button
              onClick={handleDrawRunes}
              className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(220,20,60,0.4)]"
            >
              Draw 3 Runes
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
