import React, { useState, useRef, useEffect } from 'react';
import { conveneSovereignRoundTable } from '../services/gemini';
import { voiceEngine } from '../services/voiceSynthesis';

export interface SovereignRoundTableProps {
  onReturnToChat?: () => void;
  onDirectQueryPersona?: (personaName: string, initialPrompt?: string) => void;
}

interface SovereignCardDef {
  id: string;
  name: string;
  symbol: string;
  archetype: string;
  portrait: string;
  accentColor: string;
  borderColor: string;
}

const SOVEREIGN_ROSTER: SovereignCardDef[] = [
  {
    id: 'blavatsky',
    name: 'Madame Helena Blavatsky',
    symbol: '🕯️',
    archetype: 'Theosophy & Cosmic Mechanics',
    portrait: '/src/assets/images/blavatsky_portrait_1791047507460.jpg',
    accentColor: '#A855F7',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'khan',
    name: 'Genghis Khan',
    symbol: '⚔️',
    archetype: 'Relentless Conquest & Discipline',
    portrait: '/src/assets/images/khan_portrait_1791047515167.jpg',
    accentColor: '#EF4444',
    borderColor: 'border-red-600/40'
  },
  {
    id: 'marie',
    name: 'Marie Antoinette',
    symbol: '👑',
    archetype: 'High Rococo Dignity & Poise',
    portrait: '/src/assets/images/marie_portrait_1791047524755.jpg',
    accentColor: '#EC4899',
    borderColor: 'border-pink-500/40'
  },
  {
    id: 'lavey',
    name: 'Anton LaVey (Left Hand Path Magus)',
    symbol: '⚡',
    archetype: 'Carnal Sovereignty & Self-Deification',
    portrait: '/src/assets/images/lhp_portrait_1791047603300.jpg',
    accentColor: '#F59E0B',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    symbol: '🗡️',
    archetype: 'Strategic Realpolitik & Leverage',
    portrait: '/src/assets/images/machiavelli_portrait_1791047533771.jpg',
    accentColor: '#DC143C',
    borderColor: 'border-[#DC143C]/40'
  },
  {
    id: 'odin',
    name: 'Odin (The All-Father)',
    symbol: '👁️',
    archetype: 'Willing Sacrifice & Runic Fate',
    portrait: '/src/assets/images/odin_portrait_1791047543652.jpg',
    accentColor: '#10B981',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'inayat',
    name: 'Hazrat Inayat Khan',
    symbol: '🌿',
    archetype: 'Sufi Harmony & Resonance',
    portrait: '/src/assets/images/sufi_portrait_1791047584231.jpg',
    accentColor: '#38BDF8',
    borderColor: 'border-sky-500/40'
  },
  {
    id: 'laveau',
    name: 'Marie Laveau',
    symbol: '🔮',
    archetype: 'Voodoo Rootwork & Ancestral Power',
    portrait: '/src/assets/images/laveau_portrait_1791047594586.jpg',
    accentColor: '#F97316',
    borderColor: 'border-orange-500/40'
  },
  {
    id: 'casanova',
    name: 'Giacomo Casanova',
    symbol: '🌹',
    archetype: 'Adventurer & Romantic',
    portrait: '/src/assets/images/casanova_portrait_placeholder.jpg',
    accentColor: '#FB7185',
    borderColor: 'border-rose-500/40'
  },
  {
    id: 'diotima',
    name: 'Diotima of Mantinea',
    symbol: '✨',
    archetype: 'Philosopher & Priestess',
    portrait: '/src/assets/images/diotima_portrait_placeholder.jpg',
    accentColor: '#A78BFA',
    borderColor: 'border-violet-500/40'
  }
];

const PRESET_QUERIES = [
  "How should a sovereign individual navigate systemic collapse and institutional control?",
  "Is fate an unyielding geometric trap or malleable clay shaped by concentrated Will?",
  "Where is the boundary between necessary indulgence and self-destructive weakness?",
  "How can one transmute intense public malice and corporate envy into sovereign leverage?",
  "What is the ultimate mechanic of power: absolute discipline or perceptual manipulation?"
];

interface ParsedPerspective {
  sovereignName: string;
  symbol: string;
  quote: string;
  stance: string;
  rawText: string;
}

export const SovereignRoundTable: React.FC<SovereignRoundTableProps> = ({
  onReturnToChat,
  onDirectQueryPersona
}) => {
  const [query, setQuery] = useState('');
  const [isConvening, setIsConvening] = useState(false);
  const [conveningStep, setConveningStep] = useState(0);
  const [transcript, setTranscript] = useState<string | null>(() => {
    return localStorage.getItem('laevus_last_round_table_transcript');
  });
  const [currentTopic, setCurrentTopic] = useState<string>(() => {
    return localStorage.getItem('laevus_last_round_table_topic') || '';
  });
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isConvening) {
      interval = setInterval(() => {
        setConveningStep(prev => (prev + 1) % 4);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isConvening]);

  const handleConveneCouncil = async (inquiryToSubmit?: string) => {
    const activeQuestion = (inquiryToSubmit || query).trim();
    if (!activeQuestion || isConvening) return;

    setIsConvening(true);
    setTranscript(null);
    setCurrentTopic(activeQuestion);

    try {
      const response = await conveneSovereignRoundTable(activeQuestion);
      setTranscript(response);
      localStorage.setItem('laevus_last_round_table_transcript', response);
      localStorage.setItem('laevus_last_round_table_topic', activeQuestion);
      
      setTimeout(() => {
        if (transcriptRef.current) {
          transcriptRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 250);
    } catch (err) {
      console.error('Error convening round table:', err);
      setTranscript('### 🔮 LAEVUS ROUND TABLE DISTURBANCE\nThe spiritual currents encountered a momentary interference. Please convene the council once more.');
    } finally {
      setIsConvening(false);
    }
  };

  const handleCopyTranscript = async () => {
    if (!transcript) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(transcript);
      } else {
        const ta = document.createElement('textarea');
        ta.value = transcript;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Copy failed:', e);
    }
  };

  useEffect(() => {
    const unsub = voiceEngine.onSpeakingChange((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return () => {
      unsub();
      voiceEngine.stop();
    };
  }, []);

  const handleSpeakSynthesis = async () => {
    if (!transcript) return;
    if (isPlayingAudio) {
      voiceEngine.stop();
      setIsPlayingAudio(false);
      return;
    }

    const synthesisMatch = transcript.match(/### 🏛️ SOVEREIGN SYNTHESIS\s+([\s\S]*?)(?:---|$)/);
    const textToSpeak = synthesisMatch 
      ? `Sovereign Synthesis. ${synthesisMatch[1].trim()}`
      : transcript.slice(0, 400);

    voiceEngine.speak(textToSpeak);
  };

  // Structured parser for Sovereign markdown
  const parsedContent = React.useMemo(() => {
    if (!transcript) return null;

    const topicMatch = transcript.match(/\*\*Topic \/ Question:\*\*\s*"([^"]+)"/);
    const topic = topicMatch ? topicMatch[1] : currentTopic;

    // Extract Moderator intro: text between topic line and first "---" or "####"
    let moderatorIntro = "";
    const introMatch = transcript.match(/\*\*Topic \/ Question:\*\*[^\n]*\n+([\s\S]*?)(?=---\n+####|####)/);
    if (introMatch) {
      moderatorIntro = introMatch[1].replace(/---/g, '').trim();
    }

    // Extract individual perspectives
    const perspectives: ParsedPerspective[] = [];
    const sectionRegex = /####\s+([🕯️⚔️👑⚡🗡️👁️🌿🔮\w\s().\-]+)\n+([\s\S]*?)(?=(?:---\n+####|### 🏛️ SOVEREIGN SYNTHESIS|$))/g;
    let match;

    while ((match = sectionRegex.exec(transcript)) !== null) {
      const headerRaw = match[1].trim();
      const body = match[2].trim();

      // Extract symbol
      const symbolMatch = headerRaw.match(/^([🕯️⚔️👑⚡🗡️👁️🌿🔮])/);
      const symbol = symbolMatch ? symbolMatch[1] : '🏛️';
      const sovereignName = headerRaw.replace(/^[🕯️⚔️👑⚡🗡️👁️🌿🔮]\s*/, '').trim();

      // Extract quote
      const quoteMatch = body.match(/\*"([^"]+)"\*|\*“([^”]+)”\*|"([^"]+)"/);
      const quote = quoteMatch ? (quoteMatch[1] || quoteMatch[2] || quoteMatch[3]) : "";

      // Extract stance
      const stanceMatch = body.match(/\*\s+\*\*The Stance:\*\*\s*([\s\S]*?)(?=$|\n\n)/);
      const stance = stanceMatch ? stanceMatch[1].trim() : body.replace(/\*"[^"]+"\*/g, '').replace(/\* \*\*The Stance:\*\*/g, '').trim();

      perspectives.push({
        sovereignName,
        symbol,
        quote,
        stance,
        rawText: body
      });
    }

    // Extract Sovereign Synthesis
    let synthesis = "";
    const synthesisMatch = transcript.match(/### 🏛️ SOVEREIGN SYNTHESIS\s+([\s\S]*?)(?:---|$)/);
    if (synthesisMatch) {
      synthesis = synthesisMatch[1].trim();
    }

    return {
      topic,
      moderatorIntro,
      perspectives,
      synthesis
    };
  }, [transcript, currentTopic]);

  const conveningMessages = [
    "Opening the obsidian vault and summoning the Sovereign Council...",
    "Aligning the cosmic mechanics of Blavatsky with the iron will of Khan...",
    "Harmonizing Machiavellian realpolitik with Anton LaVey's carnal sovereignty...",
    "Synthesizing runic fate, Sufi resonance, and New Orleans rootwork into council verdict..."
  ];

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-6 py-6 overflow-y-auto font-google-sans text-zinc-200 animate-fadeIn select-text">
      {/* Top Protocol Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900/60 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C] animate-pulse" />
            <span className="text-[12px] font-mono uppercase tracking-[0.25em] text-[#DC143C] font-bold">
              LAEVUS 2000 • TAB: SOVEREIGN ROUND TABLE
            </span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#F8F7F4] uppercase tracking-tight">
            The Sovereign Round Table
          </h2>
          <p className="text-sm text-zinc-400 font-google-sans mt-2 max-w-2xl">
            Convene a multi-perspective panel discussion where all eight Sovereign archetypes confront your inquiry simultaneously, delivering authentic doctrines, intellectual friction, and a concluding synthesis.
          </p>
        </div>

        {onReturnToChat && (
          <button
            onClick={onReturnToChat}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#DC143C]/60 text-sm font-mono uppercase text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <span>← Return to Sanctuary</span>
          </button>
        )}
      </div>

      {/* Council Roster Grid */}
      <div className="mb-8 bg-zinc-950/80 border border-zinc-900 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5 px-1">
          <span className="text-[12px] font-mono uppercase tracking-widest text-zinc-500 font-bold flex items-center gap-2">
            <span>🏛️</span> Active Council Roster (8 Sovereigns In Attendance)
          </span>
          <span className="text-[10px] font-mono text-zinc-600">UNIFIED LAEVUS ENGINE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SOVEREIGN_ROSTER.map((sovereign) => (
            <div
              key={sovereign.id}
              className={`p-3 rounded-xl bg-black/60 border ${sovereign.borderColor} flex items-center gap-3 transition-all group hover:bg-zinc-900/60`}
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900 relative">
                <img
                  src={sovereign.portrait}
                  alt={sovereign.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base">{sovereign.symbol}</span>
                  <span className="text-[12px] font-syne font-bold text-zinc-200 truncate group-hover:text-white">
                    {sovereign.name.split(' ')[0]}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 truncate block">
                  {sovereign.archetype.split('&')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seeker's Inquiry Chamber Form */}
      <div className="bg-black border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative mb-10 focus-within:border-[#DC143C]/60 transition-all">
        <label className="block text-sm font-mono uppercase tracking-widest text-zinc-400 mb-4 font-bold flex items-center justify-between">
          <span>Pose Your Question to the Council</span>
          <span className="text-[11px] text-[#DC143C] font-normal lowercase tracking-normal">
            8 distinct doctrines • 1 unified synthesis
          </span>
        </label>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. How does a sovereign spirit maintain internal composure and decisive command when facing organized institutional betrayal?"
          rows={4}
          disabled={isConvening}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-5 py-4 text-sm text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C] font-google-sans leading-relaxed resize-none transition-all shadow-inner"
        />

        {/* Preset Question Chips */}
        <div className="mt-5 flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-mono uppercase text-zinc-600 mr-2">Suggested Inquiries:</span>
          {PRESET_QUERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(preset);
                handleConveneCouncil(preset);
              }}
              disabled={isConvening}
              className="text-[10px] font-google-sans px-4 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer text-left truncate max-w-[320px]"
              title={preset}
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Convene Action Button */}
        <div className="mt-6 pt-5 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
            <span className="text-[#DC143C]">●</span>
            <span>Protocol: Moderator Intro → Sovereign Arguments → Debate Friction → Final Synthesis</span>
          </div>

          <button
            onClick={() => handleConveneCouncil()}
            disabled={!query.trim() || isConvening}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-mono text-sm uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg ${
              !query.trim() || isConvening
                ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                : 'bg-[#DC143C] hover:bg-[#b81132] text-white border border-[#DC143C] shadow-[0_0_20px_rgba(220,20,60,0.5)] active:scale-95'
            }`}
          >
            {isConvening ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Convening Council...</span>
              </>
            ) : (
              <>
                <span>🔮</span>
                <span>Convene the Round Table</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Convening Chamber Animation */}
      {isConvening && (
        <div className="p-8 my-6 bg-zinc-950 border border-[#DC143C]/40 rounded-2xl shadow-[0_0_30px_rgba(220,20,60,0.2)] text-center animate-fadeIn flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#DC143C]/20 border-t-[#DC143C] animate-spin" />
            <div className="absolute inset-2 rounded-full border border-zinc-800 border-b-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
            <span className="text-2xl animate-pulse">🏛️</span>
          </div>
          <h3 className="font-syne text-sm font-extrabold uppercase tracking-widest text-[#F8F7F4] mb-1">
            Sovereign Council Deliberating
          </h3>
          <p className="text-xs font-mono text-[#DC143C] animate-pulse max-w-md">
            {conveningMessages[conveningStep]}
          </p>
        </div>
      )}

      {/* Rendered Transcript and Verdict */}
      {transcript && !isConvening && (
        <div ref={transcriptRef} className="space-y-6 animate-fadeIn">
          {/* Transcript Control Bar */}
          <div className="flex items-center justify-between bg-zinc-950 border border-zinc-900 px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-400">
            <span className="font-bold text-[#DC143C] flex items-center gap-1.5 uppercase text-[10px]">
              <span>🔮</span> Protocol Complete
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakSynthesis}
                className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
                title="Listen to vocal synthesis"
              >
                <span>{isPlayingAudio ? '⏹️ Stop Voice' : '🔊 Hear Synthesis'}</span>
              </button>
              <button
                onClick={handleCopyTranscript}
                className="px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{copied ? '✓ Copied' : '📋 Copy Council Verdict'}</span>
              </button>
            </div>
          </div>

          {/* Structured Presentation View */}
          {parsedContent && parsedContent.perspectives.length > 0 ? (
            <div className="space-y-6">
              {/* Header & Topic Banner */}
              <div className="bg-gradient-to-b from-black to-zinc-950 border border-zinc-800 rounded-2xl p-6 text-center shadow-xl">
                <span className="px-3 py-1 rounded-full bg-[#DC143C]/20 border border-[#DC143C]/40 text-[#DC143C] text-[9px] font-mono uppercase tracking-widest font-bold">
                  🔮 LAEVUS ROUND TABLE CONVENED
                </span>
                <h3 className="font-syne text-lg sm:text-xl font-extrabold text-[#F8F7F4] mt-3 uppercase tracking-tight">
                  "{parsedContent.topic}"
                </h3>
                {parsedContent.moderatorIntro && (
                  <p className="mt-3 text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-google-sans leading-relaxed italic border-t border-zinc-900 pt-3">
                    {parsedContent.moderatorIntro}
                  </p>
                )}
              </div>

              {/* Individual Perspectives Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsedContent.perspectives.map((persp, idx) => {
                  const matchingSovereign = SOVEREIGN_ROSTER.find(s => 
                    persp.sovereignName.toLowerCase().includes(s.id) ||
                    s.name.toLowerCase().includes(persp.sovereignName.toLowerCase().split(' ')[0])
                  );

                  return (
                    <div
                      key={idx}
                      className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-zinc-800 transition-all group relative overflow-hidden"
                    >
                      {/* Accent glow line */}
                      <div 
                        className="absolute top-0 left-0 right-0 h-1" 
                        style={{ backgroundColor: matchingSovereign?.accentColor || '#DC143C' }} 
                      />

                      <div>
                        {/* Sovereign Header */}
                        <div className="flex items-center gap-3 mb-3">
                          {matchingSovereign && (
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-zinc-800 shrink-0 bg-black">
                              <img
                                src={matchingSovereign.portrait}
                                alt={persp.sovereignName}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{persp.symbol}</span>
                              <h4 className="font-syne font-extrabold text-sm sm:text-base text-[#F8F7F4] uppercase tracking-tight truncate">
                                {persp.sovereignName}
                              </h4>
                            </div>
                            <span className="text-[9px] font-mono text-zinc-500 block truncate">
                              {matchingSovereign?.archetype || 'Sovereign Oracle'}
                            </span>
                          </div>
                        </div>

                        {/* Direct Quote in Voice */}
                        {persp.quote && (
                          <div className="mb-3 p-3 rounded-xl bg-black/80 border border-zinc-900 text-xs text-zinc-200 italic font-google-sans leading-relaxed border-l-2" style={{ borderLeftColor: matchingSovereign?.accentColor || '#DC143C' }}>
                            "{persp.quote}"
                          </div>
                        )}

                        {/* The Stance */}
                        <div className="text-xs text-zinc-400 font-google-sans leading-relaxed space-y-1">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                            THE STANCE:
                          </span>
                          <p>{persp.stance}</p>
                        </div>
                      </div>

                      {/* Direct Query 1-on-1 handoff */}
                      <div className="pt-3 mt-4 border-t border-zinc-900/60 flex items-center justify-between">
                        <span className="text-[8px] font-mono uppercase text-zinc-600">
                          SEEK FURTHER COUNSEL
                        </span>
                        {onDirectQueryPersona && (
                          <button
                            onClick={() => onDirectQueryPersona(
                              persp.sovereignName,
                              `Regarding the Round Table topic: "${parsedContent.topic}", elaborate on your specific counsel for my situation.`
                            )}
                            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-[#DC143C]/20 hover:text-white border border-zinc-800 hover:border-[#DC143C]/40 text-[10px] font-mono uppercase text-zinc-300 transition-all cursor-pointer font-bold flex items-center gap-1"
                          >
                            <span>Direct Query (1-on-1)</span>
                            <span className="text-[#DC143C]">→</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* The Grand Synthesis */}
              {parsedContent.synthesis && (
                <div className="bg-black border-2 border-[#DC143C] rounded-2xl p-6 shadow-[0_0_40px_rgba(220,20,60,0.25)] relative overflow-hidden animate-fadeIn">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">🏛️</span>
                    <h3 className="font-syne font-extrabold text-base sm:text-lg text-[#F8F7F4] uppercase tracking-wide">
                      SOVEREIGN SYNTHESIS
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#DC143C] font-bold block mb-3">
                    CONVERGENCE & FRICTION RESOLUTION
                  </span>
                  <div className="text-xs sm:text-sm text-zinc-300 font-google-sans leading-relaxed whitespace-pre-wrap">
                    {parsedContent.synthesis}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Raw fallback if formatting diverged
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 whitespace-pre-wrap font-mono text-xs text-zinc-300 leading-relaxed">
              {transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
