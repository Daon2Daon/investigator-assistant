'use client';

import { DeductionResult } from '@/types/game';

interface ResultModalProps {
  isOpen: boolean;
  result: DeductionResult;
  playTime: number;
  onClose: () => void;
  onRestart: () => void;
}

export default function ResultModal({ 
  isOpen, 
  result,
  playTime,
  onClose,
  onRestart 
}: ResultModalProps) {
  if (!isOpen) return null;

  const culpritName = result.culprit === 'suspect_a' ? '이영희' : 
                      result.culprit === 'suspect_b' ? '박민수' :
                      result.culprit === 'suspect_c' ? '김수진' : '정태호';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in">
        {/* 헤더 */}
        <div className={`px-6 py-8 rounded-t-3xl text-center ${
          result.isCorrect 
            ? 'bg-gradient-to-r from-emerald-600 to-green-600'
            : 'bg-gradient-to-r from-slate-600 to-slate-700'
        }`}>
          <div className="text-6xl mb-4">
            {result.isCorrect ? '🎉' : '🤔'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">
            {result.isCorrect ? '정답입니다!' : '오답입니다'}
          </h2>
          <p className="text-white/80">
            {result.isCorrect 
              ? '훌륭한 추리였습니다!' 
              : '다시 한번 도전해보세요'}
          </p>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 추리 결과 */}
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                당신의 추리
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-lg">
                범인: {culpritName}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                동기: {result.motive}
              </div>
            </div>

            {!result.isCorrect && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-2">
                  💡 힌트
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {result.feedback}
                </p>
              </div>
            )}

            {result.isCorrect && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200 mb-2">
                  ✅ 정답 설명
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                  제자 이영희가 범인입니다. 왼손잡이인 피해자의 오른손에 붓이 쥐어져 있었고, 
                  왼손잡이인 이영희가 현장을 조작한 흔적이 발견되었습니다.
                </p>
              </div>
            )}
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {playTime}분
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                플레이 시간
              </div>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {result.evidence.length}개
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                발견한 단서
              </div>
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="p-4 space-y-2">
          <button
            onClick={onRestart}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-bold transition-colors touch-manipulation"
          >
            새 게임 시작
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-xl font-bold transition-colors touch-manipulation"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

