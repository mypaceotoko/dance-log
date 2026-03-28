// Dance Log - 基礎練ライブラリ
// Dark Studio / Cinematic Minimal Design
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, ChevronRight, Star, Youtube, AlertTriangle, Search } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Basic, Genre } from '@/lib/store';
import PageHeader from '@/components/ui/PageHeader';
import GenreBadge from '@/components/GenreBadge';
import BasicForm from '@/components/forms/BasicForm';
import BasicDetail from '@/components/BasicDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Library() {
  const { data } = useData();
  const [selectedGenreId, setSelectedGenreId] = useState<string | null>(null);
  const [selectedBasicId, setSelectedBasicId] = useState<string | null>(null);
  const [showAddBasic, setShowAddBasic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedGenre = data.genres.find(g => g.id === selectedGenreId);
  const selectedBasic = data.basics.find(b => b.id === selectedBasicId);

  // 詳細表示
  if (selectedBasic && selectedGenre) {
    return (
      <BasicDetail
        basic={selectedBasic}
        genre={selectedGenre}
        onBack={() => setSelectedBasicId(null)}
      />
    );
  }

  // ジャンル内の基礎練一覧
  if (selectedGenreId) {
    const basics = data.basics.filter(b => b.genreId === selectedGenreId);
    const filtered = searchQuery
      ? basics.filter(b => b.title.includes(searchQuery) || b.memo.includes(searchQuery))
      : basics;

    return (
      <div className="min-h-screen bg-background">
        <PageHeader
          title={selectedGenre?.name ?? ''}
          showBack
          onBack={() => setSelectedGenreId(null)}
          rightAction={
            <Button
              size="sm"
              onClick={() => setShowAddBasic(true)}
              className="gap-1 text-xs h-8"
            >
              <Plus size={14} /> 追加
            </Button>
          }
        />
        <div className="px-4 py-3 max-w-lg mx-auto pb-nav">
          {/* 検索 */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="項目を検索..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 bg-card border-border/50 text-sm h-9"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpenIcon className="mx-auto mb-3 opacity-30" size={40} />
              <p className="text-sm">基礎練がまだありません</p>
              <p className="text-xs mt-1">「追加」ボタンで登録してください</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((basic, i) => (
                <BasicCard
                  key={basic.id}
                  basic={basic}
                  genre={selectedGenre!}
                  delay={i}
                  onClick={() => setSelectedBasicId(basic.id)}
                />
              ))}
            </div>
          )}
        </div>

        {showAddBasic && (
          <BasicForm
            genreId={selectedGenreId}
            onClose={() => setShowAddBasic(false)}
          />
        )}
      </div>
    );
  }

  // ジャンル一覧
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="基礎練ライブラリ"
        subtitle="ジャンルを選んで練習メニューを管理"
        settingsTo="/settings"
      />
      <div className="px-4 py-3 max-w-lg mx-auto pb-nav">
        <div className="grid grid-cols-2 gap-3">
          {data.genres.map((genre, i) => {
            const count = data.basics.filter(b => b.genreId === genre.id).length;
            const weakCount = data.basics.filter(b => b.genreId === genre.id && b.isWeakPoint).length;
            return (
              <GenreCard
                key={genre.id}
                genre={genre}
                count={count}
                weakCount={weakCount}
                delay={i}
                onClick={() => setSelectedGenreId(genre.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ジャンルカード
function GenreCard({
  genre, count, weakCount, delay, onClick
}: {
  genre: Genre; count: number; weakCount: number; delay: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="dl-card-hover text-left animate-slide-up opacity-0 w-full"
      style={{ animationDelay: `${delay * 0.05}s`, animationFillMode: 'forwards' }}
    >
      <div
        className="w-8 h-1 rounded-full mb-3"
        style={{ backgroundColor: genre.color }}
      />
      <div className="font-bold text-sm text-foreground mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {genre.name}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{count}項目</span>
        {weakCount > 0 && (
          <span className="flex items-center gap-0.5 text-[10px] text-red-400">
            <AlertTriangle size={10} /> {weakCount}
          </span>
        )}
      </div>
      <ChevronRight size={14} className="absolute top-4 right-4 text-muted-foreground/50" />
    </button>
  );
}

// 基礎練カード
function BasicCard({
  basic, genre, delay, onClick
}: {
  basic: Basic; genre: Genre; delay: number; onClick: () => void;
}) {
  const priorityColors = ['', 'text-slate-400', 'text-yellow-400', 'text-red-400'];
  const priorityLabels = ['', '低', '中', '高'];

  return (
    <button
      onClick={onClick}
      className="dl-card-hover w-full text-left animate-slide-up opacity-0"
      style={{ animationDelay: `${delay * 0.04}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">{basic.title}</span>
            {basic.isWeakPoint && (
              <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded">苦手</span>
            )}
          </div>
          {basic.memo && (
            <p className="text-xs text-muted-foreground line-clamp-1">{basic.memo}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[10px] font-medium ${priorityColors[basic.priority]}`}>
              優先度: {priorityLabels[basic.priority]}
            </span>
            {basic.youtubeUrl && (
              <span className="flex items-center gap-0.5 text-[10px] text-red-400">
                <Youtube size={10} /> YouTube
              </span>
            )}
          </div>
        </div>
        <ChevronRight size={16} className="text-muted-foreground/40 flex-shrink-0 mt-0.5" />
      </div>
    </button>
  );
}

// アイコン（lucide-reactにBookOpenがあるので流用）
function BookOpenIcon({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size ?? 24}
      height={size ?? 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
