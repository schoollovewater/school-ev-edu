import { X } from 'lucide-react';

export default function TermModal({ term, onClose }) {
  if (!term) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {term.tag}
            </span>
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {term.acronym}
          </h2>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300 mb-2">
            {term.term}
          </p>
          
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
              Hệ thống: {
                term.domain === 'info' ? 'Thông tin giải trí (Infotainment)' :
                term.domain === 'center' ? 'Kiểm soát trung tâm (Central)' :
                term.domain === 'adas' ? 'Hỗ trợ người lái (ADAS)' :
                term.domain === 'chassis' ? 'Khung gầm (Chassis)' :
                term.domain === 'powertrain' ? 'Truyền động (Powertrain)' :
                term.domain === 'thermal' ? 'Quản lý nhiệt (Thermal)' :
                term.domain === 'body' ? 'Thân vỏ (Body)' : term.domain
              }
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tiếng Việt</h3>
              <p className="text-slate-800 dark:text-slate-200 font-medium">{term.vietnamese}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Định nghĩa</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {term.description}
              </p>
            </div>
            
            {term.functions && term.functions.length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Chức năng chính</h3>
                <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                  {term.functions.map((func, idx) => (
                    <li key={idx}>{func}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {term.communication && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Giao tiếp & Kết nối</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {term.communication}
                </p>
              </div>
            )}
            
            {term.related && term.related.length > 0 && (
              <div className="pt-4 mt-2">
                <h3 className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Thuật ngữ liên quan</h3>
                <div className="flex flex-wrap gap-2">
                  {term.related.map((rel) => (
                    <span key={rel} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {rel.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
