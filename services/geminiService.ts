
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DictionaryResult, LanguageCode } from "../types";
import { MODELS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Audio utility: Convert base64 to bytes manually as requested
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const lookupWord = async (
  query: string,
  nativeLang: string,
  targetLang: string
): Promise<DictionaryResult> => {
  // 1. Get Text Definition
  const textResponse = await ai.models.generateContent({
    model: MODELS.TEXT,
    contents: `Translate and define "${query}" from ${targetLang} to ${nativeLang}.
    Provide a definition in ${nativeLang}.
    Two example sentences in ${targetLang} with ${nativeLang} translations.
    A usage note that is fun, lively, casual, and explains cultural nuances or common mistakes. Use "buddy-like" language.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          nativeDefinition: { type: Type.STRING },
          examples: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                target: { type: Type.STRING },
                native: { type: Type.STRING }
              },
              required: ["target", "native"]
            }
          },
          usageNote: { type: Type.STRING }
        },
        required: ["word", "nativeDefinition", "examples", "usageNote"]
      }
    }
  });

  const textData = JSON.parse(textResponse.text || '{}');

  // 2. Generate Image
  const imageResponse = await ai.models.generateContent({
    model: MODELS.IMAGE,
    contents: `A fun, vibrant, and clear artistic visualization of the concept: "${query}" in the context of ${targetLang}. Use high contrast and friendly style.`,
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  let imageUrl = "https://picsum.photos/400/400";
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    ...textData,
    imageUrl,
    timestamp: Date.now(),
    id: Math.random().toString(36).substring(7)
  };
};

export const playAudio = async (text: string, voiceName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: MODELS.TTS,
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      audioCtx,
      24000,
      1
    );

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  } catch (error) {
    console.error("Audio playback error:", error);
  }
};

export const generateStory = async (words: string[], targetLang: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: MODELS.TEXT,
    contents: `Write a very short, fun, and crazy story using these words: ${words.join(", ")}. 
    The story should be in ${targetLang}. Keep it simple enough for a language learner.`,
  });
  return response.text || "Failed to generate story.";
};
