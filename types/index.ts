// 단서 분석 결과 타입
export interface AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  analysis: string;
  clueId: ClueId;
}

// 단서 ID 타입
export type ClueId = 'CLUE_01' | 'CLUE_02' | 'CLUE_03' | 'CLUE_NONE';

// 단서 정의 타입
export interface ClueDefinition {
  id: ClueId;
  description: string;
  response: string;
}

// 용의자 정보 타입
export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relationship: string;
  alibi: string;
  profile: string;
}

// 사건 정보 타입
export interface CaseInfo {
  title: string;
  victim: string;
  location: string;
  timeOfDeath: string;
  causeOfDeath: string;
  description: string;
}

