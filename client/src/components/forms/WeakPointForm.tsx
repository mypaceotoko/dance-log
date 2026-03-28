// Dance Log - 苦手項目フォーム
import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { WeakPoint } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface WeakPointFormProps {
  existing?: WeakPoint;
  onClose: () => void;
}

export default function WeakPointForm({ existing, onClose }: WeakPointFormProps) {
  const { data, addWeakPoint, updateWeakPoint } = useData();
  const [title, setTitle] = useState(existing?.title ?? '');
  const [reason, setReason] = useState(existing?.reason ?? '');
  const [improvement, setImprovement] = useState(existing?.improvement ?? '');
  const [priority, setPriority] = useState<1 | 2 | 3>(existing?.priority ?? 2);
  const [relatedBasicIds, setRelatedBasicIds] = useState<string[]>(existing?.relatedBasicIds ?? []);
  const [showBasicPicker, setShowBasicPicker] = useState(false);

  const toggleBasic = (id: string) => {
    setRelatedBasicIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(), reason, improvement,
      priority, relatedBasicIds, isDone: existing?.isDone ?? false,
    };
    if (existing) {
      updateWeakPoint(existing.id, payload);
    } else {
      addWeakPoint(payload);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">      <div className="w-full max-w-lg bg-card rounded-t-2xl border-t border-border/50 max-h-[90vh] flex flex-col">        <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
          <h2 className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {existing ? '課題を編集' : '苦手を追加'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4 overflow-y-auto flex-1 pb-6">
          {/* タイトル */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">苦手・課題 *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例: 鏡を見ると崩れる、リズムが走る"
              className="bg-background border-border/50"
              required
            />
          </div>

          {/* 理由 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">理由・悩み</Label>
            <Textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="なぜ苦手なのか、どんな状況で困るか..."
              className="bg-background border-border/50 resize-none text-sm"
              rows={2}
            />
          </div>

          {/* 改善方法 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">改善方法・目標</Label>
            <Textarea
              value={improvement}
              onChange={e => setImprovement(e.target.value)}
              placeholder="どう改善したいか、取り組み方..."
              className="bg-background border-border/50 resize-none text-sm"
              rows={2}
            />
          </div>

          {/* 優先度 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">優先度</Label>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    priority === p
                      ? p === 3 ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : p === 2 ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
                        : 'bg-slate-500/20 border-slate-500/50 text-slate-400'
                      : 'bg-background border-border/30 text-muted-foreground'
                  }`}
                >
                  {p === 3 ? '高' : p === 2 ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>

          {/* 関連基礎練 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">関連する基礎練</Label>
            {relatedBasicIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {relatedBasicIds.map(id => {
                  const basic = data.basics.find(b => b.id === id);
                  const genre = data.genres.find(g => g.id === basic?.genreId);
                  if (!basic) return null;
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                      style={genre ? {
                        backgroundColor: genre.color + '20',
                        color: genre.color,
                        border: `1px solid ${genre.color}40`,
                      } : {}}
                    >
                      {basic.title}
                      <button type="button" onClick={() => toggleBasic(id)} className="hover:opacity-70">
                        <X size={10} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowBasicPicker(!showBasicPicker)}
              className="w-full py-2 rounded-lg border border-dashed border-border/50 text-muted-foreground text-sm hover:border-primary/40 hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> 基礎練を関連付ける
            </button>

            {showBasicPicker && (
              <div className="mt-2 bg-background rounded-lg border border-border/50 max-h-40 overflow-y-auto">
                {data.basics.map(b => {
                  const genre = data.genres.find(g => g.id === b.genreId);
                  const isSelected = relatedBasicIds.includes(b.id);
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => toggleBasic(b.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-muted/30 transition-colors ${isSelected ? 'bg-primary/10' : ''}`}
                    >
                      {genre && <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: genre.color }} />}
                      <span className="text-sm text-foreground">{b.title}</span>
                      <span className="text-[10px] text-muted-foreground">{genre?.name}</span>
                      {isSelected && <span className="ml-auto text-primary text-xs">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ボタン */}
          <div className="flex gap-2 pt-2 pb-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              キャンセル
            </Button>
            <Button type="submit" className="flex-1">
              {existing ? '更新する' : '追加する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
