// Dance Log - 練習ログフォーム
import { useState } from 'react';
import { X, Plus, Minus, Tag, Clock } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PracticeLog, LogItem, getTodayStr } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import RatingStars from '@/components/RatingStars';
import GenreBadge from '@/components/GenreBadge';

interface LogFormProps {
  existing?: PracticeLog;
  initialDate?: string;
  onClose: () => void;
}

export default function LogForm({ existing, initialDate, onClose }: LogFormProps) {
  const { data, addLog, updateLog } = useData();
  const [date, setDate] = useState(existing?.date ?? initialDate ?? getTodayStr());
  const [items, setItems] = useState<LogItem[]>(existing?.items ?? []);
  const [memo, setMemo] = useState(existing?.memo ?? '');
  const [feeling, setFeeling] = useState(existing?.feeling ?? '');
  const [rating, setRating] = useState<1|2|3|4|5>(existing?.rating ?? 3);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(existing?.tags ?? []);
  const [showBasicPicker, setShowBasicPicker] = useState(false);

  const addItem = (basicId: string) => {
    if (items.some(i => i.basicId === basicId)) return;
    setItems(prev => [...prev, { basicId, minutes: 10 }]);
    setShowBasicPicker(false);
  };

  const removeItem = (basicId: string) => {
    setItems(prev => prev.filter(i => i.basicId !== basicId));
  };

  const updateMinutes = (basicId: string, delta: number) => {
    setItems(prev => prev.map(i =>
      i.basicId === basicId
        ? { ...i, minutes: Math.max(5, Math.min(120, i.minutes + delta)) }
        : i
    ));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  const totalMinutes = items.reduce((s, i) => s + i.minutes, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const payload = { date, items, memo, feeling, rating, tags };
    if (existing) {
      updateLog(existing.id, payload);
    } else {
      addLog(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card rounded-t-2xl border-t border-border/50 max-h-[92vh] flex flex-col">
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/40 sticky top-0 bg-card z-10">
          <h2 className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {existing ? '練習ログを編集' : '練習を記録する'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <form id="log-form" onSubmit={handleSubmit} className="px-4 py-4 space-y-5 overflow-y-auto flex-1 pb-2">
          {/* 日付 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">日付</Label>
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-background border-border/50"
            />
          </div>

          {/* 練習項目 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs text-muted-foreground">練習した項目 *</Label>
              {totalMinutes > 0 && (
                <span className="text-xs text-primary font-medium dl-number">
                  合計 {totalMinutes}分
                </span>
              )}
            </div>

            {items.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-xs border border-dashed border-border/50 rounded-lg">
                項目を追加してください
              </div>
            ) : (
              <div className="space-y-2 mb-2">
                {items.map(item => {
                  const basic = data.basics.find(b => b.id === item.basicId);
                  const genre = data.genres.find(g => g.id === basic?.genreId);
                  if (!basic) return null;
                  return (
                    <div key={item.basicId} className="flex items-center gap-2 bg-background rounded-lg px-3 py-2 border border-border/30">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground">{basic.title}</div>
                        {genre && <div className="text-[10px] text-muted-foreground">{genre.name}</div>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => updateMinutes(item.basicId, -5)}
                          className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium dl-number w-12 text-center">{item.minutes}分</span>
                        <button type="button" onClick={() => updateMinutes(item.basicId, 5)}
                          className="w-6 h-6 rounded bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Plus size={12} />
                        </button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.basicId)}
                        className="p-1 text-muted-foreground/50 hover:text-red-400 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowBasicPicker(true)}
              className="w-full py-2 rounded-lg border border-dashed border-primary/40 text-primary text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> 項目を追加
            </button>
          </div>

          {/* 評価 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">今日の出来</Label>
            <RatingStars rating={rating} onChange={v => setRating(v as 1|2|3|4|5)} size={24} />
          </div>

          {/* メモ */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">練習メモ</Label>
            <Textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="今日やったこと、気づいたこと..."
              className="bg-background border-border/50 resize-none text-sm"
              rows={2}
            />
          </div>

          {/* 感想 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">感想・振り返り</Label>
            <Textarea
              value={feeling}
              onChange={e => setFeeling(e.target.value)}
              placeholder="できた感じ、課題、次回への意気込みなど..."
              className="bg-background border-border/50 resize-none text-sm"
              rows={2}
            />
          </div>

          {/* タグ */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Tag size={11} /> タグ
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="タグを入力してEnter"
                className="bg-background border-border/50 text-sm h-8 flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={addTag} className="h-8 px-3 text-xs">
                追加
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map(t => (
                  <span key={t} className="flex items-center gap-1 bg-primary/15 text-primary text-xs px-2 py-0.5 rounded">
                    {t}
                    <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

        </form>

        {/* ボタン - 常に下部に固定 */}
        <div className="flex gap-2 px-4 py-3 border-t border-border/40 bg-card">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            キャンセル
          </Button>
          <Button type="submit" form="log-form" className="flex-1" disabled={items.length === 0}>
            {existing ? '更新する' : '記録する'}
          </Button>
        </div>
      </div>

      {/* 基礎練ピッカー */}
      {showBasicPicker && (
        <BasicPicker
          selectedIds={items.map(i => i.basicId)}
          onSelect={addItem}
          onClose={() => setShowBasicPicker(false)}
        />
      )}
    </div>
  );
}

// 基礎練ピッカー
function BasicPicker({
  selectedIds, onSelect, onClose
}: {
  selectedIds: string[];
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const { data } = useData();
  const [searchQ, setSearchQ] = useState('');
  const [filterGenreId, setFilterGenreId] = useState<string>('');

  const filtered = data.basics.filter(b => {
    const matchSearch = !searchQ || b.title.includes(searchQ);
    const matchGenre = !filterGenreId || b.genreId === filterGenreId;
    return matchSearch && matchGenre;
  });

  return (
    <div className="fixed inset-0 z-60 flex items-end justify-center bg-black/70">
      <div className="w-full max-w-lg bg-card rounded-t-2xl border-t border-border/50 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <h3 className="font-semibold text-sm">練習項目を選択</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground"><X size={16} /></button>
        </div>
        <div className="px-3 py-2 border-b border-border/30 space-y-2">
          <Input
            placeholder="検索..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="bg-background border-border/40 h-8 text-sm"
          />
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilterGenreId('')}
              className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                !filterGenreId ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              すべて
            </button>
            {data.genres.map(g => (
              <button
                key={g.id}
                onClick={() => setFilterGenreId(g.id === filterGenreId ? '' : g.id)}
                className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-medium transition-colors`}
                style={filterGenreId === g.id
                  ? { backgroundColor: g.color + '30', color: g.color, border: `1px solid ${g.color}50` }
                  : { backgroundColor: 'transparent', color: 'var(--muted-foreground)' }
                }
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-y-auto flex-1 px-3 py-2 space-y-1">
          {filtered.map(b => {
            const genre = data.genres.find(g => g.id === b.genreId);
            const isSelected = selectedIds.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => !isSelected && onSelect(b.id)}
                disabled={isSelected}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'opacity-40 cursor-not-allowed bg-muted/30'
                    : 'hover:bg-muted/50'
                }`}
              >
                {genre && (
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: genre.color }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{b.title}</div>
                  {genre && <div className="text-[10px] text-muted-foreground">{genre.name}</div>}
                </div>
                {isSelected && <span className="text-[10px] text-muted-foreground">追加済み</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
