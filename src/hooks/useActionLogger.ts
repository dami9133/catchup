'use client';

import { useCallback } from 'react';

type ActionType = 'view' | 'click' | 'submit';

interface LogActionPayload {
  email: string;
  detail_action_type: ActionType;
  action_detail: string;
}

export function useActionLogger() {
  const logAction = useCallback(async (payload: LogActionPayload) => {
    const gasUrl = process.env.NEXT_PUBLIC_GAS_URL;
    
    if (!gasUrl) {
      console.warn('NEXT_PUBLIC_GAS_URL is not defined.');
      return;
    }

    try {
      await fetch(gasUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action_type: 'log_action',
          ...payload,
        }),
        // mode: 'no-cors' // Google Apps Script POST 요청 시 no-cors를 사용할 수 있으나, 응답을 읽어야 하면 서버 측에서 CORS 헤더(doOptions) 처리를 해야 함
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }, []);

  return { logAction };
}
