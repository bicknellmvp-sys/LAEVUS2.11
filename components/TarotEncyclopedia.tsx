import React, { useState } from 'react';
import { TAROT_DATABASE, TarotCardData } from '../data/tarotCards';

interface TarotCard {
  name: string;
  position: 'Past' | 'Present' | 'Future';
  description: string;
  symbol: string;
  meaning: string;
  image: string;
}

interface TarotEncyclopediaProps {
  onReturnToChat?: () => void;
  onStartSeanceWithCard?: (cardName: string, query?: string) => void;
}

export const TarotEncyclopedia: React.FC<TarotEncyclopediaProps> = ({
  onReturnToChat,
  onStartSeanceWithCard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCardData>(TAROT_DATABASE[0]);

  // Filter cards based on query and suit
  const filteredCards = TAROT_DATABASE.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSuit = suitFilter === 'all' || card.suit === suitFilter;
    return matchesSearch && matchesSuit;
  });

  const handleSummonInSanctuary = () => {
    if (onStartSeanceWithCard && selectedCard) {
      onStartSeanceWithCard(selectedCard.name, `Speak to me of your secret wisdom, ${selectedCard.name}.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto font-google-sans text-zinc-200 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-[10px] font-mono font-bold uppercase tracking-widest">
              Tarot Archives
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Complete 78-Card Grimoire
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-syne text-[#F8F7F4] uppercase tracking-tight mt-1">
            Tarot Encyclopedia
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card List - Left Column (Renders at bottom on mobile, left on desktop) */}
        <div className="order-2 lg:order-1 lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col h-[350px] lg:h-[520px] overflow-hidden">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-2.5">
            Deck Inventory
          </h3>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards..."
            className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 mb-2.5"
          />

          {/* Suit Filters */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            {['all', 'major', 'wands', 'cups', 'swords', 'pentacles'].map((suit) => (
              <button
                key={suit}
                onClick={() => setSuitFilter(suit as any)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                  suitFilter === suit
                    ? 'bg-zinc-900 text-[#DC143C] border-[#DC143C]/30'
                    : 'bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300'
                }`}
              >
                {suit}
              </button>
            ))}
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredCards.map((card) => {
              const isSelected = selectedCard?.name === card.name;
              return (
                <button
                  key={card.name}
                  onClick={() => setSelectedCard(card)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[50px] ${
                    isSelected
                      ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg'
                      : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-syne font-bold text-xs truncate block w-full">{card.name}</span>
                  <div className="flex items-center justify-between text-[7px] font-mono uppercase tracking-wider text-zinc-500 mt-1">
                    <span>{card.arcana} Arcana</span>
                    <span>{card.suit === 'major' ? 'Spirit' : card.suit}</span>
                  </div>
                </button>
              );
            })}
            {filteredCards.length === 0 && (
              <div className="text-center py-8 text-zinc-600 text-xs font-mono">
                No cards found.
              </div>
            )}
          </div>
        </div>

        {/* Card Details View - Right Column (Renders at top on mobile, right on desktop) */}
        <div className="order-1 lg:order-2 lg:col-span-8">
          {selectedCard ? (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row gap-5 animate-fadeIn min-h-[420px] lg:h-[520px]">
              
              {/* Visual Card Card */}
              <div className="md:w-5/12 flex flex-col items-center border-b md:border-b-0 md:border-r border-zinc-900 pb-4 md:pb-0 md:pr-5 shrink-0">
                {selectedCard.image ? (
                  <div className="w-28 h-48 sm:w-32 sm:h-52 rounded-xl overflow-hidden border-2 border-zinc-800 shadow-xl bg-black mb-3 group relative shrink-0">
                    <img
                      src={selectedCard.image}
                      alt={selectedCard.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-28 h-48 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center bg-black mb-3 shrink-0">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">Image Missing</span>
                  </div>
                )}

                <h3 className="font-syne font-extrabold text-base text-center text-[#F8F7F4] uppercase tracking-tight">
                  {selectedCard.name}
                </h3>
                <span className="text-[9px] font-mono text-[#DC143C] uppercase tracking-widest font-bold mt-0.5">
                  {selectedCard.arcana} Arcana
                </span>

                <div className="w-full space-y-1.5 mt-3 text-[9px] font-mono border-t border-zinc-900/60 pt-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ELEMENT</span>
                    <span className="text-zinc-300">{selectedCard.element}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">ASTROLOGY</span>
                    <span className="text-zinc-300">{selectedCard.astrology}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">NUMBER</span>
                    <span className="text-zinc-300">{selectedCard.number}</span>
                  </div>
                </div>
              </div>

              {/* Conceptual / Expositions */}
              <div className="md:w-7/12 flex flex-col justify-between space-y-3 min-w-0">
                <div className="space-y-3 overflow-y-auto lg:max-h-[400px] pr-1 scrollbar-thin">
                  <div>
                    <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">Keywords</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {selectedCard.keywords.map((kw: string) => (
                        <span
                          key={kw}
                          className="text-[8px] font-mono uppercase tracking-wider bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded-md border border-zinc-850"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block mb-0.5">Upright Meaning</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-google-sans">
                      {selectedCard.meaning}
                    </p>
                  </div>

                  {selectedCard.reversedMeaning && (
                    <div>
                      <span className="text-[8px] font-mono uppercase text-[#DC143C] tracking-wider block mb-0.5">Reversed Meaning</span>
                      <p className="text-xs text-zinc-400 leading-relaxed font-google-sans">
                        {selectedCard.reversedMeaning}
                      </p>
                    </div>
                  )}

                  {selectedCard.description && (
                    <div className="border-t border-zinc-900 pt-2">
                      <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block mb-0.5">Symbolic Essence</span>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-google-sans">
                        {selectedCard.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-900 flex justify-end">
                  <button
                    onClick={handleSummonInSanctuary}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] border border-zinc-800 hover:border-transparent text-[10px] font-mono uppercase font-bold text-zinc-300 hover:text-black transition-all cursor-pointer shadow-md"
                  >
                    Summon Archetype
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl flex items-center justify-center min-h-[420px] text-zinc-600 font-mono text-xs uppercase">
              Select a Card to study its secrets
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
