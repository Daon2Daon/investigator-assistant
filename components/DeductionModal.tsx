'use client';

import { useState } from 'react';
import { suspects } from '@/data/suspects';
import { DeductionResult } from '@/types/game';

interface DeductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: DeductionResult) => void;
  discoveredClues: string[];
}

export default function DeductionModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  discoveredClues 
}: DeductionModalProps) {
  const [selectedCulprit, setSelectedCulprit] = useState('');
  const [motive, setMotive] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedCulprit || !motive) {
      alert('범인과 동기를 모두 선택해주세요.');
      return;
    }

    // 정답 확인 (실제 게임에서는 서버에서 확인)
    const isCorrect = selectedCulprit === 'suspect_a' && 
                      selectedEvidence.includes('CLUE_01') && 
                      selectedEvidence.includes('CLUE_02');

    const result: DeductionResult = {
      culprit: selectedCulprit,
      motive,
      evidence: selectedEvidence,
      isCorrect,
      feedback: isCorrect 
        ? '정답입니다! 훌륭한 추리였습니다. 제자 이영희가 범인이었습니다.' 
        : '아쉽지만 틀렸습니다. 단서를 다시 검토해보세요.',
      timestamp: Date.now(),
    };

    onSubmit(result);
  };

  const toggleEvidence = (clueId: string) => {
    setSelectedEvidence(prev =>
      prev.includes(clueId)
        ? prev.filter(id => id !== clueId)
        : [...prev, clueId]
    );
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
        <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white">최종 추리</h2>
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
        <div className="overflow-y-auto max-h-[calc(85vh-140px)] p-6 space-y-6">
          {/* 범인 선택 */}
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
              1. 범인은 누구입니까?
            </h3>
            <div className="space-y-2">
              {suspects.map((suspect) => (
                <label
                  key={suspect.id}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all touch-manipulation ${
                    selectedCulprit === suspect.id
                      ? 'border-red-600 bg-red-50 dark:bg-red-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="culprit"
                    value={suspect.id}
                    checked={selectedCulprit === suspect.id}
                    onChange={(e) => setSelectedCulprit(e.target.value)}
                    className="w-5 h-5 text-red-600"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {suspect.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {suspect.occupation} · {suspect.relationship}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 동기 입력 */}
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
              2. 범행 동기는 무엇입니까?
            </h3>
            <textarea
              value={motive}
              onChange={(e) => setMotive(e.target.value)}
              placeholder="범인이 범행을 저지른 이유를 작성하세요..."
              className="w-full p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-red-600 dark:focus:border-red-600 focus:outline-none"
              rows={4}
            />
          </div>

          {/* 증거 선택 */}
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">
              3. 결정적 증거 (발견한 단서 체크)
            </h3>
            <div className="space-y-2">
              {discoveredClues.map((clueId) => (
                <label
                  key={clueId}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all touch-manipulation ${
                    selectedEvidence.includes(clueId)
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedEvidence.includes(clueId)}
                    onChange={() => toggleEvidence(clueId)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="font-bold text-slate-900 dark:text-white">
                    {clueId === 'CLUE_01' && '왼쪽 소매의 물감'}
                    {clueId === 'CLUE_02' && '오른손의 붓'}
                    {clueId === 'CLUE_03' && '터펜타인 병'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 p-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedCulprit || !motive}
            className="w-full py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl font-black text-lg transition-colors touch-manipulation disabled:cursor-not-allowed"
          >
            추리 제출하기
          </button>
        </div>
      </div>
    </div>
  );
}

