// Dance Log - 成長ダッシュボード
// Dark Studio / Cinematic Minimal Design
import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useData } from '@/contexts/DataContext';
import { getTodayStr, getStreakDays, getTotalMinutes, formatDateShort } from '@/lib/store';
import PageHeader from '@/components/ui/PageHeader';
import { Flame, TrendingUp, Clock, Target, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { data } = useData();

  const todayStr = getTodayStr();
  const streak = useMemo(() => getStreakDays(data.logs), [data.logs]);

  // 今月
  const thisMonth = todayStr.slice(0, 7);
  const monthLogs = data.logs.filter(l => l.date.startsWith(thisMonth));
  const monthMinutes = getTotalMinutes(monthLogs);
  const monthDays = new Set(monthLogs.map(l => l.date)).size;

  // 全期間
  const totalMinutes = getTotalMinutes(data.logs);
  const totalDays = new Set(data.logs.map(l => l.date)).size;

  // 直近7日間の練習時間グラフ
  const last7Days = useMemo(() => {
    const days: { date: string; label: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const logs = data.logs.filter(l => l.date === dateStr);
      const minutes = getTotalMinutes(logs);
      days.push({
        date: dateStr,
        label: formatDateShort(dateStr),
        minutes,
      });
    }
    return days;
  }, [data.logs]);

  // よく練習した項目 (今月)
  const topBasics = useMemo(() => {
    const count: Record<string, number> = {};
    const minutes: Record<string, number> = {};
    for (const log of monthLogs) {
      for (const item of log.items) {
        count[item.basicId] = (count[item.basicId] ?? 0) + 1;
        minutes[item.basicId] = (minutes[item.basicId] ?? 0) + item.minutes;
      }
    }
    return Object.entries(count)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, cnt]) => ({
        id, count: cnt, minutes: minutes[id] ?? 0,
        basic: data.basics.find(b => b.id === id),
        genre: data.genres.find(g => g.id === data.basics.find(b => b.id === id)?.genreId),
      }));
  }, [monthLogs, data.basics, data.genres]);

  // 最近練習していない項目 (7日以上)
  const neglectedBasics = useMemo(() => {
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7);
    const recentIds = new Set<string>();
    for (const log of data.logs) {
      if (new Date(log.date) >= recentDate) {
        log.items.forEach(i => recentIds.add(i.basicId));
      }
    }
    return data.basics
      .filter(b => !recentIds.has(b.id))
      .slice(0, 5);
  }, [data.logs, data.basics]);

  // 苦手改善状況
  const doneWps = data.weakPoints.filter(w => w.isDone);
  const activeWps = data.weakPoints.filter(w => !w.isDone);
  const wpProgress = data.weakPoints.length > 0
    ? Math.round((doneWps.length / data.weakPoints.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="成長ダッシュボード" subtitle="練習の積み重ねを確認" />

      <div className="px-4 py-3 max-w-lg mx-auto pb-nav space-y-5">
        {/* サマリーカード */}
        <div className="grid grid-cols-2 gap-2">
          <SummaryCard
            icon={<Flame size={18} className="text-orange-400" />}
            value={streak}
            unit="日"
            label="連続記録"
            color="text-orange-400"
          />
          <SummaryCard
            icon={<Clock size={18} className="text-primary" />}
            value={monthMinutes}
            unit="分"
            label="今月の練習時間"
            color="text-primary"
          />
          <SummaryCard
            icon={<Target size={18} className="text-sky-400" />}
            value={monthDays}
            unit="日"
            label="今月の練習日数"
            color="text-sky-400"
          />
          <SummaryCard
            icon={<TrendingUp size={18} className="text-emerald-400" />}
            value={totalDays}
            unit="日"
            label="累計練習日数"
            color="text-emerald-400"
          />
        </div>

        {/* 直近7日間グラフ */}
        <div className="dl-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            直近7日間の練習時間
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={last7Days} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelStyle={{ color: 'var(--foreground)' }}
                formatter={(value: number) => [`${value}分`, '練習時間']}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {last7Days.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.date === todayStr ? 'oklch(0.72 0.2 130)' : 'oklch(0.72 0.2 130 / 40%)'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* よく練習した項目 */}
        {topBasics.length > 0 && (
          <div className="dl-card">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              今月よく練習した項目
            </h3>
            <div className="space-y-2.5">
              {topBasics.map(({ id, count, minutes, basic, genre }) => {
                if (!basic) return null;
                const maxCount = topBasics[0].count;
                return (
                  <div key={id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {genre && (
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: genre.color }} />
                        )}
                        <span className="text-sm text-foreground">{basic.title}</span>
                        {genre && <span className="text-[10px] text-muted-foreground">{genre.name}</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="dl-number">{count}回</span>
                        <span className="dl-number text-primary">{minutes}分</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          backgroundColor: genre?.color ?? 'var(--primary)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 最近練習していない項目 */}
        {neglectedBasics.length > 0 && (
          <div className="dl-card">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              最近練習していない項目
            </h3>
            <div className="space-y-2">
              {neglectedBasics.map(basic => {
                const genre = data.genres.find(g => g.id === basic.genreId);
                return (
                  <div key={basic.id} className="flex items-center gap-2">
                    {genre && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: genre.color }} />
                    )}
                    <span className="text-sm text-foreground flex-1">{basic.title}</span>
                    {genre && <span className="text-[10px] text-muted-foreground">{genre.name}</span>}
                    <span className="text-[10px] text-yellow-400">7日以上</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 苦手改善の進捗 */}
        <div className="dl-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            苦手改善の進捗
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">解決済み</span>
                <span className="text-primary dl-number">{wpProgress}%</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${wpProgress}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold dl-number text-primary">{doneWps.length}</div>
              <div className="text-[10px] text-muted-foreground">/{data.weakPoints.length}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <AlertTriangle size={14} className="text-red-400" />
              <div>
                <div className="text-sm font-bold dl-number text-foreground">{activeWps.length}</div>
                <div className="text-[10px] text-muted-foreground">未解決</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
              <CheckCircle size={14} className="text-primary" />
              <div>
                <div className="text-sm font-bold dl-number text-foreground">{doneWps.length}</div>
                <div className="text-[10px] text-muted-foreground">解決済み</div>
              </div>
            </div>
          </div>
        </div>

        {/* 総計 */}
        <div className="dl-card">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">累計記録</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xl font-bold dl-number text-foreground">{totalMinutes}</div>
              <div className="text-[10px] text-muted-foreground">総練習分数</div>
            </div>
            <div>
              <div className="text-xl font-bold dl-number text-foreground">{data.logs.length}</div>
              <div className="text-[10px] text-muted-foreground">総ログ数</div>
            </div>
            <div>
              <div className="text-xl font-bold dl-number text-foreground">{data.basics.length}</div>
              <div className="text-[10px] text-muted-foreground">登録基礎練</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon, value, unit, label, color
}: {
  icon: React.ReactNode; value: number; unit: string; label: string; color: string;
}) {
  return (
    <div className="dl-card flex items-center gap-3 animate-count-up">
      <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className={`text-xl font-bold dl-number ${color}`}>
          {value}<span className="text-sm ml-0.5">{unit}</span>
        </div>
        <div className="text-[10px] text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
