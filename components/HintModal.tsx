'use client';

import { useState } from 'react';
import { hints } from '@/data/hints';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hintsUsed: number;
}

export default function HintModal({ isOpen, onClose, hintsUsed }: HintModalProps) {
  const [viewedHints, setViewedHints] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const handleViewHint = (hintId: string) => {
    setViewedHints(prev => new Set([...prev, hintId]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white">힌트</h2>
            <p className="text-amber-100 text-sm mt-1">
              사용한 힌트: {hintsUsed}개
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 힌트 목록 */}
        <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6 space-y-4">
          {hints.map((hint, index) => (
            <HintCard
              key={hint.id}
              hint={hint}
              index={index}
              isViewed={viewedHints.has(hint.id)}
              onView={() => handleViewHint(hint.id)}
            />
          ))}

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-6">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              💡 <strong>팁:</strong> 힌트는 순서대로 보는 것을 권장합니다. 
              먼저 직접 추리해보고, 막힐 때만 힌트를 확인하세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HintCard({ 
  hint, 
  index,
  isViewed, 
  onView 
}: { 
  hint: { id: string; title: string; content: string; cost: number };
  index: number;
  isViewed: boolean;
  onView: () => void;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 bg-amber-500 text-white rounded-full text-xs font-black">
            {index + 1}
          </span>
          {hint.title}
        </h3>
        {hint.cost > 0 && (
          <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full font-bold">
            {hint.cost} 포인트
          </span>
        )}
      </div>

      {isViewed ? (
        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mt-3">
          {hint.content}
        </p>
      ) : (
        <div className="mt-3">
          <button
            onClick={onView}
            className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-lg font-bold text-sm transition-colors touch-manipulation"
          >
            힌트 보기
          </button>
        </div>
      )}
    </div>
  );
}

