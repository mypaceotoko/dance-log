// Dance Log - 練習ログフォーム
// ボトムシート構造: ボトムナビ(80px)の上から表示
// BasicPickerはインラインドロップダウンとして実装（z-index問題を回避）
import { useState } from 'react';
import { X, Plus, Minus, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { PracticeLog, LogItem, getTodayStr } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import RatingStars from '@/components/RatingStars';

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
  const [showPicker, setShowPicker] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [filterGenreId, setFilterGenreId] = useState('');

  const addItem = (basicId: string) => {
    if (items.some(i => i.basicId === basicId)) return;
    setItems(prev => [...prev, { basicId, minutes: 10 }]);
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

  const handleSave = () => {
    if (items.length === 0) return;
    const payload = { date, items, memo, feeling, rating, tags };
    if (existing) {
      updateLog(existing.id, payload);
    } else {
      addLog(payload);
    }
    onClose();
  };

  const filteredBasics = data.basics.filter(b => {
    const matchSearch = !searchQ || b.title.toLowerCase().includes(searchQ.toLowerCase());
    const matchGenre = !filterGenreId || b.genreId === filterGenreId;
    return matchSearch && matchGenre;
  });

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 z-[100]"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      {/* シート本体: ボトムナビの上から表示 */}
      <div
        className="fixed left-0 right-0 z-[101] flex flex-col rounded-t-2xl border-t border-white/10 max-w-lg mx-auto"
        style={{
          bottom: '80px',
          top: '10dvh',
          backgroundColor: 'hsl(222 47% 11%)',
        }}
      >
        {/* ── ヘッダー（固定） ── */}
        <div
          className="flex items-center justify-between px-4 border-b border-white/10"
          style={{ paddingTop: '1rem', paddingBottom: '1rem', flexShrink: 0 }}
        >
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1rem', color: 'white' }}>
            {existing ? '練習ログを編集' : '練習を記録する'}
          </h2>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', color: '#94a3b8', background: 'transparent', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── スクロール可能エリア ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

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
                <span className="text-xs text-primary font-medium">合計 {totalMinutes}分</span>
              )}
            </div>

            {/* 追加済み項目 */}
            {items.length > 0 && (
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
                        <span className="text-sm font-medium w-12 text-center">{item.minutes}分</span>
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

            {/* + 項目を追加ボタン */}
            <button
              type="button"
              onClick={() => setShowPicker(prev => !prev)}
              className="w-full py-2.5 rounded-lg border border-dashed border-primary/40 text-primary text-sm hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} />
              項目を追加
              {showPicker ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* インラインピッカー */}
            {showPicker && (
              <div className="mt-2 rounded-xl border border-border/50 overflow-hidden" style={{ backgroundColor: 'hsl(222 47% 8%)' }}>
                {/* 検索・フィルター */}
                <div className="p-2 border-b border-border/30 flex gap-2">
                  <Input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="検索..."
                    className="bg-background border-border/50 text-sm h-8 flex-1"
                    autoFocus={false}
                  />
                  <select
                    value={filterGenreId}
                    onChange={e => setFilterGenreId(e.target.value)}
                    className="bg-background border border-border/50 rounded-md text-xs px-2 h-8 text-foreground"
                  >
                    <option value="">全ジャンル</option>
                    {data.genres.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                {/* 基礎練リスト */}
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {filteredBasics.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-xs">該当なし</div>
                  ) : (
                    filteredBasics.map(b => {
                      const genre = data.genres.find(g => g.id === b.genreId);
                      const isSelected = items.some(i => i.basicId === b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            if (!isSelected) {
                              addItem(b.id);
                            } else {
                              removeItem(b.id);
                            }
                          }}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors ${
                            isSelected ? 'bg-primary/15' : 'hover:bg-muted/20'
                          }`}
                        >
                          {genre && (
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: genre.color }} />
                          )}
                          <span className="text-sm text-foreground flex-1">{b.title}</span>
                          <span className="text-[10px] text-muted-foreground">{genre?.name}</span>
                          {isSelected && (
                            <span className="text-primary text-xs font-bold">✓</span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* 閉じるボタン */}
                <div className="p-2 border-t border-border/30">
                  <button
                    type="button"
                    onClick={() => setShowPicker(false)}
                    className="w-full py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    閉じる
                  </button>
                </div>
              </div>
            )}
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
        </div>

        {/* ── フッター（固定） ── */}
        <div
          className="flex gap-2 border-t border-white/10"
          style={{
            padding: '0.75rem 1rem',
            flexShrink: 0,
            backgroundColor: 'hsl(222 47% 11%)',
          }}
        >
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            キャンセル
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={items.length === 0}
            className="flex-1"
          >
            {existing ? '更新する' : '記録する'}
          </Button>
        </div>
      </div>
    </>
  );
}
