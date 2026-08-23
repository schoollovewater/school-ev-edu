import { useState } from 'react';
import { ShieldAlert, Zap, Cpu, Car, Layers } from 'lucide-react';
import termsData from '../data/terms.json';
import TermModal from '../components/TermModal';
import clsx from 'clsx';

export default function Map() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);

  const domains = [
    { id: 'powertrain', name: 'Powertrain', icon: Zap, color: 'bg-rose-500', terms: ['regen'] },
    { id: 'battery', name: 'Energy Storage', icon: Layers, color: 'bg-emerald-500', terms: ['bms', 'soc'] },
    { id: 'control', name: 'Vehicle Control', icon: Cpu, color: 'bg-purple-500', terms: ['vcu'] },
    { id: 'power', name: 'Power Electronics', icon: Zap, color: 'bg-amber-500', terms: ['inverter'] },
    { id: 'safety', name: 'ADAS & Safety', icon: ShieldAlert, color: 'bg-blue-500', terms: ['adas'] },
    { id: 'sensor', name: 'Sensors', icon: Car, color: 'bg-cyan-500', terms: ['lidar'] }
  ];

  const handleDomainClick = (domainId) => {
    setSelectedDomain(selectedDomain === domainId ? null : domainId);
  };

  const getDomainTerms = (domainTerms) => {
    return termsData.filter(t => domainTerms.includes(t.id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-8 flex flex-col">
      <div className="bg-white dark:bg-slate-900 pt-8 pb-4 px-4 sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1 tracking-tight">
          Architecture
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sơ đồ khối hệ thống xe điện (Interactive)
        </p>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {domains.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            const isFaded = selectedDomain && !isSelected;
            return (
              <button
                key={domain.id}
                onClick={() => handleDomainClick(domain.id)}
                className={clsx(
                  "p-4 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 border-2",
                  isSelected ? "border-blue-500 shadow-lg scale-105" : "border-transparent",
                  isFaded ? "opacity-50 scale-95 grayscale" : "opacity-100",
                  "bg-white dark:bg-slate-800 shadow-sm hover:shadow-md"
                )}
              >
                <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-white", domain.color)}>
                  <domain.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 text-center">
                  {domain.name}
                </span>
              </button>
            )
          })}
        </div>

        {selectedDomain && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 px-1">
              Hệ thống liên quan
            </h3>
            <div className="space-y-2">
              {getDomainTerms(domains.find(d => d.id === selectedDomain).terms).map(term => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className="w-full text-left p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between group hover:border-blue-400 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{term.acronym}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{term.vietnamese}</div>
                  </div>
                  <div className="text-blue-500 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </button>
              ))}
              
              {getDomainTerms(domains.find(d => d.id === selectedDomain).terms).length === 0 && (
                <p className="text-slate-500 text-center py-4">Đang cập nhật dữ liệu...</p>
              )}
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
