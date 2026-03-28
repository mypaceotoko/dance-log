// Dance Log - ホームページ
// Dark Studio / Cinematic Minimal Design
import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Flame, Plus, ChevronRight, Clock, Zap, AlertTriangle, BookOpen, BarChart2 } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { suggestTodayMenu, getTodayStr, getStreakDays, getTotalMinutes, formatDateShort, getDayOfWeek } from '@/lib/store';
import LogForm from '@/components/forms/LogForm';
import GenreBadge from '@/components/GenreBadge';
import RatingStars from '@/components/RatingStars';
import { Button } from '@/components/ui/button';

const HERO_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663073731871/X9yTJySXcFPDXAwP8chonL/dance-log-hero-3hrn3WWNvufBh3bunCQWc4.webp';

export default function Home() {
  const { data } = useData();
  const [, navigate] = useLocation();
  const [showLogForm, setShowLogForm] = useState(false);

  const todayStr = getTodayStr();
  const todayLog = data.logs.find(l => l.date === todayStr);
  const streak = useMemo(() => getStreakDays(data.logs), [data.logs]);
  const suggestions = useMemo(() => suggestTodayMenu(data, 5), [data]);
  const activeWeakPoints = data.weakPoints.filter(w => !w.isDone).slice(0, 3);

  // 直近5件のログ
  const recentLogs = useMemo(() =>
    [...data.logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [data.logs]
  );

  // 今月の練習時間
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthLogs = data.logs.filter(l => l.date.startsWith(thisMonth));
  const monthMinutes = getTotalMinutes(monthLogs);

  return (
    <div className="min-h-screen bg-background pb-nav">
      {/* ヒーローヘッダー */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, rgba(15,23,42,0.3) 0%, rgba(15,23,42,0.85) 70%, rgba(15,23,42,1) 100%), url(${HERO_BG}) center/cover no-repeat`,
          minHeight: '180px',
        }}
      >
        <div className="px-4 pt-10 pb-6 max-w-lg mx-auto">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-primary font-semibold tracking-widest uppercase mb-1">
                {new Date().toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' })}
              </p>
              <h1 className="text-2xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Dance Log
              </h1>
              <p className="text-sm text-slate-300 mt-0.5">今日も練習しよう</p>
            </div>

            {/* 連続記録 */}
            <div className="text-center bg-black/40 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/10">
              <div className="flex items-center gap-1 justify-center">
                <Flame size={16} className={streak > 0 ? 'text-orange-400' : 'text-slate-500'} />
                <span className="text-2xl font-bold dl-number text-white">{streak}</span>
              </div>
              <div className="text-[10px] text-slate-400">連続記録</div>
            </div>
          </div>

          {/* 今日の記録ボタン */}
          <div className="mt-4">
            {todayLog ? (
              <div className="flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-xl px-4 py-2.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-primary font-medium">今日の練習を記録済み</span>
                <button
                  onClick={() => setShowLogForm(true)}
                  className="ml-auto text-xs text-primary/70 hover:text-primary"
                >
                  追記
                </button>
              </div>
            ) : (
              <Button
                onClick={() => setShowLogForm(true)}
                className="w-full gap-2 h-11 text-sm font-semibold dl-glow"
              >
                <Plus size={16} /> 今日の練習を記録する
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 max-w-lg mx-auto space-y-5 pt-4">
        {/* 今月のサマリー */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard
            value={monthMinutes}
            unit="分"
            label="今月の練習"
            color="text-primary"
          />
          <StatCard
            value={monthLogs.length}
            unit="回"
            label="今月の回数"
            color="text-sky-400"
          />
          <StatCard
            value={data.weakPoints.filter(w => !w.isDone).length}
            unit="件"
            label="課題"
            color="text-red-400"
          />
        </div>

        {/* 今日のおすすめメニュー */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-primary" />
              <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                今日のおすすめ
              </h2>
            </div>
            <button
              onClick={() => setShowLogForm(true)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              記録する
            </button>
          </div>

          {suggestions.length === 0 ? (
            <div className="dl-card text-center py-6 text-muted-foreground text-sm">
              基礎練ライブラリに項目を追加してください
            </div>
          ) : (
            <div className="space-y-2">
              {suggestions.map((basic, i) => {
                const genre = data.genres.find(g => g.id === basic.genreId);
                return (
                  <div
                    key={basic.id}
                    className="dl-card flex items-center gap-3 animate-slide-up opacity-0"
                    style={{ animationDelay: `${i * 0.06}s`, animationFillMode: 'forwards' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold dl-number"
                      style={{
                        backgroundColor: (genre?.color ?? '#84CC16') + '20',
                        color: genre?.color ?? '#84CC16',
                      }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{basic.title}</span>
                        {basic.isWeakPoint && (
                          <span className="text-[10px] bg-red-500/15 text-red-400 px-1 py-0.5 rounded">苦手</span>
                        )}
                      </div>
                      {genre && <div className="text-[10px] text-muted-foreground">{genre.name}</div>}
                    </div>
                    <span className="text-xs text-muted-foreground dl-number flex-shrink-0">10分</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 今の課題 */}
        {activeWeakPoints.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  今の課題
                </h2>
              </div>
              <button
                onClick={() => navigate('/weak')}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                すべて <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-2">
              {activeWeakPoints.map((wp, i) => (
                <button
                  key={wp.id}
                  onClick={() => navigate('/weak')}
                  className="dl-card-hover w-full text-left flex items-center gap-3 animate-slide-up opacity-0"
                  style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'forwards' }}
                >
                  <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
                    wp.priority === 3 ? 'bg-red-500' : wp.priority === 2 ? 'bg-yellow-500' : 'bg-slate-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{wp.title}</div>
                    {wp.reason && <div className="text-xs text-muted-foreground truncate">{wp.reason}</div>}
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground/40 flex-shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 直近の練習履歴 */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-sky-400" />
              <h2 className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                直近の練習
              </h2>
            </div>
            <button
              onClick={() => navigate('/logs')}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
            >
              すべて <ChevronRight size={12} />
            </button>
          </div>

          {recentLogs.length === 0 ? (
            <div className="dl-card text-center py-6 text-muted-foreground text-sm">
              まだ練習ログがありません
            </div>
          ) : (
            <div className="space-y-2">
              {recentLogs.map((log, i) => {
                const totalMins = log.items.reduce((s, item) => s + item.minutes, 0);
                const isToday = log.date === todayStr;
                return (
                  <div
                    key={log.id}
                    onClick={() => navigate('/logs')}
                    className="dl-card-hover w-full text-left flex items-center gap-3 animate-slide-up opacity-0 cursor-pointer"
                    style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="text-center w-8 flex-shrink-0">
                      <div className="text-base font-bold dl-number text-foreground">
                        {new Date(log.date).getDate()}
                      </div>
                      <div className="text-[9px] text-muted-foreground">{getDayOfWeek(log.date)}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <RatingStars rating={log.rating} size={11} />
                        <span className="text-xs text-primary dl-number">{totalMins}分</span>
                        {isToday && <span className="text-[9px] text-primary font-bold">TODAY</span>}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {log.items.slice(0, 3).map(item => {
                          const basic = data.basics.find(b => b.id === item.basicId);
                          const genre = data.genres.find(g => g.id === basic?.genreId);
                          if (!basic) return null;
                          return (
                            <span
                              key={item.basicId}
                              className="text-[10px] px-1 py-0.5 rounded"
                              style={genre ? { backgroundColor: genre.color + '20', color: genre.color } : {}}
                            >
                              {basic.title}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground/40 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* クイックリンク */}
        <section className="grid grid-cols-2 gap-2 pb-2">
          <button
            onClick={() => navigate('/library')}
            className="dl-card-hover flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <BookOpen size={18} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">ライブラリ</div>
              <div className="text-[10px] text-muted-foreground">{data.basics.length}項目</div>
            </div>
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="dl-card-hover flex items-center gap-3 text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center">
              <BarChart2 size={18} className="text-sky-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">成長記録</div>
              <div className="text-[10px] text-muted-foreground">ダッシュボード</div>
            </div>
          </button>
        </section>
      </div>

      {showLogForm && (
        <LogForm
          initialDate={todayStr}
          onClose={() => setShowLogForm(false)}
        />
      )}
    </div>
  );
}

function StatCard({ value, unit, label, color }: { value: number; unit: string; label: string; color: string }) {
  return (
    <div className="dl-card text-center py-3 animate-count-up">
      <div className={`text-2xl font-bold dl-number ${color}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground">{unit}</div>
      <div className="text-[10px] text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}
