import { useState, useEffect } from 'react';
import { Key, Moon, Sun, Trash2, Check, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load existing settings
    const savedKey = localStorage.getItem('school_ev_edu_api_key');
    if (savedKey) setApiKey(savedKey);

    // Check system preference or saved preference
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem('school_ev_edu_api_key', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn xoá API Key và dữ liệu cá nhân không?')) {
      localStorage.removeItem('school_ev_edu_api_key');
      setApiKey('');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col">
      <div className="bg-white dark:bg-slate-900 pt-8 pb-4 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cài đặt
        </h1>
      </div>

      <div className="flex-1 p-4 space-y-6">
        
        {/* API Key Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800 dark:text-slate-200">Google Gemini API Key</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Cần thiết để sử dụng tính năng <strong>AI Analyzer</strong>. Key được lưu cục bộ trên máy bạn, không gửi về bất kỳ máy chủ nào khác.
          </p>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              placeholder="Nhập API Key của bạn..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
            />
            <button
              onClick={handleSaveKey}
              className={clsx(
                "py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors",
                isSaved 
                  ? "bg-emerald-500 text-white" 
                  : "bg-slate-900 dark:bg-blue-600 text-white"
              )}
            >
              {isSaved ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Đã lưu</span>
                </>
              ) : (
                'Lưu API Key'
              )}
            </button>
          </div>
        </section>

        {/* Display Settings */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-indigo-500" />
              ) : (
                <Sun className="w-5 h-5 text-orange-500" />
              )}
              <h2 className="font-bold text-slate-800 dark:text-slate-200">Giao diện Tối</h2>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className={clsx(
                "w-14 h-8 rounded-full p-1 transition-colors relative",
                isDarkMode ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
              )}
            >
              <div 
                className={clsx(
                  "w-6 h-6 bg-white rounded-full shadow-sm transition-transform",
                  isDarkMode ? "translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-red-200 dark:border-red-900/50">
          <div className="flex items-center gap-2 mb-2 text-red-500">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-bold">Xoá dữ liệu</h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Xoá bộ nhớ đệm và các khoá API đã lưu trên thiết bị này.
          </p>
          <button
            onClick={handleReset}
            className="w-full py-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-xl flex justify-center items-center gap-2 transition-colors border border-red-200 dark:border-red-800"
          >
            <Trash2 className="w-4 h-4" />
            Xoá tất cả
          </button>
        </section>

      </div>
    </div>
  );
}
