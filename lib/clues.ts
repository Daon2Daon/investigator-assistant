import { ClueDefinition, ClueId } from '@/types';

/**
 * 단서 데이터베이스
 * 각 단서 ID에 매핑되는 사전 정의된 답변
 */
export const CLUE_DATABASE: Record<ClueId, ClueDefinition> = {
  CLUE_01: {
    id: 'CLUE_01',
    description: '피해자의 왼쪽 소매에 묻은 물감',
    response: '작업복의 왼쪽 소매와 주머니에 물감이 묻어있는 것으로 볼때 화가는 왼손잡이로 추정됩니다'
  },
  CLUE_02: {
    id: 'CLUE_02',
    description: '피해자의 오른손에 쥐어진 붓',
    response: '피해자는 오른손에 붓을 쥐고 있습니다. 누군가 사건 이후 현장을 조작했을 가능성이 있습니다'
  },
  CLUE_03: {
    id: 'CLUE_03',
    description: '터펜타인 유리병',
    response: '터펜타인은 유화물감 희석제입니다'
  },
  CLUE_NONE: {
    id: 'CLUE_NONE',
    description: '결정적 단서 없음',
    response: '흠... 이건 결정적인 단서는 아닌 것 같네요. 좀 더 자세히 살펴보시죠.'
  }
};

/**
 * 단서 ID로 답변을 가져옵니다.
 */
export function getClueResponse(clueId: ClueId): string {
  return CLUE_DATABASE[clueId]?.response || CLUE_DATABASE.CLUE_NONE.response;
}

