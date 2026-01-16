
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { AgeGroup, GenerationState } from './types';
import { generate3DCharacter } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    originalImage: null,
    generatedImage: null,
    ageGroup: 'Child',
    status: 'idle',
    error: null,
  });

  const [mobileView, setMobileView] = useState<'setup' | 'result'>('setup');

  useEffect(() => {
    if (state.status === 'success' || state.status === 'loading') {
      setMobileView('result');
    }
  }, [state.status]);

  const handleImageUpload = (base64: string) => {
    setState(prev => ({ ...prev, originalImage: base64, status: 'idle', generatedImage: null }));
    setMobileView('setup');
  };

  const handleAgeChange = (age: AgeGroup) => {
    setState(prev => ({ ...prev, ageGroup: age }));
  };

  const handleGenerate = async () => {
    if (!state.originalImage) {
      alert("이미지를 먼저 업로드해주세요!");
      return;
    }

    setState(prev => ({ ...prev, status: 'loading', error: null }));
    setMobileView('result');
    
    try {
      const result = await generate3DCharacter(state.originalImage, state.ageGroup);
      setState(prev => ({ ...prev, generatedImage: result, status: 'success' }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: err.message || "캐릭터 생성에 실패했습니다." 
      }));
      setMobileView('setup');
    }
  };

  const handleDownload = () => {
    if (!state.generatedImage) return;
    
    const link = document.createElement('a');
    link.href = state.generatedImage;
    link.download = `my-3d-character-${state.ageGroup}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetView = () => {
    setMobileView('setup');
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden text-gray-800 bg-gray-50 font-sans">
      
      {/* Sidebar - Shows current uploaded image inside the upload box */}
      <div className={`flex-none lg:h-full overflow-y-auto lg:overflow-visible z-20 ${mobileView === 'result' ? 'hidden lg:block' : 'block'}`}>
        <Sidebar 
          onImageUpload={handleImageUpload} 
          selectedAge={state.ageGroup} 
          onAgeChange={handleAgeChange}
          isGenerating={state.status === 'loading'}
          onGenerate={handleGenerate}
          currentImage={state.originalImage}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto scroll-smooth">
        
        {/* Mobile Result Screen Header */}
        {mobileView === 'result' && (
          <div className="lg:hidden w-full p-4 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
            <button onClick={resetView} className="flex items-center gap-2 text-pink-500 font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              뒤로
            </button>
            <h1 className="text-lg font-bold text-gray-700">변신 완료!</h1>
            <div className="w-10"></div>
          </div>
        )}

        <div className="w-full max-w-4xl p-4 lg:p-10 flex flex-col items-center">
          
          {/* Main Empty State */}
          {mobileView === 'setup' && (
            <div className="hidden lg:flex flex-col items-center justify-center min-h-[60vh] text-center opacity-60">
              <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mb-6 text-pink-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-400">나만의 3D 캐릭터 만들기</h2>
              <p className="mt-2 text-gray-400 max-w-xs">왼쪽 메뉴에서 사진을 선택하고 나이를 설정한 뒤,<br/>'Generate' 버튼을 눌러보세요!</p>
            </div>
          )}

          {/* Result Section (The "New Screen" feeling) */}
          <section className={`w-full flex flex-col items-center gap-6 ${mobileView === 'setup' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="hidden lg:flex items-center gap-3 w-full max-w-md">
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">✨</div>
              <h2 className="text-xl font-bold text-gray-700">결과물 확인</h2>
            </div>

            {/* Frame Container - Now using object-cover to fill frame completely */}
            <div className="w-full max-w-md aspect-[3/4] bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden border-4 border-purple-100 shadow-2xl relative">
              {state.status === 'loading' && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center p-8 text-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl animate-bounce">🪄</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    캐릭터 생성 중...
                  </h3>
                  <p className="text-sm text-gray-400 mt-3 leading-relaxed">거의 다 되었어요!<br/>나만의 3D 세상이 열립니다.</p>
                </div>
              )}

              {state.generatedImage ? (
                <img 
                  src={state.generatedImage} 
                  alt="Result" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                mobileView === 'result' && state.status !== 'loading' && (
                   <div className="text-center p-8">
                    <p className="text-gray-400">이미지를 생성하는 중 오류가 발생했을 수 있습니다.</p>
                   </div>
                )
              )}
            </div>

            {state.generatedImage && (
              <div className="w-full max-w-md flex flex-col gap-3 pb-20 lg:pb-0">
                <button
                  onClick={handleDownload}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-purple-200 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  JPEG 저장하기
                </button>
                <button
                  onClick={resetView}
                  className="w-full bg-white border-2 border-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors active:scale-95 shadow-sm"
                >
                  다시 만들기
                </button>
              </div>
            )}
          </section>

          {state.error && (
            <div className="p-4 mt-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-center gap-3 w-full max-w-md mx-auto">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {state.error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
