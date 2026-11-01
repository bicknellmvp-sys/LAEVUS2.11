import React, { useState } from 'react';
import { RUNE_DATABASE, RuneData, RunicAett } from '../data/runes';

interface RuneEncyclopediaProps {
  onConsultRune?: (runeName: string, prompt: string) => void;
}

export const RuneEncyclopedia: React.FC<RuneEncyclopediaProps> = ({ onConsultRune }) => {
  const [selectedRune, setSelectedRune] = useState<RuneData>(RUNE_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [aettFilter, setAettFilter] = useState<'all' | RunicAett>('all');
  const [viewMerkstave, setViewMerkstave] = useState(false);

  const filteredRunes = RUNE_DATABASE.filter((rune) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      rune.name.toLowerCase().includes(query) ||
      rune.phonetic.toLowerCase().includes(query) ||
      rune.meaning.toLowerCase().includes(query) ||
      rune.deity.toLowerCase().includes(query) ||
      rune.symbol.includes(query);

    const matchesAett = aettFilter === 'all' || rune.aett === aettFilter;

    return matchesSearch && matchesAett;
  });

  const handleInquire = () => {
    if (onConsultRune) {
      onConsultRune(
        selectedRune.name,
        `Enlighten me on the ancient mysteries, practical galdr, and divinatory significance of the rune ${selectedRune.name} (${selectedRune.symbol}) - ${selectedRune.meaning}.`
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
      {/* LEFT COLUMN: RUNE SELECTOR & FILTERS */}
      <div className="order-2 lg:order-1 lg:col-span-5 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col h-[520px] lg:h-[620px] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DC143C]" />
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#DC143C]">
              Elder Futhark (24 Runes)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {filteredRunes.length} / 24
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mb-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rune, deity, phonetic..."
            className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 font-google-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-zinc-600 hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        {/* Aett Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 mb-2.5 bg-black p-1 rounded-xl border border-zinc-900/80">
          <button
            onClick={() => setAettFilter('all')}
            className={`py-1 text-[8px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center ${
              aettFilter === 'all'
                ? 'bg-[#DC143C] text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setAettFilter("Freyr's Aett")}
            className={`py-1 text-[8px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center ${
              aettFilter === "Freyr's Aett"
                ? 'bg-amber-600 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Freyr
          </button>
          <button
            onClick={() => setAettFilter("Heimdall's Aett")}
            className={`py-1 text-[8px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center ${
              aettFilter === "Heimdall's Aett"
                ? 'bg-cyan-600 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Heimdall
          </button>
          <button
            onClick={() => setAettFilter("Tyr's Aett")}
            className={`py-1 text-[8px] font-mono uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center ${
              aettFilter === "Tyr's Aett"
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Tyr
          </button>
        </div>

        {/* Runes Grid / List */}
        <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 scrollbar-thin">
          {filteredRunes.map((rune) => {
            const isSelected = selectedRune?.name === rune.name;
            return (
              <button
                key={rune.name}
                onClick={() => setSelectedRune(rune)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg shadow-[#DC143C]/10'
                    : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-serif text-[#DC143C] w-7 text-center">
                    {rune.symbol}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-syne font-bold text-xs text-[#F8F7F4]">{rune.name}</span>
                      <span className="text-[9px] font-mono px-1 py-0.2 bg-zinc-900 text-zinc-400 rounded border border-zinc-800">
                        /{rune.phonetic}/
                      </span>
                    </div>
                    <span className="text-[9px] text-zinc-500 line-clamp-1 font-google-sans">
                      {rune.meaning}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-600 block">
                    {rune.aett.replace("'s Aett", '')}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-500">
                    {rune.element}
                  </span>
                </div>
              </button>
            );
          })}

          {filteredRunes.length === 0 && (
            <div className="text-center py-10 text-zinc-600 text-xs font-mono">
              No runes found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: EXPANDED RUNE CODEX DETAILS */}
      <div className="order-1 lg:order-2 lg:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-auto lg:h-[620px] overflow-hidden">
        {selectedRune ? (
          <div className="flex flex-col h-full justify-between overflow-hidden">
            
            {/* Header info bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center shadow-lg relative group">
                  <span className="text-4xl text-[#DC143C] select-none font-serif transition-transform duration-300 group-hover:scale-110">
                    {selectedRune.symbol}
                  </span>
                  <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-[8px] font-mono text-zinc-400">
                    {selectedRune.phonetic}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold tracking-wider bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C]">
                      {selectedRune.aett}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      Element: {selectedRune.element}
                    </span>
                  </div>
                  <h3 className="font-syne font-extrabold text-2xl text-[#F8F7F4] uppercase tracking-tight mt-0.5">
                    {selectedRune.name}
                  </h3>
                  <span className="text-xs text-zinc-400 font-google-sans">
                    {selectedRune.meaning}
                  </span>
                </div>
              </div>

              {/* Merkstave toggle */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  onClick={() => setViewMerkstave(false)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    !viewMerkstave
                      ? 'bg-zinc-800 text-white font-bold border border-zinc-700'
                      : 'bg-black text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  Upright
                </button>
                <button
                  onClick={() => setViewMerkstave(true)}
                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    viewMerkstave
                      ? 'bg-[#DC143C] text-white font-bold border border-[#DC143C]'
                      : 'bg-black text-zinc-500 border border-zinc-900 hover:text-zinc-300'
                  }`}
                >
                  Merkstave / Shadow
                </button>
              </div>
            </div>

            {/* Scrollable details body */}
            <div className="overflow-y-auto space-y-4 my-3 pr-2 scrollbar-thin flex-1 text-xs leading-relaxed font-google-sans">
              
              {/* Correspondences Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/60 p-2.5 rounded-xl border border-zinc-900">
                <div>
                  <span className="text-[8px] font-mono uppercase text-zinc-600 block">Deity</span>
                  <span className="text-zinc-300 font-bold text-[10px]">{selectedRune.deity}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase text-zinc-600 block">Astrology</span>
                  <span className="text-zinc-300 font-bold text-[10px]">{selectedRune.astrology}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase text-zinc-600 block">Sound</span>
                  <span className="text-zinc-300 font-bold text-[10px]">/{selectedRune.phonetic}/</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase text-zinc-600 block">Classification</span>
                  <span className="text-zinc-300 font-bold text-[10px]">{selectedRune.aett.split(" ")[0]}</span>
                </div>
              </div>

              {/* Mythological Lore & Description */}
              <div className="bg-black/40 border border-zinc-900/80 rounded-xl p-3">
                <span className="text-[9px] font-mono uppercase text-[#DC143C] tracking-wider block font-bold mb-1">
                  Esoteric Lore & Doctrine
                </span>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {selectedRune.description}
                </p>
              </div>

              {/* Divinatory Interpretation (Upright vs Merkstave) */}
              <div className={`p-3.5 rounded-xl border transition-colors ${
                viewMerkstave 
                  ? 'bg-[#DC143C]/5 border-[#DC143C]/30' 
                  : 'bg-zinc-900/40 border-zinc-800'
              }`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className="text-xs">
                    {viewMerkstave ? '🔻' : '🔺'}
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                    viewMerkstave ? 'text-[#DC143C]' : 'text-zinc-200'
                  }`}>
                    {viewMerkstave ? 'Merkstave (Reversed / Shadow Aspect)' : 'Upright Divination Guidance'}
                  </span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  {viewMerkstave ? selectedRune.merkstaveMeaning : selectedRune.uprightMeaning}
                </p>
              </div>

              {/* Ancient Rune Poem Stanza */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-xl p-3 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold">
                    Historical Rune Poem
                  </span>
                  <span className="text-[8px] font-mono text-zinc-600 italic">
                    {selectedRune.runePoem.source}
                  </span>
                </div>
                <blockquote className="italic font-serif text-zinc-400 text-xs mb-1 border-l-2 border-[#DC143C]/40 pl-2">
                  "{selectedRune.runePoem.stanza}"
                </blockquote>
                <p className="text-[10.5px] text-zinc-400 font-google-sans">
                  <span className="text-zinc-600 font-mono text-[9px] uppercase mr-1">Translation:</span>
                  "{selectedRune.runePoem.translation}"
                </p>
              </div>

              {/* Magickal & Galdr Application */}
              <div className="bg-black/60 border border-zinc-900 rounded-xl p-3">
                <span className="text-[9px] font-mono uppercase text-emerald-400 tracking-wider block font-bold mb-1">
                  Practical Galdr & Magickal Craft
                </span>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-google-sans">
                  {selectedRune.magickalUse}
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="border-t border-zinc-900 pt-3 flex items-center justify-between shrink-0">
              <span className="text-[9px] font-mono text-zinc-600 uppercase">
                Elder Futhark Canon · Sacred 24 Glyphs
              </span>

              <button
                onClick={handleInquire}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-[#DC143C] text-zinc-200 hover:text-white border border-zinc-800 hover:border-[#DC143C] text-xs font-mono uppercase tracking-wider transition-all font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Consult on {selectedRune.name}</span>
                <span>→</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs uppercase">
            Select a Rune to study its secrets
          </div>
        )}
      </div>
    </div>
  );
};
