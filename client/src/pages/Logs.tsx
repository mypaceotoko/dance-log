// Dance Log - 練習ログページ
// Dark Studio / Cinematic Minimal Design
import { useState, useMemo } from 'react';
import { Plus, Search, Filter, Clock, Star, ChevronRight, Edit2, Trash2, Tag } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PracticeLog, formatDate, getDayOfWeek, getRatingLabel, getTodayStr } from '@/lib/store';
import PageHeader from '@/components/ui/PageHeader';
import LogForm from '@/components/forms/LogForm';
import RatingStars from '@/components/RatingStars';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Logs() {
  const { data, deleteLog } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editLog, setEditLog] = useState<PracticeLog | null>(null);
  const [selectedLog, setSelectedLog] = useState<PracticeLog | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  // 全タグ収集
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    data.logs.forEach(l => l.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [data.logs]);

  // フィルタリング
  const filteredLogs = useMemo(() => {
    return data.logs
      .filter(l => {
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const basicTitles = l.items.map(i => data.basics.find(b => b.id === i.basicId)?.title ?? '').join(' ');
          if (!l.memo.toLowerCase().includes(q) && !basicTitles.toLowerCase().includes(q) && !l.tags.some(t => t.toLowerCase().includes(q))) {
            return false;
          }
        }
        if (filterTag && !l.tags.includes(filterTag)) return false;
        if (filterRating > 0 && l.rating !== filterRating) return false;
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [data.logs, data.basics, searchQuery, filterTag, filterRating]);

  const handleDelete = (log: PracticeLog) => {
    if (confirm('このログを削除しますか？')) {
      deleteLog(log.id);
      if (selectedLog?.id === log.id) setSelectedLog(null);
      toast.success('削除しました');
    }
  };

  // 詳細表示
  if (selectedLog) {
    return (
      <LogDetail
        log={selectedLog}
        onBack={() => setSelectedLog(null)}
        onEdit={() => { setEditLog(selectedLog); setSelectedLog(null); }}
        onDelete={() => handleDelete(selectedLog)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="練習ログ"
        subtitle={`${data.logs.length}件の記録`}
        rightAction={
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1 text-xs h-8">
            <Plus size={14} /> 記録
          </Button>
        }
      />

      <div className="px-4 py-3 max-w-lg mx-auto pb-nav">
        {/* 検索 */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ログを検索..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 bg-card border-border/50 text-sm h-9"
          />
        </div>

        {/* フィルター */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
          {/* 評価フィルター */}
          {[0, 5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setFilterRating(r === filterRating ? 0 : r)}
              className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterRating === r && r > 0 ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground border border-border/40'
              }`}
            >
              {r === 0 ? 'すべて' : '★'.repeat(r)}
            </button>
          ))}
        </div>

        {/* タグフィルター */}
        {allTags.length > 0 && (
          <div className="flex gap-1.5 mb-4 overflow-x-auto no-scrollbar pb-1">
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setFilterTag(t === filterTag ? '' : t)}
                className={`flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                  filterTag === t
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-card text-muted-foreground border border-border/30'
                }`}
              >
                <Tag size={9} /> {t}
              </button>
            ))}
          </div>
        )}

        {/* ログ一覧 */}
        {filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Clock className="mx-auto mb-3 opacity-30" size={40} />
            <p className="text-sm">練習ログがありません</p>
            <p className="text-xs mt-1">「記録」ボタンで今日の練習を記録しよう</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredLogs.map((log, i) => (
              <LogCard
                key={log.id}
                log={log}
                delay={i}
                onClick={() => setSelectedLog(log)}
                onEdit={() => setEditLog(log)}
                onDelete={() => handleDelete(log)}
              />
            ))}
          </div>
        )}
      </div>

      {(showForm || editLog) && (
        <LogForm
          existing={editLog ?? undefined}
          onClose={() => { setShowForm(false); setEditLog(null); }}
        />
      )}
    </div>
  );
}

// ログカード
function LogCard({
  log, delay, onClick, onEdit, onDelete
}: {
  log: PracticeLog; delay: number;
  onClick: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const { data } = useData();
  const totalMinutes = log.items.reduce((s, i) => s + i.minutes, 0);
  const isToday = log.date === getTodayStr();

  return (
    <div
      className="dl-card animate-slide-up opacity-0"
      style={{ animationDelay: `${delay * 0.04}s`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-start gap-3">
        {/* 日付 */}
        <div className="flex-shrink-0 text-center w-10">
          <div className="text-lg font-bold dl-number text-foreground leading-none">
            {new Date(log.date).getDate()}
          </div>
          <div className="text-[10px] text-muted-foreground">{getDayOfWeek(log.date)}</div>
          {isToday && (
            <div className="text-[9px] text-primary font-semibold mt-0.5">TODAY</div>
          )}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-center gap-2 mb-1">
            <RatingStars rating={log.rating} size={12} />
            <span className="text-xs text-muted-foreground dl-number">{totalMinutes}分</span>
          </div>

          {/* 練習項目 */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {log.items.slice(0, 3).map(item => {
              const basic = data.basics.find(b => b.id === item.basicId);
              const genre = data.genres.find(g => g.id === basic?.genreId);
              if (!basic) return null;
              return (
                <span
                  key={item.basicId}
                  className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                  style={genre ? {
                    backgroundColor: genre.color + '20',
                    color: genre.color,
                  } : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}
                >
                  {basic.title} {item.minutes}分
                </span>
              );
            })}
            {log.items.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{log.items.length - 3}</span>
            )}
          </div>

          {log.memo && (
            <p className="text-xs text-muted-foreground line-clamp-1">{log.memo}</p>
          )}

          {log.tags.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {log.tags.slice(0, 3).map(t => (
                <span key={t} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* アクション */}
        <div className="flex flex-col gap-1 flex-shrink-0">
          <button onClick={onEdit} className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors">
            <Edit2 size={13} />
          </button>
          <button onClick={onDelete} className="p-1 text-muted-foreground/50 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ログ詳細
function LogDetail({
  log, onBack, onEdit, onDelete
}: {
  log: PracticeLog; onBack: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const { data } = useData();
  const totalMinutes = log.items.reduce((s, i) => s + i.minutes, 0);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={formatDate(log.date)}
        subtitle={`${getDayOfWeek(log.date)}曜日`}
        showBack
        onBack={onBack}
        rightAction={
          <div className="flex gap-1">
            <button onClick={onEdit} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Edit2 size={18} />
            </button>
            <button onClick={onDelete} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        }
      />

      <div className="px-4 py-4 max-w-lg mx-auto pb-nav space-y-4 animate-fade-in">
        {/* サマリー */}
        <div className="flex gap-3">
          <div className="dl-card flex-1 text-center">
            <div className="text-2xl font-bold dl-number text-primary">{totalMinutes}</div>
            <div className="text-xs text-muted-foreground">分</div>
          </div>
          <div className="dl-card flex-1 text-center">
            <div className="text-2xl font-bold dl-number text-foreground">{log.items.length}</div>
            <div className="text-xs text-muted-foreground">項目</div>
          </div>
          <div className="dl-card flex-1 flex flex-col items-center justify-center">
            <RatingStars rating={log.rating} size={16} />
            <div className="text-xs text-muted-foreground mt-1">{getRatingLabel(log.rating)}</div>
          </div>
        </div>

        {/* 練習項目 */}
        <div className="dl-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">練習内容</h3>
          <div className="space-y-2">
            {log.items.map(item => {
              const basic = data.basics.find(b => b.id === item.basicId);
              const genre = data.genres.find(g => g.id === basic?.genreId);
              if (!basic) return null;
              return (
                <div key={item.basicId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {genre && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: genre.color }} />}
                    <span className="text-sm text-foreground">{basic.title}</span>
                    {genre && <span className="text-[10px] text-muted-foreground">{genre.name}</span>}
                  </div>
                  <span className="text-sm font-medium dl-number text-primary">{item.minutes}分</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* メモ */}
        {log.memo && (
          <div className="dl-card">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">メモ</h3>
            <p className="text-sm text-foreground leading-relaxed">{log.memo}</p>
          </div>
        )}

        {/* 感想 */}
        {log.feeling && (
          <div className="dl-card border-l-2 border-primary/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">感想・振り返り</h3>
            <p className="text-sm text-foreground leading-relaxed">{log.feeling}</p>
          </div>
        )}

        {/* タグ */}
        {log.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {log.tags.map(t => (
              <span key={t} className="flex items-center gap-1 bg-primary/15 text-primary text-xs px-2.5 py-1 rounded-full">
                <Tag size={10} /> {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
