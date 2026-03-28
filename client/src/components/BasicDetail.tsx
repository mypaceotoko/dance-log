// Dance Log - 基礎練詳細ビュー
import { useState } from 'react';
import { Youtube, Link as LinkIcon, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { Basic, Genre, getPriorityLabel, getPriorityColor } from '@/lib/store';
import PageHeader from '@/components/ui/PageHeader';
import GenreBadge from '@/components/GenreBadge';
import BasicForm from '@/components/forms/BasicForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BasicDetailProps {
  basic: Basic;
  genre: Genre;
  onBack: () => void;
}

export default function BasicDetail({ basic, genre, onBack }: BasicDetailProps) {
  const { deleteBasic, updateBasic } = useData();
  const [showEdit, setShowEdit] = useState(false);

  const handleDelete = () => {
    if (confirm(`「${basic.title}」を削除しますか？`)) {
      deleteBasic(basic.id);
      onBack();
      toast.success('削除しました');
    }
  };

  const toggleWeakPoint = () => {
    updateBasic(basic.id, { isWeakPoint: !basic.isWeakPoint });
    toast.success(basic.isWeakPoint ? '苦手フラグを外しました' : '苦手項目にマークしました');
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={basic.title}
        showBack
        onBack={onBack}
        rightAction={
          <div className="flex gap-1">
            <button
              onClick={() => setShowEdit(true)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        }
      />

      <div className="px-4 py-4 max-w-lg mx-auto pb-nav space-y-4 animate-fade-in">
        {/* ジャンル・優先度・苦手フラグ */}
        <div className="flex flex-wrap items-center gap-2">
          <GenreBadge name={genre.name} color={genre.color} size="md" />
          <span className={`text-xs font-medium ${getPriorityColor(basic.priority)}`}>
            優先度: {getPriorityLabel(basic.priority)}
          </span>
          {basic.isWeakPoint && (
            <span className="text-xs bg-red-500/15 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
              ⚠️ 苦手
            </span>
          )}
        </div>

        {/* 説明メモ */}
        {basic.memo && (
          <div className="dl-card">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">説明</h3>
            <p className="text-sm text-foreground leading-relaxed">{basic.memo}</p>
          </div>
        )}

        {/* 練習のコツ */}
        {basic.tips && (
          <div className="dl-card border-l-2" style={{ borderLeftColor: genre.color }}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              💡 練習のコツ
            </h3>
            <p className="text-sm text-foreground leading-relaxed">{basic.tips}</p>
          </div>
        )}

        {/* YouTubeリンク */}
        {basic.youtubeUrl && (
          <a
            href={basic.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dl-card flex items-center gap-3 hover:border-red-500/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <Youtube size={20} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">YouTube で見る</div>
              <div className="text-xs text-muted-foreground truncate">{basic.youtubeUrl}</div>
            </div>
            <ExternalLink size={14} className="text-muted-foreground/50 flex-shrink-0" />
          </a>
        )}

        {/* 参考リンク */}
        {basic.referenceUrl && (
          <a
            href={basic.referenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="dl-card flex items-center gap-3 hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
              <LinkIcon size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">参考リンク</div>
              <div className="text-xs text-muted-foreground truncate">{basic.referenceUrl}</div>
            </div>
            <ExternalLink size={14} className="text-muted-foreground/50 flex-shrink-0" />
          </a>
        )}

        {/* アクション */}
        <div className="pt-2">
          <Button
            variant="outline"
            onClick={toggleWeakPoint}
            className={`w-full ${basic.isWeakPoint ? 'border-red-500/40 text-red-400 hover:bg-red-500/10' : ''}`}
          >
            {basic.isWeakPoint ? '苦手フラグを外す' : '苦手項目としてマーク'}
          </Button>
        </div>
      </div>

      {showEdit && (
        <BasicForm
          genreId={basic.genreId}
          existing={basic}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
