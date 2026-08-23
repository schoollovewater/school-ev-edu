import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import termsData from '../data/terms.json';
import TermCard from '../components/TermCard';
import TermModal from '../components/TermModal';

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
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
          Dictionary
        </h1>
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
