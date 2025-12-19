
import React, { useState, useEffect } from 'react';
import { DictionaryResult } from '../types';

interface Props {
  words: DictionaryResult[];
}

const Flashcard: React.FC<{ word: DictionaryResult }> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset flip when word changes
  useEffect(() => {
    setIsFlipped(false);
  }, [word]);

  return (
    <div
      className={`relative w-full h-[500px] cursor-pointer group perspective-1000 ${isFlipped ? 'card-flip-active' : ''}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="card-flip-inner relative w-full h-full transition-transform duration-700 rounded-[40px] shadow-2xl">
        {/* Front: Word against the image */}
        <div className="card-front absolute w-full h-full bg-indigo-900 rounded-[40px] overflow-hidden shadow-2xl">
          <img src={word.imageUrl} alt={word.word} className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/20 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-end p-10">
            <h2 className="text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] text-center break-words w-full">
              {word.word}
            </h2>
            <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-white text-xs font-black uppercase tracking-widest">Tap to flip</span>
            </div>
          </div>
        </div>

        {/* Back: Word + Definition + Example */}
        <div className="card-back absolute w-full h-full bg-white rounded-[40px] flex flex-col p-8 border-[6px] border-indigo-500 shadow-2xl overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-4xl font-black text-indigo-600 mb-2">{word.word}</h2>
            <div className="h-1 w-16 bg-pink-400 rounded-full mb-6"></div>
            
            <p className="text-2xl font-bold text-gray-800 mb-8 leading-tight italic">
              "{word.nativeDefinition}"
            </p>

            <div className="w-full space-y-4">
              <div className="bg-indigo-50 p-5 rounded-3xl text-left border-2 border-indigo-100">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Target Example</p>
                <p className="text-lg font-bold text-indigo-900 leading-snug">
                  {word.examples[0].target}
                </p>
              </div>
              
              <div className="bg-pink-50 p-5 rounded-3xl text-left border-2 border-pink-100">
                <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-2">Translation</p>
                <p className="text-lg font-medium text-pink-900 leading-snug">
                  {word.examples[0].native}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Tap to see image again</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudyFlashcards: React.FC<Props> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionWords, setSessionWords] = useState<DictionaryResult[]>([]);

  // Shuffle words when component mounts or words list significantly changes
  useEffect(() => {
    setSessionWords([...words].sort(() => Math.random() - 0.5));
  }, [words.length]);

  if (sessionWords.length === 0) return (
    <div className="text-center p-12 bg-white rounded-[40px] shadow-inner mt-10 mx-4 border-4 border-dashed border-gray-100">
      <div className="text-6xl mb-4">📭</div>
      <p className="text-gray-400 text-lg font-bold">Your notebook is empty!</p>
      <p className="text-sm text-gray-300">Save some words from the search to start studying.</p>
    </div>
  );

  const progress = ((currentIndex + 1) / sessionWords.length) * 100;

  return (
    <div className="space-y-6 pb-24">
      {/* Progress Header */}
      <div className="px-6 pt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-black text-indigo-600">Flashcards</h3>
          <span className="text-sm font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
            {currentIndex + 1} / {sessionWords.length}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Card Display */}
      <div className="px-4">
        <Flashcard key={sessionWords[currentIndex].id} word={sessionWords[currentIndex]} />
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-8 px-8">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-indigo-600 disabled:opacity-20 hover:scale-110 active:scale-90 transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => {
            setSessionWords([...sessionWords].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
          }}
          className="bg-indigo-100 px-6 py-2 rounded-2xl text-indigo-600 font-black text-xs uppercase tracking-widest hover:bg-indigo-200 transition-colors"
        >
          Shuffle
        </button>

        <button
          onClick={() => setCurrentIndex(prev => Math.min(sessionWords.length - 1, prev + 1))}
          disabled={currentIndex === sessionWords.length - 1}
          className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-indigo-600 disabled:opacity-20 hover:scale-110 active:scale-90 transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {currentIndex === sessionWords.length - 1 && (
        <div className="text-center animate-bounce">
          <p className="text-pink-500 font-black text-lg">You're doing great! ✨</p>
        </div>
      )}
    </div>
  );
};

export default StudyFlashcards;
