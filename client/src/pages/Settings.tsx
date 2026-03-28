// Dance Log - 設定ページ
// Dark Studio / Cinematic Minimal Design
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, ChevronRight, AlertTriangle } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Genre, GENRE_COLORS } from '@/lib/store';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Settings() {
  const { data, addGenre, updateGenre, deleteGenre, resetData } = useData();
  const [showGenreForm, setShowGenreForm] = useState(false);
  const [editGenre, setEditGenre] = useState<Genre | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDeleteGenre = (genre: Genre) => {
    const basicCount = data.basics.filter(b => b.genreId === genre.id).length;
    if (basicCount > 0) {
      if (!confirm(`「${genre.name}」を削除すると、${basicCount}件の基礎練も削除されます。続けますか？`)) return;
    }
    deleteGenre(genre.id);
    toast.success('ジャンルを削除しました');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="設定" subtitle="ジャンル管理・データ管理" />

      <div className="px-4 py-3 max-w-lg mx-auto pb-nav space-y-5">
        {/* ジャンル管理 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              ジャンル管理
            </h2>
            <Button size="sm" onClick={() => setShowGenreForm(true)} className="gap-1 text-xs h-7">
              <Plus size={12} /> 追加
            </Button>
          </div>

          <div className="space-y-2">
            {data.genres.map((genre, i) => {
              const count = data.basics.filter(b => b.genreId === genre.id).length;
              return (
                <div
                  key={genre.id}
                  className="dl-card flex items-center gap-3 animate-slide-up opacity-0"
                  style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: genre.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{genre.name}</div>
                    <div className="text-[10px] text-muted-foreground">{count}項目</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditGenre(genre)}
                      className="p-1.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteGenre(genre)}
                      className="p-1.5 text-muted-foreground/50 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* データ管理 */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            データ管理
          </h2>
          <div className="space-y-2">
            <div className="dl-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">データのエクスポート</div>
                  <div className="text-xs text-muted-foreground">JSONファイルとして保存</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7"
                  onClick={() => {
                    const json = JSON.stringify(data, null, 2);
                    const blob = new Blob([json], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dance-log-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('エクスポートしました');
                  }}
                >
                  エクスポート
                </Button>
              </div>
            </div>

            <div className="dl-card border border-red-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">データを初期化</div>
                  <div className="text-xs text-muted-foreground">すべてのデータを削除して初期状態に戻します</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-red-500/40 text-red-400 hover:bg-red-500/10"
                  onClick={() => setShowResetConfirm(true)}
                >
                  初期化
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* アプリ情報 */}
        <section>
          <h2 className="text-sm font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            アプリ情報
          </h2>
          <div className="dl-card space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">バージョン</span>
              <span className="text-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">登録ジャンル数</span>
              <span className="text-foreground dl-number">{data.genres.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">登録基礎練数</span>
              <span className="text-foreground dl-number">{data.basics.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">練習ログ数</span>
              <span className="text-foreground dl-number">{data.logs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">苦手項目数</span>
              <span className="text-foreground dl-number">{data.weakPoints.length}</span>
            </div>
          </div>
        </section>
      </div>

      {/* ジャンルフォーム */}
      {(showGenreForm || editGenre) && (
        <GenreForm
          existing={editGenre ?? undefined}
          onClose={() => { setShowGenreForm(false); setEditGenre(null); }}
        />
      )}

      {/* 初期化確認 */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-card rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400" />
              <h3 className="font-bold text-foreground">データを初期化しますか？</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              すべての練習ログ、基礎練、苦手項目が削除されます。この操作は取り消せません。
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowResetConfirm(false)} className="flex-1">
                キャンセル
              </Button>
              <Button
                onClick={() => { resetData(); setShowResetConfirm(false); }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              >
                初期化する
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ジャンルフォーム
function GenreForm({ existing, onClose }: { existing?: Genre; onClose: () => void }) {
  const { addGenre, updateGenre } = useData();
  const [name, setName] = useState(existing?.name ?? '');
  const [color, setColor] = useState(existing?.color ?? '#84CC16');

  const presetColors = Object.values(GENRE_COLORS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (existing) {
      updateGenre(existing.id, { name: name.trim(), color });
      toast.success('ジャンルを更新しました');
    } else {
      addGenre(name.trim(), color);
      toast.success('ジャンルを追加しました');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card rounded-t-2xl border-t border-border/50">
        <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
          <h2 className="font-bold text-base">{existing ? 'ジャンルを編集' : 'ジャンルを追加'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">ジャンル名 *</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: HIPHOP, POPPING"
              className="bg-background border-border/50"
              required
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">カラー</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetColors.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white/50' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs text-muted-foreground">カスタムカラー</span>
            </div>
          </div>
          <div className="flex gap-2 pb-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">キャンセル</Button>
            <Button type="submit" className="flex-1">{existing ? '更新する' : '追加する'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
