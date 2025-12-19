
import { Language } from './types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', voiceName: 'Kore' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳', voiceName: 'Puck' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', voiceName: 'Kore' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', voiceName: 'Kore' },
  { code: 'fr', name: 'French', flag: '🇫🇷', voiceName: 'Kore' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', voiceName: 'Kore' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', voiceName: 'Kore' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷', voiceName: 'Kore' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', voiceName: 'Puck' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', voiceName: 'Kore' },
];

export const MODELS = {
  TEXT: 'gemini-3-flash-preview',
  IMAGE: 'gemini-2.5-flash-image',
  TTS: 'gemini-2.5-flash-preview-tts'
};
