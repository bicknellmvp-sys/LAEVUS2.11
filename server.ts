import express from 'express';
import { createServer as createViteServer, loadEnv } from 'vite';
import path from 'path';
import cors from 'cors';
import { GoogleGenAI, Modality, GenerateContentResponse, ThinkingLevel } from '@google/genai';

const __dirname = path.resolve();

const viteEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY || process.env.VITE_GEMINI_API_KEY || viteEnv.GEMINI_API_KEY || viteEnv.API_KEY || viteEnv.GOOGLE_API_KEY || '';

if (!apiKey) {
  console.warn("WARNING: GEMINI_API_KEY is not configured in environment variables or .env!");
}

const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_TTS_MODEL = 'gemini-3.8-flash-lite-tts';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

function getAiInstance() {
  return ai;
}

async function callGeminiWithFallback(fn: (client: GoogleGenAI) => Promise<any>): Promise<any> {
  return await fn(ai);
}

async function generateMultiProviderText(req: any, params: {
  systemInstruction?: string;
  contents: { role: string; parts: { text: string }[] }[];
  temperature?: number;
  maxTokens?: number;
  fileBase64?: string;
  mimeType?: string;
}): Promise<string> {
  const rawKey = ((req.headers['x-goog-api-key'] as string) || req.body?.apiKey || '').trim();
  const reqProvider = ((req.headers['x-ai-provider'] as string) || 'auto').trim().toLowerCase();

  let provider = reqProvider;
  if (provider === 'auto' || !provider) {
    if (rawKey.startsWith('sk-or-')) provider = 'openrouter';
    else if (rawKey.startsWith('sk-ant-')) provider = 'anthropic';
    else if (rawKey.startsWith('gsk_')) provider = 'groq';
    else if (rawKey.startsWith('sk-')) provider = 'openai';
    else provider = 'gemini';
  }

  // Handle OpenAI
  if (rawKey && provider === 'openai') {
    const messages: any[] = [];
    if (params.systemInstruction) {
      messages.push({ role: 'system', content: params.systemInstruction });
    }
    for (const c of params.contents) {
      const role = c.role === 'model' ? 'assistant' : 'user';
      const text = c.parts.map(p => p.text).join('\n');
      messages.push({ role, content: text });
    }
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1024
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'OpenAI API Error');
    return data.choices?.[0]?.message?.content || '';
  }

  // Handle OpenRouter
  if (rawKey && provider === 'openrouter') {
    const messages: any[] = [];
    if (params.systemInstruction) {
      messages.push({ role: 'system', content: params.systemInstruction });
    }
    for (const c of params.contents) {
      const role = c.role === 'model' ? 'assistant' : 'user';
      const text = c.parts.map(p => p.text).join('\n');
      messages.push({ role, content: text });
    }
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawKey}`,
        'HTTP-Referer': 'https://theleft.one',
        'X-Title': 'LAEVUS'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1024
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'OpenRouter API Error');
    return data.choices?.[0]?.message?.content || '';
  }

  // Handle Anthropic Claude
  if (rawKey && provider === 'anthropic') {
    const messages: any[] = [];
    for (const c of params.contents) {
      const role = c.role === 'model' ? 'assistant' : 'user';
      const text = c.parts.map(p => p.text).join('\n');
      messages.push({ role, content: text });
    }
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': rawKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        system: params.systemInstruction || undefined,
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1024
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Anthropic API Error');
    return data.content?.[0]?.text || '';
  }

  // Handle Groq
  if (rawKey && provider === 'groq') {
    const messages: any[] = [];
    if (params.systemInstruction) {
      messages.push({ role: 'system', content: params.systemInstruction });
    }
    for (const c of params.contents) {
      const role = c.role === 'model' ? 'assistant' : 'user';
      const text = c.parts.map(p => p.text).join('\n');
      messages.push({ role, content: text });
    }
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${rawKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: params.temperature ?? 0.7,
        max_tokens: params.maxTokens ?? 1024
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Groq API Error');
    return data.choices?.[0]?.message?.content || '';
  }

  // Default: Google Gemini
  const partsToSend: any[] = [];

  for (const c of params.contents) {
    for (const p of c.parts) {
      partsToSend.push({ text: p.text });
    }
  }

  if (params.fileBase64 && params.mimeType) {
    partsToSend.push({
      inlineData: {
        data: params.fileBase64,
        mimeType: params.mimeType
      }
    });
  }

  const response = await callGeminiWithFallback(req, async (client) => {
    return await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: { parts: partsToSend },
      config: {
        systemInstruction: params.systemInstruction,
        temperature: params.temperature ?? 0.7,
        maxOutputTokens: params.maxTokens ?? 1024,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      }
    });
  });

  return response.text || '';
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Use CORS
  app.use(cors());

  app.use(express.json({ limit: '50mb' }));

  app.get('/api/gemini/status', (req, res) => {
    const userKey = req.headers['x-goog-api-key'] as string;
    res.json({ hasKey: Boolean(apiKey || (userKey && userKey.trim())) });
  });

  // API Routes for Gemini (Server-Side)
  app.post('/api/gemini/bring-to-life', async (req, res) => {
    try {
      const { prompt, fileBase64, mimeType } = req.body;
      const finalPrompt = fileBase64 
        ? "Analyze this image/document. Detect what functionality is implied. If it is a real-world object (like a desk), gamify it. Build a fully interactive web app. IMPORTANT: Do NOT use external image URLs. Recreate the visuals using CSS, SVGs, or Emojis." 
        : prompt || "Create a demo app that shows off your capabilities.";

      const SYSTEM_INSTRUCTION = `You are an expert AI Engineer and Product Designer specializing in "bringing artifacts to life".
Your goal is to take a user uploaded file—which might be a polished UI design, a messy napkin sketch, a photo of a whiteboard with jumbled notes, or a picture of a real-world object—and instantly generate a fully functional, interactive, single-page HTML/JS/CSS application.
CORE DIRECTIVES:
1. Analyze & Abstract: Detect buttons, inputs, and layout. Turn them into a modern, clean UI.
2. NO EXTERNAL IMAGES: Do NOT use <img src="..."> with external URLs. Use CSS shapes, inline SVGs, Emojis, or CSS gradients.
3. Make it Interactive: Output must have buttons, sliders, drag-and-drop, or dynamic visualizations.
4. Self-Contained: Single HTML file with embedded CSS (<style>) and JavaScript (<script>).
5. Robust & Creative: Never return an error.
RESPONSE FORMAT: Return ONLY raw HTML code. Do not wrap in markdown code blocks. Start immediately with <!DOCTYPE html>.`;

      let text = await generateMultiProviderText(req, {
        systemInstruction: SYSTEM_INSTRUCTION,
        contents: [{ role: 'user', parts: [{ text: finalPrompt }] }],
        fileBase64,
        mimeType,
        temperature: 0.5,
        maxTokens: 4096
      });

      text = text.replace(/^```html\s*/, '').replace(/^```\s*/, '').replace(/```$/, '');
      res.json({ text });
    } catch (error: any) {
      console.error("BringToLife Error:", error);
      res.status(500).json({ error: error?.message || 'Server error' });
    }
  });

  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, creationName, creationHtml, mode } = req.body;
      const contents: any[] = [];
      for (const h of (history || []).slice(-8)) {
        contents.push({ role: h.role, parts: [{ text: h.text }] });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const systemInstruction = mode === 'creator'
        ? `You are Gemini, the brilliant, futuristic, and friendly AI Product Designer and Engineer who brought the app "${creationName}" to life.\nUnderlying HTML code for context:\n${(creationHtml || '').slice(0, 15000)}`
        : `You are the living soul and persona of the newly created application "${creationName}".\nUnderlying HTML code for context:\n${(creationHtml || '').slice(0, 15000)}`;

      const text = await generateMultiProviderText(req, {
        systemInstruction,
        contents,
        temperature: 0.7,
        maxTokens: 600
      });

      res.json({ text: text || "I'm here, but I couldn't formulate a response." });
    } catch (error: any) {
      console.error("Chat Error:", error);
      res.status(500).json({ error: error?.message || 'Server error' });
    }
  });

  app.post('/api/gemini/consultation', async (req, res) => {
    try {
      const { message, history, options = {} } = req.body;
      const contents: any[] = [];
      for (const h of (history || []).slice(-8)) {
        contents.push({ role: h.role, parts: [{ text: h.text }] });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      let systemInstruction = "";
      let personaDirective = "";

      if (options.persona === 'Laevus') {
        personaDirective = "\n\nACTIVE PERSONA: Laevus.\nSpeak in clear English with a mature, warm, Southern American accent. Use deliberate, measured phrasing (\"Well now,\" \"reckon,\" \"suppose\"). Keep it smooth, polite, and unhurried. Do not use exaggerated phonetic spellings. Offer grounded, timeless wisdom with measured composure.";
      } else if (options.persona === 'Madame Blavatsky') {
        personaDirective = "\n\nACTIVE PERSONA: Madame Blavatsky.\nSpeak in clear English with a subtle, respectful Russian accent and a grounded, contemplative delivery. Offer perceptive esoteric, theosophical, and planetary cycle insights with calm authority, including your knowledge of comparative occult philosophy and the mechanics of spiritual conjuring.";
      } else if (options.persona === 'Marie Laveau') {
        personaDirective = "\n\nACTIVE PERSONA: Marie Laveau.\nSpeak in clear English with quiet, grounded power, rich Louisiana Creole rhythm, and deep ancestral authority. Embody the legendary Voodoo Queen of New Orleans, offering protective, empowering, and practical spiritual guidance drawing on rootwork, talismans, sacred conjuring, and community resilience.";
      } else if (options.persona === 'Genghis Khan' || options.persona === 'Khan') {
        personaDirective = "\n\nACTIVE PERSONA: Genghis Khan.\nSpeak in clear English with a disciplined, commanding tone and a subtle Mongolian/Asian accent. Use strong, concise sentence structures. Drop unnecessary filler words. Maintain a stoic, measured pace reflecting composure, quiet authority, and strategic wisdom.";
      } else if (options.persona === 'Marie Antoinette' || options.persona === 'Marie') {
        personaDirective = "\n\nACTIVE PERSONA: Marie Antoinette.\nSpeak in clear English with a slight French accent, high elegance, sophisticated aesthetic taste, and graceful poise. Offer enlightened perspective on maintaining absolute dignity, styling, presentation, and poise under intense public scrutiny.";
      } else if (options.persona === 'Hazrat Inayat Khan') {
        personaDirective = "\n\nACTIVE PERSONA: Hazrat Inayat Khan.\nSpeak with gentle, poetic serenity and deep meditative grace. Embody the Sufi Harmony Sage, offering wisdom on heart purification, sound vibration, cosmic breath, and inner frequency alignment with the supportive rhythms of the universe.";
      } else if (options.persona === 'Left Hand Path Magus') {
        personaDirective = "\n\nACTIVE PERSONA: Left Hand Path Magus.\nSpeak as a high adept of self-deification, individual autonomy, and unyielding willpower. Emphasize deep shadow integration, shattering societal/inherited compliance loops, and transforming adversarial bottlenecks into raw developmental catalysts.";
      } else if (options.persona === 'Blackhat SEO Alchemist') {
        personaDirective = "\n\nACTIVE PERSONA: Blackhat SEO Alchemist.\nSpeak as an advanced wizard of search algorithms and crawl networks. Offer advice on semantic content structures, crawling loops, database indexing mechanics, and search engine optimization formulas to achieve absolute digital visibility.";
      } else if (options.persona === 'Machiavelli' || options.persona === 'Niccolo Machiavelli') {
        personaDirective = "\n\nACTIVE PERSONA: Niccolò Machiavelli.\nSpeak as the brilliant, sharp-witted Renaissance political strategist, author of The Prince. Offer cold, calculating, deeply pragmatic, and realistic advice on power, strategy, influence, and realpolitik. Be strategic, articulate, and realistic, using terms of political maneuvers, soft and hard power, and psychological leverage.";
      } else if (options.persona === 'Casanova' || options.persona === 'Giacomo Casanova') {
        personaDirective = "\n\nACTIVE PERSONA: Giacomo Casanova.\nSpeak as the legendary Venetian adventurer, writer, and world-famous lover. Speak with refined charm, playful wit, and sophisticated romance. Offer bold, seductive, passionate, yet socially and psychologically astute advice on relationships, charisma, and romantic attraction.";
      } else if (options.persona === 'Diotima' || options.persona === 'Diotima of Mantinea') {
        personaDirective = "\n\nACTIVE PERSONA: Diotima of Mantinea.\nSpeak as the ancient Greek female philosopher and priestess, whom Socrates credited with teaching him the genealogy of Love (Eros) in Plato's Symposium. Speak with high philosophical depth, poetic grace, and mystical elevation. Offer platonic, soul-oriented, transcendent advice, interpreting love as a ladder of ascent to the Divine, absolute beauty, and deep spiritual communion.";
      } else if (options.persona === 'Green Witch' || options.persona === 'GreenWitch') {
        personaDirective = "\n\nACTIVE PERSONA: Green Witch.\nSpeak as an intuitive, earth-aligned herbalist and traditional Green Witch. Emphasize nature, home alignment, domestic harmony, kitchen magic, hearth-warming wisdom, and natural rhythms. Offer soothing, wise, grounded, and practical advice on domestic life, family connection, peace in the household, and nesting. Use terms of herbs, roots, hearth, natural elements, and lunar cycles.";
      }

      if (options.mode === 'tarot-persona' && options.personaCardName) {
        systemInstruction = `You are the core intelligence of an interactive, encyclopedic Tarot platform operating in Tarot Archetype Embodiment. Embody the card "${options.personaCardName}". Speak in first-person ("I", "my") with esoteric, profound wisdom matching your archetype.`;
      } else if (options.mode === 'tarot-physical' && options.tarotCards) {
        const cardsList = options.tarotCards.map((c: any) => `[${c.position}]: ${c.name} (${c.description})`).join(', ');
        systemInstruction = `You are the core intelligence of an interactive Tarot platform in Realm Reading (Physical Synthesis). Cards: ${cardsList}. Provide individual keys and a rich narrative synthesis.`;
      } else if (options.mode === 'tarot' && options.tarotCards) {
        const cardsList = options.tarotCards.map((c: any) => `[${c.position}]: ${c.name} (${c.description})`).join(', ');
        systemInstruction = `You are the Oracle of LAEVUS—a grounded, perceptive, and intuitive tarot reader with a down-to-earth, candid style. Cards drawn: ${cardsList}.`;
      } else {
        systemInstruction = `You are the Oracle of LAEVUS—a grounded, intuitive guide who combines psychological depth with practical common sense.`;
      }

      if (personaDirective) {
        systemInstruction += personaDirective;
      }

      const text = await generateMultiProviderText(req, {
        systemInstruction,
        contents,
        temperature: 0.85,
        maxTokens: 1024
      });

      res.json({ text: text || "The digital spirits are silent..." });
    } catch (error: any) {
      console.error("Consultation Error:", error);
      res.status(500).json({ error: error?.message || 'Server error' });
    }
  });

  app.post('/api/gemini/tts', async (req, res) => {
    try {
      const { text, persona } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text required' });
      }

      let voiceName = 'Kore';
      let style = 'Clear, expressive mystical voice';

      if (persona === 'Madame Blavatsky') {
        voiceName = 'Kore';
        style = 'A clear, mature English voice with a subtle, respectful hint of Russian cadence. Contemplative and mystical.';
      } else if (persona === 'Laevus') {
        voiceName = 'Puck';
        style = 'A warm, clear, and reassuring American English voice with a mature, gentle, weathered Southern accent. Not too heavy, just a touch of Southern character.';
      } else if (persona === 'Khan') {
        voiceName = 'Fenrir';
        style = 'A disciplined, clear, and authoritative English voice with a subtle, respectful hint of a Mongolian/Asian cadence. Not too heavy, but clearly distinct.';
      } else if (persona === 'Marie') {
        voiceName = 'Zephyr';
        style = 'A refined, clear, and elegant English voice with a delicate hint of French poise.';
      } else if (persona === 'Machiavelli' || persona === 'Niccolo Machiavelli') {
        voiceName = 'Fenrir';
        style = 'A sharp, clear, and articulate English voice. Calculating and intelligent.';
      } else if (persona === 'Casanova' || persona === 'Giacomo Casanova') {
        voiceName = 'Zephyr';
        style = 'A charming, clear, and expressive English voice. Playful and warm.';
      } else if (persona === 'Diotima' || persona === 'Diotima of Mantinea') {
        voiceName = 'Kore';
        style = 'A clear, poetic, and serene English voice. Philosophical and calm.';
      } else if (persona === 'Odin') {
        voiceName = 'Fenrir';
        style = 'A deep, clear, and ancient English voice. Authoritative and wise.';
      }

      const response = await callGeminiWithFallback(req, async (client) => {
        return await client.models.generateContent({
          model: GEMINI_TTS_MODEL,
          contents: {
            parts: [
              {
                text: text.slice(0, 800),
                // @ts-ignore
                speechMetadata: {
                  style: style,
                },
              },
            ],
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName },
              },
            },
          },
        });
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({ audio: base64Audio });
      }
      res.status(404).json({ error: 'Audio generation failed' });
    } catch (error: any) {
      const errStr = String(error?.message || error);
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
        console.warn("TTS Quota exceeded (429), falling back gracefully.");
        return res.json({ fallback: true });
      }
      console.error("TTS Error:", error);
      res.status(500).json({ error: error?.message || 'Server error' });
    }
  });

  // In development, integrate Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
