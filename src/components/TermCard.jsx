import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function TermCard({ term, onClick }) {
  // Generate a distinct color scheme based on the tag
  const getTagColors = (tag) => {
    switch(tag?.toLowerCase()) {
      case 'battery': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
      case 'control': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      case 'power': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'powertrain': return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
      case 'safety': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'sensor': return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800';
      default: return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <button 
      onClick={() => onClick(term)}
      className="w-full text-left group bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 flex items-center justify-between"
    >
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {term.acronym}
          </h3>
          <span className={clsx('text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border', getTagColors(term.tag))}>
            {term.tag}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-1">
          {term.term}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
          {term.vietnamese}
        </p>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 transition-colors shrink-0">
        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
      </div>
    </button>
  );
}
