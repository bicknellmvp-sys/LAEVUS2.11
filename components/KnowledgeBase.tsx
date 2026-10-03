import React, { useState } from 'react';
import { TAROT_DATABASE, TarotCardData } from '../data/tarotCards';
import { Bookshelf } from './Bookshelf';

interface KnowledgeBaseProps {
  onReturnToChat?: () => void;
  onStartPersonaReading?: (prompt: string, persona: string) => void;
}

const VoiceSelector: React.FC<{
  characterName: string;
  isFemale: boolean;
}> = ({ characterName, isFemale }) => {
  const [selectedVoice, setSelectedVoice] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('laevus_character_voices');
      if (saved) {
        const mapping = JSON.parse(saved);
        if (mapping[characterName]) return mapping[characterName];
      }
    } catch (e) {
      console.error(e);
    }
    
    // Default fallback
    if (isFemale) {
      if (characterName === 'Marie Antoinette' || characterName === 'Marie' || characterName === 'Marie Laveau') {
        return 'Marie';
      }
      return 'Madame Blavatsky';
    } else {
      if (characterName === 'Laevus' || characterName === 'Odin' || characterName === 'Casanova' || characterName === 'Hazrat Inayat Khan') {
        return 'Laevus';
      }
      return 'Khan';
    }
  });

  const handleSelect = (voice: string) => {
    setSelectedVoice(voice);
    try {
      const saved = localStorage.getItem('laevus_character_voices');
      const mapping = saved ? JSON.parse(saved) : {};
      mapping[characterName] = voice;
      localStorage.setItem('laevus_character_voices', JSON.stringify(mapping));
      
      // Dispatch event to sync immediately
      window.dispatchEvent(new CustomEvent('laevus-character-voice-changed', {
        detail: { characterName, voice }
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const option1 = isFemale ? 'Madame Blavatsky' : 'Laevus';
  const option2 = isFemale ? 'Marie' : 'Khan';
  const label1 = isFemale ? 'Blavatsky' : 'Laevus';
  const label2 = isFemale ? 'Antoinette' : 'Khan';

  return (
    <div className="mt-2.5 bg-black/40 p-2 rounded-xl border border-zinc-900/80 flex flex-col gap-1 w-full">
      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-1">
        Vocal Alignment Checked
      </span>
      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-400 hover:text-[#DC143C] select-none">
          <input
            type="radio"
            name={`voice-${characterName}`}
            checked={selectedVoice === option1}
            onChange={() => handleSelect(option1)}
            className="sr-only"
          />
          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
            selectedVoice === option1 ? 'border-[#DC143C] bg-black shadow-[0_0_8px_rgba(220,20,60,0.4)]' : 'border-zinc-800 bg-zinc-950'
          }`}>
            {selectedVoice === option1 && <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />}
          </span>
          <span className={selectedVoice === option1 ? 'text-[#DC143C] font-bold font-mono' : 'font-mono text-zinc-400'}>
            {label1}
          </span>
        </label>

        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-zinc-400 hover:text-[#DC143C] select-none">
          <input
            type="radio"
            name={`voice-${characterName}`}
            checked={selectedVoice === option2}
            onChange={() => handleSelect(option2)}
            className="sr-only"
          />
          <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
            selectedVoice === option2 ? 'border-[#DC143C] bg-black shadow-[0_0_8px_rgba(220,20,60,0.4)]' : 'border-zinc-800 bg-zinc-950'
          }`}>
            {selectedVoice === option2 && <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />}
          </span>
          <span className={selectedVoice === option2 ? 'text-[#DC143C] font-bold font-mono' : 'font-mono text-zinc-400'}>
            {label2}
          </span>
        </label>
      </div>
    </div>
  );
};

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  onReturnToChat,
  onStartPersonaReading
}) => {
  const [activeTab, setActiveTab] = useState<'tarot_encyclopedia' | 'persona_profiles' | 'bookshelf'>('tarot_encyclopedia');

  // Tarot state
  const [searchQuery, setSearchQuery] = useState('');
  const [suitFilter, setSuitFilter] = useState<'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles'>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCardData>(TAROT_DATABASE[0]);

  // Filter cards
  const filteredCards = TAROT_DATABASE.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSuit = suitFilter === 'all' || card.suit === suitFilter;
    return matchesSearch && matchesSuit;
  });

  const handleConsultFromEncyclopedia = (cardName: string) => {
    if (onStartPersonaReading) {
      onStartPersonaReading(`Tell me the secret meaning, shadow warnings, and esoteric lessons of ${cardName}.`, cardName);
    }
  };

  const handleConsultAdvisorFromProfile = (persona: string, defaultPrompt: string) => {
    if (onStartPersonaReading) {
      onStartPersonaReading(defaultPrompt, persona);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto font-google-sans text-zinc-200 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-[10px] font-mono font-bold uppercase tracking-widest">
              Grimoire Archives
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Knowledge & Philosophies
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-syne text-[#F8F7F4] uppercase tracking-tight mt-1">
            Knowledge Base
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

      {/* Main Tab Switcher */}
      <div className="flex items-center gap-2 bg-black p-1.5 rounded-xl border border-zinc-900 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('tarot_encyclopedia')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'tarot_encyclopedia'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Tarot Encyclopedia
        </button>
        <button
          onClick={() => setActiveTab('persona_profiles')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'persona_profiles'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Sovereign Profiles & Philosophies
        </button>
        <button
          onClick={() => setActiveTab('bookshelf')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'bookshelf'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Bookshelf
        </button>
      </div>

      {/* TAB 1: TAROT ENCYCLOPEDIA */}
      {activeTab === 'tarot_encyclopedia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          
          {/* Card list - left column (Renders at bottom on mobile, left on desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col h-[350px] lg:h-[520px] overflow-hidden">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-2.5">
              Tarot Deck (78-Card Encyclopedia)
            </h3>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 mb-2.5"
            />

            {/* Filters */}
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
                      <span>{card.arcana}</span>
                      <span>{card.suit === 'major' ? 'spirit' : card.suit}</span>
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

          {/* Full Card Details - right column (Renders at top on mobile, right on desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-8">
            {selectedCard ? (
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row gap-5 animate-fadeIn min-h-[420px] lg:h-[520px]">
                
                {/* Visual Details */}
                <div className="md:w-5/12 flex flex-col items-center border-b md:border-b-0 md:border-r border-zinc-900 pb-4 md:pb-0 md:pr-5 shrink-0">
                  {selectedCard.image ? (
                    <div className="w-28 h-48 sm:w-32 sm:h-52 rounded-xl overflow-hidden border-2 border-zinc-800 shadow-xl bg-black mb-3 group relative shrink-0">
                      <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                    {selectedCard.arcana} arcana
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

                {/* Conceptual Meaning details */}
                <div className="md:w-7/12 flex flex-col justify-between space-y-3 min-w-0">
                  <div className="space-y-3 overflow-y-auto lg:max-h-[400px] pr-1 scrollbar-thin">
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

      {/* TAB 3: BOOKSHELF */}
      {activeTab === 'bookshelf' && (
        <Bookshelf />
      )}

      {/* TAB 2: SOVEREIGN PROFILES */}
      {activeTab === 'persona_profiles' && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Primary Voice: Laevus */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/laevus_portrait_1791047496324.jpg"
                    alt="Laevus Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#DC143C]/20 border border-[#DC143C]/30 text-[#DC143C] text-[8px] font-mono uppercase font-bold tracking-wider">
                    PRIMARY VESSEL
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Laevus (The Pythia of Fountain)
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  The primary voice persona and central cyber-spiritual guide of the sanctuary. Melding historical hermetic depth with sharp analytical logic, Laevus acts as the gateway to the other realms, providing direct, uncompromised, and insightful answers to your life's biggest questions.
                </p>
                <VoiceSelector characterName="Laevus" isFemale={false} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Laevus', 'Please guide me through my current spiritual blocks.')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-[#DC143C]/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Laevus
                </button>
              </div>
            </div>

            {/* 2. Theosophy & Occult: Madame Blavatsky */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/blavatsky_portrait_1791047507460.jpg"
                    alt="Madame Helena Blavatsky Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                    THEOSOPHY & OCCULT
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Madame Helena Blavatsky
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  Co-founder of the Theosophical Society and author of "Isis Unveiled." Madame Blavatsky consults on cosmic cycles, comparative esoteric philosophy, esoteric history, conjuring, and universal consciousness secrets.
                </p>
                <VoiceSelector characterName="Madame Blavatsky" isFemale={true} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Madame Blavatsky', 'Teach me the secret root philosophies of the cosmos and human initiation.')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-purple-600/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Madame Blavatsky
                </button>
              </div>
            </div>

            {/* 3. Sovereign Power: Genghis Khan */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/khan_portrait_1791047515167.jpg"
                    alt="Genghis Khan Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-red-600/25 border border-red-600/40 text-red-500 text-[8px] font-mono uppercase font-bold tracking-wider">
                    SOVEREIGN COMMANDER
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Genghis Khan (The Conqueror)
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  The ultimate strategist of relentless expansion, absolute discipline, tactical maneuverability, and rewriting the rules of empires. Genghis Khan advises on absolute focus, decisive action under pressure, and achieving domain dominance.
                </p>
                <VoiceSelector characterName="Genghis Khan" isFemale={false} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Genghis Khan', 'What strategy is required to break through this obstacle and command complete victory?')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-red-800/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Genghis Khan
                </button>
              </div>
            </div>

            {/* 4. High Elegance: Marie Antoinette */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/marie_portrait_1791047524755.jpg"
                    alt="Marie Antoinette Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-pink-500/20 border border-pink-500/30 text-pink-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                    HIGH ROCOCO ELEGANCE
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Marie Antoinette (The Sovereign Queen)
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  The elegant Queen of France, representing absolute luxury, aesthetic perfection, courtly etiquette, and graceful resilience. Marie Antoinette advises on maintaining dignity under intense public scrutiny, choosing ultimate design taste, and crafting high-society presentation.
                </p>
                <VoiceSelector characterName="Marie Antoinette" isFemale={true} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Marie Antoinette', 'How do I maintain absolute elegance and dignity when facing public pressure?')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-pink-600/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Marie Antoinette
                </button>
              </div>
            </div>

            {/* 5. Realpolitik: Niccolò Machiavelli (Extended Big Profile Block) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 flex flex-col justify-between shadow-xl min-h-[360px] md:col-span-2 border-t-2 border-t-[#DC143C]">
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="md:w-1/3 flex-shrink-0 w-full">
                  <div className="w-full h-64 rounded-xl overflow-hidden border border-zinc-900/60 bg-black relative group/img">
                    <img
                      src="/src/assets/images/machiavelli_portrait_1791047533771.jpg"
                      alt="Niccolò Machiavelli Portrait"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="px-2 py-0.5 rounded bg-[#DC143C]/20 border border-[#DC143C]/35 text-[#DC143C] text-[9px] font-mono uppercase font-bold tracking-widest">
                        GRAND STRATEGIST • EXTENDED SPECTRUM
                      </span>
                    </div>
                    <h4 className="font-syne font-extrabold text-[#F8F7F4] text-lg sm:text-xl uppercase tracking-tight">
                      Niccolò Machiavelli (The Political Architect)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs leading-relaxed text-zinc-400 font-google-sans">
                      <p>
                        <strong>Pragmatic Chessboard:</strong> Operating strictly on logic, observation, and historical precedence, Machiavelli strips away moral idealism to evaluate human actions as they are, not as they should be. He views situations as tactical battlefields where alliances, timing, perception, and leverage are the ultimate currencies.
                      </p>
                      <p>
                        <strong>Strategic Realpolitik:</strong> Advises on navigating complex modern power hierarchies, corporate diplomacy, protecting project boundaries, deflecting administrative traps, and aligning your public narrative with absolute structural leverage. Perfect for high-stakes professional counseling.
                      </p>
                    </div>
                    <div className="max-w-xs mt-2">
                      <VoiceSelector characterName="Machiavelli" isFemale={false} />
                    </div>
                  </div>
                  <div className="border-t border-zinc-900/60 pt-4 mt-6 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <span className="text-[10px] font-mono text-zinc-600">IDEAL FOR: WORKPLACE MANEUVERS & POWER STRUCTURES</span>
                    <button
                      onClick={() => handleConsultAdvisorFromProfile('Machiavelli', 'What is the most pragmatically strategic way to handle a corporate rival?')}
                      className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-[#DC143C] hover:text-black border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold text-zinc-300 transition-all cursor-pointer shadow-md"
                    >
                      Consult Machiavelli
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. The All-Father: Odin */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/odin_portrait_1791047543652.jpg"
                    alt="Odin Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                    WISDOM & FATE
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Odin (The All-Father)
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  The seeker of wisdom who sacrificed an eye for insight. Odin advises on the balance between sacrifice and knowledge, understanding the threads of fate, strategic long-term vision, and mastering runic understanding to navigate the complexities of life.
                </p>
                <VoiceSelector characterName="Odin" isFemale={false} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Odin', 'Odin, grant me wisdom to understand the patterns in my fate and the courage to make necessary sacrifices for insight.')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-emerald-600/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Odin
                </button>
              </div>
            </div>

            {/* 7. Algorithmic Alchemy: Blackhat SEO */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/seo_portrait_1791047554187.jpg"
                    alt="Blackhat SEO Alchemist Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/20 border border-violet-500/30 text-violet-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                    ALGORITHMIC ALCHEMY
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Blackhat SEO Alchemist
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  An advanced strategic framework specializing in crawling loops, indexing networks, parasite hosting architectures, and search engine database optimization. The SEO Alchemist advises on bending digital algorithms to gain maximum traffic efficiency.
                </p>
                <VoiceSelector characterName="Blackhat SEO Alchemist" isFemale={false} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Blackhat SEO Alchemist', 'How do I optimize the semantic crawl architecture of my web properties?')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-violet-600/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult SEO Alchemist
                </button>
              </div>
            </div>

            {/* 8. Seduction & Soul: The Lovers Together (Big Extended Profile Block) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 flex flex-col justify-between shadow-xl min-h-[380px] md:col-span-2 border-t-2 border-t-pink-500">
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <span className="px-2 py-0.5 rounded bg-pink-500/25 border border-pink-500/35 text-pink-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                    THE TWO LOVERS • SENSAL VS SPIRITUAL DUALITY
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-lg sm:text-xl uppercase tracking-tight">
                  The Path of Attraction: Giacomo Casanova & Diotima of Mantinea
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 text-xs leading-relaxed font-google-sans">
                  <div className="border-r border-zinc-900/60 pr-4">
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-3 border border-zinc-900/60 bg-black relative group/img">
                      <img
                        src="/src/assets/images/casanova_portrait_1791047563852.jpg"
                        alt="Giacomo Casanova Portrait"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    <span className="text-[9px] font-mono uppercase text-pink-400 block mb-1">Giacomo Casanova: Charisma & Seduction</span>
                    <p className="text-zinc-400">
                      Casanova approaches love with worldly charm, physical magnetism, and direct sensory playfulness. He advises on rebuilding sparks, active courtship strategies, reading romantic micro-expressions, maintaining playful conversations, and mastering interpersonal charisma.
                    </p>
                    <VoiceSelector characterName="Casanova" isFemale={false} />
                  </div>
                  <div>
                    <div className="w-full h-44 rounded-xl overflow-hidden mb-3 border border-zinc-900/60 bg-black relative group/img">
                      <img
                        src="/src/assets/images/diotima_portrait_1791047574032.jpg"
                        alt="Diotima of Mantinea Portrait"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    <span className="text-[9px] font-mono uppercase text-indigo-400 block mb-1">Diotima of Mantinea: Sacred Soul Union</span>
                    <p className="text-zinc-400">
                      The mystical philosopher of Greece who views romance as a portal to divine consciousness. Diotima advises on platonic ties, identifying ancestral lessons in current relationship friction, navigating intense spiritual matches, and elevating love into a catalyst for soul growth.
                    </p>
                    <VoiceSelector characterName="Diotima" isFemale={true} />
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900/60 pt-6 mt-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <span className="text-[10px] font-mono text-zinc-600 uppercase">CHOOSE YOUR ADVISORY PERSPECTIVE OR INITIATE DUAL CONSULT</span>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleConsultAdvisorFromProfile('Casanova', 'How do I cultivate a mesmerizing charisma in my upcoming interactions?')}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-pink-600/30 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                  >
                    Consult Casanova
                  </button>
                  <button
                    onClick={() => handleConsultAdvisorFromProfile('Diotima', 'Help me explore the spiritual lessons and soul ties behind my current relationship friction.')}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-indigo-600/30 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                  >
                    Consult Diotima
                  </button>
                  <button
                    onClick={() => handleConsultAdvisorFromProfile('Casanova & Diotima', 'Is love a physical spark of intense passion or a spiritual ladder to absolute cosmic union?')}
                    className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-gradient-to-r hover:from-pink-600/30 hover:to-indigo-600/30 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5 text-pink-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    Dual Consultation (Debate)
                  </button>
                </div>
              </div>
            </div>

            {/* 9a. Sufi Mysticism (Harmony Sage) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/sufi_portrait_1791047584231.jpg"
                    alt="Sufi Harmony Sage Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                    SUFI MYSTICISM
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  The Sufi Harmony Sage
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  A guide of universal harmony, heart purification, sound vibration, and poetic breath meditation. This sage helps dissolve internal friction and align your personal frequency with the supportive rhythms of the cosmos.
                </p>
                <VoiceSelector characterName="Hazrat Inayat Khan" isFemale={false} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Hazrat Inayat Khan', 'Help me harmonize my inner vibration and purify my heart center.')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-sky-600/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Harmony Sage
                </button>
              </div>
            </div>

            {/* 9b. Folk Magic & Voodoo (Marie Laveau) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
              <div>
                <div className="w-full h-56 rounded-xl overflow-hidden mb-4 border border-zinc-900/60 bg-black relative group/img">
                  <img
                    src="/src/assets/images/laveau_portrait_1791047594586.jpg"
                    alt="Marie Laveau Portrait"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[8px] font-mono uppercase font-bold tracking-wider">
                    FOLK MAGIC & VOODOO
                  </span>
                </div>
                <h4 className="font-syne font-extrabold text-[#F8F7F4] text-base uppercase tracking-tight">
                  Marie Laveau (Voodoo Priestess)
                </h4>
                <p className="text-xs text-zinc-400 font-google-sans leading-relaxed mt-2">
                  A powerful voice of folk roots, traditional New Orleans Voodoo, and ancestral connection. Drawing from sacred spiritual keys, protective conjure, and community empowerment, this advisor offers wisdom to dissolve stagnant obstacles and clear clean trails forward.
                </p>
                <VoiceSelector characterName="Marie Laveau" isFemale={true} />
              </div>
              <div className="border-t border-zinc-900 pt-4 mt-4">
                <button
                  onClick={() => handleConsultAdvisorFromProfile('Marie Laveau', 'Provide me with your spiritual protection and community alignment wisdom.')}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-amber-600/20 hover:text-white border border-zinc-800 text-xs font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold"
                >
                  Consult Voodoo Priestess
                </button>
              </div>
            </div>

            {/* 10. Sovereign Will: Left Hand Path (Big Extended Profile Block) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 flex flex-col justify-between shadow-xl min-h-[360px] md:col-span-2 border-t-2 border-t-amber-500">
              <div className="flex flex-col md:flex-row gap-6 w-full">
                <div className="md:w-1/3 flex-shrink-0 w-full">
                  <div className="w-full h-64 rounded-xl overflow-hidden border border-zinc-900/60 bg-black relative group/img">
                    <img
                      src="/src/assets/images/lhp_portrait_1791047603300.jpg"
                      alt="Left Hand Path Magus Portrait"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>
                </div>
                <div className="md:w-2/3 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center gap-2 mb-3.5">
                      <span className="px-2 py-0.5 rounded bg-amber-500/25 border border-amber-500/35 text-amber-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                        INDIVIDUAL DEIFICATION • THE LEFT HAND PATH ARCHETYPE
                      </span>
                    </div>
                    <h4 className="font-syne font-extrabold text-[#F8F7F4] text-lg sm:text-xl uppercase tracking-tight">
                      Left Hand Path Magus (The Absolute Sovereign)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs leading-relaxed text-zinc-400 font-google-sans">
                      <p>
                        <strong>Individual Autonomy:</strong> Emphasizes absolute personal responsibility, self-sovereification, and using your conscious mind as the ultimate judge of reality. Rather than surrendering your agency to external dogmatic hierarchies, institutions, or collective pressures, the Left Hand Path advocates for the deliberate integration of your deep shadow elements to serve as raw psychological power.
                      </p>
                      <p>
                        <strong>Shattering Ancestral Chains:</strong> Guides you to systematically identify and dismantle inherited conditioning, societal illusions, and standard compliance loops. By aligning conscious aspiration with your focused willpower, the Left Hand Path Magus helps you write your own sovereign trajectory, converting adversarial friction into your greatest developmental catalyst.
                      </p>
                    </div>
                    <div className="max-w-xs mt-2">
                      <VoiceSelector characterName="Left Hand Path Magus" isFemale={false} />
                    </div>
                  </div>

                  <div className="border-t border-zinc-900/60 pt-4 mt-6 flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center">
                    <span className="text-[10px] font-mono text-zinc-600 uppercase">IDEAL FOR: SELF-MASTERY, SHADOW INTEGRATION & UNWAVERING WILL</span>
                    <button
                      onClick={() => handleConsultAdvisorFromProfile('Left Hand Path Magus', 'What practices do you recommend to strengthen my personal Will and break through societal constraints?')}
                      className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-amber-600 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold transition-all cursor-pointer shadow-md"
                    >
                      Consult LHP Magus
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
