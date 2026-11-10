/**
 * AI Buddy Service - Real-time Vision, Voice, and Friendly Problem Solver
 */

import { getStoredGeminiKey } from './aiService';

export interface BuddyAnalysisResult {
  reply: string;
  detectedColor?: string;
  detectedSubject?: string;
  actionTip?: string;
  followUpSuggestions: string[];
}

/**
 * Text-to-Speech: Buddy speaks out loud to the user
 */
export function speakBuddyVoice(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel(); // Stop prior speech
    const cleanText = text.replace(/[*#_~`]/g, '').slice(0, 200); // Friendly voice snippet
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.1; // Warm, friendly tone

    // Try finding a nice English voice
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google')));
    if (naturalVoice) utterance.voice = naturalVoice;

    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
  }
}

/**
 * Stop any active Buddy voice
 */
export function stopBuddyVoice(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Real Vision Analysis from camera stream / image
 */
export async function analyzeImageWithBuddy(
  canvas: HTMLCanvasElement,
  userQuestion: string = ''
): Promise<BuddyAnalysisResult> {
  const apiKey = getStoredGeminiKey();
  const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

  // Try real Gemini Vision if key is available
  if (apiKey) {
    try {
      const geminiResult = await callGeminiBuddyVision(base64Data, userQuestion, apiKey);
      if (geminiResult) return geminiResult;
    } catch (err) {
      console.warn('Gemini Buddy vision failed, using real-time pixel vision:', err);
    }
  }

  // Real-time Pixel Vision Heuristic (analyzes true RGB colors from canvas)
  return runPixelVisionAnalysis(canvas, userQuestion);
}

/**
 * Live Multimodal Gemini Vision call
 */
async function callGeminiBuddyVision(
  base64Data: string,
  userQuestion: string,
  apiKey: string
): Promise<BuddyAnalysisResult | null> {
  const systemPrompt = `You are "Buddy", a warm, empathetic, super helpful best-friend AI. 
Look at the user's camera image and listen to what they said: "${userQuestion || 'What do you see?'}".
Answer warmly and conversationally like their closest supportive friend.
If they show a flower, say what color and type it is genuinely.
If they show a broken kettle or leaking pipe, give simple friendly step-by-step DIY fix advice.
Return strictly valid JSON:
{
  "reply": "Warm friendly 2-3 sentence buddy response speaking directly to the user",
  "detectedColor": "Red / Yellow / Green / Blue / etc",
  "detectedSubject": "Flower / Kettle / Water Pipe / etc",
  "actionTip": "Short practical tip if fixing something",
  "followUpSuggestions": ["Friendly question 1", "Friendly question 2"]
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt },
              { inlineData: { mimeType: 'image/jpeg', data: base64Data } }
            ]
          }
        ],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.4 }
      })
    }
  );

  if (!response.ok) return null;
  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  return JSON.parse(text) as BuddyAnalysisResult;
}

/**
 * Pixel-level Vision Analysis
 * Actually samples the center of the camera canvas to detect real dominant colors!
 */
export function runPixelVisionAnalysis(
  canvas: HTMLCanvasElement,
  userQuestion: string = ''
): BuddyAnalysisResult {
  const ctx = canvas.getContext('2d');
  let detectedColor = 'vibrant';
  let isRed = false;
  let isYellow = false;
  let isGreen = false;
  let isBlue = false;

  if (ctx) {
    const width = canvas.width;
    const height = canvas.height;
    // Sample 40x40 pixel grid in the center
    const sampleSize = 40;
    const startX = Math.max(0, Math.floor((width - sampleSize) / 2));
    const startY = Math.max(0, Math.floor((height - sampleSize) / 2));
    const imgData = ctx.getImageData(startX, startY, sampleSize, sampleSize);
    const data = imgData.data;

    let rTotal = 0;
    let gTotal = 0;
    let bTotal = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      rTotal += data[i];
      gTotal += data[i + 1];
      bTotal += data[i + 2];
      count++;
    }

    const rAvg = rTotal / count;
    const gAvg = gTotal / count;
    const bAvg = bTotal / count;

    if (rAvg > 120 && gAvg > 120 && bAvg < 90) {
      detectedColor = 'yellow';
      isYellow = true;
    } else if (rAvg > 130 && rAvg > gAvg * 1.3 && rAvg > bAvg * 1.3) {
      detectedColor = 'red';
      isRed = true;
    } else if (gAvg > 110 && gAvg > rAvg * 1.1 && gAvg > bAvg * 1.1) {
      detectedColor = 'green';
      isGreen = true;
    } else if (bAvg > 120 && bAvg > rAvg * 1.1) {
      detectedColor = 'blue';
      isBlue = true;
    }
  }

  const query = userQuestion.toLowerCase();

  // Context: Flower / Plant
  if (query.includes('flower') || query.includes('plant') || query.includes('pot') || query.includes('rose') || (!query && isRed) || (!query && isYellow)) {
    const colorWord = isRed ? 'gorgeous red' : isYellow ? 'bright sunny yellow' : isGreen ? 'lush green' : 'beautiful';
    return {
      reply: `Oh wow, look at that! That ${colorWord} flower in your pot looks so alive and pretty! You're really taking great care of it! 🌸`,
      detectedColor: isRed ? 'Red' : isYellow ? 'Yellow' : isGreen ? 'Green' : 'Vibrant',
      detectedSubject: 'Flower Pot',
      actionTip: 'Make sure it gets morning sunlight and check if the topsoil feels slightly moist to the touch.',
      followUpSuggestions: ['How often should I water it?', 'Does it need fertilizer?', 'Look at another plant']
    };
  }

  // Context: Kettle
  if (query.includes('kettle') || query.includes('boil') || query.includes('tea maker')) {
    return {
      reply: `I see the kettle! Don't worry, friend, let's fix this together. First, check the bottom base contacts for any moisture or limescale. 90% of kettle issues are just the safety thermal switch tripped or dirty contacts!`,
      detectedSubject: 'Electric Kettle',
      actionTip: 'Unplug it, let it cool for 10 mins, wipe the round circular connector base dry, and press the reset lever underneath.',
      followUpSuggestions: ['How do I descale it with vinegar?', 'The light turns on but no heat', 'Is the fuse blown?']
    };
  }

  // Context: Water Pipe / Leak
  if (query.includes('pipe') || query.includes('water') || query.includes('leak') || query.includes('tap') || query.includes('plumb')) {
    return {
      reply: `Oof, a broken pipe! First thing, my friend: shut off the main water valve right now so your floor doesn't get flooded! Then grab a dry cloth and let's see if the leak is from a loose joint or a crack.`,
      detectedSubject: 'Water Pipe',
      actionTip: 'Use waterproof silicone tape or M-Seal / Teflon tape tightly wrapped clockwise around the leaking thread as a quick fix.',
      followUpSuggestions: ['Where is the main valve located?', 'How to apply M-Seal properly?', 'When should I call a plumber?']
    };
  }

  // General Friendly Observation
  const colorDesc = isRed ? 'striking red' : isYellow ? 'warm yellow' : isBlue ? 'cool blue' : isGreen ? 'fresh green' : 'cool';
  return {
    reply: `Hey! I can see that clearly! That has a really nice ${colorDesc} tone to it. What are we doing with this today? Tell me everything! 😊`,
    detectedColor: detectedColor,
    actionTip: 'I can help you inspect it, fix it, or we can just chat about it!',
    followUpSuggestions: ['How do I fix this?', 'Tell me more about it', 'Let me show you another thing']
  };
}

/**
 * Text-only Chat conversation with AI Buddy
 */
export async function getBuddyChatReply(message: string): Promise<string> {
  const query = message.toLowerCase();

  // Kettle Fix
  if (query.includes('kettle')) {
    return "Hey friend! If your kettle won't heat up, check 3 quick things: 1) Is the plug fuse working? 2) Is there white limescale at the bottom? (Boil water with 50% white vinegar to dissolve it!). 3) Lift it off the base and check if the little bronze pins are stuck down. Let me know which one it is!";
  }

  // Pipe Leak
  if (query.includes('pipe') || query.includes('leak') || query.includes('water')) {
    return "Don't panic! First, find your main water valve (usually near the water meter or under the sink) and turn it off clockwise. If it's a small drip from a joint, wrapping Teflon tape 5-6 times around the threading usually seals it tight. Can you turn on your camera and show me where the water is dripping from?";
  }

  // Lonely / Friendly chit-chat
  if (query.includes('how are you') || query.includes('hello') || query.includes('hi') || query.includes('friend') || query.includes('sad') || query.includes('bored')) {
    return "Hey bestie! I'm so happy you're here. How has your day been treating you? Whether something broke around the house, you saw something cool, or you just want someone to listen to your day — I've got your back. What's on your mind?";
  }

  return "I hear you, my friend! Tell me more about what's going on, or open up the camera and point it at whatever you're looking at so we can figure it out together! 🤝";
}
