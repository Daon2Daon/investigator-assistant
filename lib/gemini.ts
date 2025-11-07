import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClueId } from '@/types';
import { caseInfo } from '@/data/case-info';
import { suspects } from '@/data/suspects';
import { CLUE_DATABASE } from '@/lib/clues';

/**
 * Gemini AI 클라이언트 초기화
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY가 설정되지 않았습니다. .env.local 파일을 확인해주세요.');
  }
  
  return new GoogleGenerativeAI(apiKey);
}

/**
 * 단서 분류를 위한 시스템 프롬프트를 생성합니다.
 */
function generateSystemPrompt(): string {
  // 사건 정보
  const caseDescription = `
[사건 개요]
- 제목: ${caseInfo.title}
- 피해자: ${caseInfo.victim}
- 발견 장소: ${caseInfo.location}
- 추정 사망 시간: ${caseInfo.timeOfDeath}
- 사망 원인: ${caseInfo.causeOfDeath}
- 상세 설명: ${caseInfo.description}
`;

  // 용의자 정보
  const suspectsDescription = suspects.map((suspect, idx) => 
    `${idx + 1}. ${suspect.name} (${suspect.age}세, ${suspect.occupation})
   - 관계: ${suspect.relationship}
   - 알리바이: ${suspect.alibi}`
  ).join('\n\n');

  // 결정적 단서 리스트
  const cluesDescription = Object.entries(CLUE_DATABASE)
    .filter(([id]) => id !== 'CLUE_NONE')
    .map(([id, clue]) => `- ${id}: ${clue.description}`)
    .join('\n');

  return `당신은 천재적인 AI 탐정 보조입니다. 지금부터 가상의 살인 사건을 수사합니다.

${caseDescription}

[용의자 정보]
${suspectsDescription}

[결정적 단서 리스트]
${cluesDescription}

**중요 지침:**
1. 사용자가 제공한 사진을 분석하여 위 [결정적 단서 리스트]와 일치하는지 판단하세요.
2. 사진이 결정적 단서 중 하나와 일치하면 해당 단서의 ID(CLUE_01, CLUE_02, CLUE_03)를 반환하세요.
3. 사진이 결정적 단서와 관련이 없거나 불명확하면 'CLUE_NONE'을 반환하세요.
4. 반드시 'CLUE_01', 'CLUE_02', 'CLUE_03', 'CLUE_NONE' 중 하나만 반환해야 합니다.
5. 다른 텍스트나 설명 없이 오직 단서 ID만 반환하세요.

응답 예시:
- 왼쪽 소매에 물감이 묻은 작업복 사진 → CLUE_01
- 오른손에 쥐어진 붓 사진 → CLUE_02
- 터펜타인 유리병 사진 → CLUE_03
- 관련 없는 물건 사진 → CLUE_NONE`;
}

/**
 * 이미지를 Gemini AI로 분석하여 단서 ID를 분류합니다.
 */
export async function analyzeImageWithGemini(
  imageBase64: string,
  mimeType: string
): Promise<ClueId> {
  try {
    const genAI = getGeminiClient();
    
    // Gemini 1.5 Flash 모델 사용 (Vision 지원)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
    });

    // 시스템 프롬프트 생성
    const systemPrompt = generateSystemPrompt();

    // 이미지 데이터 준비
    // Base64에서 data:image/...;base64, 부분 제거
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;

    // API 호출
    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    console.log('Gemini AI 응답:', text);

    // 응답에서 단서 ID 추출
    if (text.includes('CLUE_01')) {
      return 'CLUE_01';
    } else if (text.includes('CLUE_02')) {
      return 'CLUE_02';
    } else if (text.includes('CLUE_03')) {
      return 'CLUE_03';
    } else {
      return 'CLUE_NONE';
    }
  } catch (error) {
    console.error('Gemini AI 분석 오류:', error);
    
    // API 키 오류인 경우 더 명확한 메시지
    if (error instanceof Error && error.message.includes('API_KEY')) {
      throw new Error('Gemini API 키가 올바르지 않습니다.');
    }
    
    // 기타 오류는 CLUE_NONE 반환
    return 'CLUE_NONE';
  }
}

/**
 * API 키가 설정되어 있는지 확인합니다.
 */
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

