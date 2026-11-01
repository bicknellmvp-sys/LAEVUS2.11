import React, { useState, useEffect } from 'react';

export interface TarotCard {
  name: string;
  position: 'Past' | 'Present' | 'Future';
  description: string;
  symbol: string;
  meaning: string;
  image: string;
}

interface Oracle3DCardRevealProps {
  cards: TarotCard[];
  isDrawing: boolean;
  flippedCount: number;
  onConsult?: () => void;
  onDrawNew?: () => void;
  question?: string;
}

export const Oracle3DCardReveal: React.FC<Oracle3DCardRevealProps> = ({
  cards,
  isDrawing,
  flippedCount,
  onConsult,
  onDrawNew,
  question
}) => {
  // Local state to support individual manual card flipping override
  const [userFlipped, setUserFlipped] = useState<boolean[]>([false, false, false]);
  const [selectedInspectCard, setSelectedInspectCard] = useState<TarotCard | null>(null);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  // Sync auto-flip progression with state
  useEffect(() => {
    setUserFlipped([
      flippedCount >= 1,
      flippedCount >= 2,
      flippedCount >= 3
    ]);
  }, [flippedCount]);

  // Handle manual user toggle on card click
  const handleToggleCardFlip = (index: number) => {
    setUserFlipped(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleRevealAll = () => {
    setUserFlipped([true, true, true]);
  };

  const handleHideAll = () => {
    setUserFlipped([false, false, false]);
  };

  const isAllFlipped = userFlipped.every(Boolean);

  // Position theme mapping
  const positionThemes = {
    Past: {
      badgeBg: 'bg-[#DC143C]/20 border-[#DC143C]/60 text-[#DC143C]',
      glowColor: 'shadow-[0_0_25px_rgba(220,20,60,0.35)]',
      borderGlow: 'border-[#DC143C]/50',
      label: '01. PAST FOUNDATION',
      subtext: 'Influences anchoring your path'
    },
    Present: {
      badgeBg: 'bg-amber-500/20 border-amber-500/60 text-amber-400',
      glowColor: 'shadow-[0_0_25px_rgba(245,158,11,0.35)]',
      borderGlow: 'border-amber-500/50',
      label: '02. PRESENT CATALYST',
      subtext: 'Energetic vortex active right now'
    },
    Future: {
      badgeBg: 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400',
      glowColor: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      borderGlow: 'border-emerald-500/50',
      label: '03. FUTURE TRAJECTORY',
      subtext: 'Ultimate destiny unfolding ahead'
    }
  };

  if (isDrawing) {
    return (
      <div className="w-full py-12 px-4 rounded-2xl bg-zinc-950 border border-[#DC143C]/30 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
        {/* Shuffling animation effects */}
        <div className="absolute inset-0 bg-radial from-[#DC143C]/10 via-transparent to-transparent pointer-events-none animate-pulse" />
        
        {/* Stack of cards shuffling */}
        <div className="relative w-40 h-60 my-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-black border-2 border-[#DC143C]/40 rounded-xl shadow-[0_0_20px_rgba(220,20,60,0.3)] animate-deck-shuffle transform -rotate-6" />
          <div className="absolute inset-0 bg-black border-2 border-amber-500/40 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-deck-shuffle delay-200 transform rotate-6" />
          <div className="absolute inset-0 bg-zinc-950 border-2 border-[#DC143C] rounded-xl shadow-[0_0_30px_rgba(220,20,60,0.6)] flex flex-col items-center justify-center p-4 text-center animate-card-glow z-10">
            <span className="text-3xl text-[#DC143C] mb-2 animate-spin">✦</span>
            <span className="text-[10px] font-mono text-zinc-300 uppercase tracking-widest font-bold">
              Shuffling Scrying Deck
            </span>
          </div>
        </div>

        <p className="text-xs font-mono text-[#DC143C] uppercase tracking-widest animate-pulse mt-2">
          Consulting the etheric matrix...
        </p>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Top Spread Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-950 p-4 rounded-xl border border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#F8F7F4] font-bold">
              3-Card Scrying Spread
            </span>
          </div>
          {question && (
            <p className="text-[11px] font-google-sans text-zinc-400 italic mt-0.5 line-clamp-1">
              "{question}"
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={isAllFlipped ? handleHideAll : handleRevealAll}
            className="px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            {isAllFlipped ? '✦ Turn All Face-Down' : '✦ Reveal All Cards'}
          </button>

          {onDrawNew && (
            <button
              onClick={onDrawNew}
              className="px-3 py-1.5 rounded-lg bg-[#DC143C]/20 hover:bg-[#DC143C] border border-[#DC143C]/50 text-[#DC143C] hover:text-white text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer font-bold"
            >
              Shuffle Again
            </button>
          )}
        </div>
      </div>

      {/* 3-Card Oracle Grid (3D Flip Animation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => {
          const isFlipped = userFlipped[idx];
          const theme = positionThemes[card.position] || positionThemes.Past;

          return (
            <div key={`${card.name}-${idx}`} className="flex flex-col items-center">
              {/* Position Header Label */}
              <div className="w-full mb-2 flex items-center justify-between px-1">
                <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider ${theme.badgeBg}`}>
                  {theme.label}
                </span>
                <span className="text-[9px] font-mono text-zinc-600">
                  {isFlipped ? 'Revealed' : 'Face Down'}
                </span>
              </div>

              {/* 3D Flip Card Container */}
              <div
                onClick={() => handleToggleCardFlip(idx)}
                className={`w-full h-[380px] perspective-1000 cursor-pointer group select-none relative`}
                title={`Click to ${isFlipped ? 'turn face down' : 'reveal card'}`}
              >
                {/* Flipping Inner Wrapper */}
                <div
                  className={`w-full h-full relative rounded-2xl transform-style-3d card-flip-transition shadow-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* ==================================================== */}
                  {/* CARD BACK SIDE (Face Down)                           */}
                  {/* ==================================================== */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-zinc-950 border-2 border-[#DC143C]/40 p-4 flex flex-col justify-between items-center backface-hidden overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] group-hover:border-[#DC143C] transition-colors">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(#DC143C_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
                    
                    {/* Corner Ornaments */}
                    <div className="w-full flex justify-between text-[10px] text-[#DC143C]/60 font-mono">
                      <span>❖</span>
                      <span>✦</span>
                      <span>❖</span>
                    </div>

                    {/* Central Sacred Sigil */}
                    <div className="flex flex-col items-center text-center my-auto">
                      <div className="w-20 h-20 rounded-full bg-black border-2 border-[#DC143C]/50 flex items-center justify-center text-3xl text-[#DC143C] shadow-[0_0_20px_rgba(220,20,60,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(220,20,60,0.6)] transition-all duration-300">
                        {card.symbol || '✦'}
                      </div>
                      <h4 className="font-syne font-extrabold text-xs uppercase tracking-widest text-[#F8F7F4] mt-3">
                        LAEVUS 2000
                      </h4>
                      <span className="text-[9px] font-mono text-[#DC143C] uppercase tracking-widest mt-1">
                        Cyber-Spiritual Scrying
                      </span>
                    </div>

                    {/* Footer Instruction */}
                    <div className="w-full text-center border-t border-zinc-900 pt-2.5">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 group-hover:text-[#DC143C] transition-colors flex items-center justify-center gap-1.5">
                        <span className="animate-pulse">✦</span> Click to Flip Card <span className="animate-pulse">✦</span>
                      </span>
                    </div>
                  </div>

                  {/* ==================================================== */}
                  {/* CARD FRONT SIDE (Revealed Face Up)                   */}
                  {/* ==================================================== */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl bg-black border-2 ${theme.borderGlow} p-3.5 flex flex-col justify-between backface-hidden rotate-y-180 overflow-hidden ${theme.glowColor}`}
                  >
                    {/* Image Area with Fallback */}
                    <div className="relative w-full h-[220px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-900 group/img">
                      {!imageError[idx] && card.image ? (
                        <img
                          src={card.image}
                          alt={card.name}
                          onError={() => setImageError(prev => ({ ...prev, [idx]: true }))}
                          className="w-full h-full object-cover object-center group-hover/img:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 to-black p-4 text-center">
                          <span className="text-4xl text-[#DC143C] mb-2">{card.symbol || '🃏'}</span>
                          <span className="text-xs font-syne font-bold uppercase text-zinc-200">{card.name}</span>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase mt-1">Tarot Arcana</span>
                        </div>
                      )}

                      {/* Top Overlay Badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-zinc-800 text-[8px] font-mono uppercase font-bold text-zinc-300">
                        {card.symbol || 'Major'}
                      </div>
                    </div>

                    {/* Card Information */}
                    <div className="flex flex-col flex-1 justify-between pt-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-syne font-extrabold text-sm uppercase text-[#F8F7F4] tracking-wide line-clamp-1">
                            {card.name}
                          </h4>
                        </div>
                        <p className="text-[10px] font-google-sans text-zinc-400 leading-snug line-clamp-2 mt-1">
                          {card.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                          {card.meaning.length > 45 ? card.meaning.substring(0, 45) + '...' : card.meaning}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInspectCard(card);
                          }}
                          className="px-2 py-1 rounded bg-zinc-900 hover:bg-[#DC143C] text-zinc-300 hover:text-black text-[9px] font-mono uppercase tracking-wider font-bold transition-colors cursor-pointer"
                        >
                          Lore ↗
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtext info */}
              <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-wider mt-2 text-center">
                {theme.subtext}
              </span>
            </div>
          );
        })}
      </div>

      {/* Consult Oracle Main Action Call */}
      {isAllFlipped && onConsult && (
        <div className="flex flex-col items-center gap-2 pt-4 animate-fadeIn">
          <button
            onClick={onConsult}
            className="px-8 py-3.5 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-extrabold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_25px_rgba(220,20,60,0.6)] hover:shadow-[0_0_35px_rgba(220,20,60,0.9)] hover:scale-105 active:scale-95"
          >
            ✦ Consult Laevus Oracle with this Spread ✦
          </button>
          <p className="text-[10px] text-zinc-500 font-mono italic">
            The cards are aligned in physical form. Channel the divine response now.
          </p>
        </div>
      )}

      {/* CARD INSPECT LORE MODAL */}
      {selectedInspectCard && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-950 border border-[#DC143C]/50 rounded-2xl max-w-lg w-full p-6 relative shadow-[0_0_50px_rgba(220,20,60,0.3)]">
            <button
              onClick={() => setSelectedInspectCard(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex gap-4 items-start mb-4">
              <div className="w-24 h-36 rounded-xl bg-black border border-zinc-800 overflow-hidden flex-shrink-0">
                {selectedInspectCard.image ? (
                  <img src={selectedInspectCard.image} alt={selectedInspectCard.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-[#DC143C]">
                    {selectedInspectCard.symbol}
                  </div>
                )}
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/20 text-[#DC143C] border border-[#DC143C]/40 text-[9px] font-mono font-bold uppercase tracking-widest">
                  {selectedInspectCard.position} Position
                </span>
                <h3 className="text-xl font-syne font-extrabold text-zinc-100 uppercase tracking-tight mt-1.5">
                  {selectedInspectCard.name}
                </h3>
                <p className="text-xs text-zinc-400 font-google-sans mt-1">
                  {selectedInspectCard.description}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-zinc-900 pt-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#DC143C] font-bold block mb-1">
                  ✦ Esoteric Meaning & Archetype
                </span>
                <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                  {selectedInspectCard.meaning}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedInspectCard(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-mono uppercase text-zinc-300 cursor-pointer"
              >
                Close Lore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
