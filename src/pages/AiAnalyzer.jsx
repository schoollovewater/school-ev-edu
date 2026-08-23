import { useState } from 'react';
import { Bot, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { analyzeDocumentWithGemini } from '../utils/ai';
import termsData from '../data/terms.json';
import TermModal from '../components/TermModal';

export default function AiAnalyzer() {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await analyzeDocumentWithGemini(inputText);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTermClick = (acronym) => {
    // Find the term in our local database if it exists
    const found = termsData.find(t => t.acronym.toLowerCase() === acronym.toLowerCase() || t.id === acronym.toLowerCase());
    if (found) {
      setSelectedTerm(found);
    } else {
      // If not found in local DB, create a temporary one from AI result
      const aiTerm = result?.terms.find(t => t.acronym === acronym);
      if (aiTerm) {
        setSelectedTerm({
          id: acronym,
          acronym: acronym,
          term: 'Từ AI Phân tích',
          vietnamese: 'N/A',
          description: aiTerm.explanation,
          tag: 'AI Generated'
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col">
      <div className="bg-white dark:bg-slate-900 pt-8 pb-4 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Analyzer
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Phân tích tài liệu xe điện bằng AI
        </p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Nhập đoạn văn bản
            </span>
          </div>
          <textarea
            className="w-full h-48 p-4 bg-transparent border-none resize-none focus:ring-0 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder="Dán một đoạn tài liệu kỹ thuật, tin tức hoặc mô tả về xe điện vào đây..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!inputText.trim() || isAnalyzing}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Đang phân tích...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Phân tích tài liệu</span>
            </>
          )}
        </button>

        {result && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 px-1">
              Kết quả từ AI
            </h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 mb-4">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Tóm tắt</h4>
              <p className="text-slate-700 dark:text-slate-300">{result.summary}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Các thuật ngữ tìm thấy</h4>
              {result.terms && result.terms.map((t, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleTermClick(t.acronym)}
                  className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 shadow-sm cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-blue-700 dark:text-blue-400">{t.acronym}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {t.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedTerm && (
        <TermModal 
          term={selectedTerm} 
          onClose={() => setSelectedTerm(null)} 
        />
      )}
    </div>
  );
}
