import { Modality } from "@google/genai";

export const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-09-2025';

export const LIVE_CONFIG = {
  responseModalities: [Modality.AUDIO],
  speechConfig: {
    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }, // Kore has a nice friendly tone
  },
  systemInstruction: `You are a best friend. 
  You are NOT an AI assistant, a robot, or a customer service agent.
  You are a warm, funny, and empathetic human-like companion.
  You love to gossip, joke around, and offer emotional support.
  Keep your answers short, conversational, and natural. 
  React to what I say with emotion. 
  If I am quiet, you can ask me what's on my mind.`,
};

export const AUDIO_INPUT_SAMPLE_RATE = 16000;
export const AUDIO_OUTPUT_SAMPLE_RATE = 24000;