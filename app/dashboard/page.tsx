'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  getAnalysisHistory, 
  addAnalysisResult, 
  deleteAnalysisResult,
  clearAnalysisHistory,
  getAnalysisStats,
  getImportantClues,
  type AnalysisStats
} from '@/lib/storage';
import { AnalysisResult } from '@/types';
import CaseOverviewModal from '@/components/CaseOverviewModal';
import SuspectInfoModal from '@/components/SuspectInfoModal';
import ImagePreviewModal from '@/components/ImagePreviewModal';
import AnalysisStatsCard from '@/components/AnalysisStatsCard';
import TestToolsCard from '@/components/TestToolsCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import HintModal from '@/components/HintModal';
import DeductionModal from '@/components/DeductionModal';
import ResultModal from '@/components/ResultModal';
import TutorialModal from '@/components/TutorialModal';
import { optimizeImage, isImageFile, isFileSizeExceeded, formatFileSize } from '@/lib/image-utils';
import { getGameState, setGamePhase, submitDeduction, resetGame as resetGameState, getPlayTime } from '@/lib/game-state';
import { DeductionResult } from '@/types/game';

type FilterType = 'all' | 'important';

export default function DashboardPage() {
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isSuspectModalOpen, setIsSuspectModalOpen] = useState(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [isDeductionModalOpen, setIsDeductionModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<AnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [stats, setStats] = useState<AnalysisStats>({
    total: 0,
    importantClues: 0,
    clue01Count: 0,
    clue02Count: 0,
    clue03Count: 0,
    normalCount: 0,
  });
  
  // 이미지 미리보기 관련 상태
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [pendingImageData, setPendingImageData] = useState<{ blob: Blob; dataUrl: string; fileName?: string } | null>(null);
  
  // 삭제 확인 다이얼로그
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    targetId?: string;
  }>({
    isOpen: false,
    type: 'single',
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 분석 내역 및 통계 불러오기
  useEffect(() => {
    loadHistory();
    
    // 첫 방문 시 튜토리얼 표시
    const gameState = getGameState();
    if (gameState.phase === 'tutorial') {
      setIsTutorialModalOpen(true);
    }
    
    // 게임 완료 시 결과 표시
    if (gameState.phase === 'completed' && gameState.deductionResult) {
      setIsResultModalOpen(true);
    }
  }, []);

  // 필터 적용
  useEffect(() => {
    if (filter === 'important') {
      setFilteredHistory(getImportantClues());
    } else {
      setFilteredHistory(analysisHistory);
    }
  }, [filter, analysisHistory]);

  const loadHistory = () => {
    const history = getAnalysisHistory();
    setAnalysisHistory(history);
    setStats(getAnalysisStats());
  };

  // 카메라로 단서 촬영
  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!isImageFile(file)) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      event.target.value = '';
      return;
    }

    // 파일 크기 검증 (10MB 제한)
    if (isFileSizeExceeded(file, 10)) {
      alert('파일 크기가 너무 큽니다. 10MB 이하의 이미지를 선택해주세요.');
      event.target.value = '';
      return;
    }

    try {
      console.log('🖼️ 이미지 최적화 시작...');
      console.log(`📝 원본 파일명: "${file.name}"`);
      
      // 이미지 최적화 (모바일 성능 향상)
      const optimized = await optimizeImage(file, {
        maxWidth: 1024,
        maxHeight: 1024,
        quality: 0.85,
      });

      console.log(`✅ 원본 크기: ${formatFileSize(file.size)} → 최적화: ${formatFileSize(optimized.size)}`);
      console.log('📸 미리보기 화면을 여는 중...');

      // 미리보기 표시 (원본 파일명 함께 저장)
      setPreviewImage(optimized.dataUrl);
      setPendingImageData({
        ...optimized,
        fileName: file.name, // 원본 파일명 보존
      } as any);
      setIsPreviewOpen(true);
      
      console.log('✅ 미리보기 상태 설정 완료:', {
        fileName: file.name,
        imageUrlLength: optimized.dataUrl.length,
        isPreviewOpen: true,
      });
    } catch (error) {
      console.error('❌ 이미지 최적화 오류:', error);
      alert('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      // input 초기화
      event.target.value = '';
    }
  };

  // 미리보기 확인 - 분석 진행
  const handleConfirmAnalysis = async () => {
    if (!pendingImageData) {
      console.error('❌ pendingImageData가 없습니다!');
      return;
    }

    console.log('🚀 분석 시작...');
    setIsAnalyzing(true);

    try {
      // API로 이미지 전송 (FormData 사용)
      const formData = new FormData();
      // 원본 파일명 사용 (테스트 모드에서 파일명 인식을 위해)
      const fileName = pendingImageData.fileName || 'clue.jpg';
      formData.append('image', pendingImageData.blob, fileName);
      
      console.log(`📤 API 요청 전송 중... (파일명: ${fileName})`);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      console.log(`📥 API 응답 수신: ${response.status}`);

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 프론트엔드 응답 수신:');
      console.log('   clueId:', data.clueId);
      console.log('   analysis:', data.analysis);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // 분석 결과 추가
      const newResult: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: pendingImageData.dataUrl,
        analysis: data.analysis,
        clueId: data.clueId || 'CLUE_NONE',
      };

      console.log('💾 분석 결과 저장:', newResult);
      
      addAnalysisResult(newResult);
      loadHistory(); // 히스토리 및 통계 다시 로드

      // 미리보기 닫기
      setIsPreviewOpen(false);
      setPreviewImage('');
      setPendingImageData(null);
      
      console.log('✅ 분석 완료!');
    } catch (error) {
      console.error('❌ 분석 오류:', error);
      alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 미리보기 재촬영
  const handleRetake = () => {
    setIsPreviewOpen(false);
    setPreviewImage('');
    setPendingImageData(null);
    // 갤러리 다시 열기 (테스트 편의성)
    fileInputRef.current?.click();
  };

  // 개별 삭제
  const handleDeleteSingle = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'single',
      targetId: id,
    });
  };

  // 전체 삭제
  const handleDeleteAll = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'all',
    });
  };

  // 삭제 확인
  const handleConfirmDelete = () => {
    if (confirmDialog.type === 'single' && confirmDialog.targetId) {
      deleteAnalysisResult(confirmDialog.targetId);
    } else if (confirmDialog.type === 'all') {
      clearAnalysisHistory();
    }
    loadHistory();
    setConfirmDialog({ isOpen: false, type: 'single' });
  };

  // 삭제 취소
  const handleCancelDelete = () => {
    setConfirmDialog({ isOpen: false, type: 'single' });
  };

  // 튜토리얼 시작
  const handleStartGame = () => {
    setGamePhase('investigation');
    setIsTutorialModalOpen(false);
  };

  // 추리 제출
  const handleSubmitDeduction = (result: DeductionResult) => {
    submitDeduction(result);
    setIsDeductionModalOpen(false);
    setIsResultModalOpen(true);
  };

  // 게임 재시작
  const handleRestartGame = () => {
    resetGameState();
    clearAnalysisHistory();
    loadHistory();
    setIsResultModalOpen(false);
    setIsTutorialModalOpen(true);
  };

  // 발견한 중요 단서 목록
  const discoveredClues = analysisHistory
    .filter(item => item.clueId !== 'CLUE_NONE')
    .map(item => item.clueId)
    .filter((value, index, self) => self.indexOf(value) === index); // 중복 제거

  const gameState = getGameState();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-24">
      {/* 헤더 - 모바일 최적화 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-slate-800 shadow-sm safe-area-top">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl">🔍</span>
              <span className="hidden sm:inline">AI 탐정 보조</span>
            </h1>
            <div className="flex gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsCaseModalOpen(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation"
              >
                사건
              </button>
              <button
                onClick={() => setIsSuspectModalOpen(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation"
              >
                용의자
              </button>
              <button
                onClick={() => setIsHintModalOpen(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm touch-manipulation"
              >
                💡
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* 테스트 도구 카드 */}
        <TestToolsCard />
        
        {/* 통계 카드 */}
        <AnalysisStatsCard stats={stats} />

        {/* 추리 제출 버튼 */}
        {stats.importantClues > 0 && gameState.phase !== 'completed' && (
          <div className="mb-4">
            <button
              onClick={() => setIsDeductionModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-black text-lg shadow-lg transition-all touch-manipulation flex items-center justify-center gap-2"
            >
              <span>🎯</span>
              <span>최종 추리 제출하기</span>
              <span className="text-sm opacity-80">({discoveredClues.length}개 단서 발견)</span>
            </button>
          </div>
        )}

        {/* 필터 및 관리 버튼 */}
        {analysisHistory.length > 0 && (
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors touch-manipulation ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                전체 ({stats.total})
              </button>
              <button
                onClick={() => setFilter('important')}
                className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-colors touch-manipulation ${
                  filter === 'important'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                중요 단서 ({stats.importantClues})
              </button>
            </div>
            
            {stats.total > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-3 py-1.5 text-sm font-bold rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors touch-manipulation"
              >
                전체 삭제
              </button>
            )}
          </div>
        )}

        {analysisHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-thin mb-2">
              아직 분석한 단서가 없습니다
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              하단의 카메라 버튼을 눌러 단서를 촬영해 주세요
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>해당 필터에 맞는 분석 내역이 없습니다.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4">
                  분석 내역 {filter === 'important' && '(중요 단서만)'}
                </h2>
                {filteredHistory.map((result) => (
                  <AnalysisCard 
                    key={result.id} 
                    result={result} 
                    onDelete={handleDeleteSingle}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </main>

      {/* Floating Action Buttons - 듀얼 입력 시스템 */}
      <div className="fixed bottom-6 right-6 z-20 flex flex-col gap-3">
        {/* 카메라로 촬영 (모바일 전용) */}
        <label htmlFor="camera-input" className="cursor-pointer group">
          <div className="w-14 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 touch-manipulation">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="absolute right-16 top-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
            📸 카메라 촬영
          </div>
        </label>
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          className="hidden"
        />

        {/* 갤러리에서 선택 (테스트 & 파일 업로드) */}
        <label htmlFor="gallery-input" className="cursor-pointer group">
          <div className="w-14 h-14 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-full shadow-xl flex items-center justify-center transition-all active:scale-95 touch-manipulation">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="absolute right-16 top-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
            🖼️ 갤러리 선택
          </div>
        </label>
        <input
          ref={fileInputRef}
          id="gallery-input"
          type="file"
          accept="image/*"
          onChange={handleCameraCapture}
          className="hidden"
        />
      </div>

      {/* 모달들 */}
      <CaseOverviewModal 
        isOpen={isCaseModalOpen} 
        onClose={() => setIsCaseModalOpen(false)} 
      />
      <SuspectInfoModal 
        isOpen={isSuspectModalOpen} 
        onClose={() => setIsSuspectModalOpen(false)} 
      />
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        imageUrl={previewImage}
        onConfirm={handleConfirmAnalysis}
        onRetake={handleRetake}
        isAnalyzing={isAnalyzing}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'all' ? '전체 삭제' : '분석 내역 삭제'}
        message={
          confirmDialog.type === 'all'
            ? `모든 분석 내역(${stats.total}개)을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
            : '이 분석 내역을 삭제하시겠습니까?'
        }
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        danger
      />
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        hintsUsed={gameState.hintsUsed}
      />
      <DeductionModal
        isOpen={isDeductionModalOpen}
        onClose={() => setIsDeductionModalOpen(false)}
        onSubmit={handleSubmitDeduction}
        discoveredClues={discoveredClues}
      />
      {gameState.deductionResult && (
        <ResultModal
          isOpen={isResultModalOpen}
          result={gameState.deductionResult}
          playTime={getPlayTime()}
          onClose={() => setIsResultModalOpen(false)}
          onRestart={handleRestartGame}
        />
      )}
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        onStart={handleStartGame}
      />
    </div>
  );
}

// 분석 결과 카드 컴포넌트 - 모바일 최적화
function AnalysisCard({ 
  result, 
  onDelete 
}: { 
  result: AnalysisResult;
  onDelete: (id: string) => void;
}) {
  const date = new Date(result.timestamp);
  const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden touch-manipulation">
      <div className="p-3 sm:p-4">
        <div className="flex gap-3 sm:gap-4">
          {/* 이미지 썸네일 */}
          <div className="flex-shrink-0">
            <img 
              src={result.imageUrl} 
              alt="단서 이미지" 
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.open(result.imageUrl, '_blank')}
            />
          </div>

          {/* 분석 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2 gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {timeString}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 sm:py-1 rounded-full font-bold whitespace-nowrap ${
                  result.clueId === 'CLUE_NONE' 
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }`}>
                  {result.clueId === 'CLUE_NONE' ? '일반' : '중요 단서'}
                </span>
                <button
                  onClick={() => onDelete(result.id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1"
                  aria-label="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed break-words">
              {result.analysis}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

