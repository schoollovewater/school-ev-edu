import { useState, useEffect } from 'react';
import { Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import termsData from '../data/terms.json';
import clsx from 'clsx';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate 5 random questions from termsData
  const generateQuestions = () => {
    if (termsData.length < 4) return; // Need at least 4 terms for options

    const shuffledTerms = [...termsData].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffledTerms.slice(0, 5); // 5 questions

    const newQuestions = selectedTerms.map((term) => {
      // Get 3 incorrect answers
      const incorrectTerms = termsData
        .filter(t => t.id !== term.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [term, ...incorrectTerms]
        .sort(() => 0.5 - Math.random());

      return {
        term: term.term, // The question asks: "What does [Acronym] stand for?" or "What is [Acronym]?"
        acronym: term.acronym,
        correctId: term.id,
        options: options
      };
    });

    setQuestions(newQuestions);
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    if (option.id === questions[currentQuestionIdx].correctId) {
      setScore(prev => prev + 1);
    }
    
    setTimeout(() => {
      if (currentQuestionIdx + 1 < questions.length) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  if (questions.length === 0) return <div className="p-4">Đang tải câu hỏi...</div>;

  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl w-full max-w-sm text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            Kết Quả
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Bạn đã trả lời đúng {score} / {questions.length} câu hỏi.
          </p>
          
          <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-8">
            {Math.round((score / questions.length) * 100)}%
          </div>
          
          <button
            onClick={generateQuestions}
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Làm lại bài Test
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col">
      <div className="bg-white dark:bg-slate-900 pt-8 pb-4 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Quiz
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentQuestionIdx) / questions.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {currentQuestionIdx + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 flex flex-col pt-8">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 text-center">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Thuật ngữ nào mang nghĩa:
          </h2>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            "{currentQ.term}"
          </p>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedAnswer?.id === opt.id;
            const isCorrect = opt.id === currentQ.correctId;
            
            let btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400";
            
            if (isAnswered) {
              if (isCorrect) {
                btnClass = "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300";
              } else if (isSelected && !isCorrect) {
                btnClass = "bg-red-50 dark:bg-red-900/30 border-red-500 text-red-700 dark:text-red-300";
              } else {
                btnClass = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-50";
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleAnswer(opt)}
                disabled={isAnswered}
                className={clsx(
                  "w-full p-4 rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-between",
                  btnClass
                )}
              >
                <span>{opt.acronym}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
