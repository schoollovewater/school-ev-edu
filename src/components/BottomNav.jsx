import { NavLink } from 'react-router-dom';
import { BookOpen, Map as MapIcon, Target, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
  const navItems = [
    { name: 'Từ điển', path: '/', icon: BookOpen },
    { name: 'Sơ đồ', path: '/map', icon: MapIcon },
    { name: 'Quiz', path: '/quiz', icon: Target },
    { name: 'AI', path: '/ai', icon: Sparkles },
    { name: 'Cài đặt', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              )
            }
          >
            <item.icon className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium tracking-wide">
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
