/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const BACKEND_URL = 'https://ai-studio-laevus2000.onrender.com';

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
    mode?: 'laevus' | 'tarot' | 'tarot-persona' | 'tarot-physical';
    tarotCards?: { name: string; position: 'Past' | 'Present' | 'Future' | 'Follow-up' | string; description: string; meaning?: string; symbol?: string }[];
    tarotQuestion?: string;
    followUpQuestion?: string;
    readingCount?: number;
    personaCardName?: string;
    persona?: string;
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

export async function generatePersonaTtsAudio(text: string, persona: string): Promise<string | null> {
  try {
    const data = await fetchFromProxy('/api/gemini/tts', { text, persona });
    return data.audio || null;
  } catch (err) {
    console.error("TTS generation error:", err);
    return null;
  }
}
