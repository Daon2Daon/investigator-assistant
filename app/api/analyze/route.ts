import { NextRequest, NextResponse } from 'next/server';
import { analyzeImageWithGemini, isGeminiConfigured } from '@/lib/gemini';
import { getClueResponse } from '@/lib/clues';
import { ClueId } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // FormData 파싱
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: '이미지 파일이 전송되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 이미지 파일 타입 검증
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드할 수 있습니다.' },
        { status: 400 }
      );
    }

    console.log(`📥 이미지 수신: ${imageFile.name}, 크기: ${imageFile.size} bytes, 타입: ${imageFile.type}`);

    let clueId: ClueId;

    // 🎮 테스트 모드: API 키가 없거나 파일명에 테스트 키워드가 있으면 파일명 기반으로 단서 반환
    const fileName = imageFile.name.toLowerCase();
    const isApiConfigured = isGeminiConfigured();
    
    console.log(`🔑 API 설정 상태: ${isApiConfigured ? '설정됨' : '미설정'}`);
    console.log(`📝 파일명: "${fileName}"`);
    
    const isTestMode = !isApiConfigured || 
                       fileName.includes('test') || 
                       fileName.includes('clue') ||
                       fileName.includes('단서');

    console.log(`🎮 테스트 모드: ${isTestMode ? '활성화' : '비활성화'}`);

    if (isTestMode) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎮 테스트 모드 활성화됨');
      console.log(`📝 파일명 검사: "${fileName}"`);
      
      // 파일명으로 단서 결정
      if (fileName.includes('clue1') || fileName.includes('clue_01') || fileName.includes('단서1') || fileName.includes('1.')) {
        clueId = 'CLUE_01';
        console.log('✅ 매칭: CLUE_01 (왼쪽 소매 물감)');
      } else if (fileName.includes('clue2') || fileName.includes('clue_02') || fileName.includes('단서2') || fileName.includes('2.')) {
        clueId = 'CLUE_02';
        console.log('✅ 매칭: CLUE_02 (오른손 붓)');
      } else if (fileName.includes('clue3') || fileName.includes('clue_03') || fileName.includes('단서3') || fileName.includes('3.')) {
        clueId = 'CLUE_03';
        console.log('✅ 매칭: CLUE_03 (터펜타인)');
      } else {
        // 기본값: CLUE_NONE
        clueId = 'CLUE_NONE';
        console.log('⚠️ 매칭 실패: CLUE_NONE 반환 (파일명에 clue1, clue2, clue3 포함 필요)');
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      // 실제 Gemini AI 분석
      // 이미지를 Base64로 변환
      const arrayBuffer = await imageFile.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');

      console.log('Gemini AI 분석 시작...');
      clueId = await analyzeImageWithGemini(
        base64Image,
        imageFile.type
      );
      console.log(`분석 결과: ${clueId}`);
    }

    // 단서 ID에 해당하는 답변 가져오기
    const analysis = getClueResponse(clueId);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 API 응답 준비:');
    console.log(`   단서 ID: ${clueId}`);
    console.log(`   답변: ${analysis}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 응답 반환
    const response = {
      success: true,
      clueId,
      analysis,
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Analysis error:', error);
    
    // 에러 메시지 상세화
    let errorMessage = '분석 중 오류가 발생했습니다.';
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY') || error.message.includes('API 키')) {
        errorMessage = 'Gemini API 키가 올바르지 않습니다. .env.local 파일을 확인해주세요.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        clueId: 'CLUE_NONE',
        analysis: `❌ ${errorMessage}`
      },
      { status: 200 } // 프론트엔드에서 처리하기 위해 200 반환
    );
  }
}

// OPTIONS 메서드 처리 (CORS)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}

