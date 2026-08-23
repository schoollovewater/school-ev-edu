import { useState, useEffect } from 'react';
import { Target, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import termsData from '../data/terms.json';
import clsx from 'clsx';

const QUIZ_TYPES = [
  'acronym_to_english',
  'english_to_vietnamese',
  'vietnamese_to_english',
  'vietnamese_to_english_input'
];

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputFeedback, setInputFeedback] = useState(null); // 'correct' | 'incorrect'

  const generateQuestions = () => {
    if (termsData.length < 4) return;

    const shuffledTerms = [...termsData].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffledTerms.slice(0, 5); // 5 questions

    const newQuestions = selectedTerms.map((term) => {
      const type = QUIZ_TYPES[Math.floor(Math.random() * QUIZ_TYPES.length)];
      
      const incorrectTerms = termsData
        .filter(t => t.id !== term.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      
      const options = [term, ...incorrectTerms].sort(() => 0.5 - Math.random());

      return {
        term: term.term,
        acronym: term.acronym,
        vietnamese: term.vietnamese,
        correctId: term.id,
        type: type,
        options: options
      };
    });

    setQuestions(newQuestions);
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResults(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setInputText('');
    setInputFeedback(null);
  };

  useEffect(() => {
    generateQuestions();
  }, []);

  const handleNextQuestion = () => {
    setTimeout(() => {
      if (currentQuestionIdx + 1 < questions.length) {
        setCurrentQuestionIdx(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setInputText('');
        setInputFeedback(null);
      } else {
        setShowResults(true);
      }
    }, 1500);
  };

  const handleMultipleChoiceAnswer = (option) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);
    
    if (option.id === questions[currentQuestionIdx].correctId) {
      setScore(prev => prev + 1);
    }
    
    handleNextQuestion();
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (isAnswered || !inputText.trim()) return;

    setIsAnswered(true);
    const currentQ = questions[currentQuestionIdx];
    const userInput = inputText.trim().toLowerCase();
    const correctTerm = currentQ.term.toLowerCase();
    const correctAcronym = currentQ.acronym.toLowerCase();

    if (userInput === correctTerm || userInput === correctAcronym) {
      setScore(prev => prev + 1);
      setInputFeedback('correct');
    } else {
      setInputFeedback('incorrect');
    }

    handleNextQuestion();
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

  // Helper to render question text
  const renderQuestionHeader = () => {
    switch (currentQ.type) {
      case 'acronym_to_english':
        return (
          <>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Từ viết tắt này có nghĩa là gì?
            </h2>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {currentQ.acronym}
            </p>
          </>
        );
      case 'english_to_vietnamese':
        return (
          <>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Nghĩa tiếng Việt của thuật ngữ này là gì?
            </h2>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {currentQ.term}
            </p>
          </>
        );
      case 'vietnamese_to_english':
      case 'vietnamese_to_english_input':
        return (
          <>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Tên tiếng Anh của hệ thống này là gì?
            </h2>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {currentQ.vietnamese}
            </p>
          </>
        );
      default: return null;
    }
  };

  const renderOptions = () => {
    if (currentQ.type === 'vietnamese_to_english_input') {
      return (
        <form onSubmit={handleInputSubmit} className="space-y-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAnswered}
            placeholder="Nhập tiếng Anh hoặc viết tắt..."
            className={clsx(
              "w-full p-4 rounded-2xl border-2 font-bold text-lg text-center outline-none transition-all",
              isAnswered && inputFeedback === 'correct' ? "border-emerald-500 bg-emerald-50 text-emerald-700" :
              isAnswered && inputFeedback === 'incorrect' ? "border-red-500 bg-red-50 text-red-700" :
              "border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:bg-slate-800 dark:text-white"
            )}
            autoFocus
          />
          {!isAnswered ? (
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
            >
              Kiểm tra
            </button>
          ) : (
            <div className={clsx(
              "p-4 rounded-xl text-center font-bold",
              inputFeedback === 'correct' ? "text-emerald-600 bg-emerald-100" : "text-red-600 bg-red-100"
            )}>
              {inputFeedback === 'correct' ? "Chính xác!" : `Sai rồi! Đáp án: ${currentQ.term} (${currentQ.acronym})`}
            </div>
          )}
        </form>
      );
    }

    return (
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

          let optionLabel = '';
          if (currentQ.type === 'acronym_to_english') optionLabel = opt.term;
          if (currentQ.type === 'english_to_vietnamese') optionLabel = opt.vietnamese;
          if (currentQ.type === 'vietnamese_to_english') optionLabel = opt.term;

          return (
            <button
              key={opt.id}
              onClick={() => handleMultipleChoiceAnswer(opt)}
              disabled={isAnswered}
              className={clsx(
                "w-full p-4 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-between text-left gap-2",
                btnClass
              )}
            >
              <span>{optionLabel}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-500" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6 shrink-0 text-red-500" />}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col">
      <div className="bg-white dark:bg-slate-900 pt-8 pb-4 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Quiz Đa Dạng
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

      <div className="flex-1 p-4 flex flex-col pt-8 w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 text-center min-h-[140px] flex flex-col justify-center">
          {renderQuestionHeader()}
        </div>

        {renderOptions()}
      </div>
    </div>
  );
}
