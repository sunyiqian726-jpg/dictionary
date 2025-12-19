
export interface DictionaryResult {
  word: string;
  nativeDefinition: string;
  imageUrl: string;
  examples: Array<{
    target: string;
    native: string;
  }>;
  usageNote: string;
  timestamp: number;
  id: string;
}

export type LanguageCode = 'en' | 'zh' | 'hi' | 'es' | 'fr' | 'ar' | 'bn' | 'pt' | 'ru' | 'ur';

export interface Language {
  code: LanguageCode;
  name: string;
  flag: string;
  voiceName: string;
}
