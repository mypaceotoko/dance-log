// Dance Log - ページヘッダーコンポーネント
import { ArrowLeft, Settings } from 'lucide-react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  settingsTo?: string;
}

export default function PageHeader({
  title, subtitle, showBack, backTo, onBack, rightAction, settingsTo
}: PageHeaderProps) {
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/40 px-4 py-3">
      <div className="flex items-center gap-3 max-w-lg mx-auto">
        {showBack && (
          <button
            onClick={() => onBack ? onBack() : backTo ? navigate(backTo) : history.back()}
            className="p-1.5 -ml-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-foreground leading-tight truncate"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        {rightAction}
        {settingsTo && (
          <Link href={settingsTo}>
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Settings size={20} />
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
