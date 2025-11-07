import { GameState, GamePhase, DeductionResult } from '@/types/game';

const GAME_STATE_KEY = 'investigator_game_state';

const DEFAULT_GAME_STATE: GameState = {
  phase: 'tutorial',
  startTime: Date.now(),
  hintsUsed: 0,
  deductionSubmitted: false,
};

/**
 * 게임 상태 불러오기
 */
export function getGameState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_GAME_STATE;
  
  try {
    const data = localStorage.getItem(GAME_STATE_KEY);
    return data ? JSON.parse(data) : DEFAULT_GAME_STATE;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return DEFAULT_GAME_STATE;
  }
}

/**
 * 게임 상태 저장
 */
export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

/**
 * 게임 페이즈 변경
 */
export function setGamePhase(phase: GamePhase): void {
  const state = getGameState();
  state.phase = phase;
  
  if (phase === 'investigation') {
    state.startTime = Date.now();
  } else if (phase === 'completed' && !state.completedTime) {
    state.completedTime = Date.now();
  }
  
  saveGameState(state);
}

/**
 * 힌트 사용 기록
 */
export function useHint(): void {
  const state = getGameState();
  state.hintsUsed += 1;
  saveGameState(state);
}

/**
 * 추리 제출
 */
export function submitDeduction(result: DeductionResult): void {
  const state = getGameState();
  state.deductionSubmitted = true;
  state.deductionResult = result;
  state.phase = 'completed';
  state.completedTime = Date.now();
  saveGameState(state);
}

/**
 * 게임 초기화
 */
export function resetGame(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GAME_STATE_KEY);
}

/**
 * 플레이 시간 계산 (분)
 */
export function getPlayTime(): number {
  const state = getGameState();
  const endTime = state.completedTime || Date.now();
  return Math.floor((endTime - state.startTime) / 1000 / 60);
}

