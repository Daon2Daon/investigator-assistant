'use client';

interface ImagePreviewModalProps {
  isOpen: boolean;
  imageUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
  isAnalyzing: boolean;
}

export default function ImagePreviewModal({
  isOpen,
  imageUrl,
  onConfirm,
  onRetake,
  isAnalyzing,
}: ImagePreviewModalProps) {
  if (!isOpen) {
    console.log('🔒 미리보기 모달 닫힘');
    return null;
  }

  console.log('🎬 미리보기 모달 렌더링 중:', { 
    isOpen, 
    hasImageUrl: !!imageUrl,
    imageUrlLength: imageUrl?.length,
    isAnalyzing 
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      {/* 이미지 미리보기 */}
      <div className="relative w-full h-full flex flex-col">
        {/* 상단 정보 */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <p className="text-white text-center font-bold">
            📸 촬영한 이미지를 확인하세요
          </p>
        </div>

        {/* 이미지 영역 */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <img
            src={imageUrl}
            alt="촬영한 단서"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* 하단 액션 버튼 - 항상 보이도록 고정 */}
        <div className="sticky bottom-0 bg-slate-900 border-t-2 border-slate-700 p-4 sm:p-6 safe-area-bottom">
          <div className="max-w-lg mx-auto space-y-3">
            {isAnalyzing ? (
              <div className="bg-blue-600 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span className="font-bold">AI가 단서를 분석 중입니다...</span>
              </div>
            ) : (
              <>
                <button
                  onClick={onConfirm}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-4 px-6 rounded-xl font-black text-lg transition-colors shadow-lg touch-manipulation"
                >
                  ✅ 이 사진으로 분석하기
                </button>
                <button
                  onClick={onRetake}
                  className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white py-3 px-6 rounded-xl font-bold text-base transition-colors touch-manipulation"
                >
                  🔄 다시 선택하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

