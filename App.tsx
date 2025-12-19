
import React, { useState, useEffect, useCallback } from 'react';
import { DictionaryResult, LanguageCode } from './types';
import { LANGUAGES } from './constants';
import { lookupWord, generateStory } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import WordCard from './components/WordCard';
import StudyFlashcards from './components/StudyFlashcards';

const App: React.FC = () => {
  const [nativeLang, setNativeLang] = useState<LanguageCode>('en');
  const [targetLang, setTargetLang] = useState<LanguageCode>('es');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DictionaryResult | null>(null);
  const [notebook, setNotebook] = useState<DictionaryResult[]>([]);
  const [view, setView] = useState<'search' | 'notebook' | 'study'>('search');
  const [story, setStory] = useState<string | null>(null);
  const [generatingStory, setGeneratingStory] = useState(false);

  // Load notebook from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lingopop_notebook');
    if (saved) {
      setNotebook(JSON.parse(saved));
    }
  }, []);

  // Save notebook to localStorage
  useEffect(() => {
    localStorage.setItem('lingopop_notebook', JSON.stringify(notebook));
  }, [notebook]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const native = LANGUAGES.find(l => l.code === nativeLang)?.name || 'English';
      const target = LANGUAGES.find(l => l.code === targetLang)?.name || 'Spanish';
      const res = await lookupWord(query, native, target);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Oops! Something went wrong with the AI. Try again!");
    } finally {
      setLoading(false);
    }
  };

  const saveToNotebook = (item: DictionaryResult) => {
    if (!notebook.find(n => n.word === item.word)) {
      setNotebook([item, ...notebook]);
    }
  };

  const handleGenerateStory = async () => {
    if (notebook.length < 2) {
      alert("Add at least 2 words to your notebook to generate a story!");
      return;
    }
    setGeneratingStory(true);
    setStory(null);
    try {
      const target = LANGUAGES.find(l => l.code === targetLang)?.name || 'Spanish';
      const words = notebook.map(n => n.word);
      const res = await generateStory(words, target);
      setStory(res);
    } catch (err) {
      alert("Couldn't create a story right now.");
    } finally {
      setGeneratingStory(false);
    }
  };

  const getTargetLangObj = () => LANGUAGES.find(l => l.code === targetLang)!;

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-pink-50 pb-24 relative shadow-2xl flex flex-col">
      {/* Header */}
      <header className="p-6 bg-white rounded-b-[40px] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-indigo-600 tracking-tight">LingoPop<span className="text-pink-500">!</span></h1>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          </div>
        </div>

        {view === 'search' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <LanguageSelector
                label="Native"
                value={nativeLang}
                onChange={setNativeLang}
                colorClass="bg-pink-100 text-pink-700"
              />
              <LanguageSelector
                label="Target"
                value={targetLang}
                onChange={setTargetLang}
                colorClass="bg-indigo-100 text-indigo-700"
              />
            </div>

            <form onSubmit={handleSearch} className="relative mt-6">
              <input
                type="text"
                placeholder="Type a word or phrase..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-16 px-6 pr-16 bg-gray-100 rounded-3xl text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all border-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 rounded-2xl text-white flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-6">
        {view === 'search' && (
          <>
            {!result && !loading && (
              <div className="text-center py-20 opacity-30 select-none">
                <div className="text-8xl mb-4">📖</div>
                <p className="text-xl font-bold">Start your language journey!</p>
              </div>
            )}
            {result && (
              <div className="pb-10">
                <WordCard
                  result={result}
                  targetLang={getTargetLangObj()}
                  onSave={saveToNotebook}
                  isSaved={!!notebook.find(n => n.word === result.word)}
                />
              </div>
            )}
          </>
        )}

        {view === 'notebook' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-indigo-600">Notebook 📓</h2>
              <button
                onClick={handleGenerateStory}
                disabled={notebook.length < 2 || generatingStory}
                className="bg-yellow-400 px-4 py-2 rounded-xl font-bold text-yellow-900 shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {generatingStory ? 'Stitching...' : 'Make Story ✨'}
              </button>
            </div>

            {story && (
              <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold opacity-80">AI Magic Story</h3>
                  <button onClick={() => setStory(null)} className="text-2xl font-bold">&times;</button>
                </div>
                <p className="text-xl leading-relaxed italic">"{story}"</p>
              </div>
            )}

            <div className="grid gap-4">
              {notebook.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-md border-l-8 border-pink-500 flex items-center gap-4 group">
                  <img src={item.imageUrl} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-black text-lg text-indigo-600">{item.word}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.nativeDefinition}</p>
                  </div>
                  <button
                    onClick={() => {
                      setNotebook(prev => prev.filter(n => n.id !== item.id));
                    }}
                    className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
              {notebook.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl text-gray-400">
                  <p className="text-5xl mb-4">Empty!</p>
                  <p>Save words to see them here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'study' && <StudyFlashcards words={notebook} />}
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/80 backdrop-blur-xl h-20 rounded-[30px] shadow-2xl flex items-center justify-around px-2 border border-white/40 overflow-hidden">
        <button
          onClick={() => setView('search')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${view === 'search' ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-indigo-400'}`}
        >
          <svg className="w-7 h-7" fill={view === 'search' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
        </button>
        <button
          onClick={() => setView('notebook')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${view === 'notebook' ? 'text-pink-500 scale-110' : 'text-gray-400 hover:text-pink-400'}`}
        >
          <svg className="w-7 h-7" fill={view === 'notebook' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Books</span>
        </button>
        <button
          onClick={() => setView('study')}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${view === 'study' ? 'text-yellow-500 scale-110' : 'text-gray-400 hover:text-yellow-400'}`}
        >
          <svg className="w-7 h-7" fill={view === 'study' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Study</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
