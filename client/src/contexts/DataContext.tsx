// Dance Log - グローバルデータコンテキスト
import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  AppData, Basic, Genre, PracticeLog, WeakPoint,
  loadData, saveData, newId, getTodayStr,
} from '@/lib/store';

interface DataContextType {
  data: AppData;
  // Genres
  addGenre: (name: string, color: string) => void;
  updateGenre: (id: string, updates: Partial<Genre>) => void;
  deleteGenre: (id: string) => void;
  // Basics
  addBasic: (basic: Omit<Basic, 'id' | 'createdAt'>) => void;
  updateBasic: (id: string, updates: Partial<Basic>) => void;
  deleteBasic: (id: string) => void;
  // Logs
  addLog: (log: Omit<PracticeLog, 'id' | 'createdAt'>) => void;
  updateLog: (id: string, updates: Partial<PracticeLog>) => void;
  deleteLog: (id: string) => void;
  // WeakPoints
  addWeakPoint: (wp: Omit<WeakPoint, 'id' | 'createdAt'>) => void;
  updateWeakPoint: (id: string, updates: Partial<WeakPoint>) => void;
  deleteWeakPoint: (id: string) => void;
  markWeakPointDone: (id: string) => void;
  // Util
  resetData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  const update = useCallback((updater: (prev: AppData) => AppData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  // Genres
  const addGenre = useCallback((name: string, color: string) => {
    update(prev => ({
      ...prev,
      genres: [...prev.genres, {
        id: newId(), name, color,
        order: prev.genres.length + 1,
      }],
    }));
  }, [update]);

  const updateGenre = useCallback((id: string, updates: Partial<Genre>) => {
    update(prev => ({
      ...prev,
      genres: prev.genres.map(g => g.id === id ? { ...g, ...updates } : g),
    }));
  }, [update]);

  const deleteGenre = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g.id !== id),
      basics: prev.basics.filter(b => b.genreId !== id),
    }));
  }, [update]);

  // Basics
  const addBasic = useCallback((basic: Omit<Basic, 'id' | 'createdAt'>) => {
    update(prev => ({
      ...prev,
      basics: [...prev.basics, {
        ...basic,
        id: newId(),
        createdAt: new Date().toISOString(),
      }],
    }));
  }, [update]);

  const updateBasic = useCallback((id: string, updates: Partial<Basic>) => {
    update(prev => ({
      ...prev,
      basics: prev.basics.map(b => b.id === id ? { ...b, ...updates } : b),
    }));
  }, [update]);

  const deleteBasic = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      basics: prev.basics.filter(b => b.id !== id),
    }));
  }, [update]);

  // Logs
  const addLog = useCallback((log: Omit<PracticeLog, 'id' | 'createdAt'>) => {
    update(prev => ({
      ...prev,
      logs: [...prev.logs, {
        ...log,
        id: newId(),
        createdAt: new Date().toISOString(),
      }],
    }));
  }, [update]);

  const updateLog = useCallback((id: string, updates: Partial<PracticeLog>) => {
    update(prev => ({
      ...prev,
      logs: prev.logs.map(l => l.id === id ? { ...l, ...updates } : l),
    }));
  }, [update]);

  const deleteLog = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      logs: prev.logs.filter(l => l.id !== id),
    }));
  }, [update]);

  // WeakPoints
  const addWeakPoint = useCallback((wp: Omit<WeakPoint, 'id' | 'createdAt'>) => {
    update(prev => ({
      ...prev,
      weakPoints: [...prev.weakPoints, {
        ...wp,
        id: newId(),
        createdAt: new Date().toISOString(),
      }],
    }));
  }, [update]);

  const updateWeakPoint = useCallback((id: string, updates: Partial<WeakPoint>) => {
    update(prev => ({
      ...prev,
      weakPoints: prev.weakPoints.map(w => w.id === id ? { ...w, ...updates } : w),
    }));
  }, [update]);

  const deleteWeakPoint = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      weakPoints: prev.weakPoints.filter(w => w.id !== id),
    }));
  }, [update]);

  const markWeakPointDone = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      weakPoints: prev.weakPoints.map(w =>
        w.id === id
          ? { ...w, isDone: true, doneAt: new Date().toISOString() }
          : w
      ),
    }));
  }, [update]);

  const resetData = useCallback(() => {
    localStorage.removeItem('dance-log-data');
    window.location.reload();
  }, []);

  return (
    <DataContext.Provider value={{
      data,
      addGenre, updateGenre, deleteGenre,
      addBasic, updateBasic, deleteBasic,
      addLog, updateLog, deleteLog,
      addWeakPoint, updateWeakPoint, deleteWeakPoint,
      markWeakPointDone,
      resetData,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

export { getTodayStr };
