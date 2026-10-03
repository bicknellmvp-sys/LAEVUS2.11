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
  const [runeQuestion, setRuneQuestion] = useState('');
  const [selectedRuneAdvisor, setSelectedRuneAdvisor] = useState('Odin');
  const [selectedRuneVoice, setSelectedRuneVoice] = useState('Laevus');

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


      {/* TAB CONTENT: PRIVATE PULL (PHYSICAL REALM SPREAD) */}
      {activeTab === 'private_pull' && (
        <UploadSpread
          onReturnToChat={onReturnToChat}
          onCompleteReading={(readingData) => {
            if (onStartReading) {
              const mappedCards = readingData.cards.map(c => ({
                name: c.name,
                position: c.position as any,
                description: c.description,
                symbol: c.symbol,
                meaning: c.meaning,
                image: c.image
              }));
              onStartReading(
                `Synthesize this physical realm Tarot spread: "${readingData.question}"`,
                'tarot-physical',
                mappedCards,
                { question: readingData.question }
              );
            }
          }}
        />
      )}


      {/* TAB CONTENT: RUNES */}
      {activeTab === 'cast_your_lot' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-2">
              Cast your lot (Rune Divination)
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Focus your intent on the Norse cosmos. Enter your inquiry, select your reading advisor (defaults to Odin), pick your desired vocal medium, and draw three runes to illuminate your path.
            </p>

            {/* Rune Question */}
            <div className="mb-4">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                Your Inquiry / Question (Optional)
              </label>
              <input
                type="text"
                value={runeQuestion}
                onChange={(e) => setRuneQuestion(e.target.value)}
                placeholder="e.g., What obstacles must I prepare to encounter?"
                className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              {/* Advisor Selector */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Reading Advisor (Defaults to Odin)
                </label>
                <select
                  value={selectedRuneAdvisor}
                  onChange={(e) => setSelectedRuneAdvisor(e.target.value)}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#DC143C]/50"
                >
                  <option value="Odin">Odin (The All-Father)</option>
                  <option value="Madame Blavatsky">Madame Helena Blavatsky</option>
                  <option value="Genghis Khan">Genghis Khan (The Conqueror)</option>
                  <option value="Marie Antoinette">Marie Antoinette (Sovereign Queen)</option>
                  <option value="Machiavelli">Niccolò Machiavelli</option>
                  <option value="Left Hand Path Magus">Left Hand Path Magus</option>
                  <option value="Blackhat SEO Alchemist">Blackhat SEO Alchemist</option>
                  <option value="Hazrat Inayat Khan">Sufi Harmony Sage</option>
                  <option value="Marie Laveau">Marie Laveau (Voodoo Priestess)</option>
                  <option value="Casanova">Giacomo Casanova</option>
                  <option value="Diotima">Diotima of Mantinea</option>
                  <option value="Casanova & Diotima">Casanova & Diotima (Lovers Debate)</option>
                </select>
              </div>

              {/* Voice Selector */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Speaking Voice (Defaults to Laevus)
                </label>
                <select
                  value={selectedRuneVoice}
                  onChange={(e) => setSelectedRuneVoice(e.target.value)}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#DC143C]/50"
                >
                  <option value="Laevus">Laevus Voice (Male)</option>
                  <option value="Khan">Khan Voice (Male)</option>
                  <option value="Madame Blavatsky">Madame Blavatsky Voice (Female)</option>
                  <option value="Marie">Marie Antoinette Voice (Female)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleDrawRunes}
                className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(220,20,60,0.4)]"
              >
                {drawnRunes.length > 0 ? 'Cast New Runes' : 'Cast 3 Runes'}
              </button>
            </div>
          </div>

          {/* Render Drawn Runes */}
          {drawnRunes.length === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {drawnRunes.map((rune, idx) => (
                  <div key={rune.name} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
                    <div className="absolute top-2 left-3 text-[9px] font-mono text-zinc-600 uppercase">
                      RUNE {idx + 1}
                    </div>
                    <div className="w-16 h-16 rounded-full bg-black border border-zinc-800 flex items-center justify-center text-3xl font-syne text-[#DC143C] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(220,20,60,0.15)] mb-3 mt-1.5">
                      {rune.symbol}
                    </div>
                    <h4 className="font-syne font-extrabold text-sm uppercase text-zinc-200 tracking-wider">
                      {rune.name}
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                      {rune.meaning}
                    </span>
                    <p className="text-[11px] text-zinc-400 font-google-sans leading-relaxed mt-2.5 border-t border-zinc-900 pt-2.5 w-full">
                      {rune.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Consult Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => {
                    const runesList = drawnRunes.map((r, idx) => `[Position ${idx + 1}]: ${r.name} (${r.meaning})`).join(', ');
                    const promptText = runeQuestion.trim()
                      ? `Perform a profound Norse Rune interpretation for my question: "${runeQuestion}". Runes cast: ${runesList}.`
                      : `Perform a profound Norse Rune interpretation. Runes cast: ${runesList}.`;
                    
                    if (onStartReading) {
                      onStartReading(promptText, 'tarot-persona', [], {
                        persona: selectedRuneAdvisor,
                        voice: selectedRuneVoice,
                        runes: drawnRunes,
                        runeQuestion: runeQuestion
                      });
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(220,20,60,0.5)]"
                >
                  Consult {selectedRuneAdvisor} with these Runes
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
