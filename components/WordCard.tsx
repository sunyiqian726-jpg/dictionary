
import React from 'react';
import { DictionaryResult, Language } from '../types';
import { playAudio } from '../services/geminiService';

interface Props {
  result: DictionaryResult;
  targetLang: Language;
  onSave?: (result: DictionaryResult) => void;
  isSaved?: boolean;
}

const WordCard: React.FC<Props> = ({ result, targetLang, onSave, isSaved }) => {
  const handlePlay = (text: string) => {
    playAudio(text, targetLang.voiceName);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-yellow-300 animate-in fade-in zoom-in duration-300">
      <div className="relative aspect-square">
        <img src={result.imageUrl} alt={result.word} className="w-full h-full object-cover" />
        <button
          onClick={() => handlePlay(result.word)}
          className="absolute bottom-4 right-4 bg-yellow-400 p-4 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-transform"
        >
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-4xl font-extrabold text-indigo-600 mb-1">{result.word}</h2>
          <p className="text-gray-600 italic font-semibold">{result.nativeDefinition}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl">
          <h3 className="text-sm font-bold text-blue-400 uppercase mb-2">Cool Usage Note</h3>
          <p className="text-gray-800 leading-relaxed">{result.usageNote}</p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-pink-400 uppercase">Examples</h3>
          {result.examples.map((ex, i) => (
            <div key={i} className="flex items-start gap-3 group">
              <button
                onClick={() => handlePlay(ex.target)}
                className="mt-1 bg-indigo-100 p-2 rounded-full group-hover:bg-indigo-200 transition-colors"
              >
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
              </button>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{ex.target}</p>
                <p className="text-sm text-gray-500">{ex.native}</p>
              </div>
            </div>
          ))}
        </div>

        {onSave && (
          <button
            onClick={() => onSave(result)}
            disabled={isSaved}
            className={`w-full py-4 rounded-2xl font-extrabold text-white transition-all shadow-lg ${
              isSaved ? 'bg-gray-400' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isSaved ? 'Saved in Notebook! ✨' : 'Save to Notebook 📓'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WordCard;
