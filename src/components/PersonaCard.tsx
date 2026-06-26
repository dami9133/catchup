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
        <h2 className="text-primary text-sm font-bold tracking-wider uppercase mb-2">당신의 커리어 페르소나</h2>
        <h3 className="text-3xl font-extrabold text-white mb-4">{name}</h3>
        <p className="text-slate-200 mb-6 leading-relaxed font-medium">
          {description}
        </p>
        
        <div className="mb-8">
          <h4 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wide">어울리는 직무</h4>
          <div className="flex flex-wrap gap-2">
            {jobs.map((job, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-primary/20 text-primary-hover text-sm rounded-full font-medium border border-primary/30"
              >
                {job}
              </span>
            ))}
          </div>
        </div>

        <button 
          onClick={handleShare}
          className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          인스타그램 스토리에 공유하기
        </button>
      </div>
    </div>
  );
}
