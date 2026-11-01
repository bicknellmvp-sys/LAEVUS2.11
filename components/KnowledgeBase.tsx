import React, { useState, useEffect } from 'react';
import { TAROT_DATABASE, TarotCardData } from '../data/tarotCards';
import { Bookshelf } from './Bookshelf';
import { RuneEncyclopedia } from './RuneEncyclopedia';
import { NorseHistoryCodex } from './NorseHistoryCodex';
import { FutharkFAQCompendium } from './FutharkFAQCompendium';
import { HermeticLexicon } from './HermeticLexicon';

export type KnowledgeBaseTab =
  | 'bookshelf'
  | 'tarot_encyclopedia'
  | 'rune_encyclopedia'
  | 'futhark_faq'
  | 'norse_history'
  | 'hermetic_lexicon';

interface KnowledgeBaseProps {
  onReturnToChat?: () => void;
  onStartPersonaReading?: (prompt: string, persona: string) => void;
  onConveneRoundTable?: () => void;
  initialTab?: KnowledgeBaseTab;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  onReturnToChat,
  onStartPersonaReading,
  onConveneRoundTable,
  initialTab = 'bookshelf'
}) => {
  const [activeTab, setActiveTab] = useState<KnowledgeBaseTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Tarot state
  const [searchQuery, setSearchQuery] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCardData>(TAROT_DATABASE[0]);

  // Filter cards
  const filteredCards = TAROT_DATABASE.filter((card) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      card.name.toLowerCase().includes(q) ||
      card.keywords.some((kw) => kw.toLowerCase().includes(q)) ||
      card.element.toLowerCase().includes(q) ||
      card.astrology.toLowerCase().includes(q);

    const matchesSuit = suitFilter === 'all' || card.suit === suitFilter;
    return matchesSearch && matchesSuit;
  });

  const handleConsultFromEncyclopedia = (cardName: string) => {
    if (onStartPersonaReading) {
      onStartPersonaReading(
        `Tell me the secret esoteric meaning, shadow warnings, and sovereign lessons of ${cardName}.`,
        cardName
      );
    }
  };

  const handleAdvisorInquiry = (advisor: string, prompt: string) => {
    if (onStartPersonaReading) {
      onStartPersonaReading(prompt, advisor);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 overflow-y-auto font-google-sans text-zinc-200 animate-fadeIn select-text">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-[10px] font-mono font-bold uppercase tracking-widest">
              LAEVUS 2000 ARCHIVES
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Living Esoteric Knowledge Base
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-syne text-[#F8F7F4] uppercase tracking-tight mt-1">
            Knowledge Base
          </h2>
          <p className="text-xs text-zinc-400 font-google-sans mt-0.5 max-w-2xl">
            The complete repository: explore the 16-Volume Canonical Bookshelf, the 78-Card Tarot Deck, the 24 Elder Futhark Runes, the Norse Mythological Codex, Runic FAQ, and the Seven Hermetic Laws.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onConveneRoundTable && (
            <button
              onClick={onConveneRoundTable}
              className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-zinc-900 border border-[#DC143C]/50 hover:border-[#DC143C] text-xs font-mono uppercase text-[#DC143C] hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(220,20,60,0.2)]"
            >
              <span>🏛️ Round Table</span>
            </button>
          )}
          {onReturnToChat && (
            <button
              onClick={onReturnToChat}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono uppercase text-zinc-300 hover:text-[#DC143C] hover:border-[#DC143C]/50 transition-colors cursor-pointer"
            >
              Return to Sanctuary
            </button>
          )}
        </div>
      </div>

      {/* Primary Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-black p-1.5 rounded-xl border border-zinc-900 mb-6 w-full">
        <button
          onClick={() => setActiveTab('bookshelf')}
          className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
            activeTab === 'bookshelf'
              ? 'bg-[#DC143C] text-white shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Bookshelf (16)
        </button>
        <button
          onClick={() => setActiveTab('tarot_encyclopedia')}
          className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
            activeTab === 'tarot_encyclopedia'
              ? 'bg-[#DC143C] text-white shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Tarot (78 Cards)
        </button>
        <button
          onClick={() => setActiveTab('rune_encyclopedia')}
          className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
            activeTab === 'rune_encyclopedia'
              ? 'bg-[#DC143C] text-white shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Rune Codex (24)
        </button>
        <button
          onClick={() => setActiveTab('futhark_faq')}
          className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
            activeTab === 'futhark_faq'
              ? 'bg-[#DC143C] text-white shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Futhark FAQ
        </button>
        <button
          onClick={() => setActiveTab('norse_history')}
          className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
            activeTab === 'norse_history'
              ? 'bg-[#DC143C] text-white shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Norse Cosmos
        </button>
        <button
          onClick={() => setActiveTab('hermetic_lexicon')}
          className={`px-3 py-2 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer text-center ${
            activeTab === 'hermetic_lexicon'
              ? 'bg-[#DC143C] text-white shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Hermetic Laws
        </button>
      </div>

      {/* PILLAR 1: BOOKSHELF */}
      {activeTab === 'bookshelf' && (
        <div className="animate-fadeIn">
          <Bookshelf onConsultAdvisor={handleAdvisorInquiry} />
        </div>
      )}

      {/* PILLAR 2: TAROT ENCYCLOPEDIA (78 CARDS) */}
      {activeTab === 'tarot_encyclopedia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Card list - left column */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col h-[520px] lg:h-[620px] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#DC143C]">
                Tarot Deck ({filteredCards.length} Cards)
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                78 Total Arcana
              </span>
            </div>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards, astrology, element, meaning..."
              className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 mb-2.5 font-google-sans"
            />

            {/* Suit & Arcana Filters */}
            <div className="flex flex-wrap gap-1 mb-2.5">
              {['all', 'major', 'wands', 'cups', 'swords', 'pentacles'].map((suit) => (
                <button
                  key={suit}
                  onClick={() => setSuitFilter(suit as any)}
                  className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
                    suitFilter === suit
                      ? 'bg-zinc-900 text-[#DC143C] border-[#DC143C]/40 font-bold'
                      : 'bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  {suit === 'all' ? 'All (78)' : suit}
                </button>
              ))}
            </div>

            {/* Card Items List */}
            <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 scrollbar-thin">
              {filteredCards.map((card) => {
                const isSelected = selectedCard?.name === card.name;
                return (
                  <button
                    key={card.name}
                    onClick={() => setSelectedCard(card)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between min-h-[50px] ${
                      isSelected
                        ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg shadow-[#DC143C]/10'
                        : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-syne font-bold text-xs truncate block w-full">{card.name}</span>
                      <span className="text-[10px] text-zinc-500 ml-1">{card.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-[7.5px] font-mono uppercase tracking-wider text-zinc-500 mt-1">
                      <span>{card.arcana} ARCANA</span>
                      <span>{card.suit === 'major' ? card.astrology : card.suit}</span>
                    </div>
                  </button>
                );
              })}
              {filteredCards.length === 0 && (
                <div className="text-center py-8 text-zinc-600 text-xs font-mono">
                  No cards found matching your query.
                </div>
              )}
            </div>
          </div>

          {/* Full Card Details - Right column */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            {selectedCard ? (
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row gap-5 animate-fadeIn min-h-[420px] lg:h-[620px]">
                
                {/* Visual Details */}
                <div className="md:w-5/12 flex flex-col items-center border-b md:border-b-0 md:border-r border-zinc-900 pb-4 md:pb-0 md:pr-5 shrink-0">
                  {selectedCard.image ? (
                    <div className="w-32 h-52 sm:w-36 sm:h-56 rounded-xl overflow-hidden border-2 border-zinc-800 shadow-xl bg-black mb-3 group relative shrink-0">
                      <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-52 rounded-xl border-2 border-dashed border-zinc-800 flex items-center justify-center bg-black mb-3 shrink-0">
                      <span className="text-[10px] font-mono text-zinc-600 uppercase">Image Missing</span>
                    </div>
                  )}

                  <h3 className="font-syne font-extrabold text-base text-center text-[#F8F7F4] uppercase tracking-tight">
                    {selectedCard.name}
                  </h3>
                  <span className="text-[9px] font-mono text-[#DC143C] uppercase tracking-widest font-bold mt-0.5">
                    {selectedCard.arcana} arcana · {selectedCard.number}
                  </span>

                  <div className="w-full space-y-1.5 mt-3 text-[9px] font-mono border-t border-zinc-900/60 pt-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">ELEMENT</span>
                      <span className="text-zinc-300 font-bold">{selectedCard.element}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">ASTROLOGY</span>
                      <span className="text-zinc-300 font-bold">{selectedCard.astrology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-600">SUIT</span>
                      <span className="text-zinc-300 font-bold capitalize">{selectedCard.suit}</span>
                    </div>
                  </div>
                </div>

                {/* Conceptual Meaning details */}
                <div className="md:w-7/12 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="space-y-3 overflow-y-auto lg:max-h-[490px] pr-1 scrollbar-thin">
                    <div>
                      <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider">Keywords</span>
                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {selectedCard.keywords.map((kw: string) => (
                          <span
                            key={kw}
                            className="text-[8px] font-mono uppercase tracking-wider bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded-md border border-zinc-800"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-black/60 p-3 rounded-xl border border-zinc-900">
                      <span className="text-[8px] font-mono uppercase text-zinc-400 tracking-wider block mb-0.5 font-bold">
                        Upright Divination Guidance
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-google-sans">
                        {selectedCard.meaning}
                      </p>
                    </div>

                    {selectedCard.reversedMeaning && (
                      <div className="bg-[#DC143C]/5 p-3 rounded-xl border border-[#DC143C]/20">
                        <span className="text-[8px] font-mono uppercase text-[#DC143C] tracking-wider block mb-0.5 font-bold">
                          Reversed Meaning & Shadow Warning
                        </span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-google-sans">
                          {selectedCard.reversedMeaning}
                        </p>
                      </div>
                    )}

                    {selectedCard.description && (
                      <div className="border-t border-zinc-900 pt-2">
                        <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block mb-0.5">
                          Symbolic Essence & Archetype
                        </span>
                        <p className="text-[10px] text-zinc-500 leading-relaxed font-google-sans">
                          {selectedCard.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-zinc-900 pt-3 mt-2 flex justify-end">
                    <button
                      onClick={() => handleConsultFromEncyclopedia(selectedCard.name)}
                      className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-[#DC143C] hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <span>Inquire About {selectedCard.name}</span>
                      <span>→</span>
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
      )}

      {/* PILLAR 3: RUNE ENCYCLOPEDIA */}
      {activeTab === 'rune_encyclopedia' && (
        <div className="animate-fadeIn">
          <RuneEncyclopedia
            onConsultRune={(name, prompt) => handleAdvisorInquiry('Odin', prompt)}
          />
        </div>
      )}

      {/* PILLAR 4: FUTHARK FAQ */}
      {activeTab === 'futhark_faq' && (
        <div className="animate-fadeIn">
          <FutharkFAQCompendium onConsultAdvisor={handleAdvisorInquiry} />
        </div>
      )}

      {/* PILLAR 5: NORSE HISTORY & COSMOLOGY */}
      {activeTab === 'norse_history' && (
        <div className="animate-fadeIn">
          <NorseHistoryCodex onConsultAdvisor={handleAdvisorInquiry} />
        </div>
      )}

      {/* PILLAR 6: HERMETIC LEXICON */}
      {activeTab === 'hermetic_lexicon' && (
        <div className="animate-fadeIn">
          <HermeticLexicon onConsultAdvisor={handleAdvisorInquiry} />
        </div>
      )}

    </div>
  );
};
