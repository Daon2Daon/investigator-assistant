'use client';

import { useState } from 'react';

export default function TestToolsCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const testImages = [
    { id: 'clue1', name: 'clue1.jpg', label: '단서 1: 왼쪽 소매 물감', path: '/test-images/clue1.jpg' },
    { id: 'clue2', name: 'clue2.jpg', label: '단서 2: 오른손 붓', path: '/test-images/clue2.jpg' },
    { id: 'clue3', name: 'clue3.jpg', label: '단서 3: 터펜타인 병', path: '/test-images/clue3.jpg' },
  ];

  const handleDownload = async (path: string, fileName: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        alert('테스트 이미지가 준비되지 않았습니다. public/test-images/ 폴더에 이미지를 추가해주세요.');
        return;
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert('테스트 이미지를 다운로드할 수 없습니다.');
    }
  };

  const handleUseTestImage = async (path: string) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        alert('테스트 이미지가 준비되지 않았습니다. public/test-images/ 폴더에 이미지를 추가해주세요.');
        return;
      }
      
      const blob = await response.blob();
      
      // 갤러리 input 트리거
      const input = document.getElementById('gallery-input') as HTMLInputElement;
      if (input) {
        // Blob을 File로 변환
        const fileName = path.split('/').pop() || 'test.jpg';
        const file = new File([blob], fileName, { type: blob.type });
        
        // DataTransfer를 사용하여 input에 파일 설정
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        
        // change 이벤트 트리거
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } catch (error) {
      console.error('이미지 사용 오류:', error);
      alert('테스트 이미지를 불러올 수 없습니다.');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 overflow-hidden mb-4">
      {/* 헤더 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-colors touch-manipulation"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🧪</span>
          <span className="font-bold text-purple-900 dark:text-purple-200">
            테스트 도구
          </span>
          <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-bold">
            개발 전용
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-purple-600 dark:text-purple-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 컨텐츠 */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-purple-900 dark:text-purple-200">
            💡 테스트용 단서 이미지를 바로 사용할 수 있습니다.
          </p>

          <div className="space-y-2">
            {testImages.map((image) => (
              <div 
                key={image.id}
                className="bg-white dark:bg-slate-800 rounded-lg p-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    {image.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {image.name}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTestImage(image.path)}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold rounded-lg transition-colors touch-manipulation"
                  >
                    바로 사용
                  </button>
                  <button
                    onClick={() => handleDownload(image.path, image.name)}
                    className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-bold rounded-lg transition-colors touch-manipulation"
                  >
                    다운로드
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3 mt-3">
            <p className="text-xs text-purple-900 dark:text-purple-200 leading-relaxed">
              <strong>사용법:</strong><br/>
              • <strong>바로 사용</strong>: 이미지를 즉시 미리보기로 불러옵니다<br/>
              • <strong>다운로드</strong>: 이미지를 다운로드하여 저장합니다 (모바일 테스트용)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

