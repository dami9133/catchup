'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PersonaCard } from '@/components/PersonaCard';
import { updateUserPersona } from '@/app/actions/auth';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "새로운 프로젝트 과제가 주어졌을 때 당신의 행동은?",
    options: [
      { id: 'A', text: "먼저 계획부터 꼼꼼하게 짠다." },
      { id: 'B', text: "일단 시작해보고 부딪히면서 수정한다." }
    ]
  },
  {
    id: 2,
    question: "팀원과 의견이 충돌했을 때 당신은?",
    options: [
      { id: 'A', text: "객관적인 데이터와 논리로 설득한다." },
      { id: 'B', text: "상대방의 감정을 공감하며 타협점을 찾는다." }
    ]
  },
  {
    id: 3,
    question: "주말에 시간이 주어졌을 때 더 선호하는 것은?",
    options: [
      { id: 'A', text: "평소 관심있던 분야의 사이드 프로젝트를 한다." },
      { id: 'B', text: "새로운 사람들을 만나 네트워킹을 한다." }
    ]
  }
];

export default function TestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = async (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // 퀴즈 완료
      setIsFinished(true);
      // 구글 시트에 업데이트 반영
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        // 프로토타입이므로 고정된 결과(실행력 100% 불도저) 저장
        await updateUserPersona(userEmail, '실행력 100% 불도저');
      }
    }
  };

  if (isFinished) {
    return (
      <main className="flex flex-col items-center justify-center min-h-full p-6 bg-background relative overflow-y-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">분석이 완료되었습니다! 🎉</h2>
        <PersonaCard 
          name="실행력 100% 불도저"
          description="어떤 과제든 망설임 없이 시작하며, 문제를 겪으면서 빠르게 해결책을 찾아내는 탁월한 실행력을 갖췄습니다."
          jobs={['스타트업 창업가', '그로스 해커', '세일즈 매니저']}
        />
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-10 w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white rounded-xl font-bold transition-colors"
        >
          내 맞춤형 진로 맵 보러가기
        </button>
      </main>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <main className="flex flex-col min-h-full p-6 bg-background">
      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2 mb-12 mt-8">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-sm text-primary font-bold tracking-widest mb-4">QUESTION {currentStep + 1}</h2>
        <h1 className="text-2xl font-bold text-white leading-snug mb-10">
          {currentQ.question}
        </h1>

        <div className="space-y-4">
          {currentQ.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.id)}
              className="w-full text-left p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-primary/50 text-slate-200 transition-all duration-200 active:scale-[0.98]"
            >
              <span className="inline-block w-8 font-mono text-slate-500">{opt.id}.</span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
