import React, { useState } from 'react';
import { RUNE_DATABASE, RuneData } from '../data/runes';

export const RuneEncyclopedia: React.FC = () => {
  const [selectedRune, setSelectedRune] = useState<RuneData>(RUNE_DATABASE[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
      {/* Rune list - left column */}
      <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-2xl p-4 flex flex-col h-[520px] overflow-hidden">
        <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-2.5">
          Elder Futhark Encyclopedia
        </h3>
        <div className="overflow-y-auto space-y-1.5 pr-1 flex-1 scrollbar-thin">
          {RUNE_DATABASE.map((rune) => {
            const isSelected = selectedRune?.name === rune.name;
            return (
              <button
                key={rune.name}
                onClick={() => setSelectedRune(rune)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg'
                    : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-xl">{rune.symbol}</span>
                <span className="font-syne font-bold text-xs">{rune.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rune details - right column */}
      <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        {selectedRune ? (
          <>
            <div className="flex items-center gap-4">
              <span className="text-5xl text-[#DC143C]">{selectedRune.symbol}</span>
              <h3 className="font-syne font-extrabold text-2xl text-[#F8F7F4] uppercase tracking-tight">
                {selectedRune.name}
              </h3>
            </div>
            <div className="border-t border-zinc-900 pt-4">
              <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block mb-1">Meaning</span>
              <p className="text-sm text-zinc-300 font-google-sans">{selectedRune.meaning}</p>
            </div>
            <div className="border-t border-zinc-900 pt-4">
              <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider block mb-1">Description</span>
              <p className="text-sm text-zinc-400 font-google-sans leading-relaxed">{selectedRune.description}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs uppercase">
            Select a Rune to study
          </div>
        )}
      </div>
    </div>
  );
};
