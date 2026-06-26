'use client';

import React from 'react';

interface PersonaCardProps {
  name: string;
  description: string;
  jobs: string[];
}

export function PersonaCard({ name, description, jobs }: PersonaCardProps) {
  const handleShare = () => {
    // 인스타그램 스토리 공유 가상 기능
    alert('인스타그램 스토리에 공유할 수 있는 기능이 준비중입니다! (웹 공유 API 또는 이미지 저장 기능 연동 예정)');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-w-sm w-full mx-auto transform transition-all hover:scale-[1.02] duration-300">
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary rounded-full mix-blend-plus-lighter filter blur-3xl opacity-30"></div>
      
      <div className="relative z-10">
        <h2 className="text-slate-400 text-xs font-bold tracking-wider uppercase mb-2">당신의 커리어 페르소나</h2>
        <h3 className="text-2xl font-extrabold text-white mb-3">{name}</h3>
        <p className="text-slate-300 text-sm mb-5 leading-relaxed font-medium">
          {description}
        </p>
        
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">어울리는 직무</h4>
          <div className="flex flex-wrap gap-2">
            {jobs.map((job, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1.5 bg-white/10 text-white text-xs rounded-full font-medium border border-white/10 backdrop-blur-sm shadow-sm"
              >
                {job}
              </span>
            ))}
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
        >
          인스타그램 스토리에 공유하기
        </button>
      </div>
    </div>
  );
}
