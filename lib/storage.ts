import { AnalysisResult } from '@/types';

const STORAGE_KEY = 'investigator_analysis_history';
const MAX_HISTORY_COUNT = 100; // 최대 저장 개수

/**
 * localStorage에서 분석 내역을 가져옵니다.
 */
export function getAnalysisHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load analysis history:', error);
    return [];
  }
}

/**
 * localStorage에 분석 내역을 저장합니다.
 */
export function saveAnalysisHistory(history: AnalysisResult[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    // 최대 저장 개수 제한
    const limitedHistory = history.slice(0, MAX_HISTORY_COUNT);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save analysis history:', error);
    
    // localStorage 용량 초과 시 오래된 항목 삭제
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      const reducedHistory = history.slice(0, Math.floor(MAX_HISTORY_COUNT / 2));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedHistory));
    }
  }
}

/**
 * 새로운 분석 결과를 추가합니다.
 */
export function addAnalysisResult(result: AnalysisResult): void {
  const history = getAnalysisHistory();
  history.unshift(result); // 최신 항목을 맨 앞에 추가
  saveAnalysisHistory(history);
}

/**
 * 특정 분석 결과를 삭제합니다.
 */
export function deleteAnalysisResult(id: string): void {
  const history = getAnalysisHistory();
  const filtered = history.filter(item => item.id !== id);
  saveAnalysisHistory(filtered);
}

/**
 * 분석 내역을 초기화합니다.
 */
export function clearAnalysisHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 중요 단서만 필터링합니다.
 */
export function getImportantClues(): AnalysisResult[] {
  const history = getAnalysisHistory();
  return history.filter(item => item.clueId !== 'CLUE_NONE');
}

/**
 * 분석 통계를 가져옵니다.
 */
export interface AnalysisStats {
  total: number;
  importantClues: number;
  clue01Count: number;
  clue02Count: number;
  clue03Count: number;
  normalCount: number;
}

export function getAnalysisStats(): AnalysisStats {
  const history = getAnalysisHistory();
  
  return {
    total: history.length,
    importantClues: history.filter(item => item.clueId !== 'CLUE_NONE').length,
    clue01Count: history.filter(item => item.clueId === 'CLUE_01').length,
    clue02Count: history.filter(item => item.clueId === 'CLUE_02').length,
    clue03Count: history.filter(item => item.clueId === 'CLUE_03').length,
    normalCount: history.filter(item => item.clueId === 'CLUE_NONE').length,
  };
}

/**
 * localStorage 사용량을 확인합니다.
 */
export function getStorageUsage(): { used: number; percentage: number } {
  if (typeof window === 'undefined') return { used: 0, percentage: 0 };
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const used = data ? new Blob([data]).size : 0;
    const quota = 5 * 1024 * 1024; // 대략 5MB
    const percentage = Math.round((used / quota) * 100);
    
    return { used, percentage };
  } catch (error) {
    return { used: 0, percentage: 0 };
  }
}

