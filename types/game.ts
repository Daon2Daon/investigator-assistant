/**
 * 게임 진행 상태 타입
 */
export type GamePhase = 'tutorial' | 'investigation' | 'deduction' | 'completed';

/**
 * 게임 상태
 */
export interface GameState {
  phase: GamePhase;
  startTime: number;
  completedTime?: number;
  hintsUsed: number;
  deductionSubmitted: boolean;
  deductionResult?: DeductionResult;
}

/**
 * 추리 제출 결과
 */
export interface DeductionResult {
  culprit: string;        // 범인 이름
  motive: string;         // 동기
  evidence: string[];     // 증거 (발견한 단서 ID)
  isCorrect: boolean;     // 정답 여부
  feedback: string;       // 피드백
  timestamp: number;
}

/**
 * 힌트
 */
export interface Hint {
  id: string;
  title: string;
  content: string;
  cost: number;  // 0이면 무료
}

