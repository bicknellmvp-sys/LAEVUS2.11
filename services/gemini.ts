/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

async function fetchFromProxy(endpoint: string, body: any) {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed request.');
  }
  return data;
}

export async function bringToLife(prompt: string, fileBase64?: string, mimeType?: string): Promise<string> {
  try {
    const data = await fetchFromProxy('/api/gemini/bring-to-life', { prompt, fileBase64, mimeType });
    return data.text || "<!-- Failed to generate content -->";
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    return "<!-- Network or API Error -->\n<div class=\"p-6 text-center font-mono text-zinc-400\"><h3 class=\"text-[#DC143C] font-bold mb-2\">Sanctuary Connection Notice</h3><p class=\"text-xs\">Unable to reach the digital realm. Please verify server configuration.</p></div>";
  }
}

export async function chatWithPersona(
  message: string,
  history: { role: 'user' | 'model'; text: string }[],
  creationName: string,
  creationHtml: string,
  mode: 'creator' | 'persona'
): Promise<string> {
  try {
    const data = await fetchFromProxy('/api/gemini/chat', { message, history, creationName, creationHtml, mode });
    return data.text || "I'm here, but I couldn't formulate a response. Let's try again!";
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return "The digital currents encountered a momentary network disturbance. Please try again.";
  }
}

export async function metaphysicalConsultation(
  message: string,
  history: { role: 'user' | 'model'; text: string }[],
  options: {
    mode?: 'laevus' | 'tarot' | 'tarot-persona' | 'tarot-physical' | 'round-table';
    tarotCards?: { name: string; position: 'Past' | 'Present' | 'Future' | 'Follow-up' | string; description: string; meaning?: string; symbol?: string }[];
    tarotQuestion?: string;
    followUpQuestion?: string;
    readingCount?: number;
    personaCardName?: string;
    persona?: string;
    roundTableQuestion?: string;
    activeSovereigns?: string[];
  }
): Promise<string> {
  try {
    const data = await fetchFromProxy('/api/gemini/consultation', { message, history, options });
    return data.text || "The digital spirits are silent... Try again.";
  } catch (error: any) {
    console.error("Metaphysical Chat Error:", error);
    return "The spiritual currents are experiencing a temporary network disturbance. Please try again.";
  }
}

export async function conveneSovereignRoundTable(
  question: string,
  activeSovereigns?: string[]
): Promise<string> {
  return metaphysicalConsultation(
    question,
    [],
    {
      mode: 'round-table',
      roundTableQuestion: question,
      activeSovereigns
    }
  );
}

export async function generatePersonaTtsAudio(text: string, persona: string): Promise<string | null> {
  try {
    const data = await fetchFromProxy('/api/gemini/tts', { text, persona });
    return data.audio || null;
  } catch (err) {
    console.error("TTS generation error:", err);
    return null;
  }
}

export function fallbackExtract3Sentences(readingText: string): { sentences: string[]; summary: string } {
  const cleaned = readingText
    .replace(/^#+.*$/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  const rawSentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim().replace(/^[-•\d.]+\s*/, ''))
    .filter(s => s.length > 20 && !s.toLowerCase().startsWith('welcome') && !s.toLowerCase().startsWith('greetings'));

  let s1 = "";
  let s2 = "";
  let s3 = "";

  if (rawSentences.length >= 3) {
    s1 = rawSentences[0];
    const midIdx = Math.floor(rawSentences.length / 2);
    s2 = rawSentences[midIdx];
    s3 = rawSentences[rawSentences.length - 1];
  } else if (rawSentences.length === 2) {
    s1 = rawSentences[0];
    s2 = rawSentences[1];
    s3 = "Integrate these insights with resolute focus to command your sovereign path forward.";
  } else if (rawSentences.length === 1) {
    s1 = rawSentences[0];
    s2 = "A pivotal threshold now demands deliberate discernment over inherited habits.";
    s3 = "Anchor your intent firmly to navigate the unfolding current with sovereign composure.";
  } else {
    s1 = "The underlying foundation reveals an essential period of internal re-alignment.";
    s2 = "Active forces present a catalyst challenging your habitual perceptions.";
    s3 = "Decisive personal sovereignty remains your clearest guide toward triumph.";
  }

  const sentences = [s1, s2, s3];
  return {
    sentences,
    summary: sentences.join(' ')
  };
}

export async function generateReadingSummary(
  readingText: string,
  context?: {
    type?: string;
    question?: string;
    items?: string[];
  }
): Promise<{ sentences: string[]; summary: string }> {
  try {
    const data = await fetchFromProxy('/api/gemini/summarize-reading', { readingText, context });
    if (data.sentences && Array.isArray(data.sentences) && data.sentences.length > 0) {
      return {
        sentences: data.sentences,
        summary: data.summary || data.sentences.join(' ')
      };
    }
    throw new Error("Invalid format from summary endpoint");
  } catch (err) {
    console.warn("Generating summary with client-side heuristic fallback:", err);
    return fallbackExtract3Sentences(readingText);
  }
}

