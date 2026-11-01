import React, { useState } from 'react';

export const NorseHistoryCodex: React.FC<{ onConsultAdvisor?: (advisor: string, prompt: string) => void }> = ({
  onConsultAdvisor
}) => {
  const [subSection, setSubSection] = useState<'realms' | 'pantheon' | 'cosmology' | 'wyrd' | 'ragnarok' | 'seidr'>('realms');
  const [selectedRealmIndex, setSelectedRealmIndex] = useState(0);
  const [selectedDeityIndex, setSelectedDeityIndex] = useState(0);

  const NINE_REALMS = [
    {
      name: 'Asgard',
      meaning: 'Enclosure of the Aesir',
      inhabitants: 'The Aesir gods (Odin, Thor, Frigg, Baldr, Tyr)',
      element: 'Celestial Fire & Golden Light',
      hall: 'Valhalla, Bilskirnir, Fensalir, Gladsheim',
      summary: 'The celestial citadel located in the highest branches of Yggdrasil, connected to Midgard by the shimmering rainbow bridge Bifröst. It represents divine order, high architecture, heroic sovereignty, and purposeful assembly.',
      esotericLesson: 'The realm of conscious will, executive clarity, and noble ideals. It requires constant boundary vigilance to protect against lower chaotic impulses.'
    },
    {
      name: 'Midgard',
      meaning: 'Middle Earth / Middle Enclosure',
      inhabitants: 'Mortal Humanity (Descendants of Ask and Embla)',
      element: 'Earth & Salt Water',
      hall: 'The mortal continents encircled by Jörmungandr',
      summary: 'The physical terrestrial plane fashioned by Odin and his brothers from the brow of the primordial giant Ymir. Completely encircled by the vast world ocean where the Midgard Serpent lies biting its own tail.',
      esotericLesson: 'The battleground of conscious action. Midgard is the dense physical manifestation where karmic debt and heroic legacy are tangibly forged through daily deeds.'
    },
    {
      name: 'Jotunheim (Utgard)',
      meaning: 'Realm of the Giants (The Outer Realm)',
      inhabitants: 'The Jötnar (Frost, Mountain, and Rock Giants)',
      element: 'Primordial Rock, Glacier & Wild Tempest',
      hall: 'Utgarda-Loki’s Fortress, Gastropnir, Mimir’s Well',
      summary: 'The vast, rugged, primeval wilderness of sheer cliffs, frozen forests, and howling chasms beyond the boundaries of civilization. It houses Mimir’s Well of primordial memory and wisdom.',
      esotericLesson: 'The realm of the untamed subconscious, raw raw nature, and shadow forces. Danger lies in being crushed by them; wisdom lies in engaging them respectfully without surrendering sovereignty.'
    },
    {
      name: 'Vanaheim',
      meaning: 'Home of the Vanir',
      inhabitants: 'The Vanir deities (Njord, Freyja, Freyr, Kvasir)',
      element: 'Flowing Water, Living Earth & Verdant Life',
      hall: 'Noatun (Ship-Haven), Sessrumnir',
      summary: 'The tranquil, fertile, and magical realm of the elder fertility and nature deities. Unlike the martial Aesir, the Vanir govern agriculture, oceanic tides, trade, sensual ecstasy, and deep magical seer-craft (Seidr).',
      esotericLesson: 'Integration of instinctual sensuality, natural abundance, and emotional resonance. Teaches that peace and fertility must balance the martial sword.'
    },
    {
      name: 'Alfheim (Ljósálfheim)',
      meaning: 'World of the Light Elves',
      inhabitants: 'The Light Elves (Ljósálfar), ruled by Freyr',
      element: 'Pure Air, Subtle Light & Ether',
      hall: 'The Hall of Freyr',
      summary: 'A luminous, airy realm shimmering higher than the sun. The Light Elves are beings of extraordinary ethereal beauty, mental lucidity, creative genius, and artistic inspiration.',
      esotericLesson: 'The realm of higher intellect, aesthetic intuition, and refined philosophical clarity. It elevates coarse physical desires into harmonious spiritual expression.'
    },
    {
      name: 'Svartalfheim (Nidavellir)',
      meaning: 'Dark Elves / Low Fields of the Dwarves',
      inhabitants: 'The Dvergar (Dwarves / Master Smith Artisans)',
      element: 'Mineral Earth, Molten Ore & Subterranean Flame',
      hall: 'The Golden Halls of Sindri, caves of Brokkr',
      summary: 'The labyrinthine underground caverns and fiery subterranean forges beneath the earth. Here the subterranean craftsmen fashion the greatest treasures of the cosmos: Thor’s hammer Mjölnir, Odin’s spear Gungnir, and Freyja’s necklace Brísingamen.',
      esotericLesson: 'The alchemical craft of transforming dark, unrefined emotional trauma and subterranean pain into shining, indestructible spiritual weapons.'
    },
    {
      name: 'Niflheim',
      meaning: 'Abode of Mist and Primordial Ice',
      inhabitants: 'Primeval frost spirits, the dragon Níðhöggr',
      element: 'Venomous Rime, Freezing Mist & Glacial Cold',
      hall: 'Spring of Hvergelmir (Source of all eleven rivers Élivágar)',
      summary: 'The ancient primordial realm of extreme freezing cold, stinging fog, and frozen venom that existed long before creation. At its heart roars Hvergelmir, the boiling cauldron feeding the cosmic rivers.',
      esotericLesson: 'The principle of absolute contraction, crystallizing stillness, and latent potential awaiting the spark of spirit.'
    },
    {
      name: 'Muspelheim',
      meaning: 'Realm of Fire and Heat',
      inhabitants: 'The Fire Giants (Eldjötnar), ruled by Surtr',
      element: 'Raging Fire, Magma & Cosmic Sparks',
      hall: 'Surtr’s Black Fortress at the Southern Horizon',
      summary: 'The primeval southern realm of blinding light and devouring flame. Long before gods and mortals existed, the giant Surtr stood here with his flaming sword, awaiting the final reckoning of Ragnarök.',
      esotericLesson: 'The principle of pure expansion, untamed passion, and transformative destruction that consumes outdated forms so new life can emerge.'
    },
    {
      name: 'Helheim (Niflhel)',
      meaning: 'The Domain of Hel (The Hidden Realm)',
      inhabitants: 'The quiet ancestral dead, ruled by Queen Hel',
      element: 'Silent Grey Waters & Shadowed Earth',
      hall: 'Eljudnir (Sleet-Cold), guarded by the hound Garmr',
      summary: 'The subterranean resting domain across the river Gjöll for those who died of age, illness, or peaceful exhaustion. Neither torment nor punishment, it is a serene shadow-realm of quiet ancestral slumber and restoration.',
      esotericLesson: 'Confrontation with inevitable mortality, surrender of the ego, and peaceful reconciliation with ancestral roots.'
    }
  ];

  const DEITIES = [
    {
      name: 'Odin the Allfather',
      title: 'The Ecstatic Wanderer & Lord of the Gallows',
      symbols: 'Ravens (Huginn & Muninn), Wolves (Geri & Freki), Spear Gungnir, Eight-legged horse Sleipnir',
      archetype: 'The Sovereign Occult Shaman, seeker of truth at any price, patron of kings, outlaws, and poets.',
      doctrine: 'Odin does not seek comfortable safety; he hung on the windy tree for nine agonizing nights without water or mead to wrest the Runes from the abyss. He gave his right eye at Mimir’s Well for a single draught of primordial wisdom. He reminds seekers that profound insight requires voluntary sacrifice.'
    },
    {
      name: 'Freyja',
      title: 'Mistress of Seidr & Queen of the Vanir',
      symbols: 'Falcon Cloak, Brísingamen, Chariot drawn by blue cats, Golden Tears',
      archetype: 'Independent Sovereignty, High Magick, Sacred Eroticism, and Sovereign Choice.',
      doctrine: 'Freyja introduced the shamanic art of Seidr to the Aesir. As leader of the Valkyries, she chooses half of all battle-fallen heroes for her hall Sessrumnir before Odin receives his share. She embodies fierce autonomy: she answers to no consort, yielding only to true spiritual reciprocity.'
    },
    {
      name: 'Thor',
      title: 'Protector of Midgard & Lord of the Thunder',
      symbols: 'Hammer Mjölnir, Iron Gauntlets Járngreipr, Belt of Strength Megingjörð',
      archetype: 'The Defender of the Common Folk, righteous martial strength, and elemental vitality.',
      doctrine: 'Thor is the loyal hammer striking against the chaotic encroachment of the giants. Where Odin schemes and ponders, Thor acts with transparent, thunderous courage. His hammer is not just a weapon, but a sacred instrument used to bless marriages, hallow graves, and protect the sanctuary.'
    },
    {
      name: 'Tyr',
      title: 'The One-Handed God of Inviolable Law & Honor',
      symbols: 'The Upright Spear, The Golden Scales, The Severed Right Hand',
      archetype: 'Integrity through Self-Sacrifice, Moral Courage, and Sacred Oaths.',
      doctrine: 'When the gods could not bind the terrifying cosmic wolf Fenrir, the beast demanded a god place a hand in its mouth as a pledge of good faith. Only Tyr had the courage to step forward. He willingly sacrificed his sword hand so the realm could be saved, embodying the ultimate cost of authentic honor.'
    },
    {
      name: 'Loki',
      title: 'The Catalyst, Shape-Shifter & Sacred Trickster',
      symbols: 'Flickering Flame, Salmon, The Mistletoe Dart, Entangled Nets',
      archetype: 'The Necessary Shadow, Dissolver of Stagnant Stasis, Catalyst of Transformation.',
      doctrine: 'Loki is both blood-brother to Odin and the father of the apocalyptic beasts (Fenrir, Jörmungandr, Hel). He represents the uncomfortable truth that stability breeds decay unless regularly challenged. Though his cunning precipitates tragedy, it also compels the gods to evolve.'
    },
    {
      name: 'Heimdall',
      title: 'The Silent Sentinel & Guardian of the Bifröst',
      symbols: 'The Great Horn Gjallarhorn, Golden Teeth, Sword Hofund',
      archetype: 'Unblinking Vigilance, Heightened Sensory Perception, and Spiritual Discernment.',
      doctrine: 'Heimdall sleeps less than a bird, can see a hundred leagues by night as by day, and can hear the grass grow upon the earth and the wool upon sheep. He guards the threshold against chaotic incursions and will sound the blast that alerts the cosmos when the final hour arrives.'
    },
    {
      name: 'Skadi',
      title: 'Jötun Goddess of the Bow & Mountain Winter',
      symbols: 'Snowshoes, Hunting Bow, Mountain Wolves, Cold Granite',
      archetype: 'Unyielding Independence, Fierce Grief Turned to Sovereignty, and Winter Solitude.',
      doctrine: 'When her father Thjazi was slain, Skadi donned armor and marched alone to the gates of Asgard demanding blood-restitution. Offered marriage to a god if she chose solely by inspecting their feet, she refused to abandon her rugged mountain home Thrymheim for the ocean halls of Njord. She teaches the sanctity of true selfhood.'
    },
    {
      name: 'Hel',
      title: 'Queen of the Underworld & Keeper of Ancestral Rest',
      symbols: 'Half-Living Flesh, Half-Decayed Shadow, The Black Scepter',
      archetype: 'The Inevitable Threshold, The Gentle Shadow, and Impartial Equity.',
      doctrine: 'Banished by Odin to the subterranean mist realm, Hel accepted her role without complaint. She rules neither a torture chamber nor a punishment pit, but a quiet hall where weary souls recover from the fatigue of mortal existence. She is utterly impartial: neither wealth, fame, nor royal blood sways her judgment.'
    }
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6 shadow-xl animate-fadeIn space-y-6 select-text font-google-sans">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Norse Mythological & Historical Codex
            </span>
          </div>
          <h3 className="font-syne font-extrabold text-lg sm:text-xl uppercase text-[#F8F7F4] tracking-tight mt-0.5">
            The Cosmos of Yggdrasil & The High Lore
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Comprehensive treatise on the Nine Realms, the Norse Pantheon, the Web of Wyrd, and the Shamanic Seidr tradition.
          </p>
        </div>

        {onConsultAdvisor && (
          <button
            onClick={() => onConsultAdvisor('Odin', 'Odin Allfather, unveil the hidden cosmological secrets of Yggdrasil and the Web of Wyrd.')}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] text-zinc-300 hover:text-white border border-zinc-800 text-xs font-mono uppercase font-bold transition-all cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
          >
            <span>Consult Odin</span>
            <span>→</span>
          </button>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 bg-black p-1.5 rounded-xl border border-zinc-900">
        <button
          onClick={() => setSubSection('realms')}
          className={`px-2 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
            subSection === 'realms' ? 'bg-[#DC143C] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          Nine Realms (9)
        </button>
        <button
          onClick={() => setSubSection('pantheon')}
          className={`px-2 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
            subSection === 'pantheon' ? 'bg-[#DC143C] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          Pantheon (8)
        </button>
        <button
          onClick={() => setSubSection('cosmology')}
          className={`px-2 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
            subSection === 'cosmology' ? 'bg-[#DC143C] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          Creation
        </button>
        <button
          onClick={() => setSubSection('wyrd')}
          className={`px-2 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
            subSection === 'wyrd' ? 'bg-[#DC143C] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          Web of Wyrd
        </button>
        <button
          onClick={() => setSubSection('ragnarok')}
          className={`px-2 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
            subSection === 'ragnarok' ? 'bg-[#DC143C] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          Ragnarök
        </button>
        <button
          onClick={() => setSubSection('seidr')}
          className={`px-2 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer text-center ${
            subSection === 'seidr' ? 'bg-[#DC143C] text-white shadow-md' : 'text-zinc-500 hover:text-zinc-200'
          }`}
        >
          Seidr & Völva
        </button>
      </div>

      {/* SUB-SECTION 1: NINE REALMS */}
      {subSection === 'realms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Realms List */}
          <div className="lg:col-span-4 space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {NINE_REALMS.map((realm, idx) => (
              <button
                key={realm.name}
                onClick={() => setSelectedRealmIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedRealmIndex === idx
                    ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg shadow-[#DC143C]/10'
                    : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-syne font-bold text-xs uppercase">{realm.name}</span>
                  <span className="text-[8px] font-mono text-zinc-600">0{idx + 1}</span>
                </div>
                <span className="text-[9px] text-zinc-500 italic mt-0.5">{realm.meaning}</span>
              </button>
            ))}
          </div>

          {/* Selected Realm Details */}
          <div className="lg:col-span-8 bg-black border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col justify-between min-h-[440px]">
            {NINE_REALMS[selectedRealmIndex] && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#DC143C] font-bold tracking-widest block">
                      Realm 0{selectedRealmIndex + 1} of 09 · Yggdrasil World Tree
                    </span>
                    <h4 className="font-syne font-extrabold text-xl text-[#F8F7F4] uppercase tracking-tight mt-0.5">
                      {NINE_REALMS[selectedRealmIndex].name}
                    </h4>
                    <span className="text-xs text-zinc-400 italic">
                      "{NINE_REALMS[selectedRealmIndex].meaning}"
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900">
                    <span className="text-[8px] font-mono uppercase text-zinc-500 block">Inhabitants & Deities</span>
                    <span className="text-zinc-300 font-bold text-[10.5px]">{NINE_REALMS[selectedRealmIndex].inhabitants}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900">
                    <span className="text-[8px] font-mono uppercase text-zinc-500 block">Elemental Manifestation</span>
                    <span className="text-zinc-300 font-bold text-[10.5px]">{NINE_REALMS[selectedRealmIndex].element}</span>
                  </div>
                </div>

                <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block mb-1">
                    Cosmological Geography & Halls
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {NINE_REALMS[selectedRealmIndex].summary}
                  </p>
                </div>

                <div className="bg-emerald-950/20 p-3.5 rounded-xl border border-emerald-900/40">
                  <span className="text-[8.5px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                    Esoteric Lesson & Shamanic Application
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {NINE_REALMS[selectedRealmIndex].esotericLesson}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: PANTHEON & ARCHETYPES */}
      {subSection === 'pantheon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fadeIn">
          {/* Deity Selector */}
          <div className="lg:col-span-4 space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            {DEITIES.map((deity, idx) => (
              <button
                key={deity.name}
                onClick={() => setSelectedDeityIndex(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedDeityIndex === idx
                    ? 'bg-zinc-900 border-[#DC143C] text-white shadow-lg shadow-[#DC143C]/10'
                    : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="font-syne font-bold text-xs uppercase">{deity.name}</span>
                <span className="text-[9px] text-zinc-500 italic truncate mt-0.5">{deity.title}</span>
              </button>
            ))}
          </div>

          {/* Deity Deep Dossier */}
          <div className="lg:col-span-8 bg-black border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col justify-between min-h-[440px]">
            {DEITIES[selectedDeityIndex] && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-3">
                  <span className="text-[9px] font-mono uppercase text-[#DC143C] font-bold tracking-widest block">
                    Sovereign Archetype Profile
                  </span>
                  <h4 className="font-syne font-extrabold text-xl text-[#F8F7F4] uppercase tracking-tight mt-0.5">
                    {DEITIES[selectedDeityIndex].name}
                  </h4>
                  <span className="text-xs text-zinc-400 italic">
                    {DEITIES[selectedDeityIndex].title}
                  </span>
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[8px] font-mono uppercase text-zinc-500 block mb-1">Sacred Symbols & Regalia</span>
                  <span className="text-zinc-300 text-xs font-serif italic">{DEITIES[selectedDeityIndex].symbols}</span>
                </div>

                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[8px] font-mono uppercase text-amber-500 font-bold block mb-1">Jungian & Metaphysical Archetype</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{DEITIES[selectedDeityIndex].archetype}</p>
                </div>

                <div className="bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900">
                  <span className="text-[8px] font-mono uppercase text-emerald-400 font-bold block mb-1">Mythological Doctrine & Inner Wisdom</span>
                  <p className="text-zinc-300 text-xs leading-relaxed">{DEITIES[selectedDeityIndex].doctrine}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: CREATION & COSMOLOGY */}
      {subSection === 'cosmology' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black p-4 rounded-xl border border-zinc-900 space-y-2">
              <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">Phase 01: The Primordial Void</span>
              <h5 className="font-syne font-bold text-sm text-[#F8F7F4] uppercase">Ginnungagap</h5>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Before time, sky, earth, or sea, there was only Ginnungagap—the yawning, silent abyss of infinite potential. To the north lay Niflheim, freezing and veiled in venomous mist; to the south raged Muspelheim, burning with fierce unquenchable flame.
              </p>
            </div>

            <div className="bg-black p-4 rounded-xl border border-zinc-900 space-y-2">
              <span className="text-[9px] font-mono uppercase text-amber-500 font-bold">Phase 02: The Primeval Sparks</span>
              <h5 className="font-syne font-bold text-sm text-[#F8F7F4] uppercase">Ymir & Auðumbla</h5>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Where the heat of Muspelheim touched the rime of Niflheim, drops of life quickened. From this thaw sprang Ymir, the hermaphroditic proto-giant, and Auðumbla, the cosmic cow whose four rivers of milk nourished him while her licking of salty stones uncovered Búri, progenitor of the gods.
              </p>
            </div>

            <div className="bg-black p-4 rounded-xl border border-zinc-900 space-y-2">
              <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">Phase 03: The First Mortals</span>
              <h5 className="font-syne font-bold text-sm text-[#F8F7F4] uppercase">Ask & Embla</h5>
              <p className="text-zinc-400 text-xs leading-relaxed">
                Odin and his brothers fashioned the world from Ymir’s flesh, skull, and blood. Walking along the shore, they found two fallen tree trunks (Ash and Elm) and bestowed upon them breath (önd), spirit/mind (óðr), and vital form (lá), creating the first human beings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 4: WEB OF WYRD & NORNS */}
      {subSection === 'wyrd' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-black p-5 rounded-2xl border border-zinc-900 space-y-3">
            <span className="text-[9px] font-mono uppercase text-[#DC143C] font-bold tracking-widest block">
              Urðarbrunnr · The Well of Destiny
            </span>
            <h4 className="font-syne font-extrabold text-base text-[#F8F7F4] uppercase">
              The Three Norns: Urðr, Verðandi, and Skuld
            </h4>
            <p className="text-zinc-300 text-xs leading-relaxed">
              At the sacred root of Yggdrasil sits the Well of Urðr, tended by three sovereign maidens who belong neither to the Aesir nor the giants:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <span className="text-xs font-bold text-amber-400 font-mono block">Urðr (The Past)</span>
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">"That which has been woven"</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  The accumulated weight of every past deed, ancestral memory, and unalterable precedent.
                </p>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <span className="text-xs font-bold text-cyan-400 font-mono block">Verðandi (The Present)</span>
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">"That which is coming into being"</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  The immediate razor-edge of now, where conscious choice meets accumulated momentum.
                </p>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <span className="text-xs font-bold text-emerald-400 font-mono block">Skuld (The Future)</span>
                <span className="text-[10px] text-zinc-500 font-mono block mb-1">"That which should/ought to become"</span>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  The karmic debt and inevitable trajectory that flows from what was and what is chosen now.
                </p>
              </div>
            </div>

            <div className="border-t border-zinc-900 pt-3 text-[11px] text-zinc-400 italic">
              "The Norse concept of Wyrd is not passive victimhood; it is an active web where your present courage actively reshapes the cloth of tomorrow."
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 5: RAGNAROK & REBIRTH */}
      {subSection === 'ragnarok' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-black p-5 rounded-2xl border border-zinc-900 space-y-3">
            <span className="text-[9px] font-mono uppercase text-[#DC143C] font-bold tracking-widest block">
              The Twilight of the Gods & The Golden Dawn
            </span>
            <h4 className="font-syne font-extrabold text-base text-[#F8F7F4] uppercase">
              Ragnarök: Collapse is the Compost of Rebirth
            </h4>
            <p className="text-zinc-300 text-xs leading-relaxed">
              Ragnarök is not an eternal hell or hopeless demise; it is the grand cosmological winter that purges corruption so a clean, golden age can rise.
            </p>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                <span className="font-bold text-zinc-200 block mb-0.5">1. Fimbulwinter & Moral Breakdown</span>
                Three continuous winters without a summer; family ties fracture, greed consumes society, and the wolves Sköll and Hati swallow the sun and moon.
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900">
                <span className="font-bold text-zinc-200 block mb-0.5">2. The Great Climax of Champions</span>
                Fenrir breaks his chains to swallow Odin; Thor slays Jörmungandr but succumbs to venom after nine steps; Heimdall and Loki slay one another; Surtr flings fire across the realms.
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-900 border-l-2 border-l-emerald-500">
                <span className="font-bold text-emerald-400 block mb-0.5">3. Gimlé & The Resurrected World</span>
                The earth rises green, fertile, and self-sowing from the waters. Two humans, Líf and Lífþrasir, emerge from the sacred wood to repopulate humanity. Baldr and Höðr return reconciled, and the golden hall Gimlé shines eternally.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 6: SEIDR & VOLVA TRADITIONS */}
      {subSection === 'seidr' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="bg-black p-5 rounded-2xl border border-zinc-900 space-y-3">
            <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold tracking-widest block">
              Nordic Shamanism & Seer-Craft
            </span>
            <h4 className="font-syne font-extrabold text-base text-[#F8F7F4] uppercase">
              The Völva: Staff-Carriers, Trance & Spá
            </h4>
            <p className="text-zinc-300 text-xs leading-relaxed">
              In Viking society, the Völva (literally "staff-carrier" or "wand-bearer") occupied a position of profound religious, legal, and spiritual reverence. Sitting atop the high platform (seiðhjallr), surrounded by women chanting sacred guardian songs (varðlokur), she altered her consciousness to travel between the Nine Worlds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <span className="text-zinc-200 font-bold block mb-1">The Distaff as Shamanic Axis</span>
                The spinning staff represents the spinning of fate’s thread. By weaving and untangling symbolic cords, the practitioner shifts subtle causal webs in the energetic body.
              </div>
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <span className="text-zinc-200 font-bold block mb-1">Galdr vs Seidr</span>
                Galdr is masculine, vocal, rhythmic, incantatory, and analytical (carving runes, vibrating syllables). Seidr is feminine, receptive, intuitive, and trance-based (astral journeying, feeling future tides).
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
