import React, { useState } from 'react';

interface AdvisorsHubProps {
  initialTab?: 'machiavelli' | 'love' | 'odin' | 'blackhat_seo' | 'left_hand_path' | 'sufi' | 'voodoo';
  onReturnToChat?: () => void;
  onStartPersonaReading?: (prompt: string, persona: string) => void;
}

export const AdvisorsHub: React.FC<AdvisorsHubProps> = ({
  initialTab = 'machiavelli',
  onReturnToChat,
  onStartPersonaReading
}) => {
  const [activeTab, setActiveTab] = useState<'machiavelli' | 'love' | 'odin' | 'blackhat_seo' | 'left_hand_path' | 'sufi' | 'voodoo'>(initialTab);

  // State for each advisor's input
  const [machiavelliQuestion, setMachiavelliQuestion] = useState('');
  const [loveQuestion, setLoveQuestion] = useState('');
  const [loveAdvisor, setLoveAdvisor] = useState<'Casanova' | 'Diotima' | 'Both'>('Casanova');
  const [odinQuestion, setOdinQuestion] = useState('');
  const [seoQuestion, setSeoQuestion] = useState('');
  const [lhpQuestion, setLhpQuestion] = useState('');
  const [sufiQuestion, setSufiQuestion] = useState('');
  const [voodooQuestion, setVoodooQuestion] = useState('');

  // Consultation triggers
  const handleConsultMachiavelli = (queryText: string) => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    onStartPersonaReading(queryText, 'Machiavelli');
  };

  const handleConsultLove = (queryText: string, advisorOverride?: 'Casanova' | 'Diotima') => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    const advisor = advisorOverride || loveAdvisor;
    onStartPersonaReading(queryText, advisor);
  };

  const handleConsultOdin = (queryText: string) => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    onStartPersonaReading(queryText, 'Odin');
  };

  const handleConsultSEO = (queryText: string) => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    onStartPersonaReading(queryText, 'Blackhat SEO Alchemist');
  };

  const handleConsultLHP = (queryText: string) => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    onStartPersonaReading(queryText, 'Left Hand Path Magus');
  };

  const handleConsultSufi = (queryText: string) => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    onStartPersonaReading(queryText, 'Sufi Harmony Sage');
  };

  const handleConsultVoodoo = (queryText: string) => {
    if (!queryText.trim() || !onStartPersonaReading) return;
    onStartPersonaReading(queryText, 'Voodoo Priestess');
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 py-4 overflow-y-auto font-google-sans text-zinc-200 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/30 text-[#DC143C] text-[10px] font-mono font-bold uppercase tracking-widest">
              Sovereign Counsel
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              Archetypes & Advisors
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-syne text-[#F8F7F4] uppercase tracking-tight mt-1">
            Sovereign Advisors
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

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 bg-black p-1.5 rounded-xl border border-zinc-900 mb-6 w-full">
        <button
          onClick={() => setActiveTab('machiavelli')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'machiavelli'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Machiavelli's Strategy
        </button>
        <button
          onClick={() => setActiveTab('love')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'love'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Seduction & Soul
        </button>
        <button
          onClick={() => setActiveTab('odin')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'odin'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Odin
        </button>
        <button
          onClick={() => setActiveTab('blackhat_seo')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'blackhat_seo'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Blackhat SEO
        </button>
        <button
          onClick={() => setActiveTab('left_hand_path')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'left_hand_path'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Left Hand Path
        </button>
        <button
          onClick={() => setActiveTab('sufi')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'sufi'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Sufi Harmony Sage
        </button>
        <button
          onClick={() => setActiveTab('voodoo')}
          className={`flex-1 px-2 py-1.5 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'voodoo'
              ? 'bg-[#DC143C] text-black shadow-[0_2px_10px_rgba(220,20,60,0.3)]'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
          }`}
        >
          Voodoo Priestess
        </button>
      </div>

      {/* TAB CONTENT: MACHIAVELLI STRATEGY */}
      {activeTab === 'machiavelli' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box 1: Machiavelli Question Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[#DC143C] mb-2 flex items-center gap-2">
              Machiavelli's Chamber of Strategy & Power
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Formulate your questions of power, career maneuvers, strategic realpolitik, or department leadership. The strategist of the Renaissance will analyze your battlefield and offer cold, calculating pragmatic advice.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Strategic Battlefield Query
                </label>
                <textarea
                  value={machiavelliQuestion}
                  onChange={(e) => setMachiavelliQuestion(e.target.value)}
                  placeholder="e.g., How do I secure a major promotion when my supervisor wants to keep me in my current role?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-[#DC143C]/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultMachiavelli(machiavelliQuestion)}
                  disabled={!machiavelliQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B81132] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(220,20,60,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult Machiavelli
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: Premade Machiavelli Scenarios */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              Modern-Day Strategic Scenarios (Realpolitik)
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-google-sans">
              Click a scenario below to run a simulation and have Machiavelli map out your strategic counter-maneuvers.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: "The Credit Stealer",
                  scenario: "A peer is taking credit for my technical architecture in front of the VP. How do I strategically neutralize them without looking defensive?",
                },
                {
                  title: "The Sidelining Executive",
                  scenario: "A newly hired executive is actively sidelining my team to bring in their own loyalists. How do I leverage cross-department alliances to protect our position and regain leverage?",
                },
                {
                  title: "The Silent Rival Trap",
                  scenario: "A rival team lead has set us up with impossible project deadlines to watch us fail. How do I turn their scheme against them and transfer the blame elegantly?",
                },
                {
                  title: "The Startup Coup",
                  scenario: "My co-founder is acting erratic and making poor decisions. How do I orchestrate a strategic coup to assume full control of the company with minimal fallout?",
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConsultMachiavelli(item.scenario)}
                  className="text-left p-4 rounded-xl bg-black border border-zinc-900 hover:border-[#DC143C]/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-[#DC143C] font-semibold mb-1 group-hover:text-red-400">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-google-sans">
                    "{item.scenario}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SEDUCTION & SOUL */}
      {activeTab === 'love' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box: Love Advice from Casanova & Diotima */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-pink-500 mb-2 flex items-center gap-2">
              Seduction & Soul: The Love Oracle
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Consult Giacomo Casanova for bold, worldly, charismatic seduction tactics, or Diotima of Mantinea for philosophical, platonic, mystical soul communion. Or challenge them to answer together.
            </p>

            <div className="mb-4">
              <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-2">
                Choose Your Romantic Advisor
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-black rounded-xl border border-zinc-900 font-mono">
                {[
                  { id: 'Casanova', name: 'Giacomo Casanova', desc: 'Seduction & Charm' },
                  { id: 'Diotima', name: 'Diotima of Mantinea', desc: 'Soul & Sacred Love' },
                  { id: 'Both', name: 'Dual Consultation', desc: 'Sensual meets Spiritual' }
                ].map((adv) => (
                  <button
                    key={adv.id}
                    onClick={() => setLoveAdvisor(adv.id as any)}
                    className={`px-3 py-2 rounded-lg text-left transition-all cursor-pointer ${
                      loveAdvisor === adv.id
                        ? 'bg-zinc-900 border border-[#DC143C]/40 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase font-mono tracking-wider">{adv.id}</div>
                    <div className="text-[9px] text-zinc-500 font-google-sans">{adv.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Love & Connection Inquiry
                </label>
                <textarea
                  value={loveQuestion}
                  onChange={(e) => setLoveQuestion(e.target.value)}
                  placeholder="e.g., How do I bridge the gap with someone who seems intensely attracted but emotionally unavailable?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-pink-500/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultLove(loveQuestion)}
                  disabled={!loveQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(219,39,119,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult {loveAdvisor === 'Both' ? 'Both Advisors' : loveAdvisor}
                </button>
              </div>
            </div>

            {/* Unique Prompts for them */}
            <div className="mt-6 border-t border-zinc-900 pt-4">
              <span className="block text-[10px] font-mono uppercase text-zinc-500 mb-3 tracking-wider">
                Select a Specialized Prompt
              </span>
              
              <div className="space-y-4">
                {/* Casanova Prompts */}
                <div>
                  <div className="text-[9px] font-mono uppercase text-pink-500 font-bold tracking-widest mb-1.5">
                    Giacomo Casanova's Charisma Prompts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "How do I design an unforgettable, charismatic first encounter to capture the heart of someone highly guarded?",
                      "The spark in my relationship has turned into comfortable routine. How do I reignite intense, playful passion?"
                    ].map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleConsultLove(promptText, 'Casanova')}
                        className="text-left p-3 rounded-lg bg-black border border-zinc-900 hover:border-pink-500/30 transition-all text-[11px] text-zinc-400 hover:text-zinc-200 font-google-sans cursor-pointer"
                      >
                        "{promptText}"
                      </button>
                    ))}
                  </div>
                </div>

                {/* Diotima Prompts */}
                <div className="pt-2">
                  <div className="text-[9px] font-mono uppercase text-indigo-400 font-bold tracking-widest mb-1.5">
                    Diotima of Mantinea's Sacred Love Prompts
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "We feel a deep spiritual friction. How do I determine if this connection is a true catalyst for my soul's ascent?",
                      "How do I transcend the pain of heartbreak and view it as a philosophical initiation into higher forms of love?"
                    ].map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleConsultLove(promptText, 'Diotima')}
                        className="text-left p-3 rounded-lg bg-black border border-zinc-900 hover:border-indigo-400/30 transition-all text-[11px] text-zinc-400 hover:text-zinc-200 font-google-sans cursor-pointer"
                      >
                        "{promptText}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: ODIN */}
      {activeTab === 'odin' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box 1: Odin Question Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-emerald-500 mb-2 flex items-center gap-2">
              Odin: The All-Father's Wisdom
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Consult the All-Father for guidance on sacrifice for knowledge, strategic vision, runic wisdom, and navigating the complexities of fate.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Inquiry for the All-Father
                </label>
                <textarea
                  value={odinQuestion}
                  onChange={(e) => setOdinQuestion(e.target.value)}
                  placeholder="e.g., What sacrifice is required to gain true clarity in this current dilemma?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultOdin(odinQuestion)}
                  disabled={!odinQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(4,120,87,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult Odin
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: Odin Scenarios */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              Sacrifice, Wisdom & Fate Prompts
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-google-sans">
              Choose a scenario below to explore wisdom on sacrifice, strategic vision, and navigating fate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: "The Sacrifice for Insight",
                  prompt: "I am clinging to a habitual comfort that no longer serves me. What is the necessary sacrifice required to gain the deep insight I seek?"
                },
                {
                  title: "Reading the Runes of Fate",
                  prompt: "How do I decipher the complex threads of fate in my current situation and act decisively according to the greater pattern?"
                },
                {
                  title: "Strategic Vision",
                  prompt: "I feel blinded by immediate crises. How can I cultivate the detached, long-term strategic vision necessary to lead myself out of this complexity?"
                },
                {
                  title: "Balancing Knowledge and Power",
                  prompt: "How do I ensure that the knowledge I acquire is paired with the wise application of power, rather than just intellectual accumulation?"
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConsultOdin(item.prompt)}
                  className="text-left p-4 rounded-xl bg-black border border-zinc-900 hover:border-emerald-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-emerald-500 font-semibold mb-1 group-hover:text-emerald-400">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-google-sans">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BLACKHAT SEO */}
      {activeTab === 'blackhat_seo' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box 1: Blackhat SEO Question Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-violet-400 mb-2 flex items-center gap-2">
              Blackhat SEO & Algorithm Alchemy
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Consult the Algorithm Alchemist to exploit crawling behaviors, optimize content structure, analyze indexing networks, and design high-powered semantic structures to climb the search rankings.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Algorithm Strategy Query
                </label>
                <textarea
                  value={seoQuestion}
                  onChange={(e) => setSeoQuestion(e.target.value)}
                  placeholder="e.g., How do I structure my semantic content hubs to maximize crawl budget efficiency?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-violet-500/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultSEO(seoQuestion)}
                  disabled={!seoQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(109,40,217,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult SEO Alchemist
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: SEO Scenarios */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              Semantic Network & Algorithm Scenarios
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-google-sans">
              Select an algorithmic scenario below to explore crawling patterns, semantic hub frameworks, and search engine optimization formulas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: "Parasite SEO Alignment",
                  prompt: "How can I align and structure hosted content on highly authoritative platforms to leverage legacy authority for competitive keywords without triggering manual review loops?"
                },
                {
                  title: "Expired Domain Resurrection",
                  prompt: "What semantic strategy is required to breathe crawl authority into a newly acquired auction domain while diagnosing and cleansing legacy algorithmic flags or negative link profiles?"
                },
                {
                  title: "Semantic Loop Inflation",
                  prompt: "How can I construct an inter-linked, automated semantic keyword architecture that naturally targets long-tail search intent without manual article curation?"
                },
                {
                  title: "Instant Crawl Indexing Injection",
                  prompt: "My new technical hubs are stuck in search engine discovery limbo. What white-hat and advanced technical API indexing protocols force immediate database ingestion?"
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConsultSEO(item.prompt)}
                  className="text-left p-4 rounded-xl bg-black border border-zinc-900 hover:border-violet-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-violet-400 font-semibold mb-1 group-hover:text-violet-300">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-google-sans">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: LEFT HAND PATH */}
      {activeTab === 'left_hand_path' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box 1: Left Hand Path Question Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-amber-500 mb-2 flex items-center gap-2">
              The Left Hand Path: Esoteric Self-Sovereignty
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Seek counseling on internal self-deification, direct spiritual willpower, integrating shadow work, breaking free from collective dogmatic structures, and forging your sovereign trajectory.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Inquiry of Individual Will
                </label>
                <textarea
                  value={lhpQuestion}
                  onChange={(e) => setLhpQuestion(e.target.value)}
                  placeholder="e.g., How do I align my conscious goals with my deepest unconscious shadows to cultivate raw personal power?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultLHP(lhpQuestion)}
                  disabled={!lhpQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(217,119,6,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult LHP Magus
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: LHP Scenarios */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              Esoteric Initiations & Inquiries
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-google-sans">
              Choose an esoteric initiation or inquiry below to explore shadow work formulas, shattering societal conditioning, and absolute sovereignty of the will.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: "Esoteric Shadow Synthesis",
                  prompt: "How can I embrace and synthesize my deepest shadow elements to act as raw psychological fuel for absolute self-actualization, rather than suppressing them?"
                },
                {
                  title: "Shattering Dogmatic Conditioning",
                  prompt: "What intellectual process or sovereign practice helps dissolve ancestral and societal conditioning to achieve true independence of mind and direct agency?"
                },
                {
                  title: "Cultivating Will-Inscribed Reality",
                  prompt: "How can I construct an unwavering, focused personal Will to accomplish major aspirations when outer social circles expect compliance and comfort?"
                },
                {
                  title: "Strategic Adversarial Initiation",
                  prompt: "I am facing intense hostility or a major bottleneck. How do I strategically transform this adversarial obstacle into an initiation catalyst that hardens my capability?"
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConsultLHP(item.prompt)}
                  className="text-left p-4 rounded-xl bg-black border border-zinc-900 hover:border-amber-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-amber-500 font-semibold mb-1 group-hover:text-amber-400">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-google-sans">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SUFI HARMONY SAGE */}
      {activeTab === 'sufi' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box 1: Sufi Question Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-2">
              Sufi Harmony Sage: Inner Peace & Alignment
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Consult the Sage for guidance on opening the heart center, finding inner stillness, practicing mindfulness, and cultivating spiritual harmony amidst a chaotic world.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Inquiry for Inner Stillness
                </label>
                <textarea
                  value={sufiQuestion}
                  onChange={(e) => setSufiQuestion(e.target.value)}
                  placeholder="e.g., How do I maintain a centered heart when I am constantly bombarded by external pressures and conflicts?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultSufi(sufiQuestion)}
                  disabled={!sufiQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(29,78,216,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult Sufi Sage
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: Sufi Scenarios */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              Inner Peace & Spiritual Prompts
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-google-sans">
              Choose a scenario below to seek wisdom on heart-centered living and meditative stillness.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: "Cultivating Heart Centeredness",
                  prompt: "How can I practice active heart-centeredness throughout a workday filled with transactional demands and competitive pressures?"
                },
                {
                  title: "Transcending Inner Chaos",
                  prompt: "My mind feels perpetually cluttered and reactive. What specific meditative approach helps me find the 'still point' in the middle of this chaos?"
                },
                {
                  title: "Spiritual Surrender vs Will",
                  prompt: "How do I balance the Sufi practice of graceful surrender with my need to exert disciplined, proactive Will to achieve my worldly goals?"
                },
                {
                  title: "Deep Listening",
                  prompt: "How can I cultivate the capacity for 'Deep Listening' to truly understand others without letting my own mental projections and judgments intervene?"
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConsultSufi(item.prompt)}
                  className="text-left p-4 rounded-xl bg-black border border-zinc-900 hover:border-blue-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-blue-400 font-semibold mb-1 group-hover:text-blue-300">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-google-sans">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: VOODOO PRIESTESS */}
      {activeTab === 'voodoo' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Box 1: Voodoo Question Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-yellow-500 mb-2 flex items-center gap-2">
              Voodoo Priestess: Roots, Rhythms & Protection
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-google-sans leading-relaxed">
              Consult the Priestess regarding ancestral guidance, protection from harmful energy, rhythmic realignment, cleansing rituals, and deep communion with the spirits of the earth.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-zinc-500 mb-1.5">
                  Your Inquiry to the Priestess
                </label>
                <textarea
                  value={voodooQuestion}
                  onChange={(e) => setVoodooQuestion(e.target.value)}
                  placeholder="e.g., How do I protect my personal energy and home environment from lingering harmful influences I encounter in my professional environment?"
                  rows={3}
                  className="w-full bg-black border border-zinc-900 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-yellow-500/50 font-google-sans resize-none"
                />
              </div>

              <div className="flex justify-end font-mono">
                <button
                  onClick={() => handleConsultVoodoo(voodooQuestion)}
                  disabled={!voodooQuestion.trim()}
                  className="px-5 py-2.5 rounded-xl bg-yellow-700 hover:bg-yellow-800 text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(202,138,4,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Consult Priestess
                </button>
              </div>
            </div>
          </div>

          {/* Box 2: Voodoo Scenarios */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              Rituals, Rhythms & Ancestral Prompts
            </h3>
            <p className="text-xs text-zinc-500 mb-4 font-google-sans">
              Choose a scenario below to explore spiritual protection, ancestral connection, and energetic cleansing.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[
                {
                  title: "Cleansing Lingering Energies",
                  prompt: "I feel weighed down by external negativity. What practical cleansing ritual can I perform to clear my spirit and restore my natural protective rhythm?"
                },
                {
                  title: "Ancestral Connection",
                  prompt: "How can I open a dialogue with my ancestors to seek clarity on a generational pattern that is hindering my current progress?"
                },
                {
                  title: "Spiritual Protection",
                  prompt: "I am working in a high-stress, toxic environment. What foundational protective practices or rhythmic habits should I adopt to remain energetically armored?"
                },
                {
                  title: "Rhythmic Realignment",
                  prompt: "I have lost my personal drive and feel out of sync. How do I reconnect with the primal rhythms of my spirit to reclaim my power?"
                }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleConsultVoodoo(item.prompt)}
                  className="text-left p-4 rounded-xl bg-black border border-zinc-900 hover:border-yellow-500/40 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-[10px] font-mono uppercase text-yellow-500 font-semibold mb-1 group-hover:text-yellow-400">
                    {item.title}
                  </div>
                  <p className="text-xs text-zinc-400 group-hover:text-zinc-200 leading-relaxed font-google-sans">
                    "{item.prompt}"
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
