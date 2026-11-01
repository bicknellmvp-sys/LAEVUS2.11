export type RunicAett = "Freyr's Aett" | "Heimdall's Aett" | "Tyr's Aett";
export type RunicElement = "Fire" | "Water" | "Air" | "Earth" | "Ice" | "Ether" | string;

export interface RuneData {
  name: string;
  symbol: string;
  phonetic: string;
  aett: RunicAett;
  element: RunicElement;
  deity: string;
  astrology: string;
  meaning: string;
  description: string;
  uprightMeaning: string;
  merkstaveMeaning: string;
  runePoem: {
    stanza: string;
    source: string;
    translation: string;
  };
  magickalUse: string;
}

export const RUNE_DATABASE: RuneData[] = [
  // ==========================================
  // FREYR'S AETT (CREATION & FOUNDATIONAL FORCES)
  // ==========================================
  {
    name: "Fehu",
    symbol: "ᚠ",
    phonetic: "F",
    aett: "Freyr's Aett",
    element: "Fire",
    deity: "Freyr & Freyja",
    astrology: "Taurus / Moon",
    meaning: "Mobile Wealth, Vital Energy, Abundance, Circulation",
    description: "Fehu represents movable property, cattle, liquid gold, and the primeval fire that sparks creation. It is not static hoarding, but dynamic energetic circulation that must flow to nourish the community.",
    uprightMeaning: "Financial fruition, newfound resources, hard-earned bounty, creative fertility, and energy circulating freely.",
    merkstaveMeaning: "Loss of wealth, hoarding, stagnation, greed, deceptive investments, or feeling depleted and unrewarded.",
    runePoem: {
      source: "Old Norwegian Rune Poem",
      stanza: "Fé vældr frænda róge; føðesk ulfr í skóge.",
      translation: "Wealth is a source of discord among kinsmen; the wolf lives in the forest."
    },
    magickalUse: "Used in talismans to draw dynamic wealth, kickstart stalled entrepreneurial endeavors, and revitalize tired physical vitality."
  },
  {
    name: "Uruz",
    symbol: "ᚢ",
    phonetic: "U",
    aett: "Freyr's Aett",
    element: "Earth",
    deity: "Thor & Ullr",
    astrology: "Taurus / Mars",
    meaning: "Primal Strength, Wild Aurochs, Endurance, Vital Healing",
    description: "Uruz embodies the untamed, raw physical power of the extinct Aurochs. It is the indomitable life force, sudden healing surges, and the fortitude required to face adversity without flinching.",
    uprightMeaning: "Robust vitality, physical resilience, enduring stamina, overcoming severe physical or mental strain, taking charge.",
    merkstaveMeaning: "Brute force, misdirected rage, physical fatigue, missed opportunities due to cowardice or recklessness.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Ūr byþ ānmōd ond oferhyrned, felafrecne dēor, feohteþ mid hornum mǣre mōrstapa; þæt is mōdig deor.",
      translation: "The aurochs is proud and has great horns; it is a very savage beast and fights with its horns, a great ranger of the moors."
    },
    magickalUse: "Inscribed to accelerate bodily recuperation, foster unwavering courage before trials, and harness raw primal motivation."
  },
  {
    name: "Thurisaz",
    symbol: "ᚦ",
    phonetic: "Th",
    aett: "Freyr's Aett",
    element: "Fire",
    deity: "Thor & the Jötnar",
    astrology: "Mars / Aries",
    meaning: "The Thorn, The Giant, Defensive Catalyst, Breaking Barriers",
    description: "Thurisaz represents the thorn on the rose, the destructive and protective hammer Mjölnir, and the chaotic force of the Frost Giants. It tests resolve through sudden friction to awaken inner vigilance.",
    uprightMeaning: "Proactive boundary defense, shattering illusions, sudden breakthroughs through hardship, divine intervention.",
    merkstaveMeaning: "Vulnerability, spiteful confrontation, falling victim to malice, self-sabotaging anger, hasty defensiveness.",
    runePoem: {
      source: "Old Icelandic Rune Poem",
      stanza: "Þurs er kvenna kvöl ok kletta búi ok varðrúnar verr.",
      translation: "Thurs (Giant) is the torment of women and dweller in the rocks, and husband of a giantess."
    },
    magickalUse: "Carved for defensive barrier wards, repelling malevolent psychic attacks, and shattering entrenched psychological walls."
  },
  {
    name: "Ansuz",
    symbol: "ᚨ",
    phonetic: "A",
    aett: "Freyr's Aett",
    element: "Air",
    deity: "Odin the Allfather",
    astrology: "Mercury / Gemini",
    meaning: "Divine Breath, The Ancestral Voice, Wisdom, Poetic Ecstasy",
    description: "Ansuz is the breath of Odin gifted to Ask and Embla. It represents inspired speech, ancestral synchronicities, revelation through prophecy, and the sovereign power of the spoken word.",
    uprightMeaning: "Illuminating counsel, profound intellectual breakthroughs, poetic eloquence, guidance from mentors or ancestral spirits.",
    merkstaveMeaning: "Misleading advice, manipulative rhetoric, communication breakdown, arrogance, or deliberate propaganda.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Ōs byþ ordfruma ǣlcere sprǣce, wīsdōmes wrapu ond wītena frōfur.",
      translation: "The mouth is the source of all speech, the mainstay of wisdom and comfort to the wise."
    },
    magickalUse: "Employed to enhance persuasive speech, pass examinations, channel divine or poetic inspiration, and unlock clairaudient perception."
  },
  {
    name: "Raido",
    symbol: "ᚱ",
    phonetic: "R",
    aett: "Freyr's Aett",
    element: "Air",
    deity: "Forseti & Thor",
    astrology: "Sagittarius",
    meaning: "The Cosmic Wagon, Right Order, The Spiritual Journey, Rhythm",
    description: "Raido is the wheel, the riding horse, and the universal cosmic law. It governs both physical travels and the righteous ethical path, aligning individual action with the harmony of universal order.",
    uprightMeaning: "Safe journeys, disciplined decisions, moral alignment, rhythmic progress, taking the reins of your destiny.",
    merkstaveMeaning: "Delays, dislocation, ethical lapses, feeling out of control, derailed plans, or spiritual aimlessness.",
    runePoem: {
      source: "Old Norwegian Rune Poem",
      stanza: "Ræið kveða hrossom væsta; Reginn sló sværðet bæzta.",
      translation: "Riding is said to be the worst thing for horses; Regin forged the finest sword."
    },
    magickalUse: "Inscribed on talismans for physical travel safety, restoring cadence to chaotic workflows, and calibrating life balance."
  },
  {
    name: "Kenaz",
    symbol: "ᚲ",
    phonetic: "K / C",
    aett: "Freyr's Aett",
    element: "Fire",
    deity: "Hephaestus / Freyja / Heimdall",
    astrology: "Venus / Mars",
    meaning: "The Torch, Controlled Flame, Technical Mastery, Illumination",
    description: "Unlike the wild fire of Fehu, Kenaz is the torch of the craftsman, the warm hearth, and the spark of intellectual clarity. It represents the light that banishes ignorance through diligent craft.",
    uprightMeaning: "Creative revelation, technical ingenuity, clarity dispelling darkness, romantic passion tempered with wisdom.",
    merkstaveMeaning: "Burnout, creative darkness, smoldering resentment, fading enthusiasm, or stubborn blindness to truth.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Cēn byþ cwicera gehwām cūþ on fȳre, blāc ond beorhtlic, byrneþ oftust þǣr hīe æþelingas inne restaþ.",
      translation: "The torch is known to every living man by its flame, bright and clear; it burns most often where princes rest indoors."
    },
    magickalUse: "Carved to kindle artistic inspiration, solve perplexing academic or technical dilemmas, and ignite passionate affection."
  },
  {
    name: "Gebo",
    symbol: "ᚷ",
    phonetic: "G",
    aett: "Freyr's Aett",
    element: "Air",
    deity: "Odin & Gefjon",
    astrology: "Libra / Venus",
    meaning: "The Sacred Gift, Reciprocal Balance, Holy Alliance, Hospitality",
    description: "Gebo is the sacred X of reciprocal exchange. In Germanic tradition, 'A gift demands a gift'. It embodies mutual sovereignty in partnerships, unconditional generosity, and sacred contracts.",
    uprightMeaning: "Harmonious partnership, reciprocal generosity, equitable contracts, deep mutual respect, spiritual blessings.",
    merkstaveMeaning: "Note: Gebo cannot be inverted; its shadow lies in obligation, one-sided parasitism, bribery, or lost autonomy.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Gyfu gumena byþ gleng ond herenys, wraþu ond wyrþscype.",
      translation: "Generosity brings praise and honor to men, support and dignity to all."
    },
    magickalUse: "Essential in binding sacred alliances, forging equitable business contracts, and harmonizing romantic bonds without loss of individual identity."
  },
  {
    name: "Wunjo",
    symbol: "ᚹ",
    phonetic: "W / V",
    aett: "Freyr's Aett",
    element: "Earth",
    deity: "Freyr & Frigg",
    astrology: "Leo / Sun",
    meaning: "Joy, Communal Fellowship, Triumph, Harmony of Will",
    description: "Wunjo marks the culmination of the First Aett. It is the joyful wind blowing through the clan's banners, the celebration after the harvest, and the realization of harmonious shared purpose.",
    uprightMeaning: "Euphoric celebration, emotional contentment, harmonious camaraderie, successful conclusion of a struggle.",
    merkstaveMeaning: "Alienation, sorrow, false optimism, strife within the tribe, emotional hollow satisfaction, or lingering gloom.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Wenne brūceþ þe can wēana lyt, sāres ond sorge, ond him sylfa hæfþ blǣd ond blysse.",
      translation: "Joy is enjoyed by him who knows little of woes, pain and sorrow, and himself has prosperity and bliss."
    },
    magickalUse: "Charged to dispel depressive malaise, attract joyful companions, celebrate hard-won milestones, and unify team morale."
  },

  // ==========================================
  // HEIMDALL'S AETT (TRIALS, NATURE FORCES & INITIATION)
  // ==========================================
  {
    name: "Hagalaz",
    symbol: "ᚺ",
    phonetic: "H",
    aett: "Heimdall's Aett",
    element: "Ice / Water",
    deity: "Hel & the Norns",
    astrology: "Aquarius / Saturn",
    meaning: "The Hailstone, Cosmic Disruption, Radical Transformation, Awakening",
    description: "Hagalaz is the unyielding hail that destroys the fragile crops, only to melt and nourish the subterranean roots. It is the sudden wake-up call of the cosmos that shatters comfortable mediocrity.",
    uprightMeaning: "Necessary disruption, cathartic breakdown of unsustainable structures, rapid spiritual awakening, testing of resilience.",
    merkstaveMeaning: "Cannot be inverted; its shadow manifests as paralyzing shock, resisting inevitable transformation, or total catastrophe.",
    runePoem: {
      source: "Old Norwegian Rune Poem",
      stanza: "Hagall er kaldastr korna; Kristr skóp hæimenn forna.",
      translation: "Hail is the coldest of grains; Christ created the world of old."
    },
    magickalUse: "Invoked to break entrenched destructive habits, clear severe spiritual miasma, and accelerate karmic resolution."
  },
  {
    name: "Nauthiz",
    symbol: "ᚾ",
    phonetic: "N",
    aett: "Heimdall's Aett",
    element: "Fire / Earth",
    deity: "The Norns (Skuld)",
    astrology: "Capricorn / Saturn",
    meaning: "Necessity, The Need-Fire, Friction, Constraint, Enduring Drive",
    description: "Nauthiz is the two sticks rubbed together in freezing darkness to produce friction and spark life-saving fire. It governs necessity, constraints, and the immense inner discipline forged through poverty or pressure.",
    uprightMeaning: "Overcoming severe constraints through ingenuity, self-reliance, recognizing the difference between want and need, forging grit.",
    merkstaveMeaning: "Despair, feeling trapped by debt or circumstance, self-inflicted misery, impatience, or greed.",
    runePoem: {
      source: "Old Icelandic Rune Poem",
      stanza: "Nauð er þýjar þrá ok þungr kostr ok vássamligt verk.",
      translation: "Constraint is the servant's grief and a hard state of life and toilsome labor."
    },
    magickalUse: "Applied when survival hangs in the balance, to turn scarcity into relentless focus, and kindle the flame of will against impossibility."
  },
  {
    name: "Isa",
    symbol: "ᛁ",
    phonetic: "I",
    aett: "Heimdall's Aett",
    element: "Ice",
    deity: "Rán, Skadi & Ymir",
    astrology: "Saturn / Moon",
    meaning: "Ice, Stillness, Consolidation, The Sacred Pause, Crystalline Focus",
    description: "Isa is the glacial freeze that stops all movement. It is not death, but suspended animation where energy condenses inward. Like ice bridge over turbulent water, it creates stillness so the seeker can reflect.",
    uprightMeaning: "A mandatory pause, patience during delays, emotional stoicism, clarifying internal priorities, conserving resources.",
    merkstaveMeaning: "Cannot be inverted; its shadow is numbness, callous isolation, freezing out allies, or paralyzing stubbornness.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Īs byþ oferceald, ungemete slidor, glisnaþ glæshlūttor gimmum gelīcost.",
      translation: "Ice is very cold and immeasurably slippery; it glistens clear as glass, most like jewels."
    },
    magickalUse: "Employed to freeze aggressive opponents in their tracks, halt chaotic disputes, and maintain composure in volatile environments."
  },
  {
    name: "Jera",
    symbol: "ᛃ",
    phonetic: "J / Y",
    aett: "Heimdall's Aett",
    element: "Earth",
    deity: "Freyr & Sif",
    astrology: "Virgo / Sun",
    meaning: "The Harvest Year, Karmic Cycles, Natural Timing, Rightful Reward",
    description: "Jera represents the turning of the four seasons and the bountiful harvest that comes only after steady, diligent labor. You cannot harvest in spring; Jera teaches the sacred law of cause, effect, and patience.",
    uprightMeaning: "Reaping long-awaited rewards, fruition of disciplined plans, natural cycles resolving smoothly, legal vindication.",
    merkstaveMeaning: "Cannot be inverted; shadow aspect involves premature haste, lack of preparation, missed seasons, or reaping bitter consequences.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Gēr byþ gumena hyht, ðonne God lǣteþ, hālig heofones cyning, hrūsan sellan beorhte blēda.",
      translation: "Year is the joy of men, when God, the holy King of Heaven, causes the earth to yield bright fruit."
    },
    magickalUse: "Inscribed to ensure successful culmination of long-term investments, agriculture, research projects, and legal disputes."
  },
  {
    name: "Eihwaz",
    symbol: "ᛇ",
    phonetic: "Ei / Y",
    aett: "Heimdall's Aett",
    element: "All Elements / Ash & Yew",
    deity: "Odin & Ullr",
    astrology: "Scorpio / Pluto",
    meaning: "The Yew Tree, Yggdrasil's Axis, Immortality, Shamanic Passage",
    description: "Eihwaz is the ancient Yew—evergreen, resilient, highly toxic yet medicine, used for the sturdiest hunting bows. It is the central pillar connecting roots and branches, bridging life, death, and resurrection.",
    uprightMeaning: "Unshakable endurance, profound spiritual transformation, protection from deathly traps, wisdom forged in shadow.",
    merkstaveMeaning: "Cannot be inverted; shadow manifests as lingering bitterness, obsession with mortality, or fear of stepping through the portal.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Ēoh byþ ūtan unsmeþe trēow, heard hrūsan fæst, hyrde fȳres, wyrtrumum underwreþyd, wyn on ēþle.",
      translation: "The yew is an unsmooth tree on the outside, hard and fast in the earth, keeper of the fire, sustained by roots, a joy on the estate."
    },
    magickalUse: "The premier rune of shamanic trance, astral travel across the Nine Worlds, unwavering spine, and ancestral communion."
  },
  {
    name: "Perthro",
    symbol: "ᛈ",
    phonetic: "P",
    aett: "Heimdall's Aett",
    element: "Water",
    deity: "The Norns & Frigg",
    astrology: "Scorpio / Neptune",
    meaning: "The Dice Cup, Fate (Örlög), The Hidden Mystery, Occult Initiation",
    description: "Perthro is the vessel from which the lots are cast, the womb of potential, and the unknowable mysteries of destiny. It points to that which has not yet stepped from the void into the light.",
    uprightMeaning: "Intuitive synchronicity, hidden truths surfacing, sudden favorable twists of fortune, initiatory revelations.",
    merkstaveMeaning: "Compulsive gambling, dark secrets exposed destructively, isolation from intuition, or fatalistic resignation.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Peorþ byþ symble plega ond hlehter wlancum, ðǣr wīcan sittaþ on bēorsele blīþe ætsomne.",
      translation: "Peorth is always a source of amusement and laughter to the proud, where warriors sit happily together in the beer-hall."
    },
    magickalUse: "Drawn to divine hidden motives, enhance dream divination, decode esoteric cipher texts, and navigate moments of high uncertainty."
  },
  {
    name: "Algiz",
    symbol: "ᛉ",
    phonetic: "Z",
    aett: "Heimdall's Aett",
    element: "Air",
    deity: "Heimdall & the Valkyries",
    astrology: "Pisces / Jupiter",
    meaning: "The Elk Sedge, Divine Protection, The Shield, Upper Reach",
    description: "Algiz depicts the horns of the elk, the splay of a protective ward, and the seeker raising arms to the celestial light. It is an impenetrable energetic shield warning you long before danger strikes.",
    uprightMeaning: "Divine guardianship, high spiritual connection, instinctual awareness of traps, sanctuary, safe refuge.",
    merkstaveMeaning: "Lowered defenses, vulnerability, false sense of safety, being deceived by flattering enemies, spiritual arrogance.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Eolh-secg eard hæfþ oftust on fenne wēxeþ on wætere, wundaþ biteran.",
      translation: "The elk-sedge mostly abides in the fen, waxing in water; it wounds terribly, staining with blood any man who touches it."
    },
    magickalUse: "The master rune of protective wards, etched on thresholds, shields, and auric boundaries to repel psychic interference."
  },
  {
    name: "Sowilo",
    symbol: "ᛊ",
    phonetic: "S",
    aett: "Heimdall's Aett",
    element: "Fire / Light",
    deity: "Sunna / Sól & Baldr",
    astrology: "The Sun",
    meaning: "The Solar Wheel, Lightning Clarity, Absolute Victory, Wholeness",
    description: "Sowilo represents the warmth and dazzling radiance of the sun, chasing away the cold shadows of the Northern winter. It is triumphant wholeness, self-realization, and the light of truth.",
    uprightMeaning: "Total victory, radiant vitality, breakthrough success, supreme self-confidence, clarity replacing confusion.",
    merkstaveMeaning: "Cannot be inverted; its shadow manifests as burning arrogance, scorched-earth hubris, manic workaholism, or blinding pride.",
    runePoem: {
      source: "Old Norwegian Rune Poem",
      stanza: "Sól er landa ljóme; lúti ek helgum dóme.",
      translation: "Sun is the light of the lands; I bow to the holy decree."
    },
    magickalUse: "Inscribed to ensure decisive victory in contests, illuminate hidden fraud, supercharge health, and ignite radiant personal charisma."
  },

  // ==========================================
  // TYR'S AETT (SOVEREIGNTY, INTELLECT & TRANSCENDENCE)
  // ==========================================
  {
    name: "Tiwaz",
    symbol: "ᛏ",
    phonetic: "T",
    aett: "Tyr's Aett",
    element: "Air",
    deity: "Tyr the One-Handed",
    astrology: "Mars / Libra",
    meaning: "The Spear of Tyr, Absolute Justice, Sacred Sacrifice, Sovereign Honor",
    description: "Tiwaz depicts the upward arrow of the North Star and the spear of Tyr, who willingly placed his right hand in the wolf Fenrir's maw to preserve cosmic order. It signifies self-sacrifice for high principle.",
    uprightMeaning: "Victory through honor, righteous legal outcome, noble leadership, supreme moral courage, unwavering focus.",
    merkstaveMeaning: "Over-sacrifice for an unworthy cause, defeat through cowardice, unjust authority, broken oaths, loss of direction.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Tīr biþ tācna sum, healdeþ trēowa wel wiþ æþelingas; ā biþ on færylde ofer nihta genipu, nǣfre swīceþ.",
      translation: "Tir is a guiding star; it keeps faith well with noblemen, always on its course over the mists of night and never fails."
    },
    magickalUse: "Drawn for victory in fair disputes, unwavering commitment to vows, legal integrity, and keeping directional alignment in turmoil."
  },
  {
    name: "Berkana",
    symbol: "ᛒ",
    phonetic: "B",
    aett: "Tyr's Aett",
    element: "Earth",
    deity: "Frigg, Idunn & Nerthus",
    astrology: "Virgo / Moon",
    meaning: "The Birch Goddess, Rebirth, Maternal Nurture, Gentle Growth",
    description: "Berkana is the white birch tree—the first to regrow on burned soil. It represents fertile motherly nurture, safe gestation of ideas, healing of emotional wounds, and the gentle sprouting of life.",
    uprightMeaning: "Fertility, the birth of new projects or children, domestic peace, gradual organic flourishing, sanctuary.",
    merkstaveMeaning: "Domestic discord, stunted growth, smothered creativity, neglect of self-care, or anxiety over maternal duties.",
    runePoem: {
      source: "Old Icelandic Rune Poem",
      stanza: "Bjarkan er laufgrænn limr ok lítit tré ok ungsamligr viðr.",
      translation: "Birch is a leafy green bough and a little tree and youthful timber."
    },
    magickalUse: "Carved for fertility blessings, safe pregnancy, protecting gardens and homes, and nursing injured souls back to wholeness."
  },
  {
    name: "Ehwaz",
    symbol: "ᛖ",
    phonetic: "E",
    aett: "Tyr's Aett",
    element: "Earth",
    deity: "Freyr & the Twin Steeds",
    astrology: "Gemini / Mercury",
    meaning: "The Sacred Horse, Dynamic Partnership, Mutual Trust, Swift Transport",
    description: "Ehwaz represents the profound bond between horse and rider—a relationship based on mutual trust, nonverbal sync, and shared momentum. It governs loyal teams, marital harmony, and swift progress.",
    uprightMeaning: "Steadfast allies, fruitful collaboration, swift progress towards mutual goals, emotional loyalty, smooth transitions.",
    merkstaveMeaning: "Broken trust, suspicion, betrayal by a partner, miscommunication, abrupt halts in travel or deals.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Eh byþ for eorlum æþelinga wyn, hors hōfum wlanc, ðǣr ymbe wīflan hæleð.",
      translation: "The horse is a joy to princes in the presence of warriors, a steed proud of its hoofs."
    },
    magickalUse: "Employed to cement sacred partnerships, ensure seamless teamwork, harmonize co-founders, and quicken stagnant transitions."
  },
  {
    name: "Mannaz",
    symbol: "ᛗ",
    phonetic: "M",
    aett: "Tyr's Aett",
    element: "Air",
    deity: "Heimdall & Odin",
    astrology: "Aquarius / Jupiter",
    meaning: "The Divine Human, Collective Consciousness, Selfhood, Human Potential",
    description: "Mannaz represents the interconnected human collective and the realized self. It highlights humanity's unique capacity for reason, empathy, self-reflection, and communion with both gods and mortals.",
    uprightMeaning: "Self-realization, humanitarian cooperation, deep self-awareness, relying on wise allies, intellectual maturity.",
    merkstaveMeaning: "Isolation, misanthropy, alienation from society, self-delusion, manipulation by crowds or toxic peer pressure.",
    runePoem: {
      source: "Old Norwegian Rune Poem",
      stanza: "Maðr er moldar auki; mikil er greip á hauki.",
      translation: "Man is an increase of dust; great is the talon of the hawk."
    },
    magickalUse: "Inscribed to sharpen self-mastery, foster harmony within complex organizations, and cultivate deep social and emotional intelligence."
  },
  {
    name: "Laguz",
    symbol: "ᛚ",
    phonetic: "L",
    aett: "Tyr's Aett",
    element: "Water",
    deity: "Njord & Nerthus",
    astrology: "Moon / Pisces",
    meaning: "The Primal Ocean, Flow, Intuitive Tides, The Subconscious Deep",
    description: "Laguz is the boundless sea, the flowing river, and the intuitive current of the unconscious mind. It asks the seeker to stop resisting the flow, surrender to deep currents, and trust inner instinct.",
    uprightMeaning: "Heightened intuition, prophetic dreams, graceful emotional fluidity, navigating turbulent transitions with ease.",
    merkstaveMeaning: "Emotional drowning, irrational fears, being dragged by addictive currents, illusions, lack of boundaries.",
    runePoem: {
      source: "Old Icelandic Rune Poem",
      stanza: "Lögr er vellandi vatn ok víðr ketill ok glömmungr grund.",
      translation: "Water is a churning eddy and a wide cauldron and the land of fish."
    },
    magickalUse: "Applied to unlock latent psychic empathy, cleanse stagnant auric debris, deepen dreamwork, and achieve creative flow states."
  },
  {
    name: "Ingwaz",
    symbol: "ᛜ",
    phonetic: "Ng",
    aett: "Tyr's Aett",
    element: "Earth / Water",
    deity: "Ingvi-Freyr",
    astrology: "Cancer / Taurus",
    meaning: "The Seed, Sacred Incubation, Potential Realized, Peaceful Completion",
    description: "Ingwaz is the seed buried deep in the dark, warm earth, quietly concentrating its energy before bursting forth. It marks a period of peaceful gestation, inner integrity, and completion of a major chapter.",
    uprightMeaning: "Successful completion, stored potential about to emerge, relief from hardship, inner peace, quiet consolidation.",
    merkstaveMeaning: "Cannot be inverted; its shadow lies in premature emergence, restlessness during incubation, or refusing to finish a cycle.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Ing wæs ǣrest mid Dēnum gesewen secgum, oþ hē siððan ēast ofer wǣg gewāt.",
      translation: "Ing was first seen by men among the East-Danes, until he departed eastward over the wave."
    },
    magickalUse: "Charged to safely incubate major life plans, foster marital fertility, complete arduous milestones, and cultivate tranquility."
  },
  {
    name: "Dagaz",
    symbol: "ᛞ",
    phonetic: "D",
    aett: "Tyr's Aett",
    element: "Fire / Air",
    deity: "Heimdall & Baldr",
    astrology: "Sun / Aries",
    meaning: "The Dawn, Radiant Breakthrough, Non-Dual Awakening, Transformation",
    description: "Dagaz is the butterfly rune, the hourglass of time, and the glorious breakthrough of dawn after the longest polar night. It represents instantaneous enlightenment and the harmonious union of opposites.",
    uprightMeaning: "Total clarity, sudden major breakthrough, dark night of the soul turning to glorious dawn, positive radical turnaround.",
    merkstaveMeaning: "Cannot be inverted; shadow manifests as blindness to a fresh start, clinging to obsolete despair, or dawn-blindness.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Dæg byþ Drihtnes sond, dēore mannum, mǣre Metodes lēoht, myrgh ond tōhiht ēadgum ond earmum.",
      translation: "Day is the Lord's messenger, dear to men, glorious light of the Creator, joy and hope to rich and poor alike."
    },
    magickalUse: "Inscribed to shift catastrophic situations into sudden triumph, dissolve chronic depression, and achieve mystical non-dual consciousness."
  },
  {
    name: "Othala",
    symbol: "ᛟ",
    phonetic: "O",
    aett: "Tyr's Aett",
    element: "Earth",
    deity: "Odin & the Ancestors",
    astrology: "Saturn / Taurus",
    meaning: "Ancestral Heritage, Sacred Homeland, Spiritual Legacy, Estate",
    description: "Othala marks the culmination of the entire Elder Futhark. It is the ancestral land, the heritage passed down through blood and spirit, the sacred enclosure where traditions are honored and defended.",
    uprightMeaning: "Ancestral blessings, legacy inheritance, home ownership, belonging, honoring roots, solid foundational prosperity.",
    merkstaveMeaning: "Family disputes over inheritance, homelessness, cultural alienation, tyranny of tradition, bigotry, or squandered wealth.",
    runePoem: {
      source: "Anglo-Saxon Rune Poem",
      stanza: "Ēþel byþ oferleof ǣghwylcum men, gif hē mōt ðǣr rihtes ond gerīsena onbrūcan on reste.",
      translation: "Estate is very dear to every man, if he can enjoy what is right and proper in peace in his house."
    },
    magickalUse: "Employed to protect ancestral property, resolve familial estate matters, anchor spiritual lineage, and consecrate sacred spaces."
  }
];
