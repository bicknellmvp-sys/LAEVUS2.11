import React, { useState } from 'react';

interface FAQItem {
  id: string;
  category: 'Origins' | 'The Aettir' | 'Divination' | 'Galdr & Magic' | 'Ethics & Artifacts';
  question: string;
  answer: string;
  keyPoints?: string[];
}

const FAQS: FAQItem[] = [
  {
    id: 'what-is-elder-futhark',
    category: 'Origins',
    question: 'What is the Elder Futhark, and how old is it?',
    answer: 'The Elder Futhark is the oldest known runic writing system, utilized across northwestern Europe and Scandinavia from approximately the 2nd to the 8th century AD during the Migration Period and early Viking Age. Named as an acronym for its first six letters (Fehu, Uruz, Thurisaz, Ansuz, Raido, Kenaz), it consists of 24 angular phonemes engineered for direct carving into resilient organic mediums like wood, bone, stone, and horn.',
    keyPoints: [
      '24 angular glyphs designed without horizontal lines (to prevent splitting along wood grain).',
      'Predates the later 16-rune Younger Futhark (Viking Age) and the 33-rune Anglo-Saxon Futhorc.',
      'Earliest continuous 24-rune sequence discovered on the Swedish Kylver Stone (c. 400 AD).'
    ]
  },
  {
    id: 'futhark-vs-younger',
    category: 'Origins',
    question: 'Why did the 24 runes reduce to 16 in the Younger Futhark?',
    answer: 'During the 8th century, as Old Norse phonology evolved and the Viking Age accelerated, Scandinavian skalds condensed the alphabet into 16 runes (Younger Futhark), paradoxically having fewer letters while the spoken language possessed more vowel sounds. Elder Futhark, with its full 24 letters, remained the sacred, uncompressed cosmological system favored for esoteric, talismanic, and divinatory workings.',
    keyPoints: [
      'Younger Futhark was heavily optimized for everyday commercial trade and monumental runestones.',
      'Elder Futhark retained the complete triadic structure (3 Aettir of 8 runes) essential for metaphysical alignment.'
    ]
  },
  {
    id: 'three-aettir-meaning',
    category: 'The Aettir',
    question: 'What is an "Aett", and how does the triadic division function?',
    answer: 'An "Aett" (plural "Aettir") translates to "family", "generation", or "octave". The 24 runes are divided into three distinct groups of eight, each overseen by a presiding Norse deity. This triadic progression represents the universal spiritual evolution of consciousness: from primal material manifestation, through catalytic trials and nature forces, into transcendent sovereignty and selfhood.',
    keyPoints: [
      "Freyr's Aett (1-8: Fehu to Wunjo): Creation, material sustenance, primal drives, boundaries, and social fellowship.",
      "Heimdall's Aett (9-16: Hagalaz to Sowilo): Disruption, necessity, winter stillness, karmic harvest, endurance, and solar victory.",
      "Tyr's Aett (17-24: Tiwaz to Othala): Sovereign law, fertility, partnership, humanity, intuition, dawn, and ancestral legacy."
    ]
  },
  {
    id: 'divination-historical-roots',
    category: 'Divination',
    question: 'Were runes historically used for divination or merely writing?',
    answer: 'Both. Roman historian Tacitus in Germania (98 AD, Chapter 10) famously recorded Germanic divination: priests sliced branches from a nut-bearing tree into small slips, carved them with secret marks (notae), and scattered them at random upon a white cloth. The priest then prayed to the gods and, looking upward, picked up three slips to interpret the omens. While runes functioned as everyday letters, each rune was also an ideograph carrying a divine archetype.',
    keyPoints: [
      'Documented by Tacitus in 98 AD using carved twigs on white linen cloths.',
      'The Poetic Edda (Sigrdrífumál) records carving runes on sword hilts, shields, and animal horns for magical protection.',
      'Egil\'s Saga illustrates the mortal danger of misinterpreting or incorrectly carving runic staves.'
    ]
  },
  {
    id: 'merkstave-concept',
    category: 'Divination',
    question: 'What is a "Merkstave" rune, and how should reversed runes be read?',
    answer: 'A "Merkstave" (literally "dark stave" or "boundary stick") refers to a rune drawn upside-down or reversed during a divination reading. In esoteric runology, a merkstave rune does not signify an evil curse; rather, it highlights blocked energy, internal resistance, unconscious shadow dynamics, or excess. Notably, 9 symmetrical runes (Gebo, Hagalaz, Nauthiz, Isa, Jera, Eihwaz, Sowilo, Ingwaz, Dagaz) cannot be inverted and must be read in context of surrounding cast staves.',
    keyPoints: [
      'Merkstave reveals the shadow, excess, or blockage of the upright archetype.',
      'Symmetrical runes cannot invert; their shadow is discerned through intuition and neighboring casting positions.',
      'Approached as constructive self-diagnostic warning rather than fatalistic dread.'
    ]
  },
  {
    id: 'how-to-cast-runes',
    category: 'Divination',
    question: 'What are the classic spreads and ritual methods for casting runes?',
    answer: 'Practitioners typically keep runes in a natural pouch (leather, linen, or silk). Traditional casting methods include: 1) The Single Rune (Daily guidance and focus); 2) The Three Norns Spread (Urðr/Past, Verðandi/Present Catalyst, Skuld/Future Trajectory); 3) The Five Rune Elemental Cross; and 4) The Nine Realms Cast, where runes are gently tossed onto a circular cloth depicting the world tree, interpreting proximity to the center as immediacy.',
    keyPoints: [
      'Natural casting surfaces: undyed linen cloth or flat smooth wood.',
      'Focus questions on dynamic agency: "What forces should I align with?" rather than passive yes/no predictions.'
    ]
  },
  {
    id: 'galdr-and-sound',
    category: 'Galdr & Magic',
    question: 'What is Galdr, and how are runes vocalized or chanted?',
    answer: 'Galdr is the ancient Germanic art of incantatory magic and vocal vibration. Each rune possesses a specific acoustic tone and vowel/consonant resonance. When chanted in rhythmic meter (Galdralag), the vocal vibration alters the practitioner\'s neurological frequency and auric field, resonating with the cosmic archetype of the rune (e.g., chanting "FEEEE-HUUUU" to mobilize dormant resources).',
    keyPoints: [
      'Galdr translates to "incantation" or "crowing/singing" of sacred sounds.',
      'Vibrates the chest cavity and cranium to harmonize physical matter with spiritual intent.'
    ]
  },
  {
    id: 'bindrunes-galdrastafir',
    category: 'Galdr & Magic',
    question: 'What is a Bindrune, and how are magical staves constructed?',
    answer: 'A Bindrune is formed by fusing two or more individual runes onto a single central stave. This condenses multiple complementary energies into a unified talisman. In later Icelandic sorcery, this evolved into Galdrastafir—complex compass-like sigils such as the Ægishjálmur (Helm of Awe) for psychic invulnerability and the Vegvísir (Wayfinder) to prevent losing one\'s path in life’s storms.',
    keyPoints: [
      'Constructed with minimal lines to prevent clashing energies.',
      'Traditionally activated through focused breathing, blooding/red ochre, and spoken intent.'
    ]
  },
  {
    id: 'odin-ordeal-havamal',
    category: 'Origins',
    question: 'How did Odin obtain the Runes according to myth?',
    answer: 'In the Hávamál (Stanzas 138–145), Odin recounts hanging for nine days and nights on the windy world tree Yggdrasil. Pierced with his own spear and given neither bread nor mead, he gazed downward into the dark primeval void until, screaming in agony and ecstatic realization, he snatched up the Runes from the abyss. The myth teaches that wisdom is not a casual gift, but an illumination born of voluntary suffering and supreme dedication.',
    keyPoints: [
      '"Dedicated to Odin, myself to myself" — the seeker must sacrifice lower comfort to claim higher perception.',
      'Establishes the Runes as cosmic building blocks of reality rather than mere human inventions.'
    ]
  },
  {
    id: 'wood-materials-carving',
    category: 'Ethics & Artifacts',
    question: 'What materials are traditionally used to carve runes?',
    answer: 'Runes are best carved on organic living mediums harvested with respect: wood from fruit-bearing or sacred trees (Ash for Yggdrasil, Yew for endurance, Oak for Thor, Birch for Berkana), smooth river stones, antler, or bone. Historically, inscriptions were colored with red pigments (ochre or iron oxide), symbolizing the vital lifeforce injected into the dormant glyph.',
    keyPoints: [
      'Ash, Yew, Oak, and Birch are traditional wood selections.',
      'Red pigments symbolize blood, fire, and awakening vitality.'
    ]
  },
  {
    id: 'ethics-egil-warning',
    category: 'Ethics & Artifacts',
    question: 'What ethical warnings exist regarding runic practice?',
    answer: 'The definitive warning comes from Egil\'s Saga: "No man should carve runes who knows not how to read them; for many a man has been misled by dark-cut staves." Because runes are direct conduits of primal archetypal forces, carving them with careless, confused, or malevolent intent rebounds onto the practitioner. Integrity, mental clarity, and deep study are required before engaging in talismanic work.',
    keyPoints: [
      'Approach runes with respect and sober self-honesty.',
      'Avoid chaotic or conflicting bindrunes that fragment intention.'
    ]
  },
  {
    id: 'runes-vs-tarot',
    category: 'Divination',
    question: 'How does runic divination differ from Tarot?',
    answer: 'While Tarot is rooted in Mediterranean, Renaissance, and Hermetic-Kabbalistic traditions with elaborate pictorial archetypes and 78 cards, the 24 Runes are austere, elemental, and rooted in the harsh landscapes and fatalistic nobility of the North. Tarot reflects psychological scenarios and internal states; Runes operate like elemental vectors of force, addressing raw conditions, boundaries, and sovereign resilience.',
    keyPoints: [
      'Tarot offers rich narrative pictorial symbolism; Runes offer concentrated elemental vectors.',
      'Both systems complement each other seamlessly: Tarot clarifies the soul’s journey, while Runes harden the will.'
    ]
  }
];

export const FutharkFAQCompendium: React.FC<{ onConsultAdvisor?: (advisor: string, prompt: string) => void }> = ({
  onConsultAdvisor
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string>(FAQS[0].id);

  const categories = ['all', 'Origins', 'The Aettir', 'Divination', 'Galdr & Magic', 'Ethics & Artifacts'];

  const filteredFaqs = FAQS.filter((faq) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.keyPoints?.some((kp) => kp.toLowerCase().includes(q));

    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6 shadow-xl animate-fadeIn space-y-6 select-text font-google-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              Elder Futhark Master Compendium
            </span>
          </div>
          <h3 className="font-syne font-extrabold text-lg sm:text-xl uppercase text-[#F8F7F4] tracking-tight mt-0.5">
            Exhaustive Runological FAQ & Gnosis
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            12 core inquiries covering epigraphy, the three Aettir, Tacitean casting rituals, Galdr vocalization, and bindrune talismans.
          </p>
        </div>

        {onConsultAdvisor && (
          <button
            onClick={() => onConsultAdvisor('Odin', 'Odin, as the first discoverer of the Runes upon Yggdrasil, answer my deepest question regarding runic casting.')}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono uppercase font-bold transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Ask the High One</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search runic questions, casting rites, Tacitus, Galdr, bindrunes..."
            className="w-full bg-black border border-zinc-900 rounded-xl px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 font-google-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-zinc-600 hover:text-white text-xs cursor-pointer"
            >
              ×
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                activeCategory === cat
                  ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-md shadow-amber-600/20'
                  : 'bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800'
              }`}
            >
              {cat === 'all' ? `All Inquiries (${FAQS.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isExpanded
                  ? 'bg-black border-[#DC143C]/60 shadow-lg shadow-[#DC143C]/5'
                  : 'bg-zinc-950/70 border-zinc-900 hover:border-zinc-800'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? '' : faq.id)}
                className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-zinc-600 w-6">
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <span className="font-syne font-bold text-xs sm:text-sm text-[#F8F7F4] tracking-tight">
                    {faq.question}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-[8px] font-mono uppercase text-zinc-400 border border-zinc-800 hidden sm:inline">
                    {faq.category}
                  </span>
                  <span className="text-zinc-500 font-mono text-sm">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-zinc-900/60 animate-fadeIn space-y-3">
                  <p className="text-xs text-zinc-300 leading-relaxed font-google-sans">
                    {faq.answer}
                  </p>

                  {faq.keyPoints && faq.keyPoints.length > 0 && (
                    <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 space-y-1.5">
                      <span className="text-[8.5px] font-mono uppercase text-[#DC143C] font-bold block">
                        Key Tenets & Epigraphic Notes
                      </span>
                      <ul className="space-y-1">
                        {faq.keyPoints.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5 text-zinc-400 text-[11px]">
                            <span className="text-[#DC143C] text-xs leading-none mt-0.5">▪</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-10 text-zinc-600 font-mono text-xs">
            No questions found matching your query.
          </div>
        )}
      </div>

    </div>
  );
};
