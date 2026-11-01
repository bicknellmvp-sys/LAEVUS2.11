import React, { useState } from 'react';

interface Principle {
  number: string;
  name: string;
  axiom: string;
  explanation: string;
  practicalUse: string;
}

interface LexiconTerm {
  term: string;
  tradition: 'Hermetic' | 'Occult & Alchemy' | 'Norse' | 'Eastern / Sufi' | 'Left-Hand Path';
  definition: string;
  practicalInsight: string;
}

const HERMETIC_PRINCIPLES: Principle[] = [
  {
    number: '01',
    name: 'The Principle of Mentalism',
    axiom: '"THE ALL IS MIND; The Universe is Mental."',
    explanation: 'The underlying reality of the physical universe is pure consciousness (Spirit). The physical plane is a mental projection within the Infinite Mind of The All. Therefore, mastery of one\'s own mental states translates directly into mastery of physical circumstances.',
    practicalUse: 'Guard your mental focus ruthlessly. Shift your subjective belief, and the objective circumstance will inevitably follow.'
  },
  {
    number: '02',
    name: 'The Principle of Correspondence',
    axiom: '"As above, so below; as below, so above."',
    explanation: 'There exists an unbroken geometric and energetic harmony between the planes of matter, mind, and spirit. What occurs in the macrocosm (galaxies, seasons, societal waves) is mirrored precisely in the microcosm (cells, individual psyche, daily habits).',
    practicalUse: 'To diagnose an external blockage or relational conflict, examine your own internal emotional architecture for its counterpart.'
  },
  {
    number: '03',
    name: 'The Principle of Vibration',
    axiom: '"Nothing rests; everything moves; everything vibrates."',
    explanation: 'From the densest lead to pure divine spirit, differences between manifestations are solely differences in vibrational frequency. Mind can alter its own vibration to ascend from fear to courage, or from depression to vitality.',
    practicalUse: 'Use sound, rhythmic breath, focused posture, and mental concentration to deliberately tune your personal frequency to the desired outcome.'
  },
  {
    number: '04',
    name: 'The Principle of Polarity',
    axiom: '"Everything is Dual; everything has poles; opposites are identical in nature, but different in degree."',
    explanation: 'Heat and cold are not distinct things, but degrees on the single spectrum of temperature. Love and hate are degrees of emotional attachment. Because opposites are the same in nature, you can transmute hate into love or despair into triumph by sliding along the pole.',
    practicalUse: 'Mental Transmutation: Do not fight darkness head-on; simply turn up the dial of the positive pole.'
  },
  {
    number: '05',
    name: 'The Principle of Rhythm',
    axiom: '"Everything flows, out and in; the pendulum-swing manifests in everything."',
    explanation: 'The tide comes in and goes out; night follows day; empires rise and collapse. For every swing to the right, there must be a compensating swing to the left. The Master does not fight the rhythm; he neutralizes it by anchoring his consciousness in a higher octave.',
    practicalUse: 'The Law of Neutralization: When the emotional pendulum swings downward toward sorrow, detach your sovereign witness above the swing.'
  },
  {
    number: '06',
    name: 'The Principle of Cause and Effect',
    axiom: '"Every Cause has its Effect; every Effect has its Cause; Chance is but a name for Law not recognized."',
    explanation: 'Nothing escapes cosmic law. The masses of humanity are pawns pushed about by heredity, subconscious conditioning, and environment. The Hermetic master becomes a Mover rather than a moved piece on the chessboard of life.',
    practicalUse: 'Refuse to live as a passive effect of external news and moods; deliberately position yourself as the conscious initial cause.'
  },
  {
    number: '07',
    name: 'The Principle of Gender',
    axiom: '"Gender is in everything; everything has its Masculine and Feminine Principles."',
    explanation: 'Gender manifests across all planes: physical, mental, and spiritual. The Masculine principle initiates, projects, wills, and protects; the Feminine principle generates, conceives, incubates, and enriches. Creative fruition requires the balance of both.',
    practicalUse: 'Balance the masculine drive to execute with the feminine wisdom to incubate and listen to intuitive signals.'
  }
];

const ESOTERIC_TERMS: LexiconTerm[] = [
  {
    term: 'The Left-Hand Path (Vamachara)',
    tradition: 'Left-Hand Path',
    definition: 'Unlike the Right-Hand Path (which seeks dissolution of the ego into a collective divine ocean), the Left-Hand Path seeks self-deification, sovereign individuality, non-conformity, and intentional mastery of the physical and psychological shadow.',
    practicalInsight: 'Preserve personal sovereignty; refuse to surrender your critical faculties to dogmatic orthodoxy.'
  },
  {
    term: 'Solve et Coagula',
    tradition: 'Occult & Alchemy',
    definition: 'The cornerstone Latin alchemical maxim: "Dissolve and Coagulate". First dissolve outdated, rigid psychological conditioning and defense mechanisms, then reassemble the purified self into an indestructible golden core.',
    practicalInsight: 'Do not fear emotional breakdown; it is the necessary "Solve" phase before higher integration.'
  },
  {
    term: 'Anima Mundi',
    tradition: 'Hermetic',
    definition: 'The "World Soul". The subtle, living, interconnected conscious matrix connecting all biological, mineral, and celestial entities across the cosmos.',
    practicalInsight: 'Recognize that synchronicities and divination readings are conversations with the living World Soul.'
  },
  {
    term: 'Egregore',
    tradition: 'Occult & Alchemy',
    definition: 'A non-physical psychic entity or thought-form generated and sustained by the shared focus, emotional intensity, and rituals of a collective group of people.',
    practicalInsight: 'Be mindful of which social or corporate egregores you feed with your attention and emotional outrage.'
  },
  {
    term: 'Theurgy (Divine Magic)',
    tradition: 'Hermetic',
    definition: 'Classical Neoplatonic practice aiming to purify and unite the human soul with the Divine through sacred contemplation, invocations, and ritual symbols.',
    practicalInsight: 'Practice art and meditation not as superficial entertainment, but as sacred acts of soul elevation.'
  },
  {
    term: 'Galdr',
    tradition: 'Norse',
    definition: 'The Old Norse art of incantation and runic vocalization, designed to vibrate physical and energetic reality into alignment with runic archetypes.',
    practicalInsight: 'Speak with deliberate weight; words are phonetic talismans that shape your immediate environment.'
  },
  {
    term: 'Seidr',
    tradition: 'Norse',
    definition: 'Shamanic Norse magic associated with Freyja and Odin, involving altered trance states, spirit travel between the Nine Worlds, and weaving the threads of Wyrd.',
    practicalInsight: 'Cultivate receptive intuition and silent stillness to perceive subtle energetic undercurrents.'
  },
  {
    term: 'Fana (Annihilation of Ego)',
    tradition: 'Eastern / Sufi',
    definition: 'The mystical Sufi stage of ego-extinction, where the petty self dies so the transcendent divine light can shine through the heart without obstruction.',
    practicalInsight: 'True humility is not self-hatred, but complete freedom from the anxious performance of the ego.'
  },
  {
    term: 'Quintessence (The Fifth Element)',
    tradition: 'Occult & Alchemy',
    definition: 'The pure, incorruptible fifth element (Aether) permeating all four classical elements (Fire, Water, Air, Earth), holding the secret of spiritual immortality.',
    practicalInsight: 'Look beneath surface material conditions for the subtle spirit that animates them.'
  },
  {
    term: 'Shadow Work',
    tradition: 'Left-Hand Path',
    definition: 'The conscious exploration, confrontation, and integration of repressed, denied, or taboo parts of the self (Carl Jung / Left-Hand occultism).',
    practicalInsight: 'What you refuse to face in yourself controls you from the dark; integrate the shadow to gain authentic personal power.'
  },
  {
    term: 'Merkstave',
    tradition: 'Norse',
    definition: 'A rune drawn upside-down or reversed, indicating blocked energy, internal excess, psychological shadow, or an obstacle demanding conscious resolution.',
    practicalInsight: 'Treat setbacks not as punitive curses, but as precise diagnostic diagnostics highlighting misalignments.'
  },
  {
    term: 'Microcosm & Macrocosm',
    tradition: 'Hermetic',
    definition: 'The ancient doctrine that the human individual is a miniature replica of the entire universe, containing all planetary forces, elements, and gods within.',
    practicalInsight: 'All external wisdom is already coded into your internal biology and consciousness.'
  }
];

export const HermeticLexicon: React.FC<{ onConsultAdvisor?: (advisor: string, prompt: string) => void }> = ({
  onConsultAdvisor
}) => {
  const [activeTab, setActiveTab] = useState<'principles' | 'lexicon'>('principles');
  const [selectedPrinciple, setSelectedPrinciple] = useState<Principle>(HERMETIC_PRINCIPLES[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [traditionFilter, setTraditionFilter] = useState<string>('all');

  const traditions = ['all', 'Hermetic', 'Occult & Alchemy', 'Norse', 'Eastern / Sufi', 'Left-Hand Path'];

  const filteredTerms = ESOTERIC_TERMS.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q) ||
      item.practicalInsight.toLowerCase().includes(q);

    const matchesTradition = traditionFilter === 'all' || item.tradition === traditionFilter;

    return matchesSearch && matchesTradition;
  });

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6 shadow-xl animate-fadeIn space-y-6 select-text font-google-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
              The Seven Hermetic Principles & Lexicon
            </span>
          </div>
          <h3 className="font-syne font-extrabold text-lg sm:text-xl uppercase text-[#F8F7F4] tracking-tight mt-0.5">
            Hermetic Laws & Occult Terminology
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            The immutable universal laws of Hermes Trismegistus, alongside foundational definitions of Left-Hand Path and esoteric doctrine.
          </p>
        </div>

        {onConsultAdvisor && (
          <button
            onClick={() => onConsultAdvisor('Madame Blavatsky', 'Madame Blavatsky, guide me through the seven Hermetic Principles and their role in spiritual evolution.')}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono uppercase font-bold transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Consult Blavatsky</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Switch between Principles & Lexicon */}
      <div className="flex gap-2 border-b border-zinc-900 pb-2">
        <button
          onClick={() => setActiveTab('principles')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
            activeTab === 'principles'
              ? 'bg-[#DC143C] text-white shadow-md'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          The 7 Hermetic Principles
        </button>
        <button
          onClick={() => setActiveTab('lexicon')}
          className={`px-4 py-2 rounded-lg text-xs font-mono uppercase font-bold transition-all cursor-pointer ${
            activeTab === 'lexicon'
              ? 'bg-[#DC143C] text-white shadow-md'
              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
          }`}
        >
          Esoteric Lexicon & Terms ({ESOTERIC_TERMS.length})
        </button>
      </div>

      {/* SECTION 1: 7 PRINCIPLES */}
      {activeTab === 'principles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Principles selector on left */}
          <div className="lg:col-span-5 space-y-1.5 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
            {HERMETIC_PRINCIPLES.map((p) => {
              const isSelected = selectedPrinciple.number === p.number;
              return (
                <button
                  key={p.number}
                  onClick={() => setSelectedPrinciple(p)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg shadow-[#DC143C]/10'
                      : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#DC143C]">{p.number}</span>
                    <span className="font-syne font-bold text-xs uppercase text-[#F8F7F4]">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">→</span>
                </button>
              );
            })}
          </div>

          {/* Principle dossier on right */}
          <div className="lg:col-span-7 bg-black border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col justify-between min-h-[420px]">
            {selectedPrinciple && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <span className="text-[9px] font-mono uppercase text-[#DC143C] font-bold tracking-widest block">
                    Principle {selectedPrinciple.number} of The Kybalion
                  </span>
                  <h4 className="font-syne font-extrabold text-xl text-[#F8F7F4] uppercase tracking-tight mt-0.5">
                    {selectedPrinciple.name}
                  </h4>
                  <p className="text-xs font-serif italic text-amber-400 mt-1">
                    {selectedPrinciple.axiom}
                  </p>
                </div>

                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900">
                  <span className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block mb-1">
                    Cosmic Explanation & Doctrine
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedPrinciple.explanation}
                  </p>
                </div>

                <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/40">
                  <span className="text-[8.5px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                    Mastery & Practical Application
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedPrinciple.practicalUse}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: ESOTERIC LEXICON */}
      {activeTab === 'lexicon' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search & Tradition filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search esoteric concepts, Solve et Coagula, Egregore, Left-Hand Path..."
              className="flex-1 bg-black border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 font-google-sans"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {traditions.map((trad) => (
              <button
                key={trad}
                onClick={() => setTraditionFilter(trad)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                  traditionFilter === trad
                    ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-md shadow-purple-600/20'
                    : 'bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300'
                }`}
              >
                {trad === 'all' ? 'All Traditions' : trad}
              </button>
            ))}
          </div>

          {/* Lexicon cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[550px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredTerms.map((item) => (
              <div
                key={item.term}
                className="bg-black border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 flex flex-col justify-between space-y-2.5 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-purple-400 font-bold">
                      {item.tradition}
                    </span>
                  </div>
                  <h5 className="font-syne font-bold text-sm text-[#F8F7F4] uppercase">
                    {item.term}
                  </h5>
                  <p className="text-zinc-300 text-xs leading-relaxed mt-1 font-google-sans">
                    {item.definition}
                  </p>
                </div>

                <div className="border-t border-zinc-900/60 pt-2 bg-zinc-950/60 p-2 rounded-lg">
                  <span className="text-[8px] font-mono uppercase text-emerald-400 font-bold block mb-0.5">
                    Practical Insight
                  </span>
                  <p className="text-[11px] text-zinc-400 font-google-sans">
                    {item.practicalInsight}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-10 text-zinc-600 font-mono text-xs">
              No esoteric terms found matching your query.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
