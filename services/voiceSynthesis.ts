// Voice Synthesis & Persona Configuration Service for LAEVUS
import { generatePersonaTtsAudio } from './gemini';

export type PersonaId = 'Madame Blavatsky' | 'Laevus' | 'Khan' | 'Marie';

export interface PersonaProfile {
  id: PersonaId;
  title: string;
  accent: string;
  tone: string;
  description: string;
  defaultPitch: number;
  defaultSpeed: number;
  voiceGender: 'female' | 'male' | 'neutral';
  preferredLang?: string;
  systemPromptDirective: string;
}

export interface VoiceSettings {
  enabled: boolean;
  persona: PersonaId;
  pitch: number;
  speed: number;
  sttEnabled: boolean;
  userVoiceMode: 'actual' | 'cloned' | 'default';
  clonedPitch: number;
  clonedSpeed: number;
  autoSendVoice: boolean;
  preferredExportFormat: 'doc' | 'pdf' | 'mp3';
}

export const PERSONA_PROFILES: Record<PersonaId, PersonaProfile> = {
  'Madame Blavatsky': {
    id: 'Madame Blavatsky',
    title: 'Madame Blavatsky',
    accent: 'Accentuated Russian accent, grounded tone',
    tone: 'Russian Accent / Grounded',
    description: 'Accentuated Russian accent with a grounded, contemplative delivery.',
    defaultPitch: 0.85,
    defaultSpeed: 0.90,
    voiceGender: 'female',
    preferredLang: 'en-GB',
    systemPromptDirective: 'Speak with an accentuated Russian accent and a grounded, perceptive tone.'
  },
  'Laevus': {
    id: 'Laevus',
    title: 'Laevus',
    accent: 'Older, weathered Southern American accent',
    tone: 'Southern American / Weathered',
    description: 'Older, weathered Southern American accent, deep, warm, and reflective.',
    defaultPitch: 0.78,
    defaultSpeed: 0.85,
    voiceGender: 'male',
    preferredLang: 'en-US',
    systemPromptDirective: 'Speak with an older, weathered Southern American accent, deep, warm, and reflective composure.'
  },
  'Khan': {
    id: 'Khan',
    title: 'Khan',
    accent: 'Subtle Chinese accent, commanding historical timbre',
    tone: 'Commanding / Subtle Chinese Accent',
    description: 'Subtle Chinese accent with a commanding and disciplined historical timbre.',
    defaultPitch: 0.75,
    defaultSpeed: 0.90,
    voiceGender: 'male',
    preferredLang: 'en-US',
    systemPromptDirective: 'Speak with a subtle Chinese accent, commanding and disciplined historical timbre.'
  },
  'Marie': {
    id: 'Marie',
    title: 'Marie',
    accent: 'Slight French accent',
    tone: 'French Accent / Elegant',
    description: 'Slight French accent with elegant, lucid clarity.',
    defaultPitch: 1.05,
    defaultSpeed: 0.92,
    voiceGender: 'female',
    preferredLang: 'en-GB',
    systemPromptDirective: 'Speak with a slight French accent, poised, articulate, and elegant.'
  }
};

export const PERSONA_SAMPLES: Record<PersonaId, string> = {
  'Madame Blavatsky': 'Greetings. I am Madame Blavatsky. Truth is the sovereign light behind all veiled mysteries.',
  'Laevus': 'Welcome, friend. I am Laevus. Time moves like a deep river, carrying ancient wisdom in its quiet currents.',
  'Khan': 'I am Khan. Strategy, discipline, and unyielding focus pave the true path to victory.',
  'Marie': 'Bonjour. I am Marie. Reason and luminous clarity illuminate even the darkest questions.'
};

const STORAGE_KEY = 'laevus_voice_settings_v3';

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  enabled: true,
  persona: 'Madame Blavatsky',
  pitch: 0.85,
  speed: 0.90,
  sttEnabled: true,
  userVoiceMode: 'cloned',
  clonedPitch: 1.0,
  clonedSpeed: 1.0,
  autoSendVoice: false,
  preferredExportFormat: 'mp3'
};

export const getSavedVoiceSettings = (): VoiceSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VOICE_SETTINGS;
    const parsed = JSON.parse(raw);
    const persona: PersonaId = PERSONA_PROFILES[parsed.persona as PersonaId]
      ? (parsed.persona as PersonaId)
      : DEFAULT_VOICE_SETTINGS.persona;

    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_VOICE_SETTINGS.enabled,
      persona,
      pitch: typeof parsed.pitch === 'number' ? Math.max(0.5, Math.min(1.8, parsed.pitch)) : PERSONA_PROFILES[persona].defaultPitch,
      speed: typeof parsed.speed === 'number' ? Math.max(0.5, Math.min(1.8, parsed.speed)) : PERSONA_PROFILES[persona].defaultSpeed,
      sttEnabled: typeof parsed.sttEnabled === 'boolean' ? parsed.sttEnabled : DEFAULT_VOICE_SETTINGS.sttEnabled,
      userVoiceMode: ['actual', 'cloned', 'default'].includes(parsed.userVoiceMode) ? parsed.userVoiceMode : DEFAULT_VOICE_SETTINGS.userVoiceMode,
      clonedPitch: typeof parsed.clonedPitch === 'number' ? parsed.clonedPitch : DEFAULT_VOICE_SETTINGS.clonedPitch,
      clonedSpeed: typeof parsed.clonedSpeed === 'number' ? parsed.clonedSpeed : DEFAULT_VOICE_SETTINGS.clonedSpeed,
      autoSendVoice: typeof parsed.autoSendVoice === 'boolean' ? parsed.autoSendVoice : DEFAULT_VOICE_SETTINGS.autoSendVoice,
      preferredExportFormat: ['doc', 'pdf', 'mp3'].includes(parsed.preferredExportFormat) ? parsed.preferredExportFormat : DEFAULT_VOICE_SETTINGS.preferredExportFormat,
    };
  } catch {
    return DEFAULT_VOICE_SETTINGS;
  }
};

export const saveVoiceSettings = (settings: VoiceSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('laevus-voice-settings-changed', { detail: settings }));
    }
  } catch (err) {
    console.error('Failed to save voice settings:', err);
  }
};

// Global Speech Synthesis & Gemini TTS Controller
class VoiceEngine {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioSource: AudioBufferSourceNode | null = null;
  private isSpeakingState = false;
  private listeners: Set<(speaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.addEventListener('beforeunload', () => {
        this.stop();
      });
    }
  }

  public subscribe(listener: (speaking: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isSpeakingState);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isSpeakingState));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public stop(): void {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.currentAudioSource) {
        try {
          this.currentAudioSource.stop();
        } catch (e) {}
        this.currentAudioSource = null;
      }
      this.currentUtterance = null;
      this.isSpeakingState = false;
      this.notify();
    }
  }

  private cleanTextForSpeech(raw: string): string {
    return raw
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[MODE \d+\][^\n]*/gi, '')
      .replace(/\[Connected with [^\]]+\]/gi, '')
      .replace(/\[Embodied [^\]]+\]/gi, '')
      .replace(/\[\s*Ended session[^\]]*\]/gi, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/--+/g, ' ')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private selectVoice(persona: PersonaId): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const profile = PERSONA_PROFILES[persona];
    const englishVoices = voices.filter(v => v.lang.toLowerCase().startsWith('en') || v.lang.toLowerCase().includes('en-'));
    const pool = englishVoices.length > 0 ? englishVoices : voices;

    if (persona === 'Marie') {
      // Find female voice, preferably UK/British or Irish for elegant/refined cadence
      const premiumFemale = pool.find(v => /google|natural|premium/i.test(v.name) && /female|zira|samantha|victoria|moira|serena/i.test(v.name) && (v.lang.includes('GB') || v.lang.includes('IE') || v.lang.includes('US')));
      if (premiumFemale) return premiumFemale;
      const female = pool.find(v => /female|zira|samantha|victoria|moira|serena|karen/i.test(v.name));
      if (female) return female;
    } else if (persona === 'Madame Blavatsky') {
      // Find female voice, preferably UK/British or deeper tone
      const deepFemale = pool.find(v => /female|victoria|moira|hazel|karen/i.test(v.name) && v.lang.includes('GB'));
      if (deepFemale) return deepFemale;
      const female = pool.find(v => /female|zira|samantha|victoria|moira|serena|karen/i.test(v.name));
      if (female) return female;
    } else if (persona === 'Laevus') {
      const usMatch = pool.find(v => v.lang.toLowerCase().includes('en-us') || /united states|american|david|samantha/i.test(v.name));
      if (usMatch) return usMatch;
    } else if (persona === 'Khan') {
      const deepMatch = pool.find(v => /david|george|james|tom|male/i.test(v.name));
      if (deepMatch) return deepMatch;
    }

    if (profile.preferredLang) {
      const langMatches = pool.filter((v) => v.lang.toLowerCase().startsWith(profile.preferredLang!.toLowerCase().slice(0, 2)));
      if (langMatches.length > 0) return langMatches[0];
    }

    if (profile.voiceGender === 'female') {
      const femaleMatches = pool.filter((v) =>
        /female|zira|samantha|victoria|karen|moira|fiona|serena|stephanie|helena|kate|celine/i.test(v.name)
      );
      if (femaleMatches.length > 0) return femaleMatches[0];
    } else if (profile.voiceGender === 'male') {
      const maleMatches = pool.filter((v) =>
        /male|david|george|daniel|oliver|arthur|james|richard|tom/i.test(v.name)
      );
      if (maleMatches.length > 0) return maleMatches[0];
    }

    return pool[0] || null;
  }

  public async speak(text: string, customSettings?: Partial<VoiceSettings>): Promise<void> {
    if (typeof window === 'undefined') return;

    const settings = { ...getSavedVoiceSettings(), ...customSettings };
    if (!settings.enabled) return;

    this.stop();

    const clean = this.cleanTextForSpeech(text);
    if (!clean) return;

    // 1. Try Gemini TTS for authentic persona voice matching
    try {
      const base64Audio = await generatePersonaTtsAudio(clean, settings.persona);
      if (base64Audio) {
        this.isSpeakingState = true;
        this.notify();

        const binary = atob(base64Audio);
        const len = binary.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          const audioCtx = new AudioCtxClass({ sampleRate: 24000 });
          const audioBuffer = await audioCtx.decodeAudioData(bytes.buffer);
          const source = audioCtx.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioCtx.destination);

          source.onended = () => {
            this.isSpeakingState = false;
            this.currentAudioSource = null;
            this.notify();
          };

          source.start(0);
          this.currentAudioSource = source;
          return;
        }
      }
    } catch (err) {
      console.warn("Gemini TTS playback fallback to browser speech:", err);
    }

    // 2. Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      const truncated = clean.length > 1200 ? clean.slice(0, 1200) + '...' : clean;
      const utterance = new SpeechSynthesisUtterance(truncated);
      utterance.pitch = settings.pitch;
      utterance.rate = settings.speed;

      const selectedVoice = this.selectVoice(settings.persona);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => {
        this.isSpeakingState = true;
        this.notify();
      };

      utterance.onend = () => {
        this.isSpeakingState = false;
        this.currentUtterance = null;
        this.notify();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis notice:', e);
        this.isSpeakingState = false;
        this.currentUtterance = null;
        this.notify();
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }
  }

  public testVoice(settings: VoiceSettings): void {
    const profile = PERSONA_PROFILES[settings.persona] || PERSONA_PROFILES['Madame Blavatsky'];
    const sampleText = PERSONA_SAMPLES[settings.persona] || `Voice synthesis test for ${profile.title}.`;
    this.speak(sampleText, settings);
  }

  public playSample(persona: PersonaId, customSettings?: Partial<VoiceSettings>): void {
    const profile = PERSONA_PROFILES[persona] || PERSONA_PROFILES['Madame Blavatsky'];
    const sampleText = PERSONA_SAMPLES[persona] || `Voice synthesis test for ${profile.title}.`;
    this.speak(sampleText, {
      ...getSavedVoiceSettings(),
      persona,
      pitch: profile.defaultPitch,
      speed: profile.defaultSpeed,
      ...customSettings
    });
  }
}

export const voiceEngine = new VoiceEngine();
