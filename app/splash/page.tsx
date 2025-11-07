'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // 3초 후 자동 전환
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  // 화면 탭으로 즉시 전환
  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 cursor-pointer"
      onClick={handleSkip}
    >
      <div className="text-center px-8 animate-fade-in max-w-2xl">
        {/* 메인 브랜딩 메시지 */}
        <div className="mb-12">
          <h1 className="text-white text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            Powered by Mi:dm
          </h1>
          <p className="text-slate-300 text-2xl md:text-3xl font-bold">
            KT&apos;s AI model
          </p>
        </div>
        
        {/* 로딩 인디케이터 */}
        <div className="flex justify-center items-center space-x-3 mb-8">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* 시작 안내 */}
        <p className="text-slate-400 text-sm font-thin">
          화면을 탭하여 시작하기
        </p>
      </div>
    </div>
  );
}

