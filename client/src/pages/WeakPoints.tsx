// Dance Log - 苦手項目管理ページ
// Dark Studio / Cinematic Minimal Design
import { useState } from 'react';
import { Plus, CheckCircle, Circle, Edit2, Trash2, ChevronRight, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { WeakPoint, getPriorityLabel, getPriorityColor, formatDate } from '@/lib/store';
import PageHeader from '@/components/ui/PageHeader';
import WeakPointForm from '@/components/forms/WeakPointForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function WeakPoints() {
  const { data, deleteWeakPoint, markWeakPointDone } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editWp, setEditWp] = useState<WeakPoint | null>(null);
  const [selectedWp, setSelectedWp] = useState<WeakPoint | null>(null);
  const [showDone, setShowDone] = useState(false);

  const activeWps = data.weakPoints.filter(w => !w.isDone);
  const doneWps = data.weakPoints.filter(w => w.isDone);

  const handleDelete = (wp: WeakPoint) => {
    if (confirm(`「${wp.title}」を削除しますか？`)) {
      deleteWeakPoint(wp.id);
      if (selectedWp?.id === wp.id) setSelectedWp(null);
      toast.success('削除しました');
    }
  };

  const handleDone = (wp: WeakPoint) => {
    markWeakPointDone(wp.id);
    toast.success('課題を解決済みにしました 🎉');
  };

  // 詳細表示
  if (selectedWp) {
    return (
      <WeakPointDetail
        wp={selectedWp}
        onBack={() => setSelectedWp(null)}
        onEdit={() => { setEditWp(selectedWp); setSelectedWp(null); }}
        onDelete={() => handleDelete(selectedWp)}
        onDone={() => { handleDone(selectedWp); setSelectedWp(null); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="苦手項目"
        subtitle={`${activeWps.length}件の課題`}
        rightAction={
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1 text-xs h-8">
            <Plus size={14} /> 追加
          </Button>
        }
      />

      <div className="px-4 py-3 max-w-lg mx-auto pb-nav">
        {/* アクティブな課題 */}
        {activeWps.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CheckCircle className="mx-auto mb-3 opacity-30" size={40} />
            <p className="text-sm">課題がありません</p>
            <p className="text-xs mt-1">「追加」ボタンで苦手を登録しよう</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {activeWps
              .sort((a, b) => b.priority - a.priority)
              .map((wp, i) => (
                <WeakPointCard
                  key={wp.id}
                  wp={wp}
                  delay={i}
                  onClick={() => setSelectedWp(wp)}
                  onEdit={() => setEditWp(wp)}
                  onDelete={() => handleDelete(wp)}
                  onDone={() => handleDone(wp)}
                />
              ))}
          </div>
        )}

        {/* 解決済み */}
        {doneWps.length > 0 && (
          <div>
            <button
              onClick={() => setShowDone(!showDone)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 w-full"
            >
              <CheckCircle size={16} className="text-primary" />
              <span>解決済み ({doneWps.length}件)</span>
              <ChevronRight size={14} className={`ml-auto transition-transform ${showDone ? 'rotate-90' : ''}`} />
            </button>

            {showDone && (
              <div className="space-y-2">
                {doneWps.map((wp, i) => (
                  <div
                    key={wp.id}
                    className="dl-card opacity-60 animate-slide-up"
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground line-through">{wp.title}</div>
                        {wp.doneAt && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            解決: {formatDate(wp.doneAt)}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(wp)}
                        className="p-1 text-muted-foreground/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {(showForm || editWp) && (
        <WeakPointForm
          existing={editWp ?? undefined}
          onClose={() => { setShowForm(false); setEditWp(null); }}
        />
      )}
    </div>
  );
}

// 苦手カード
function WeakPointCard({
  wp, delay, onClick, onEdit, onDelete, onDone
}: {
  wp: WeakPoint; delay: number;
  onClick: () => void; onEdit: () => void; onDelete: () => void; onDone: () => void;
}) {
  const { data } = useData();
  const priorityBorderColor = wp.priority === 3 ? '#EF4444' : wp.priority === 2 ? '#F59E0B' : '#64748B';

  return (
    <div
      className="dl-card animate-slide-up opacity-0 border-l-2"
      style={{
        animationDelay: `${delay * 0.05}s`,
        animationFillMode: 'forwards',
        borderLeftColor: priorityBorderColor,
      }}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: priorityBorderColor }} />

        <div className="flex-1 min-w-0" onClick={onClick}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-foreground">{wp.title}</span>
            <span className={`text-[10px] font-medium ${getPriorityColor(wp.priority)}`}>
              {getPriorityLabel(wp.priority)}
            </span>
          </div>
          {wp.reason && (
            <p className="text-xs text-muted-foreground line-clamp-1">{wp.reason}</p>
          )}
          {wp.relatedBasicIds.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {wp.relatedBasicIds.slice(0, 2).map(id => {
                const basic = data.basics.find(b => b.id === id);
                const genre = data.genres.find(g => g.id === basic?.genreId);
                if (!basic) return null;
                return (
                  <span
                    key={id}
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={genre ? {
                      backgroundColor: genre.color + '20',
                      color: genre.color,
                    } : {}}
                  >
                    {basic.title}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 flex-shrink-0">
          <button onClick={onDone} className="p-1 text-muted-foreground/50 hover:text-primary transition-colors" title="解決済みにする">
            <CheckCircle size={15} />
          </button>
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

// 苦手詳細
function WeakPointDetail({
  wp, onBack, onEdit, onDelete, onDone
}: {
  wp: WeakPoint; onBack: () => void; onEdit: () => void; onDelete: () => void; onDone: () => void;
}) {
  const { data } = useData();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="課題の詳細"
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
        {/* タイトル・優先度 */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={18} className={getPriorityColor(wp.priority)} />
            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {wp.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${getPriorityColor(wp.priority)}`}>
              優先度: {getPriorityLabel(wp.priority)}
            </span>
            <span className="text-xs text-muted-foreground">
              登録: {formatDate(wp.createdAt)}
            </span>
          </div>
        </div>

        {/* 理由・悩み */}
        {wp.reason && (
          <div className="dl-card">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">理由・悩み</h3>
            <p className="text-sm text-foreground leading-relaxed">{wp.reason}</p>
          </div>
        )}

        {/* 改善方法 */}
        {wp.improvement && (
          <div className="dl-card border-l-2 border-primary/50">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              💡 改善方法
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{wp.improvement}</p>
          </div>
        )}

        {/* 関連基礎練 */}
        {wp.relatedBasicIds.length > 0 && (
          <div className="dl-card">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">関連する基礎練</h3>
            <div className="space-y-2">
              {wp.relatedBasicIds.map(id => {
                const basic = data.basics.find(b => b.id === id);
                const genre = data.genres.find(g => g.id === basic?.genreId);
                if (!basic) return null;
                return (
                  <button
                    key={id}
                    onClick={() => navigate('/library')}
                    className="w-full flex items-center gap-3 hover:bg-muted/30 rounded-lg px-2 py-1.5 transition-colors text-left"
                  >
                    {genre && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: genre.color }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{basic.title}</div>
                      {genre && <div className="text-[10px] text-muted-foreground">{genre.name}</div>}
                    </div>
                    <LinkIcon size={12} className="text-muted-foreground/40" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 解決済みボタン */}
        {!wp.isDone && (
          <Button onClick={onDone} className="w-full gap-2">
            <CheckCircle size={16} /> 解決済みにする
          </Button>
        )}
      </div>
    </div>
  );
}
