import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import termsData from '../data/terms.json';
import TermCard from '../components/TermCard';
import TermModal from '../components/TermModal';

import { Link } from 'react-router-dom';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(null);

  const filteredTerms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return termsData;
    
    return termsData.filter((term) => 
      term.acronym.toLowerCase().includes(query) ||
      term.term.toLowerCase().includes(query) ||
      term.vietnamese.toLowerCase().includes(query) ||
      term.tag.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8">
      {/* Header section with search */}
      <div className="bg-white dark:bg-slate-900 pt-8 pb-6 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-start mb-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Từ điển EV
          </h1>
          <Link to="/settings" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </Link>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Tra cứu nhanh thuật ngữ ô tô điện
        </p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Tìm kiếm từ khóa, hệ thống, viết tắt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* List section */}
      <div className="px-4 py-4 space-y-3">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term) => (
            <TermCard 
              key={term.id} 
              term={term} 
              onClick={setSelectedTerm} 
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">Không tìm thấy thuật ngữ nào phù hợp.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTerm && (
        <TermModal 
          term={selectedTerm} 
          onClose={() => setSelectedTerm(null)} 
        />
      )}
    </div>
  );
}
