// Dance Log - データストア (LocalStorage)
// Dark Studio / Cinematic Minimal Design

import { nanoid } from 'nanoid';

// ============================================================
// 型定義
// ============================================================

export interface Genre {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Basic {
  id: string;
  genreId: string;
  title: string;
  memo: string;
  tips: string;
  youtubeUrl: string;
  referenceUrl: string;
  priority: 1 | 2 | 3;
  isWeakPoint: boolean;
  createdAt: string;
}

export interface LogItem {
  basicId: string;
  minutes: number;
}

export interface PracticeLog {
  id: string;
  date: string; // YYYY-MM-DD
  items: LogItem[];
  memo: string;
  feeling: string;
  rating: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  createdAt: string;
}

export interface WeakPoint {
  id: string;
  title: string;
  reason: string;
  improvement: string;
  relatedBasicIds: string[];
  priority: 1 | 2 | 3;
  isDone: boolean;
  createdAt: string;
  doneAt?: string;
}

export interface AppData {
  genres: Genre[];
  basics: Basic[];
  logs: PracticeLog[];
  weakPoints: WeakPoint[];
}

// ============================================================
// ジャンルカラーマッピング
// ============================================================

export const GENRE_COLORS: Record<string, string> = {
  'HIPHOP': '#7C3AED',
  'POPPING': '#0EA5E9',
  'LOCKING': '#F59E0B',
  'HOUSE': '#10B981',
  'BREAKING': '#EF4444',
  'WAACK': '#EC4899',
  'FREESTYLE': '#84CC16',
  'JAZZ': '#F97316',
  'K-POP': '#F43F5E',
  'その他': '#64748B',
};

// ============================================================
// 初期データ
// ============================================================

const INITIAL_GENRES: Genre[] = [
  { id: 'g1', name: 'HIPHOP', color: '#7C3AED', order: 1 },
  { id: 'g2', name: 'POPPING', color: '#0EA5E9', order: 2 },
  { id: 'g3', name: 'LOCKING', color: '#F59E0B', order: 3 },
  { id: 'g4', name: 'HOUSE', color: '#10B981', order: 4 },
  { id: 'g5', name: 'BREAKING', color: '#EF4444', order: 5 },
  { id: 'g6', name: 'WAACK', color: '#EC4899', order: 6 },
  { id: 'g7', name: 'FREESTYLE', color: '#84CC16', order: 7 },
  { id: 'g8', name: 'JAZZ', color: '#F97316', order: 8 },
  { id: 'g9', name: 'K-POP', color: '#F43F5E', order: 9 },
  { id: 'g10', name: 'その他', color: '#64748B', order: 10 },
];

const INITIAL_BASICS: Basic[] = [
  {
    id: 'b1', genreId: 'g2', title: 'HIT',
    memo: 'ポッピングの基本。筋肉を瞬間的に収縮させる動き。',
    tips: '腕・胸・首など各パーツごとに練習する。ミラー練習で確認。',
    youtubeUrl: 'https://www.youtube.com/results?search_query=popping+hit+tutorial',
    referenceUrl: '', priority: 3, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b2', genreId: 'g2', title: 'WAVING',
    memo: '波のように体を流れる動き。アームウェーブ・ボディウェーブ。',
    tips: 'パーツを順番に意識して動かす。ゆっくりから始める。',
    youtubeUrl: 'https://www.youtube.com/results?search_query=popping+waving+tutorial',
    referenceUrl: '', priority: 2, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b3', genreId: 'g1', title: 'GROOVE',
    memo: 'ヒップホップの基本リズム感。体全体でビートを感じる。',
    tips: '膝の使い方がポイント。音楽に合わせてリラックスして動く。',
    youtubeUrl: 'https://www.youtube.com/results?search_query=hiphop+groove+tutorial',
    referenceUrl: '', priority: 3, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b4', genreId: 'g1', title: 'リズム取り',
    memo: '8カウントでのリズム感覚。アップ・ダウンの基礎。',
    tips: 'メトロノームを使って練習。BPMを変えて対応力をつける。',
    youtubeUrl: '',
    referenceUrl: '', priority: 2, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b5', genreId: 'g4', title: 'フットワーク',
    memo: 'ハウスの基本。ジャックとも呼ばれる足の動き。',
    tips: '重心移動を意識。上半身はリラックスさせる。',
    youtubeUrl: 'https://www.youtube.com/results?search_query=house+dance+footwork+tutorial',
    referenceUrl: '', priority: 3, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b6', genreId: 'g1', title: 'アイソレーション',
    memo: '体の各パーツを独立して動かすトレーニング。',
    tips: '首・肩・胸・腰を個別に動かす練習から始める。',
    youtubeUrl: 'https://www.youtube.com/results?search_query=isolation+dance+tutorial',
    referenceUrl: '', priority: 3, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b7', genreId: 'g3', title: 'LOCK',
    memo: 'ロッキングの基本動作。動きを止めるポーズ。',
    tips: 'タイミングが命。音楽のアクセントに合わせてロックする。',
    youtubeUrl: 'https://www.youtube.com/results?search_query=locking+lock+tutorial',
    referenceUrl: '', priority: 2, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'b8', genreId: 'g3', title: 'POINT',
    memo: 'ロッキングの指差しポーズ。表現力が重要。',
    tips: '目線と指の方向を合わせる。笑顔も大事。',
    youtubeUrl: '',
    referenceUrl: '', priority: 1, isWeakPoint: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

function buildInitialLogs(): PracticeLog[] {
  return [];
}

const INITIAL_WEAK_POINTS: WeakPoint[] = [
  // 初期データなし - ユーザーが自分で登録する
  /*
  {
    id: 'w1',
    title: '鏡を見ると動きが崩れる',
    reason: '鏡を意識しすぎて頭が動いてしまう。視線が定まらない。',
    improvement: '鏡を見ながらゆっくり練習する時間を意識的に作る。',
    relatedBasicIds: ['b6', 'b3'],
    priority: 3,
    isDone: false,
    createdAt: '2025-01-15T00:00:00Z',
  },
  {
    id: 'w2',
    title: 'リズムが走る（前のめりになる）',
    reason: '焦ってしまってビートより早く動いてしまう。',
    improvement: 'メトロノームを使って遅いBPMから練習する。',
    relatedBasicIds: ['b4', 'b3'],
    priority: 2,
    isDone: false,
    createdAt: '2025-01-20T00:00:00Z',
  },
  {
    id: 'w3',
    title: '上半身が硬い',
    reason: '力が入りすぎてアイソレができない。',
    improvement: 'ストレッチと脱力練習を毎日の習慣にする。',
    relatedBasicIds: ['b6', 'b2'],
    priority: 3,
    isDone: false,
    createdAt: '2025-02-01T00:00:00Z',
  },
  {
    id: 'w4',
    title: '撮影すると決まらない',
    reason: 'カメラを意識すると緊張して動きが小さくなる。',
    improvement: '毎回の練習で動画撮影を習慣化する。',
    relatedBasicIds: ['b1', 'b3'],
    priority: 1,
    isDone: true,
    createdAt: '2025-01-10T00:00:00Z',
    doneAt: '2025-03-01T00:00:00Z',
  },
  */
];

// ============================================================
// ストレージキー
// ============================================================

export const STORAGE_KEY = 'dance-log-data-v5'; // v5: 基礎練あり(苦手フラグなし)・苦手とログは空

// ============================================================
// データ読み書き
// ============================================================

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      return {
        genres: parsed.genres ?? INITIAL_GENRES,
        basics: parsed.basics ?? INITIAL_BASICS,
        logs: parsed.logs ?? buildInitialLogs(),
        weakPoints: parsed.weakPoints ?? INITIAL_WEAK_POINTS,
      };
    }
  } catch {
    // ignore
  }
  const initial: AppData = {
    genres: INITIAL_GENRES,
    basics: INITIAL_BASICS,
    logs: buildInitialLogs(),
    weakPoints: INITIAL_WEAK_POINTS,
  };
  saveData(initial);
  return initial;
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ============================================================
// ユーティリティ
// ============================================================

export function newId(): string {
  return nanoid(10);
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function getDayOfWeek(dateStr: string): string {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[new Date(dateStr).getDay()];
}

export function getTotalMinutes(logs: PracticeLog[]): number {
  return logs.reduce((sum, log) => sum + log.items.reduce((s, i) => s + i.minutes, 0), 0);
}

export function getStreakDays(logs: PracticeLog[]): number {
  if (logs.length === 0) return 0;
  const dateSet = new Set<string>(logs.map(l => l.date));
  const dates = Array.from(dateSet).sort().reverse();
  let streak = 0;
  let current = new Date(getTodayStr());
  for (const date of dates) {
    const d = new Date(date);
    const diff = Math.floor((current.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0 || diff === 1) {
      streak++;
      current = d;
    } else {
      break;
    }
  }
  return streak;
}

export function getPriorityLabel(p: 1 | 2 | 3): string {
  return p === 3 ? '高' : p === 2 ? '中' : '低';
}

export function getPriorityColor(p: 1 | 2 | 3): string {
  return p === 3 ? 'text-red-400' : p === 2 ? 'text-yellow-400' : 'text-slate-400';
}

export function getRatingLabel(r: number): string {
  const labels = ['', '😞', '😐', '🙂', '😊', '🔥'];
  return labels[r] ?? '';
}

// 今日のメニュー提案ロジック
export function suggestTodayMenu(data: AppData, maxItems = 5): Basic[] {
  const { basics, logs, weakPoints } = data;
  if (basics.length === 0) return [];

  const todayDate = getTodayStr();
  const recentDays = 7;
  const recentDate = new Date();
  recentDate.setDate(recentDate.getDate() - recentDays);

  // 最近練習した basicId の頻度
  const recentPracticeCount: Record<string, number> = {};
  for (const log of logs) {
    const logDate = new Date(log.date);
    if (logDate >= recentDate) {
      for (const item of log.items) {
        recentPracticeCount[item.basicId] = (recentPracticeCount[item.basicId] ?? 0) + 1;
      }
    }
  }

  // 苦手項目に関連する basicId
  const weakRelatedArr = weakPoints.filter(w => !w.isDone).flatMap(w => w.relatedBasicIds);
  const weakRelatedIds = new Set<string>(weakRelatedArr);

  // 今日すでに練習済みの basicId
  const todayLog = logs.find(l => l.date === todayDate);
  const todayPracticed = new Set<string>(todayLog?.items.map(i => i.basicId) ?? []);

  // スコアリング
  const scored = basics.map(b => {
    let score = 0;
    const count = recentPracticeCount[b.id] ?? 0;
    score += Math.max(0, 5 - count) * 2;
    if (weakRelatedIds.has(b.id)) score += 4;
    score += b.priority;
    if (b.isWeakPoint) score += 3;
    if (todayPracticed.has(b.id)) score -= 10;
    return { basic: b, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxItems)
    .map(s => s.basic);
}
