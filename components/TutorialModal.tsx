'use client';

import { useState } from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
}

export default function TutorialModal({ isOpen, onClose, onStart }: TutorialModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'AI 탐정 보조에 오신 것을 환영합니다!',
      content: '유명 화가의 작업실에서 의문의 죽음이 발생했습니다. 당신은 현장에 있는 단서들을 AI의 도움으로 분석하여 진실을 밝혀야 합니다.',
      icon: '🔍',
    },
    {
      title: '게임 방법',
      content: '1. 카메라 버튼을 눌러 현장의 물건을 촬영하세요.\n2. AI가 단서를 분석하여 힌트를 제공합니다.\n3. 충분한 단서를 모았다면 추리를 제출하세요.',
      icon: '📸',
    },
    {
      title: '사건 정보와 용의자',
      content: '상단의 [사건 개요]와 [용의자 정보] 버튼을 눌러 사건과 용의자들에 대한 정보를 확인할 수 있습니다.',
      icon: '👥',
    },
    {
      title: '힌트 시스템',
      content: '막힐 때는 힌트를 확인하세요. 하지만 먼저 직접 추리해보는 것을 권장합니다!',
      icon: '💡',
    },
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onStart();
    }
  };

  const handleSkip = () => {
    onStart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full shadow-2xl animate-fade-in">
        {/* 컨텐츠 */}
        <div className="p-8 text-center">
          <div className="text-7xl mb-6">
            {currentStepData.icon}
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
            {currentStepData.title}
          </h2>
          
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-8">
            {currentStepData.content}
          </p>

          {/* 진행 표시 */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="p-4 space-y-2">
          <button
            onClick={handleNext}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-black text-lg transition-colors touch-manipulation"
          >
            {currentStep < steps.length - 1 ? '다음' : '게임 시작!'}
          </button>
          
          {currentStep > 0 && (
            <button
              onClick={handleSkip}
              className="w-full py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors"
            >
              건너뛰기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

