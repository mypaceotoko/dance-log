// Dance Log - 基礎練フォーム（追加・編集）
// ボトムシート構造: ボトムナビ(80px)の上から表示
import { useState } from 'react';
import { X, Youtube, Link as LinkIcon } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Basic } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BasicFormProps {
  genreId: string;
  existing?: Basic;
  onClose: () => void;
}

export default function BasicForm({ genreId, existing, onClose }: BasicFormProps) {
  const { addBasic, updateBasic } = useData();
  const [title, setTitle] = useState(existing?.title ?? '');
  const [memo, setMemo] = useState(existing?.memo ?? '');
  const [tips, setTips] = useState(existing?.tips ?? '');
  const [youtubeUrl, setYoutubeUrl] = useState(existing?.youtubeUrl ?? '');
  const [referenceUrl, setReferenceUrl] = useState(existing?.referenceUrl ?? '');
  const [priority, setPriority] = useState<1 | 2 | 3>(existing?.priority ?? 2);
  const [isWeakPoint, setIsWeakPoint] = useState(existing?.isWeakPoint ?? false);

  const handleSave = () => {
    if (!title.trim()) return;
    const payload = {
      genreId, title: title.trim(), memo, tips,
      youtubeUrl, referenceUrl, priority, isWeakPoint,
    };
    if (existing) {
      updateBasic(existing.id, payload);
    } else {
      addBasic(payload);
    }
    onClose();
  };

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
            {existing ? '基礎練を編集' : '基礎練を追加'}
          </h2>
          <button
            onClick={onClose}
            style={{ padding: '6px', borderRadius: '8px', color: '#94a3b8', background: 'transparent', border: 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── スクロール可能エリア ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* 項目名 */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">項目名 *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="例: HIT、GROOVE、フットワーク"
              className="bg-background border-border/50"
            />
          </div>

          {/* 説明メモ */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">説明メモ</Label>
            <Textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="この基礎練について..."
              className="bg-background border-border/50 resize-none text-sm"
              rows={2}
            />
          </div>

          {/* 練習のコツ */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">練習のコツ</Label>
            <Textarea
              value={tips}
              onChange={e => setTips(e.target.value)}
              placeholder="意識するポイント、コツなど..."
              className="bg-background border-border/50 resize-none text-sm"
              rows={2}
            />
          </div>

          {/* YouTubeリンク */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Youtube size={12} className="text-red-400" /> YouTubeリンク
            </Label>
            <Input
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="bg-background border-border/50 text-sm"
              type="url"
            />
          </div>

          {/* 参考リンク */}
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <LinkIcon size={12} /> 参考リンク
            </Label>
            <Input
              value={referenceUrl}
              onChange={e => setReferenceUrl(e.target.value)}
              placeholder="https://..."
              className="bg-background border-border/50 text-sm"
              type="url"
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

          {/* 苦手フラグ */}
          <div>
            <button
              type="button"
              onClick={() => setIsWeakPoint(!isWeakPoint)}
              className={`w-full py-2.5 rounded-lg text-sm font-medium border transition-all ${
                isWeakPoint
                  ? 'bg-red-500/15 border-red-500/40 text-red-400'
                  : 'bg-background border-border/30 text-muted-foreground'
              }`}
            >
              {isWeakPoint ? '⚠️ 苦手項目としてマーク中' : '苦手項目としてマーク'}
            </button>
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
            disabled={!title.trim()}
            className="flex-1"
          >
            {existing ? '更新する' : '追加する'}
          </Button>
        </div>
      </div>
    </>
  );
}
