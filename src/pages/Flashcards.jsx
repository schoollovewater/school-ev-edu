import { useState } from 'react';
import termsData from '../data/terms.json';
import { RotateCcw, ChevronRight, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

export default function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const term = termsData[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % termsData.length);
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + termsData.length) % termsData.length);
    }, 150);
  };

  if (!term) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col items-center">
      <div className="bg-white dark:bg-slate-900 w-full pt-8 pb-4 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm text-center">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
          Flashcards
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Chạm để lật thẻ ({currentIndex + 1} / {termsData.length})
        </p>
      </div>

      <div className="flex-1 w-full max-w-sm px-6 py-8 flex flex-col justify-center perspective-1000">
        
        {/* Flashcard container with 3D perspective */}
        <div 
          className="relative w-full aspect-[3/4] cursor-pointer transition-transform duration-500 transform-style-3d group"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front of card */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center group-hover:shadow-2xl transition-shadow">
            <span className="absolute top-6 left-6 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {term.tag}
            </span>
            <div className="absolute top-6 right-6 text-slate-300 dark:text-slate-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              {term.acronym}
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Nhấn để xem chi tiết</p>
          </div>

          {/* Back of card */}
          <div 
            className="absolute inset-0 backface-hidden bg-blue-600 dark:bg-blue-700 rounded-3xl shadow-xl flex flex-col p-8 text-white rotate-y-180"
          >
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">
                {term.term}
              </h3>
              <p className="text-blue-200 font-medium mb-6">
                {term.vietnamese}
              </p>
              <div className="w-12 h-1 bg-blue-400 rounded-full mb-6"></div>
              <p className="text-blue-50 text-sm leading-relaxed">
                {term.description}
              </p>
            </div>
            <div className="text-center pt-4 text-blue-300 text-xs">
              Nhấn để quay lại
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button 
            onClick={handlePrev}
            className="p-4 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={handleNext}
            className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
