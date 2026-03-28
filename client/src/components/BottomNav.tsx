// Dance Log - ボトムナビゲーション
// Dark Studio / Cinematic Minimal Design
import { Link, useLocation } from 'wouter';
import { Home, BookOpen, ClipboardList, AlertTriangle, BarChart2 } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'ホーム', icon: Home },
  { path: '/library', label: 'ライブラリ', icon: BookOpen },
  { path: '/logs', label: 'ログ', icon: ClipboardList },
  { path: '/weak', label: '苦手', icon: AlertTriangle },
  { path: '/dashboard', label: '成長', icon: BarChart2 },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location === '/' : location.startsWith(path);
          return (
            <Link key={path} href={path}>
              <button
                className={`flex flex-col items-center gap-0.5 px-3 py-2.5 min-w-[56px] transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? 'drop-shadow-[0_0_6px_rgba(132,204,22,0.6)]' : ''}
                />
                <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
