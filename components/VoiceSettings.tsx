import React, { useState, useEffect } from 'react';
import { 
  VoiceSettings as VoiceSettingsType, 
  getSavedVoiceSettings, 
  saveVoiceSettings, 
  PERSONA_PROFILES, 
  PERSONA_SAMPLES,
  PersonaId,
  voiceEngine 
} from '../services/voiceSynthesis';

interface VoiceSettingsProps {}

export const VoiceSettings: React.FC<VoiceSettingsProps> = () => {
  const [settings, setSettings] = useState<VoiceSettingsType>(getSavedVoiceSettings());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeakingPersona, setActiveSpeakingPersona] = useState<PersonaId | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const unsubscribe = voiceEngine.subscribe((speaking) => {
      setIsSpeaking(speaking);
      if (!speaking) {
        setActiveSpeakingPersona(null);
      }
    });
    return () => {
      unsubscribe();
      voiceEngine.stop();
    };
  }, []);

  const handleUpdate = (updated: Partial<VoiceSettingsType>) => {
    const next = { ...settings, ...updated };
    if (next.enabled === false) {
      voiceEngine.stop();
    }
    setSettings(next);
    saveVoiceSettings(next);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const handlePersonaSelect = (personaId: PersonaId, triggerSample = true) => {
    const profile = PERSONA_PROFILES[personaId];
    // Auto-enable audio output when user selects or tests a persona
    const shouldEnable = !settings.enabled && triggerSample ? true : settings.enabled;
    const next: VoiceSettingsType = {
      ...settings,
      enabled: shouldEnable,
      persona: personaId,
      pitch: profile.defaultPitch,
      speed: profile.defaultSpeed
    };
    setSettings(next);
    saveVoiceSettings(next);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);

    if (triggerSample && shouldEnable) {
      setActiveSpeakingPersona(personaId);
      voiceEngine.playSample(personaId, { pitch: profile.defaultPitch, speed: profile.defaultSpeed });
    }
  };

  const handlePlaySampleOnly = (e: React.MouseEvent, personaId: PersonaId) => {
    e.stopPropagation();
    const profile = PERSONA_PROFILES[personaId];
    
    // Auto enable audio output if it was muted
    if (!settings.enabled) {
      handleUpdate({ enabled: true });
    }

    if (isSpeaking && activeSpeakingPersona === personaId) {
      voiceEngine.stop();
      setActiveSpeakingPersona(null);
    } else {
      setActiveSpeakingPersona(personaId);
      voiceEngine.playSample(personaId, { pitch: profile.defaultPitch, speed: profile.defaultSpeed });
    }
  };

  const handleTestVoice = () => {
    if (!settings.enabled) return;
    if (isSpeaking) {
      voiceEngine.stop();
      setActiveSpeakingPersona(null);
    } else {
      setActiveSpeakingPersona(settings.persona);
      voiceEngine.testVoice(settings);
    }
  };

  const handleResetSliders = () => {
    const profile = PERSONA_PROFILES[settings.persona];
    const next: VoiceSettingsType = {
      ...settings,
      pitch: profile.defaultPitch,
      speed: profile.defaultSpeed
    };
    setSettings(next);
    saveVoiceSettings(next);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1500);
  };

  const personaList: { id: PersonaId; symbol: string }[] = [
    { id: 'Madame Blavatsky', symbol: '✦' },
    { id: 'Laevus', symbol: '◇' },
    { id: 'Khan', symbol: '⚖' },
    { id: 'Marie', symbol: '⸎' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 sm:px-6 my-2 animate-fadeIn font-google-sans text-zinc-200 select-text space-y-8">
      
      {/* Top Header Box Container */}
      <div className="bg-black border border-zinc-900 p-5 sm:p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#DC143C] font-semibold flex items-center gap-1.5">
                <span>✦</span> VOICE & SPEECH CONFIGURATION
              </span>
              {savedNotice && (
                <span className="text-[10px] font-mono text-emerald-400 animate-fadeIn">
                  · SAVED
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-syne text-[#F8F7F4] tracking-tight">
              Voice Options
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xl font-google-sans leading-relaxed">
              Configure voice synthesis personas, acoustic pitch, speech rate, and microphone dictation preferences for consultations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Dictation Input Toggle */}
            <button
              onClick={() => handleUpdate({ sttEnabled: !settings.sttEnabled })}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                settings.sttEnabled
                  ? 'bg-zinc-950 border-zinc-700 text-zinc-200'
                  : 'bg-zinc-950 border-zinc-900 text-zinc-600 opacity-60 hover:opacity-100 hover:text-zinc-400'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${settings.sttEnabled ? 'bg-emerald-400' : 'bg-zinc-700'}`}></span>
              <span>Microphone: {settings.sttEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {/* Voice Power Toggle (Audio Output: ACTIVE / MUTED) */}
            <button
              onClick={() => handleUpdate({ enabled: !settings.enabled })}
              className={`px-3.5 py-1.5 rounded-lg border text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                settings.enabled
                  ? 'bg-zinc-950 border-[#DC143C]/80 text-zinc-100 shadow-[0_0_15px_rgba(220,20,60,0.12)]'
                  : 'bg-zinc-950 border-amber-900/60 text-amber-400/90'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${settings.enabled ? 'bg-[#DC143C]' : 'bg-amber-500'}`}></span>
              <span>Audio Output: {settings.enabled ? 'ACTIVE' : 'MUTED'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Voice Personas */}
      <div className={`space-y-4 transition-all duration-300 ${!settings.enabled ? 'opacity-40 grayscale-[40%]' : ''}`}>
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <span className="text-xs font-syne font-bold uppercase tracking-widest text-[#F8F7F4] flex items-center gap-2">
            <span className="text-[#DC143C]">✦</span> Voice Personas
          </span>
          <div className="flex items-center gap-2">
            {!settings.enabled && (
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                [Audio Muted]
              </span>
            )}
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
              SELECTED: <span className="text-[#DC143C] font-semibold">{settings.persona}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {personaList.map(({ id, symbol }) => {
            const profile = PERSONA_PROFILES[id];
            const sampleText = PERSONA_SAMPLES[id];
            const isSelected = settings.persona === id;
            const isPersonaPlaying = isSpeaking && activeSpeakingPersona === id;

            return (
              <div
                key={id}
                onClick={() => handlePersonaSelect(id, true)}
                className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? settings.enabled
                      ? 'bg-black border-[#DC143C] shadow-[0_0_25px_rgba(220,20,60,0.18)] ring-1 ring-[#DC143C]/50'
                      : 'bg-black border-zinc-700/80 shadow-none'
                    : 'bg-black border-zinc-900 hover:border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[11px] font-mono font-semibold flex items-center gap-1.5 ${settings.enabled ? 'text-[#DC143C]' : 'text-zinc-500'}`}>
                      <span>{symbol}</span>
                      <span className="uppercase tracking-widest font-syne text-[#F8F7F4] text-sm">
                        {profile.title}
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      {isPersonaPlaying && (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-[#DC143C] uppercase tracking-wider bg-[#DC143C]/10 px-2 py-0.5 rounded border border-[#DC143C]/30 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]"></span> Speaking
                        </span>
                      )}
                      {isSelected && !isPersonaPlaying && (
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-semibold tracking-widest ${
                          settings.enabled
                            ? 'bg-[#DC143C]/15 border border-[#DC143C]/40 text-[#DC143C]'
                            : 'bg-zinc-800/50 border border-zinc-700 text-zinc-400'
                        }`}>
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                    {profile.accent}
                  </div>

                  <p className="text-xs text-zinc-400/90 mt-2.5 leading-relaxed font-google-sans">
                    {profile.description}
                  </p>

                  {/* Sample quote box */}
                  <div className="mt-3 p-2.5 rounded-lg bg-zinc-950 border border-zinc-900 text-[11px] text-zinc-300 font-mono italic leading-relaxed flex items-start gap-2">
                    <span className={settings.enabled ? 'text-[#DC143C] not-italic' : 'text-zinc-600 not-italic'}>“</span>
                    <span className="flex-1">{sampleText}</span>
                    <span className={settings.enabled ? 'text-[#DC143C] not-italic' : 'text-zinc-600 not-italic'}>”</span>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span>Pitch: {profile.defaultPitch.toFixed(2)}x</span>
                    <span aria-hidden="true" className="text-zinc-800">·</span>
                    <span>Rate: {profile.defaultSpeed.toFixed(2)}x</span>
                    <span aria-hidden="true" className="text-zinc-800">·</span>
                    <span className="text-zinc-400">{profile.voiceGender.toUpperCase()}</span>
                  </div>

                  {/* Play Sample Button */}
                  <button
                    onClick={(e) => handlePlaySampleOnly(e, id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isPersonaPlaying
                        ? 'bg-[#DC143C] text-[#F8F7F4] border-[#DC143C]'
                        : settings.enabled
                        ? 'bg-black hover:bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                        : 'bg-black text-zinc-500 border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    <span>{isPersonaPlaying ? '■ Stop' : '▶ Sample'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Pitch & Speed Calibration */}
      <div className={`space-y-5 pt-2 border-t border-zinc-900 transition-all duration-300 ${!settings.enabled ? 'opacity-40 grayscale-[40%] pointer-events-none' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-900">
          <div>
            <div className="text-xs font-syne font-bold uppercase tracking-widest text-[#F8F7F4] flex items-center gap-2">
              <span className={settings.enabled ? 'text-[#DC143C]' : 'text-zinc-600'}>✦</span> Pitch & Speed Calibration
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-google-sans">
              Fine-tune the fundamental pitch frequency and speech rate for spoken responses.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              onClick={handleResetSliders}
              disabled={!settings.enabled}
              className="text-[10px] font-mono uppercase text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer border border-transparent hover:border-zinc-800 px-2 py-1 rounded disabled:cursor-not-allowed"
            >
              Reset Defaults
            </button>

            <button
              onClick={handleTestVoice}
              disabled={!settings.enabled}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider transition-all border flex items-center gap-2 ${
                !settings.enabled
                  ? 'bg-black text-zinc-600 border-zinc-900 cursor-not-allowed'
                  : isSpeaking
                  ? 'bg-black text-[#DC143C] border-[#DC143C] cursor-pointer'
                  : 'bg-black hover:bg-zinc-950 text-zinc-200 border-zinc-800 cursor-pointer'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-[#DC143C] animate-ping' : settings.enabled ? 'bg-zinc-400' : 'bg-zinc-700'}`}></span>
              <span>{isSpeaking ? 'Stop Audio Test' : 'Test Voice Output'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black border border-zinc-900 p-5 rounded-xl">
          {/* Pitch Control */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className={settings.enabled ? 'text-[#DC143C]' : 'text-zinc-600'}>◇</span> Vocal Pitch
              </label>
              <span className={`text-xs font-mono font-bold ${settings.enabled ? 'text-[#DC143C]' : 'text-zinc-500'}`}>
                {settings.pitch.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              disabled={!settings.enabled}
              value={settings.pitch}
              onChange={(e) => handleUpdate({ pitch: parseFloat(e.target.value) })}
              className="w-full accent-[#DC143C] bg-zinc-950 h-1 rounded-lg appearance-none cursor-pointer border border-zinc-900 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
              <span>0.50x Low Frequency</span>
              <span>1.00x Baseline</span>
              <span>1.80x High Frequency</span>
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-xs font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className={settings.enabled ? 'text-[#DC143C]' : 'text-zinc-600'}>◇</span> Speech Rate
              </label>
              <span className={`text-xs font-mono font-bold ${settings.enabled ? 'text-[#DC143C]' : 'text-zinc-500'}`}>
                {settings.speed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.05"
              disabled={!settings.enabled}
              value={settings.speed}
              onChange={(e) => handleUpdate({ speed: parseFloat(e.target.value) })}
              className="w-full accent-[#DC143C] bg-zinc-950 h-1 rounded-lg appearance-none cursor-pointer border border-zinc-900 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-600 uppercase">
              <span>0.50x Deliberate Pace</span>
              <span>1.00x Baseline</span>
              <span>1.80x Accelerated Pace</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Speech Synthesis Engine */}
      <div className="space-y-3 pt-2 border-t border-zinc-900">
        <div className="text-xs font-syne font-bold uppercase tracking-widest text-[#F8F7F4] flex items-center gap-2">
          <span className="text-[#DC143C]">✦</span> Speech Synthesis Engine
        </div>
        <p className="text-xs text-zinc-400 font-google-sans">
          Select the generation system used for character readings. Gemini AI Voice streams advanced neural audio (subject to daily limits). System Web Speech uses your browser's local, built-in synthesis (unlimited and free).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => handleUpdate({ ttsEngine: 'gemini' })}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.ttsEngine === 'gemini'
                ? 'bg-black border-[#DC143C] text-white shadow-[0_0_15px_rgba(220,20,60,0.12)]'
                : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span>Gemini AI Voice</span>
              {settings.ttsEngine === 'gemini' && <span className="text-[#DC143C] text-[10px]">✦</span>}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-google-sans">
              High-fidelity neural voice streaming (Uses Google's Gemini TTS)
            </div>
          </button>

          <button
            onClick={() => handleUpdate({ ttsEngine: 'browser' })}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.ttsEngine === 'browser'
                ? 'bg-black border-[#DC143C] text-white shadow-[0_0_15px_rgba(220,20,60,0.12)]'
                : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span>System Web Speech</span>
              {settings.ttsEngine === 'browser' && <span className="text-[#DC143C] text-[10px]">✦</span>}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-google-sans">
              Local client-side browser speech synthesis (Free, offline-capable)
            </div>
          </button>
        </div>
      </div>

      {/* SECTION 3: Export Speech Mode */}
      <div className="space-y-3 pt-2 border-t border-zinc-900">
        <div className="text-xs font-syne font-bold uppercase tracking-widest text-[#F8F7F4] flex items-center gap-2">
          <span className="text-[#DC143C]">✦</span> Audio Export Speech Synthesis Mode
        </div>
        <p className="text-xs text-zinc-400 font-google-sans">
          Select the speech synthesis mode applied to user dialogue when generating downloadable audio transcripts.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <button
            onClick={() => handleUpdate({ userVoiceMode: 'actual' })}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.userVoiceMode === 'actual'
                ? 'bg-black border-[#DC143C] text-white shadow-[0_0_15px_rgba(220,20,60,0.12)]'
                : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span>Microphone Audio</span>
              {settings.userVoiceMode === 'actual' && <span className="text-[#DC143C] text-[10px]">✦</span>}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-google-sans">
              Direct recording captured from your microphone input
            </div>
          </button>

          <button
            onClick={() => handleUpdate({ userVoiceMode: 'cloned' })}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.userVoiceMode === 'cloned'
                ? 'bg-black border-[#DC143C] text-white shadow-[0_0_15px_rgba(220,20,60,0.12)]'
                : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span>Modulated Synthesis</span>
              {settings.userVoiceMode === 'cloned' && <span className="text-[#DC143C] text-[10px]">✦</span>}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-google-sans">
              Synthesized audio matching user acoustic profile
            </div>
          </button>

          <button
            onClick={() => handleUpdate({ userVoiceMode: 'default' })}
            className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
              settings.userVoiceMode === 'default'
                ? 'bg-black border-[#DC143C] text-white shadow-[0_0_15px_rgba(220,20,60,0.12)]'
                : 'bg-black border-zinc-900 text-zinc-400 hover:border-zinc-800'
            }`}
          >
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200 flex items-center justify-between">
              <span>System Speech</span>
              {settings.userVoiceMode === 'default' && <span className="text-[#DC143C] text-[10px]">✦</span>}
            </div>
            <div className="text-[11px] text-zinc-500 mt-1 font-google-sans">
              Standard web browser speech synthesis engine
            </div>
          </button>
        </div>
      </div>

      {/* Professional System Notice */}
      <div className="pt-4 border-t border-zinc-900 flex items-start gap-2.5 text-[11px] text-zinc-500 font-mono leading-relaxed">
        <span className="text-[#DC143C] text-xs">✦</span>
        <p>
          Speech synthesis is rendered client-side within your browser. Audio output settings can be toggled at any time to optimize system performance.
        </p>
      </div>

    </div>
  );
};
