'use server';

import { getGoogleSheet } from '@/lib/googleSheets';

export interface StartupCampItem {
  id: string;
  title: string;
  category: string;
  agency: string;
  endDate: string;
  url: string;
  updatedAt: string;
}

export async function getStartupData(): Promise<{ success: boolean; data?: StartupCampItem[]; message?: string }> {
  try {
    const sheet = await getGoogleSheet('Startup_Camp');
    const rows = await sheet.getRows();
    
    // Map rows to StartupCampItem array
    const data: StartupCampItem[] = rows.map(row => ({
      id: row.get('id') || '',
      title: row.get('title') || '',
      category: row.get('category') || '',
      agency: row.get('agency') || '',
      endDate: row.get('endDate') || '',
      url: row.get('url') || '',
      updatedAt: row.get('updatedAt') || ''
    }));

    // 최신순(업데이트 등)이나 마감일 임박순 정렬도 가능하지만 우선 그대로 반환
    return { success: true, data: data.reverse() }; // 최근에 등록된 것이 위로 오도록
  } catch (error: any) {
    console.error('Error fetching startup data:', error);
    
    // Handle specific error if sheet doesn't exist
    if (error.message && error.message.includes('not found')) {
      return { 
        success: false, 
        message: '창업지원 데이터가 아직 수집되지 않았습니다. 관리자(앱스크립트)의 업데이트를 기다려주세요.' 
      };
    }
    
    return { success: false, message: '데이터를 불러오는 중 오류가 발생했습니다.' };
  }
}
