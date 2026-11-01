import React, { useState } from 'react';

export interface BookTreatise {
  id: string;
  name: string;
  author: string;
  year: string;
  category: 'Hermeticism' | 'Strategy' | 'Theosophy' | 'Norse & Eddas' | 'Sufi & Mysticism' | 'Folk Magic & Occult';
  associatedAdvisor: string;
  pages: number;
  description: string;
  coreTenets: string[];
  keyQuotes: string[];
  modernApplication: string;
  excerptText: string;
  url: string;
  isCustom?: boolean;
}

const CANONICAL_BOOKS: BookTreatise[] = [
  // 1. HERMETICISM
  {
    id: 'kybalion',
    name: 'The Kybalion',
    author: 'Three Initiates',
    year: '1908',
    category: 'Hermeticism',
    associatedAdvisor: 'Madame Blavatsky',
    pages: 223,
    description: 'The foundational modern Hermetic treatise outlining the Seven Universal Principles received from the lineage of Hermes Trismegistus. It teaches the transmutation of mental vibrations and the sovereign mastery of conscious reality.',
    coreTenets: [
      'The Principle of Mentalism: "The All is Mind; the Universe is Mental."',
      'The Principle of Correspondence: "As above, so below; as below, so above."',
      'The Principle of Polarity: "Everything is dual; opposites are identical in nature, but different in degree."'
    ],
    keyQuotes: [
      '"The lips of wisdom are closed, except to the ears of Understanding."',
      '"Mind (as well as metals and elements) may be transmuted, from state to state; degree to degree; condition to condition; pole to pole."',
      '"Rhythm compensates; the measure of the swing to the right is the measure of the swing to the left."'
    ],
    modernApplication: 'Use mental polarity to consciously neutralize negative thought spirals, recognize that external chaos mirrors internal discord, and ride emotional pendulum swings with detached stoicism.',
    excerptText: `Chapter II: The Seven Hermetic Principles\n\n"The principles of truth are seven; he who knows these, understandingly, possesses the magic key before whose touch all the doors of the temple fly open." — The Kybalion\n\n1. The Principle of Mentalism: The ALL is Mind; the Universe is Mental. This principle embodies the truth that 'All is Mind.' It explains that the All (which is the Substantial Reality underlying all the outward manifestations and appearances which we know under the terms of 'The Material Universe') is Spirit which in itself is unknowable and undefinable, but which may be considered and thought of as an Universal, Infinite, Living Mind.\n\n2. The Principle of Correspondence: As above, so below; as below, so above. This principle embodies the truth that there is always a Correspondence between the laws and phenomena of the various planes of Being and Life. The grasping of this Principle gives one the means of solving many a dark paradox and hidden secret of Nature.\n\n3. The Principle of Vibration: Nothing rests; everything moves; everything vibrates. From Pure Spirit down to the grossest form of matter, all is in vibration. By understanding this principle, students of Hermetics learn to control their own mental vibrations as well as those of others.\n\n4. The Principle of Polarity: Everything is Dual; everything has poles; everything has its pair of opposites; like and unlike are the same; opposites are identical in nature, but different in degree; extremes meet.\n\n5. The Principle of Rhythm: Everything flows, out and in; everything has its tides; all things rise and fall; the pendulum-swing manifests in everything.\n\n6. The Principle of Cause and Effect: Every Cause has its Effect; every Effect has its Cause; everything happens according to Law; Chance is but a name for Law not recognized.\n\n7. The Principle of Gender: Gender is in everything; everything has its Masculine and Feminine Principles; Gender manifests on all planes.`,
    url: 'https://www.gutenberg.org/files/1420/1420-pdf.pdf'
  },
  {
    id: 'emerald-tablet',
    name: 'The Emerald Tablet & Corpus Hermeticum',
    author: 'Hermes Trismegistus',
    year: 'c. 2nd Cent. AD',
    category: 'Hermeticism',
    associatedAdvisor: 'Madame Blavatsky',
    pages: 180,
    description: 'The primordial alchemical blueprint carved upon synthetic green stone. It reveals the unity of the macrocosm and microcosm, and the alchemical process by which the soul extracts the Sun and Moon to produce the Philosopher’s Stone.',
    coreTenets: [
      'That which is Below corresponds to that which is Above, to accomplish the miracles of the One Thing.',
      'Its father is the Sun, its mother is the Moon, the wind carried it in its belly, its nurse is the Earth.',
      'Separate the earth from the fire, the subtle from the gross, gently and with great ingenuity.'
    ],
    keyQuotes: [
      '"True, without falsehood, certain and most true: that which is below is like that which is above."',
      '"It ascends from the earth to heaven and descends again to earth, and receives the power of the higher and lower things."',
      '"Thus you will have the glory of the whole world, and all obscurity will fly away from you."'
    ],
    modernApplication: 'Teaches creative alchemy: transforming raw emotional pain (the gross) into refined spiritual purpose (the subtle) through deliberate inner discipline.',
    excerptText: `Tabula Smaragdina (The Emerald Tablet of Hermes Trismegistus):\n\n1. It is true without lying, certain, and most true.\n2. That which is below is like that which is above, and that which is above is like that which is below, to accomplish the miracles of the one thing.\n3. And as all things were created by the contemplation of one, so all things arose from this one thing by a single act of adaptation.\n4. The father thereof is the Sun, the mother the Moon.\n5. The wind carried it in its womb; the earth is the nurse thereof.\n6. It is the father of all perfection throughout the whole world.\n7. The power thereof is integral if it be turned into earth.\n8. Separate thou the earth from the fire, the subtle from the gross, deftly and with great ingenuity.\n9. It ascendeth from earth to heaven and again it descendeth to earth and receiveth the force of things superior and things inferior.\n10. By this means you shall have the glory of the whole world, and thereby all obscurity shall fly from you.`,
    url: 'https://www.sacred-texts.com/alc/emerald.htm'
  },

  // 2. STRATEGY & REALPOLITIK
  {
    id: 'the-prince',
    name: 'The Prince',
    author: 'Niccolò Machiavelli',
    year: '1532',
    category: 'Strategy',
    associatedAdvisor: 'Machiavelli',
    pages: 140,
    description: 'The master manual of political realism, command psychology, and sovereign statecraft. Machiavelli strips away idealistic platitudes to examine human ambition, virtue (virtù), and fortune (fortuna) as they actually operate.',
    coreTenets: [
      'Realism over Utopia: Judge men by what they do, not by what they profess to do.',
      'Virtù vs Fortuna: Fortune is a wild river; virtù builds the dams and dikes before the flood arrives.',
      'The Lion and the Fox: The sovereign must be a fox to recognize traps, and a lion to frighten the wolves.'
    ],
    keyQuotes: [
      '"It is much safer to be feared than loved, when of the two, either must be dispensed with."',
      '"Everyone sees what you appear to be, few experience what you really are."',
      '"Never attempt to win by force what can be won by deception."'
    ],
    modernApplication: 'Essential for organizational dynamics, negotiating high-stakes contracts, protecting oneself from bad-faith competitors, and maintaining decisive focus.',
    excerptText: `Chapter XVIII: In What Way Princes Must Keep Faith\n\nEvery one admits how praiseworthy it is in a prince, to keep faith, and to live with integrity and not with craft. Nevertheless our experience has been, that those princes who have done great things have held good faith of little account, and have known how to circumvent the intellect of men by craft, and in the end have overcome those who have relied on their word.\n\nYou must know there are two ways of contesting: the one by the law, the other by force; the first method is proper to men, the second to beasts; but because the first is frequently not sufficient, it is necessary to have recourse to the second. Therefore it is necessary for a prince to understand how to use the beast and the man.\n\nA prince being compelled of necessity to know how to use the beast, should choose the fox and the lion; because the lion cannot defend himself against traps and the fox cannot defend himself against wolves. Therefore, it is necessary to be a fox to discover the traps and a lion to terrify the wolves. Those who rely simply on the lion do not understand what they are about.`,
    url: 'https://www.gutenberg.org/files/1232/1232-pdf.pdf'
  },
  {
    id: 'art-of-war',
    name: 'The Art of War',
    author: 'Sun Tzu',
    year: '5th Cent. BC',
    category: 'Strategy',
    associatedAdvisor: 'Sun Tzu',
    pages: 110,
    description: 'The supreme ancient military classic on asymmetric maneuvering, timing, psychological deterrence, and bloodless victory. Sun Tzu posits that supreme excellence consists in breaking the enemy’s resistance without fighting.',
    coreTenets: [
      'Supreme Excellence: Subduing the enemy without fighting is the acme of skill.',
      'All warfare is based on deception: Appear weak when strong, and strong when weak.',
      'Self and Opponent: If you know the enemy and know yourself, you need not fear the result of a hundred battles.'
    ],
    keyQuotes: [
      '"In the midst of chaos, there is also opportunity."',
      '"Let your rapidity be that of the wind, your compactness that of the forest, in moved and raiding like fire, and immovable like a mountain."',
      '"He will win who knows when to fight and when not to fight."'
    ],
    modernApplication: 'Guiding corporate strategy, dispute resolution, conserving emotional energy, and orchestrating tactical positioning long before direct conflict occurs.',
    excerptText: `Chapter III: Attack by Stratagem\n\nSun Tzu said: In the practical art of war, the best thing of all is to take the enemy's country whole and intact; to shatter and destroy it is not so good. So, too, it is better to recapture an army entire than to destroy it, to capture a regiment, a detachment or a company entire than to destroy them.\n\nHence to fight and conquer in all your battles is not supreme excellence; supreme excellence consists in breaking the enemy's resistance without fighting.\n\nThus the highest form of generalship is to balk the enemy's plans; the next best is to prevent the junction of the enemy's forces; the next in order is to attack the enemy's army in the field; and the worst policy of all is to besiege walled cities.\n\nTherefore the skillful leader subdues the enemy's troops without any fighting; he captures their cities without laying siege to them; he overthrows their kingdom without lengthy operations in the field.`,
    url: 'https://www.gutenberg.org/files/132/132-pdf.pdf'
  },
  {
    id: 'discourses-on-livy',
    name: 'Discourses on Livy',
    author: 'Niccolò Machiavelli',
    year: '1531',
    category: 'Strategy',
    associatedAdvisor: 'Machiavelli',
    pages: 380,
    description: 'Machiavelli’s deeper republican magnum opus examining how free republics are born, preserved, and defended against corrupt oligarchies and internal decay, drawing lessons from ancient Rome.',
    coreTenets: [
      'Checks and Balances: Liberty survives only when class factions check each other’s overreach.',
      'Civic Virtue: A citizenry that has grown lazy and corrupt cannot sustain freedom.',
      'Renewing Foundations: Every institution must regularly be brought back to its founding principles.'
    ],
    keyQuotes: [
      '"A people that is corrupt, having come to freedom, can maintain itself free only with the greatest difficulty."',
      '"It is a sound maxim that when an action is to be condemned, the result may excuse it, and when the result is good, it will always excuse it."'
    ],
    modernApplication: 'Designing resilient teams, maintaining transparency in partnerships, and preventing institutional complacency.',
    excerptText: `Book I, Chapter VI: Whether It Was Possible to Organize in Rome a Government Capable of Removing Enmities Between the Senate and the People.\n\nIf anyone wishes to establish a state anew, he must consider whether he wants it to expand like Rome in dominion and power, or whether it should be confined within narrow boundaries like Sparta or Venice. For in the first case, he must do everything as Rome did, allowing the masses arms and public agitation; in the second, he must arrange everything so that peace is maintained, but without ambition for conquest.`,
    url: 'https://www.gutenberg.org/files/10827/10827-pdf.pdf'
  },

  // 3. THEOSOPHY & ANCIENT MYSTERIES
  {
    id: 'isis-unveiled',
    name: 'Isis Unveiled (Vol. I & II)',
    author: 'Helena P. Blavatsky',
    year: '1877',
    category: 'Theosophy',
    associatedAdvisor: 'Madame Blavatsky',
    pages: 680,
    description: 'Madame Blavatsky’s explosive debut, confronting the dogmatic materialism of 19th-century science and ecclesiastical orthodoxy. She demonstrates the universality of ancient occult sciences, psychic phenomena, and secret brotherhoods.',
    coreTenets: [
      'The Primordial Secret Doctrine: All world religions spring from a single prehistoric esoteric wisdom stream.',
      'Matter is Crystallized Spirit: Physical phenomena are the lowest octave of multidimensional conscious currents.',
      'Psychic Adeptship: The human will, properly trained, can master subtle forces known to ancient magicians.'
    ],
    keyQuotes: [
      '"There is no religion higher than Truth."',
      '"Modern science believes in no soul; the ancient world recognized in every atom a spark of the divine anima mundi."',
      '"Magic is the spiritual wisdom; nature is the material ally, pupil and servant of the magician."'
    ],
    modernApplication: 'Breaking free from rigid scientific materialism and dogma; developing synthetic thinking that bridges quantum physics and spiritual intuition.',
    excerptText: `Preface: The work now submitted to public judgment is the fruit of somewhat intimate acquaintance with Eastern adepts and study of their science. It is an attempt to aid the student to detect the vital principles which underlie the philosophical systems of old.\n\nThe book is written in all sincerity. It is meant to do even and impartial justice, and to speak the truth, but without malice or prejudice. It shows neither mercy to falsehood, nor reverence for usurped authority. It demands for a spoliated past that credit for its intellectual achievements which has been too long withheld. It would accept no statement as fact, unless supported by evidence that is beyond question.\n\nWe believe in no miracles, for there are none in nature; everything takes place according to immutable laws. The occult powers of the soul are dormant within every mortal, awaiting only the fire of true initiation to awaken into luminous life.`,
    url: 'https://www.gutenberg.org/files/48043/48043-pdf.pdf'
  },
  {
    id: 'secret-doctrine',
    name: 'The Secret Doctrine',
    author: 'Helena P. Blavatsky',
    year: '1888',
    category: 'Theosophy',
    associatedAdvisor: 'Madame Blavatsky',
    pages: 820,
    description: 'The monumental synthesis of Science, Religion, and Philosophy based on the archaic Stanzas of Dzyan. It details Cosmogenesis (the birth of the universe) and Anthropogenesis (the evolution of human consciousness across cosmic rounds).',
    coreTenets: [
      'An Omnipresent, Eternal, Boundless, and Immutable Principle beyond human comprehension.',
      'The Periodicity of the Universe: The absolute law of cycles, tides, manvantaras (manifestation) and pralayas (rest).',
      'The Fundamental Identity of all Souls with the Universal Over-Soul.'
    ],
    keyQuotes: [
      '"Space is the real world, while our world is an artificial one. It is the One Reality and its content is the divine plenum."',
      '"Karma is the unerring law which adjusts effect to cause, on the physical, mental and spiritual planes of being."'
    ],
    modernApplication: 'Expanding cosmic perspective; understanding that human life is an integral link in a billion-year evolutionary chain of expanding awareness.',
    excerptText: `Proem: The Secret Doctrine establishes three fundamental propositions:\n\n1. An Omnipresent, Eternal, Boundless, and Immutable PRINCIPLE on which all speculation is impossible, since it transcends the power of human conception and could only be dwarfed by any human expression or similitude.\n\n2. The Eternity of the Universe in toto as a boundless plane; periodically 'the playground of numberless Universes incessantly manifesting and disappearing,' called 'the manifesting stars,' and the 'sparks of Eternity.'\n\n3. The fundamental identity of all Souls with the Universal Over-Soul, the latter being itself an aspect of the Unknown Root; and the obligatory pilgrimage for every Soul through the Cycle of Incarnation in accordance with Cyclic and Karmic Law.`,
    url: 'https://www.theosociety.org/pasadena/sd/sd-hp.htm'
  },
  {
    id: 'secret-teachings',
    name: 'The Secret Teachings of All Ages',
    author: 'Manly P. Hall',
    year: '1928',
    category: 'Theosophy',
    associatedAdvisor: 'Madame Blavatsky',
    pages: 740,
    description: 'An encyclopedic masterwork illustrating the esoteric doctrines of Masonry, Rosicrucianism, Kabbalah, Hermetic Philosophy, Tarot, Alchemy, and the ancient Mystery schools of Eleusis and Egypt.',
    coreTenets: [
      'Symbolism is the universal language of the initiates.',
      'The human body is a living temple harboring latent divine faculties (chakras, endocrine glands, spinal serpent).',
      'Civilization is periodically preserved through dark ages by invisible esoteric sodalities.'
    ],
    keyQuotes: [
      '"When the human race learns to read the language of symbolism, a great veil will fall from the eyes of men."',
      '"The initiated philosopher is the priest of nature, interpreting her laws and ministering to her sacred mysteries."'
    ],
    modernApplication: 'Decoding allegories in modern media, corporate logos, architecture, and sacred art to understand hidden sociological currents.',
    excerptText: `Introduction: Philosophy is the science of estimating values. The superiority of any state or substance over another is determined by the philosophy which we hold regarding it. By philosophy, therefore, results are obtained and conditions created which are of inestimable importance to the well-being of the human race.\n\nFrom the mysteries of ancient Egypt to the secret colleges of the Rosicrucians, the masters of the Ageless Wisdom have preserved the sacred knowledge through allegorical fables, astronomical glyphs, and numerical ciphers.`,
    url: 'https://www.sacred-texts.com/eso/sta/'
  },

  // 4. NORSE LORE & EDDAS
  {
    id: 'havamal',
    name: 'The Poetic Edda: Hávamál (Sayings of the High One)',
    author: 'Anonymous Skaldic Tradition',
    year: 'c. 9th–12th Cent.',
    category: 'Norse & Eddas',
    associatedAdvisor: 'Odin',
    pages: 95,
    description: 'The direct gnosis and pragmatic counsel of Odin the Allfather. Contains tactical social wisdom, hospitality laws, warnings against drunkenness, and the legendary Rúnatal describing Odin’s nine-night ordeal on Yggdrasil to win the Runes.',
    coreTenets: [
      'Unflinching Vigilance: Check every entrance before stepping inside, for you never know where enemies sit.',
      'Reputation Outlives Death: Cattle die, kinsmen die, you yourself will die; one thing never dies: the fair fame of each one dead.',
      'The Price of Wisdom: True esoteric power requires painful sacrifice (an eye given at Mimir’s Well; nine nights on the windy tree).'
    ],
    keyQuotes: [
      '"Cattle die, kinsmen die, I myself must die; but the word of fame never dies for him who achieves it well."',
      '"A foolish man thinks he will live forever if he avoids fighting; but old age will give him no peace, though spears spare him."',
      '"Wounded I hung on a wind-swept gallows nine long nights, with a spear wounded, given up to Odin, myself to myself."'
    ],
    modernApplication: 'Cultivating authentic inner sovereignty, keeping one’s mouth shut in front of untrustworthy crowds, and paying the honest price of real competence.',
    excerptText: `Hávamál — Rúnatal (The Song of the Runes, Stanzas 138-141):\n\nI know that I hung on a windy tree\nall of nine nights,\nwounded with a spear, dedicated to Odin,\nmyself to myself,\non that tree of which no man knows\nfrom where its roots run.\n\nNo bread did they give me nor a drink from a horn,\ndownward I peered;\nI took up the runes, screaming their names I took them,\nand back from there I fell.\n\nNine mighty songs I learned from the famous son\nof Bolthor, Bestla's father,\nand a drink I got of the precious mead,\npoured from Odrerir.\n\nThen I began to wax and to be wise,\nto grow and to thrive well;\nword yielded word to me,\ndeed yielded deed to me.`,
    url: 'https://www.gutenberg.org/files/14726/14726-pdf.pdf'
  },
  {
    id: 'prose-edda',
    name: 'The Prose Edda',
    author: 'Snorri Sturluson',
    year: 'c. 1220',
    category: 'Norse & Eddas',
    associatedAdvisor: 'Odin',
    pages: 290,
    description: 'The supreme narrative handbook of Norse mythology compiled by Icelandic chieftain Snorri Sturluson. Spans the Gylfaginning (the deluding of King Gylfi), the creation from Ymir’s corpse, and the apocalyptic tragedy of Ragnarök.',
    coreTenets: [
      'The Cosmological Balance of Fire (Muspelheim) and Ice (Niflheim).',
      'The Inevitability of Fate: Even the gods cannot escape the web of the Norns.',
      'The Golden Rebirth: The cosmos is not annihilated forever; it cycles and resurrects green and radiant.'
    ],
    keyQuotes: [
      '"In the beginning was Ginnungagap, the yawning void, and neither sand nor sea nor cool waves were there."',
      '"The ash tree Yggdrasil suffers more than men know; the stag bites above, its side rots, and Nidhogg gnaws below."'
    ],
    modernApplication: 'Viewing historical and personal setbacks through a cyclical lens, recognizing that breakdown is the fertile compost for rebirth.',
    excerptText: `Gylfaginning: King Gylfi was a wise man and skilled in magic. He journeyed to Asgard in the guise of an old traveler named Gangleri. There he met three high kings seated on three thrones: High, Just-as-High, and Third.\n\nGangleri asked: 'Who is the highest and oldest of all gods?'\nHigh answered: 'He is called Allfather in our tongue. He lives through all ages and rules his whole realm, directing all things great and small. He made heaven and earth and the skies and all that is in them. But his greatest work is that he made man and gave him a spirit that shall live and never perish, even though the body rot to earth.'`,
    url: 'https://www.gutenberg.org/files/18947/18947-pdf.pdf'
  },

  // 5. SUFI & MYSTICISM
  {
    id: 'sufi-spiritual-liberty',
    name: 'Sufi Spiritual Liberty',
    author: 'Hazrat Inayat Khan',
    year: '1914',
    category: 'Sufi & Mysticism',
    associatedAdvisor: 'Khan',
    pages: 130,
    description: 'An elegant presentation of universal Sufism, harmonizing the path of love, musical vibration, and spiritual freedom. Khan demonstrates that the divine is found in the purified heart beyond sectarian walls.',
    coreTenets: [
      'The Unity of Religious Ideals: One God, One Master, One Holy Book (the sacred manuscript of Nature).',
      'The Mysticism of Sound: Creation is divine vibration; music is the direct language of the soul.',
      'Spiritual Liberty: Liberation from the rigid prison of the petty ego (Nafs).'
    ],
    keyQuotes: [
      '"The heart is the sacred shrine of God; break not the heart of any living creature."',
      '"The one who seeks God in temples and mosques has not found Him; the one who finds Him in the heart finds Him everywhere."',
      '"Life is a symphony; he who tunes his instrument to the divine pitch hears music in all circumstances."'
    ],
    modernApplication: 'Cultivating profound emotional poise, dissolving defensive egotism in relationships, and listening deeply beneath words to the energetic tone of conversations.',
    excerptText: `Chapter I: The Soul\n\nThe soul is that which is immortal in man; it is the spark of the Divine Sun. The mind is its vehicle, the body its garment. When the soul forgets its divine origin, it identifies with its garment and weeps when the garment is frayed or torn.\n\nSufism is the message of spiritual liberty. It does not invite man to follow a dogma, but invites him to examine his own heart, to tune his being to the harmony of the universe, and to recognize the sacred unity that pulses through every atom of existence. When love is purified of self-interest, it becomes the divine light that illuminates the path of liberation.`,
    url: 'https://www.gutenberg.org/files/62266/62266-pdf.pdf'
  },
  {
    id: 'conference-of-birds',
    name: 'The Conference of the Birds',
    author: 'Farid ud-Din Attar',
    year: '1177',
    category: 'Sufi & Mysticism',
    associatedAdvisor: 'Khan',
    pages: 210,
    description: 'A poetic masterpiece of Persian Sufism. The birds of the world gather under the leadership of the hoopoe to search for their mysterious sovereign king, the Simorgh, crossing seven perilous spiritual valleys.',
    coreTenets: [
      'The Seven Valleys: Quest, Love, Gnosis, Detachment, Unity, Bewilderment, and Poverty/Annihilation (Fana).',
      'The Mirror of Truth: When the surviving thirty birds reach the summit, they realize "Simorgh" means "thirty birds"—the king was their own purified collective essence.'
    ],
    keyQuotes: [
      '"Come, lost birds! Search no more in distant skies; look within, for the king you seek is the very eye with which you look."',
      '"Dismantle the fortress of your pride, for love burns only in the hearth of the humble."'
    ],
    modernApplication: 'Overcoming the illusion that external gurus or mentors possess what can only be uncovered within one’s own awakeness.',
    excerptText: `The Valley of Unity: In this valley, everything is swallowed in the One. You see neither many nor few; you see only the radiance of Being. If you count two, you have fallen into delusion. The drop that falls into the ocean is no longer a drop; yet it has not perished, for it has become the ocean itself.`,
    url: 'https://www.sacred-texts.com/isl/cb/index.htm'
  },

  // 6. FOLK MAGIC, HOODOO & CLASSICAL EROS
  {
    id: 'laveau-folk-arcana',
    name: 'New Orleans Folk Arcana & Rootwork Lore',
    author: 'Marie Laveau Traditions & New Orleans Oral Grimoires',
    year: '19th Cent. Oral Tradition',
    category: 'Folk Magic & Occult',
    associatedAdvisor: 'Marie',
    pages: 175,
    description: 'The syncretic practical folk magic of 19th-century New Orleans, blending West African Vodun, Catholic hagiography, French spiritualism, and indigenous root medicine into potent real-world workings.',
    coreTenets: [
      'Crossroads Sovereignty: The crossroads is the nexus where spiritual directives enter the physical realm.',
      'Gris-Gris & Sympathetic Resonance: Tangible objects (roots, bricks, coins, feathers) channel intense intention.',
      'Spiritual Cleansing: Stagnant conditions must be physically and energetically washed before prosperity can root.'
    ],
    keyQuotes: [
      '"Cleanse your doorstep with red brick dust and vinegar; don’t invite into your home what you wouldn’t feed at your table."',
      '"Pray with your hands open, but work with your boots on; the spirits bless feet that take strides."'
    ],
    modernApplication: 'Consecrating one’s physical home or studio workspace, clearing toxic energetic lingering after disputes, and anchoring abstract intentions into physical anchors.',
    excerptText: `The Rite of the Red Brick Dust & Threshold Protection:\n\nTake brick from an old kiln or chimney, ground fine in a heavy mortar until the powder is as vermilion as sunrise. At the first light of Tuesday or Friday morning, mix with sea salt and cayenne pepper.\n\nWash your entryway from the inside outward into the street with water steeped in rosemary and Florida water. When the stones are dry, lay a neat, unbroken line of red brick dust across the threshold from left to right. Say your firm petition: 'Let only peace, prosperity, and honorable allies cross this line. May deceit, malice, and envious eyes turn back into the dust.'`,
    url: 'https://theleft.one/pages/archives'
  },
  {
    id: 'diotima-symposium',
    name: 'Diotima’s Ladder of Eros (Plato’s Symposium)',
    author: 'Diotima of Mantinea & Plato',
    year: 'c. 385 BC',
    category: 'Folk Magic & Occult',
    associatedAdvisor: 'Diotima',
    pages: 88,
    description: 'The ancient priestess Diotima teaches Socrates the true nature of Eros: not as a frivolous god of physical lust, but as a mighty spiritual Daemon (intermediary) bridging mortality and the eternal Forms through beauty.',
    coreTenets: [
      'The Nature of Eros: Born of Poros (Resourcefulness) and Penia (Poverty), Eros is always needy yet relentlessly inventive.',
      'The Ascent of Love: Progressing from physical beauty, to beautiful minds, to noble institutions, to the ocean of Universal Beauty itself.'
    ],
    keyQuotes: [
      '"Eros is a great spirit (daemon), Socrates; everything spiritual is between that which is mortal and that which is immortal."',
      '"He who has been instructed thus far in the things of love will suddenly perceive a nature of wondrous beauty—eternal, unbegotten, unfading."'
    ],
    modernApplication: 'Elevating raw emotional attraction into creative intellectual collaboration and deep enduring loyalty.',
    excerptText: `Diotima speaks: 'Love is not fair and gentle, Socrates, as you imagine, but tough and shaggy and homeless, sleeping on thresholds and in the streets. Yet he is bold, enterprising and strong, a mighty hunter, always weaving some intrigue, keenly desirous of wisdom and full of resource.\n\nHe who would proceed aright must begin in youth by visiting beautiful bodies; and first, if his guide directs him aright, to love one body only and engender fair thoughts there. But soon he will see that the beauty of one body is sibling to the beauty of another, and he will set himself to be a lover of all physical beauty.\n\nNext he must consider that the beauty of souls is more precious than that of bodies; and so ascend step by step until he beholds the single science of Universal Beauty.'`,
    url: 'https://www.gutenberg.org/files/1600/1600-pdf.pdf'
  },
  {
    id: 'casanova-memoirs',
    name: 'The Art of Seductive Sway & Social Magnetism',
    author: 'Giacomo Casanova',
    year: '1798',
    category: 'Strategy',
    associatedAdvisor: 'Casanova',
    pages: 310,
    description: 'The razor-sharp memoirs and psychological insights of Venice’s most infamous adventurer, occultist, and master of social seduction. Casanova reveals how charm, attentiveness, and theatrical poise captivate any gathering.',
    coreTenets: [
      'Deep Attentiveness: The greatest charm is making the other person feel fascinating and understood.',
      'Theatrical Poise: Dress, cadence, and timing dictate how authority and desire are perceived.',
      'Audacity & Improvisation: When trapped, audacious confidence disarms suspicious opponents.'
    ],
    keyQuotes: [
      '"I have always loved truth passionately; but when circumstance compelled me to disguise it, I did so with the conviction of an artist."',
      '"He who desires to please must study the desires of others before he displays his own."'
    ],
    modernApplication: 'Mastering social presence, public speaking charisma, personal branding, and the psychological architecture of persuasion.',
    excerptText: `From the Venetian Memoirs: Men who believe that seduction is mere physical conquest understand nothing of the human heart. Seduction is the fine art of awakening in another person the longing to become their most exalted, enchanting self in your presence. When you reflect their unfulfilled dreams back to them with genuine admiration, you become indispensable to their world.`,
    url: 'https://www.gutenberg.org/files/2981/2981-pdf.pdf'
  },
  {
    id: 'agrippa-natural-magic',
    name: 'Three Books of Occult Philosophy: Natural Magic',
    author: 'Heinrich Cornelius Agrippa',
    year: '1533',
    category: 'Folk Magic & Occult',
    associatedAdvisor: 'Madame Blavatsky',
    pages: 420,
    description: 'The cornerstone Renaissance encyclopedia of occult correspondences, celestial sympathies, plant and gem virtues, and the mathematical harmony of the elemental world.',
    coreTenets: [
      'The Threefold World: Elemental (physical), Celestial (astrological), and Intellectual (spiritual).',
      'Sympathy and Antipathy: Like attracts like through subtle invisible rays connecting physical herbs and distant stars.'
    ],
    keyQuotes: [
      '"Magic is a faculty of wonderful virtue, full of the most high mysteries, containing the most profound contemplation of secret things."',
      '"There is a spirit in all herbs, minerals, and metals that answers to the celestial harmonies."'
    ],
    modernApplication: 'Understanding how physical environment, colors, scents, and symbols directly influence mental acuity and mood.',
    excerptText: `Book I: Natural Magic, Chapter I: How magicians collect virtues from the three-fold world. Seeing there is a three-fold world—elemental, celestial, and intellectual—every inferior is governed by its superior and receiveth the influence of the virtues thereof. So the craftsman may draw down virtues from the heavens into terrestrial stones, herbs, and tokens to accomplish marvelous effects.`,
    url: 'https://www.sacred-texts.com/eso/op1/index.htm'
  }
];

interface BookshelfProps {
  onConsultAdvisor?: (advisorName: string, prompt: string) => void;
}

export const Bookshelf: React.FC<BookshelfProps> = ({ onConsultAdvisor }) => {
  const [books, setBooks] = useState<BookTreatise[]>(CANONICAL_BOOKS);
  const [selectedBook, setSelectedBook] = useState<BookTreatise>(CANONICAL_BOOKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readerOpen, setReaderOpen] = useState(false);

  const categories = [
    'all',
    'Hermeticism',
    'Strategy',
    'Theosophy',
    'Norse & Eddas',
    'Sufi & Mysticism',
    'Folk Magic & Occult'
  ];

  const filteredBooks = books.filter((book) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      book.name.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.description.toLowerCase().includes(q) ||
      book.associatedAdvisor.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const newBook: BookTreatise = {
        id: `custom-${Date.now()}`,
        name: cleanName,
        author: 'Uploaded Seeker',
        year: new Date().getFullYear().toString(),
        category: 'Folk Magic & Occult',
        associatedAdvisor: 'Laevus',
        pages: 120,
        description: 'A customized esoteric or philosophical document added to your local grimoire bookshelf.',
        coreTenets: [
          'Seeker Document: Custom text introduced into the local archive.',
          'Active study and reflection recommended.'
        ],
        keyQuotes: ['"To know, to dare, to will, to keep silence."'],
        modernApplication: 'Custom reflection and integration with sanctuary archetypes.',
        excerptText: `Uploaded archive: ${file.name}\n\nSize: ${(file.size / 1024).toFixed(1)} KB\nType: ${file.type || 'Document'}\n\nThis manuscript has been successfully ingested into your local session shelf. Consult with any of the Sovereign Advisors to dissect its principles.`,
        url: URL.createObjectURL(file),
        isCustom: true
      };
      setBooks([newBook, ...books]);
      setSelectedBook(newBook);
    }
  };

  const handleConsult = () => {
    if (onConsultAdvisor && selectedBook) {
      onConsultAdvisor(
        selectedBook.associatedAdvisor,
        `I am studying "${selectedBook.name}" by ${selectedBook.author}. Provide your deepest esoteric analysis of its core doctrines and how I can apply them today.`
      );
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 sm:p-6 shadow-xl animate-fadeIn space-y-6 select-text">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DC143C]" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#DC143C] font-bold">
              16-Volume Canonical Grimoire
            </span>
          </div>
          <h3 className="font-syne font-extrabold text-lg sm:text-xl uppercase text-[#F8F7F4] tracking-tight mt-0.5">
            Esoteric Master Library & Bookshelf
          </h3>
          <p className="text-xs text-zinc-400 font-google-sans mt-0.5">
            Curated foundation treatises spanning Hermetic law, realpolitik strategy, Theosophy, Norse eddas, Sufi mysticism, and folk arcana.
          </p>
        </div>

        {/* Upload Custom Grimoire */}
        <label className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] border border-zinc-800 text-xs font-mono uppercase text-zinc-300 hover:text-white transition-all cursor-pointer font-bold flex items-center gap-1.5 shadow-md shrink-0">
          <span>+ Ingest Custom Text</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.epub,.txt"
          />
        </label>
      </div>

      {/* Search and Category Filter Tabs */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatises by title, author, keyword, or advisor..."
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
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#DC143C] text-white border-[#DC143C] font-bold shadow-md shadow-[#DC143C]/20'
                  : 'bg-black text-zinc-500 border-zinc-900 hover:text-zinc-300 hover:border-zinc-800'
              }`}
            >
              {cat === 'all' ? 'All Treatises (16)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Books List on Left, Deep Dossier on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Books List Grid */}
        <div className="lg:col-span-6 space-y-3 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook?.id === book.id;
              return (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] text-left ${
                    isSelected
                      ? 'bg-zinc-900 border-[#DC143C] shadow-lg shadow-[#DC143C]/10 text-white'
                      : 'bg-black border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-[#DC143C] font-bold">
                        {book.category}
                      </span>
                      <span className="text-[8px] font-mono text-zinc-600">
                        {book.year}
                      </span>
                    </div>

                    <h4 className="font-syne font-extrabold text-xs uppercase text-[#F8F7F4] mt-2 group-hover:text-[#DC143C] line-clamp-1">
                      {book.name}
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-500 italic block">
                      by {book.author}
                    </span>

                    <p className="text-[10px] text-zinc-400 font-google-sans leading-relaxed mt-1.5 line-clamp-2">
                      {book.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-900/80 pt-2.5 mt-2">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">
                      Advisor: <span className="text-zinc-300 font-bold">{book.associatedAdvisor}</span>
                    </span>
                    <span className="text-[8px] font-mono text-[#DC143C] font-bold">
                      Study →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12 text-zinc-600 font-mono text-xs">
              No grimoires found matching your search.
            </div>
          )}
        </div>

        {/* Selected Book Deep Dossier Panel */}
        <div className="lg:col-span-6 bg-black border border-zinc-900 rounded-2xl p-5 shadow-2xl flex flex-col justify-between max-h-[620px] overflow-hidden">
          {selectedBook ? (
            <div className="flex flex-col h-full justify-between overflow-hidden">
              
              {/* Header */}
              <div className="border-b border-zinc-900 pb-3 shrink-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[8.5px] font-mono uppercase font-bold tracking-wider bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C]">
                    {selectedBook.category}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    Est. {selectedBook.year} · {selectedBook.pages} pp.
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-lg text-[#F8F7F4] uppercase tracking-tight mt-1">
                  {selectedBook.name}
                </h3>
                <span className="text-xs font-mono text-zinc-400 italic">
                  by {selectedBook.author}
                </span>
              </div>

              {/* Scrollable Content Details */}
              <div className="overflow-y-auto space-y-4 my-3 pr-2 scrollbar-thin flex-1 text-xs leading-relaxed font-google-sans">
                
                {/* Description */}
                <div>
                  <span className="text-[8.5px] font-mono uppercase text-zinc-500 font-bold block mb-1">
                    Treatise Overview
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedBook.description}
                  </p>
                </div>

                {/* Core Doctrines / Tenets */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[8.5px] font-mono uppercase text-[#DC143C] font-bold block mb-1.5">
                    Essential Doctrines & Principles
                  </span>
                  <ul className="space-y-1.5">
                    {selectedBook.coreTenets.map((tenet, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-zinc-300 text-[11px]">
                        <span className="text-[#DC143C] font-bold text-xs shrink-0">✦</span>
                        <span>{tenet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Quotes */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[8.5px] font-mono uppercase text-amber-500 font-bold block mb-1.5">
                    Foundational Maxims
                  </span>
                  <div className="space-y-1.5">
                    {selectedBook.keyQuotes.map((quote, idx) => (
                      <blockquote key={idx} className="italic text-zinc-400 font-serif text-[11px] border-l border-amber-500/40 pl-2">
                        {quote}
                      </blockquote>
                    ))}
                  </div>
                </div>

                {/* Modern Seeker Application */}
                <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[8.5px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                    Tactical Seeker Application
                  </span>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {selectedBook.modernApplication}
                  </p>
                </div>

              </div>

              {/* Bottom Actions Bar */}
              <div className="border-t border-zinc-900 pt-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
                <button
                  onClick={() => setReaderOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-mono uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>📖 Read Excerpt</span>
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href={selectedBook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-black hover:bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-white text-xs font-mono uppercase transition-colors"
                  >
                    Archive Link ↗
                  </a>

                  <button
                    onClick={handleConsult}
                    className="px-3.5 py-1.5 rounded-lg bg-[#DC143C] hover:bg-[#B81132] text-white text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md shadow-[#DC143C]/20 flex items-center gap-1.5"
                  >
                    <span>Consult {selectedBook.associatedAdvisor}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-xs uppercase">
              Select a Treatise to inspect its secrets
            </div>
          )}
        </div>

      </div>

      {/* IN-APP READER MODAL */}
      {readerOpen && selectedBook && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl max-w-3xl w-full p-6 relative shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#DC143C] font-bold tracking-widest block">
                  Archive Reader
                </span>
                <h4 className="font-syne font-extrabold text-base text-[#F8F7F4] uppercase">
                  {selectedBook.name}
                </h4>
                <span className="text-xs font-mono text-zinc-500">
                  {selectedBook.author} ({selectedBook.year})
                </span>
              </div>
              <button
                onClick={() => setReaderOpen(false)}
                className="text-zinc-500 hover:text-[#DC143C] font-mono text-xs uppercase px-2 py-1 rounded bg-black border border-zinc-900 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-3 scrollbar-thin text-xs leading-relaxed font-google-sans text-zinc-300 flex-1 whitespace-pre-line bg-black/50 p-4 rounded-xl border border-zinc-900">
              {selectedBook.excerptText}
            </div>

            <div className="border-t border-zinc-900 pt-3 mt-4 flex items-center justify-between">
              <a
                href={selectedBook.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono text-zinc-400 hover:text-white uppercase underline"
              >
                Open Full Gutenberg / Source Archive ↗
              </a>
              <button
                onClick={() => setReaderOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#DC143C] text-zinc-200 hover:text-white font-mono text-xs uppercase font-bold transition-all cursor-pointer"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
