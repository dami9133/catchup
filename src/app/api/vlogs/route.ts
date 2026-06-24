import { NextResponse } from 'next/server';

// 임시 Mock 데이터 (GAS URL이 설정되지 않았거나 호출에 실패했을 때 대비)
const MOCK_VLOGS = [
  { id: 1, jobName: '데이터 분석가', title: '3년차 데이터 분석가 현실 브이로그', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: false },
  { id: 2, jobName: '데이터 분석가', title: '데이터 분석가 취준생의 하루', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: true },
  { id: 3, jobName: '콘텐츠 마케터', title: '마케터의 피가 마르는 야근 브이로그', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: false },
  { id: 4, jobName: '콘텐츠 마케터', title: '초봉 4000 마케터 실무 꿀팁', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: true },
  { id: 5, jobName: '그로스 해커', title: '퍼포먼스 마케터/그로스 해커 현실', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: false },
  { id: 6, jobName: '그로스 해커', title: '그로스 해커 A/B 테스트 A to Z', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: true },
  { id: 7, jobName: 'AI 프롬프트 엔지니어', title: 'AI 시대, 프롬프트 엔지니어의 일상', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: false },
  { id: 8, jobName: 'AI 프롬프트 엔지니어', title: '네카라쿠배 AI 엔지니어 연봉 공개', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: true },
  { id: 9, jobName: 'UX/UI 디자이너', title: '비전공자 UX/UI 디자이너 취업기', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: false },
  { id: 10, jobName: 'UX/UI 디자이너', title: '토스 디자이너 포트폴리오 피드백', thumbnailUrl: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg', videoUrl: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', isPremium: true },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPremiumUser = searchParams.get('isPremium') === 'true';

    let vlogs = [];
    const GAS_URL = process.env.GAS_URL;

    // 1. GAS 백엔드에서 VLOG 데이터 가져오기 (BFF 역할)
    if (GAS_URL) {
      const response = await fetch(GAS_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 } // Next.js 캐싱 (1시간)
      });
      const data = await response.json();
      if (data.success && data.vlogs && data.vlogs.length > 0) {
        vlogs = data.vlogs;
      } else {
        vlogs = MOCK_VLOGS;
      }
    } else {
      vlogs = MOCK_VLOGS;
    }

    // 2. [핵심 보안 로직]: 비구독자의 경우 premium 영상의 실제 URL을 null로 마스킹
    const maskedVlogs = vlogs.map((vlog: any) => {
      const isVideoPremium = vlog.isPremium === true || vlog.isPremium === 'true' || vlog.isPremium === 'TRUE';
      
      if (isVideoPremium && !isPremiumUser) {
        return {
          ...vlog,
          isPremium: true, // 클라이언트가 자물쇠를 그릴 수 있게 boolean으로 일관화
          videoUrl: null,  // 진짜 유튜브 URL 은닉
          youtubeId: null  // 진짜 아이디 은닉
        };
      }
      return {
        ...vlog,
        isPremium: isVideoPremium
      };
    });

    return NextResponse.json({
      success: true,
      data: maskedVlogs
    });

  } catch (error: any) {
    console.error('Vlogs BFF Fetch Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch vlogs',
      error: error.message
    }, { status: 500 });
  }
}
