'use client';

import { caseInfo } from '@/data/case-info';

interface CaseOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseOverviewModal({ isOpen, onClose }: CaseOverviewModalProps) {
  if (!isOpen) return null;

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
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">사건 개요</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="overflow-y-auto max-h-[calc(85vh-70px)] p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              {caseInfo.title}
            </h3>
          </div>

          <div className="grid gap-4">
            <InfoItem label="피해자" value={caseInfo.victim} />
            <InfoItem label="발견 장소" value={caseInfo.location} />
            <InfoItem label="추정 사망 시간" value={caseInfo.timeOfDeath} />
            <InfoItem label="사망 원인" value={caseInfo.causeOfDeath} />
          </div>

          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">상세 정보</h4>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {caseInfo.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
      <span className="font-bold text-slate-600 dark:text-slate-400 min-w-[120px]">
        {label}:
      </span>
      <span className="text-slate-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}

