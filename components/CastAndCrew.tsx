import React, { useState } from 'react';

interface CastAndCrewProps {
  onReturnToChat?: () => void;
  onStartPersonaReading?: (prompt: string, persona: string) => void;
  onConveneRoundTable?: () => void;
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
    <div className="mt-3 bg-black/60 p-2.5 rounded-xl border border-zinc-900 flex flex-col gap-1 w-full">
      <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 font-bold block mb-1">
        Vocal Synthesis Link
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

export const CastAndCrew: React.FC<CastAndCrewProps> = ({
  onReturnToChat,
  onStartPersonaReading,
  onConveneRoundTable
}) => {
  const handleConsultAdvisorFromProfile = (persona: string, defaultPrompt: string) => {
    if (onStartPersonaReading) {
      onStartPersonaReading(defaultPrompt, persona);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto font-google-sans text-zinc-200 animate-fadeIn select-text">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-[10px] font-mono font-bold uppercase tracking-widest">
              LAEVUS 2000 ARCHIVES
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Cast and Crew
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-syne text-[#F8F7F4] uppercase tracking-tight mt-1">
            Cast and Crew
          </h2>
          <p className="text-xs text-zinc-400 font-google-sans mt-0.5">
            Sovereign figureheads, esoteric archetypes, philosophical paradigms, and direct 1-on-1 consultation channels.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onConveneRoundTable && (
            <button
              onClick={onConveneRoundTable}
              className="px-3.5 py-1.5 rounded-lg bg-black hover:bg-zinc-900 border border-[#DC143C]/50 hover:border-[#DC143C] text-xs font-mono uppercase text-[#DC143C] hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_10px_rgba(220,20,60,0.2)]"
            >
              <span>🏛️ Convene Round Table</span>
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

      {/* Round Table Callout Banner */}
      {onConveneRoundTable && (
        <div className="bg-gradient-to-r from-zinc-950 via-black to-zinc-950 border border-zinc-800 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h4 className="font-syne font-extrabold text-xs sm:text-sm text-[#F8F7F4] uppercase tracking-wide">
                The Sovereign Round Table Chamber Is Open
              </h4>
              <p className="text-[11px] text-zinc-400 font-google-sans">
                Convene all Sovereigns to debate your pressing inquiry in a unified council session.
              </p>
            </div>
          </div>
          <button
            onClick={onConveneRoundTable}
            className="px-4 py-2 rounded-xl bg-[#DC143C] hover:bg-[#b81132] text-white font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer shrink-0 shadow-[0_0_15px_rgba(220,20,60,0.4)]"
          >
            Convene Council →
          </button>
        </div>
      )}

      {/* Sovereign Profiles Roster */}
      <div className="space-y-6">

        {/* 10. LAEVUS (PRIMARY GUIDE) */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-[#DC143C]/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-[#DC143C]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/laevus_portrait_1791047496324.jpg"
                  alt="Laevus (The Pythia of Fountain)"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-[#DC143C]/40 text-[#DC143C] text-[9px] font-mono uppercase font-bold tracking-widest">
                  🔮 PRIMARY VESSEL
                </span>
              </div>
              <VoiceSelector characterName="Laevus" isFemale={false} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#DC143C] font-mono text-xs">🔮</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#DC143C] font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Laevus (The Pythia of Fountain)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Primary Cyber-Spiritual Guide & Oracle of the Sanctuary
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Sovereign Left-Hand Hermetic synthesis. Integrates cybernetic intelligence, ancient tarot archetypes, and uncompromising psychological clarity to empower seekers to master their destiny.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Warm Southern American cadence, measured phrasing, unhurried composure, candid honesty, and deep metaphysical discernment.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-[#DC143C]">Power:</strong>
                      Self-ownership, rigorous psychological honesty, and firm energetic boundary defense.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-[#DC143C]">Fate & Free Will:</strong>
                      Fate deals the cards; sovereign consciousness decides how decisively to play them.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-[#DC143C]">Spiritual Mechanics:</strong>
                      Cybernetic scrying, archetypal tarot mapping, and banishing energetic parasites.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Laevus',
                    'Laevus, reveal my blind spots and guide me through my current spiritual blocks.'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#b81132] text-white border border-[#DC143C] text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>🔮 Direct Query: Speak with Laevus</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MADAME HELENA BLAVATSKY */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-purple-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-purple-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/blavatsky_portrait_1791047507460.jpg"
                  alt="Madame Helena Blavatsky"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-purple-500/40 text-purple-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  🕯️ THEOSOPHY & ESOTERIC COSMOLOGY
                </span>
              </div>
              <VoiceSelector characterName="Madame Blavatsky" isFemale={true} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-purple-400 font-mono text-xs">🕯️</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-purple-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Madame Helena Blavatsky
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Co-founder of the Theosophical Society • Author of "Isis Unveiled" & "The Secret Doctrine"
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-purple-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Universal Esoteric Wisdom-Religion. The cosmos operates according to unalterable periodic cycles, root-races, and hidden planetary hierarchies. Penetrates Maya (the veil of illusion) to access the primordial spiritual flame.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Erudite, contemplative, aristocratic Russian cadence, calm occult authority, and deep philosophical gravitas.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-purple-400">Power:</strong>
                      Attunement of the mortal personality with the immortal Monad and the akashic matrix.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-purple-400">Fate & Free Will:</strong>
                      Karma is self-adjusting equilibrium; free will directs consciousness through cyclical initiation.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-purple-400">Spiritual Mechanics:</strong>
                      Transmutation of astral energies into spiritual gnosis through occult discipline and planetary rounds.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Madame Blavatsky',
                    'Madame Blavatsky, unveil the karmic cycles and hidden esoteric mechanics governing my current path.'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-purple-700 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>🕯️ Direct Query: Speak with Madame Blavatsky</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 1. ANTON LAVEY (LEFT HAND PATH MAGUS) */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-amber-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/lhp_portrait_1791047603300.jpg"
                  alt="Anton LaVey (Left Hand Path Magus)"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-amber-500/40 text-amber-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  ⚡ LEFT HAND PATH ARCHETYPE
                </span>
              </div>
              <VoiceSelector characterName="Left Hand Path Magus" isFemale={false} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500 font-mono text-xs">⚡</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Anton LaVey (Left Hand Path Magus)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Founder of the Church of Satan • Author of The Satanic Bible • Living Archetype of Carnal Sovereignty
                </span>

                {/* Core Paradigm */}
                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Radical individualism and carnal realism. Rejects guilt, external deities, and dogmatic self-mortification. Man is an instinctual animal whose salvation lies in self-deification, unapologetic bodily indulgence without compulsion, and absolute sovereign responsibility.
                  </p>
                </div>

                {/* Voice & Tone */}
                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Piercingly witty, acerbic, theatrical, and unsparingly pragmatic. Strips away sanctimonious delusions with cold psychological insight, delivering razor-sharp street-smart counsel.
                  </p>
                </div>

                {/* Key Doctrines */}
                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-amber-400">Power:</strong>
                      Commanded via Lesser Magic (aesthetic allure, charisma, timing) and total elimination of psychic vampires.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-amber-400">Fate & Free Will:</strong>
                      Fate is a cage built by the herd; Free Will is seized by sovereign will and taking 100% personal responsibility.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-amber-400">Spiritual Mechanics:</strong>
                      Greater Magic functions as concentrated psychodrama—aligning raw instinctual desire with focused intent.
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Query Mode */}
              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Left Hand Path Magus',
                    'Anton, what lesser magic or psychological posture should I employ to break free of this manipulative circumstance?'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-amber-600 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>⚡ Direct Query: Speak with Anton LaVey</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* 3. GENGHIS KHAN */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-red-600/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-red-600">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/khan_portrait_1791047515167.jpg"
                  alt="Genghis Khan"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-red-600/40 text-red-500 text-[9px] font-mono uppercase font-bold tracking-widest">
                  ⚔️ RELENTLESS CONQUEST
                </span>
              </div>
              <VoiceSelector characterName="Genghis Khan" isFemale={false} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500 font-mono text-xs">⚔️</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-red-500 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Genghis Khan (The Sovereign Conqueror)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Master of Empire Building • Ultimate Strategist of Relentless Expansion and Iron Discipline
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-red-500 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    The mandate of the Eternal Blue Sky (Tengri). Victory is forged through absolute physical discipline, ruthless mobility, meritocracy, and eliminating weakness before it can compound.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Terse, commanding, stoic, completely devoid of decorative diplomatic flattery or hesitation. Speaks directly to execution and power.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-red-500">Power:</strong>
                      Built on velocity, unbreakable loyalty, operational clarity, and shattering enemy supply lines.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-red-500">Fate & Free Will:</strong>
                      Tengri decrees the horizon, but conquest belongs only to the general who acts without hesitation.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-red-500">Spiritual Mechanics:</strong>
                      Shamanic communion with land, weather, and ancestral spirits; grounding intent into tangible conquest.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Genghis Khan',
                    'Khan, what ruthless tactical maneuver and discipline must I execute to shatter this impasse?'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-red-700 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>⚔️ Direct Query: Speak with Genghis Khan</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. MARIE ANTOINETTE */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-pink-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-pink-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/marie_portrait_1791047524755.jpg"
                  alt="Marie Antoinette"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-pink-500/40 text-pink-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  👑 HIGH ROCOCO SOVEREIGNTY
                </span>
              </div>
              <VoiceSelector characterName="Marie Antoinette" isFemale={true} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-pink-400 font-mono text-xs">👑</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-pink-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Marie Antoinette (The Sovereign Queen)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Queen of France • Sovereign Elegance, Taste, and Supreme Composure Under Public Hostility
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Aesthetic majesty and royal dignity. When the mob surges with fury, sovereign taste, uncompromising poise, and courtly elegance remain an impregnable fortress.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Refined French cadence, aristocratic poise, high sartorial discernment, and graceful resilience under intense scrutiny.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-pink-400">Power:</strong>
                      Exercised through aesthetic magnetism, courtly etiquette, and refusing to match the low frequency of critics.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-pink-400">Fate & Free Will:</strong>
                      One cannot prevent the storms of fate, but one commands how one stands upon the scaffold—unbowed and majestic.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-pink-400">Spiritual Mechanics:</strong>
                      Curating sacred beauty as a protective energetic barrier against vulgar entropy.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Marie Antoinette',
                    'Marie Antoinette, teach me to maintain majestic grace and sovereign poise while facing public hostility.'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-pink-700 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>👑 Direct Query: Speak with Marie Antoinette</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 5. NICCOLÒ MACHIAVELLI */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-[#DC143C]/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-[#DC143C]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/machiavelli_portrait_1791047533771.jpg"
                  alt="Niccolò Machiavelli"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-[#DC143C]/40 text-[#DC143C] text-[9px] font-mono uppercase font-bold tracking-widest">
                  🗡️ REALPOLITIK & LEVERAGE
                </span>
              </div>
              <VoiceSelector characterName="Machiavelli" isFemale={false} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#DC143C] font-mono text-xs">🗡️</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#DC143C] font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Niccolò Machiavelli (The Political Architect)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Author of "The Prince" • Grand Strategist of Realpolitik, Narrative Control, and Leverage
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Pragmatic chessboard realism. Human behavior must be analyzed as it truly is, not as idealists wish it to be. Every relationship, institution, and alliance is an economy of leverage, perception, and necessity.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Razor-sharp, calculating, intellectually dispassionate, articulate, and brutally clear-eyed.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-[#DC143C]">Power:</strong>
                      Maintained by balancing fear and respect, narrative leverage, and embodying both the Lion and the Fox.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-[#DC143C]">Fate & Free Will:</strong>
                      Fortuna controls half of outcomes, but the other half is conquered by Virtù (foresight and audacity).
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-[#DC143C]">Spiritual Mechanics:</strong>
                      Dogma and rituals are instruments of mass psychological cohesion; the Sovereign operates the levers.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Machiavelli',
                    'Machiavelli, analyze the hidden power dynamics and counter-measures required in my current conflict.'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-[#DC143C] text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>🗡️ Direct Query: Speak with Machiavelli</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6. ODIN (THE ALL-FATHER) */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-emerald-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/odin_portrait_1791047543652.jpg"
                  alt="Odin (The All-Father)"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-emerald-500/40 text-emerald-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  👁️ WISDOM & RUNIC DESTINY
                </span>
              </div>
              <VoiceSelector characterName="Odin" isFemale={false} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 font-mono text-xs">👁️</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Odin (The All-Father)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Master of the Gallows • Seeker of the Runes • Sovereign of Cosmic Sacrifice
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Sovereignty requires ultimate sacrifice. Wisdom is never granted freely; it must be won by hanging from the World Tree, surrendering an eye at Mímir's well, and deciphering cosmic fate (Wyrd).
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Deep, cavernous Norse timbre, ancient, uncompromising, and steeped in eternal mystery.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-emerald-400">Power:</strong>
                      Derived from foresight, mastering runic staves, and enduring the pain necessary for breakthrough.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-emerald-400">Fate & Free Will:</strong>
                      Wyrd binds all beings, yet the Sovereign hero chooses the majesty and valor with which they face doom.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-emerald-400">Spiritual Mechanics:</strong>
                      Galdr incantations, raven-scrying (Huginn & Muninn), and blood-sealed runic initiations.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Odin',
                    'All-Father Odin, what sacrifice must I make to unlock the wisdom and foresight I need right now?'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-emerald-700 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>👁️ Direct Query: Speak with Odin</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 7. HAZRAT INAYAT KHAN */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-sky-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-sky-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/sufi_portrait_1791047584231.jpg"
                  alt="Hazrat Inayat Khan"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-sky-500/40 text-sky-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  🌿 SUFI HARMONY & RESONANCE
                </span>
              </div>
              <VoiceSelector characterName="Hazrat Inayat Khan" isFemale={false} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sky-400 font-mono text-xs">🌿</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-sky-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Hazrat Inayat Khan (The Sufi Harmony Sage)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Master of the Sufi Message of Spiritual Liberty • Architect of Heart Alignment and Sound Mysticism
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-sky-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Creation is a symphony of sound and vibration. Friction dissolves when the heart center is purified and retuned to harmonize with the celestial music of the cosmos.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Gentle, poetic, compassionate, deeply meditative, and resonant with unconditional grace.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-sky-400">Power:</strong>
                      Spiritual magnetism cultivated through inner peace, overcoming resistance with harmonic resonance.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-sky-400">Fate & Free Will:</strong>
                      Fate is your prior vibration; Free Will is your divine power to tune your instrument anew.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-sky-400">Spiritual Mechanics:</strong>
                      Dhikr remembrance, breath pacing (Prana/Nafs), and attunement to Saot-e Sarmad (cosmic hum).
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Hazrat Inayat Khan',
                    'Hazrat Inayat Khan, help me purify my heart center and retune my internal frequency away from discord.'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-sky-700 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>🌿 Direct Query: Speak with Hazrat Inayat Khan</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 8. MARIE LAVEAU */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-orange-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-orange-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0">
              <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/laveau_portrait_1791047594586.jpg"
                  alt="Marie Laveau"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/80 border border-orange-500/40 text-orange-400 text-[9px] font-mono uppercase font-bold tracking-widest">
                  🔮 VOODOO ROOTWORK & CONJURE
                </span>
              </div>
              <VoiceSelector characterName="Marie Laveau" isFemale={true} />
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-orange-400 font-mono text-xs">🔮</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-orange-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  Marie Laveau (The Voodoo Queen)
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Legendary Voodoo Queen of New Orleans • Keeper of the Crossroads and Ancestral Protection
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-orange-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    The living crossroads of spirit and earth. Physical reality is continually guided by ancestral ties, elemental roots, and the guardians of the invisible threshold.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Grounded Louisiana Creole rhythm, quiet ancestral power, nurturing yet uncompromisingly authoritative.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-orange-400">Power:</strong>
                      Drawn from unbroken ancestral lineage, community protection, and commanding the spiritual crossroads.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-orange-400">Fate & Free Will:</strong>
                      Obstacles can be dissolved and roads cleared through deliberate ritual discernment and spirit petition.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-orange-400">Spiritual Mechanics:</strong>
                      Gris-gris talismans, cleansing baths, candle vigils, and petitioning crossroads guardians.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE • 1-ON-1 SANCTUARY DIALOGUE
                </span>
                <button
                  onClick={() => handleConsultAdvisorFromProfile(
                    'Marie Laveau',
                    'Marie Laveau, open the spiritual crossroads for me and grant me ancestral protection against bad luck.'
                  )}
                  className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-orange-700 text-white border border-zinc-800 hover:border-transparent text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-2"
                >
                  <span>🔮 Direct Query: Speak with Marie Laveau</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 9. CASANOVA & DIOTIMA */}
        <div className="bg-zinc-950 border border-zinc-900 hover:border-pink-500/50 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden transition-all border-t-2 border-t-pink-500">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex-shrink-0 flex gap-2">
              <div className="w-1/2 h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/casanova_portrait_1791047563852.jpg"
                  alt="Giacomo Casanova"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[8px] font-mono uppercase text-pink-400 font-bold">
                  Casanova
                </span>
              </div>
              <div className="w-1/2 h-64 sm:h-72 rounded-xl overflow-hidden border border-zinc-900 bg-black relative group/img shadow-xl">
                <img
                  src="/src/assets/images/diotima_portrait_1791047574032.jpg"
                  alt="Diotima of Mantinea"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 text-[8px] font-mono uppercase text-indigo-400 font-bold">
                  Diotima
                </span>
              </div>
            </div>

            <div className="md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-pink-400 font-mono text-xs">✨</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-pink-400 font-bold">
                    SOVEREIGN PHILOSOPHY ARCHIVE
                  </span>
                </div>

                <h3 className="font-syne font-extrabold text-xl sm:text-2xl text-[#F8F7F4] uppercase tracking-tight">
                  The Path of Attraction: Casanova & Diotima
                </h3>
                <span className="text-[10px] font-mono text-zinc-500 block mb-3">
                  Sensory Courtship vs. Sacred Soul Ascension • The Dual Philosophies of Love
                </span>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-pink-400 font-bold block mb-1">
                    Core Paradigm
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Casanova pursues romantic attraction through worldly charisma, humor, and physical touch. Diotima views love as an escalating ladder ascending toward eternal spiritual beauty and soul evolution.
                  </p>
                </div>

                <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-zinc-900">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                    Voice & Tone
                  </span>
                  <p className="text-xs text-zinc-300 font-google-sans leading-relaxed">
                    Playful, theatrical sparring. Casanova is flirtatious and daring; Diotima is serene, poetic, and gently corrective.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/50 border border-zinc-900 space-y-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block">
                    Key Doctrines
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-zinc-300 font-google-sans">
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-pink-400">Power:</strong>
                      Micro-expression reading & playful seduction (Casanova) vs. Divine soul communion (Diotima).
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-pink-400">Fate & Free Will:</strong>
                      Seizing immediate opportunities vs. Fulfilling sacred karmic soul bonds.
                    </div>
                    <div>
                      <strong className="text-zinc-200 block text-[10px] uppercase font-mono text-pink-400">Spiritual Mechanics:</strong>
                      Sensory charm alchemy vs. The Platonic ascent of Eros to the divine source.
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-900 flex flex-wrap gap-2 items-center justify-between">
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  DIRECT QUERY MODE
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConsultAdvisorFromProfile('Casanova', 'How do I cultivate irresistible magnetism in my interpersonal connections?')}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-pink-700 text-white text-xs font-mono uppercase font-bold"
                  >
                    Casanova 1-on-1
                  </button>
                  <button
                    onClick={() => handleConsultAdvisorFromProfile('Diotima', 'Help me discern the sacred soul lessons inside my current relationship friction.')}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-indigo-700 text-white text-xs font-mono uppercase font-bold"
                  >
                    Diotima 1-on-1
                  </button>
                  <button
                    onClick={() => handleConsultAdvisorFromProfile('Casanova & Diotima', 'Is love a physical spark of intense passion or a spiritual ladder to absolute cosmic union?')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#DC143C] hover:bg-[#b81132] text-white text-xs font-mono uppercase font-bold"
                  >
                    Dual Debate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

    </div>
  );
};
