'use client';

import { useState } from 'react';
import { suspects } from '@/data/suspects';

interface SuspectInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuspectInfoModal({ isOpen, onClose }: SuspectInfoModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!isOpen) return null;

  const selectedSuspect = suspects[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white dark:bg-slate-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">용의자 정보</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 탭 버튼 */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
          {suspects.map((suspect, index) => (
            <button
              key={suspect.id}
              onClick={() => setSelectedIndex(index)}
              className={`flex-1 py-3 px-4 text-sm font-bold transition-colors ${
                selectedIndex === index
                  ? 'bg-white dark:bg-slate-800 text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              용의자 {String.fromCharCode(65 + index)}
            </button>
          ))}
        </div>

        {/* 컨텐츠 */}
        <div className="overflow-y-auto max-h-[calc(85vh-130px)] p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {String.fromCharCode(65 + selectedIndex)}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {selectedSuspect.name}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {selectedSuspect.age}세 · {selectedSuspect.occupation}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <InfoSection 
              title="관계" 
              content={selectedSuspect.relationship}
              icon="👤"
            />
            <InfoSection 
              title="프로필" 
              content={selectedSuspect.profile}
              icon="📋"
            />
            <InfoSection 
              title="알리바이" 
              content={selectedSuspect.alibi}
              icon="🕐"
              highlight
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoSection({ 
  title, 
  content, 
  icon,
  highlight = false 
}: { 
  title: string; 
  content: string;
  icon: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-4 ${
      highlight 
        ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800' 
        : 'bg-slate-50 dark:bg-slate-700/50'
    }`}>
      <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h4>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}

