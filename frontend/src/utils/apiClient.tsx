'use client';

import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../utils/api';

// 関数名を useApiClient に変更してカスタムフックとする
export const useApiClient = () => {
  // useAuth は React フックなので、useで始まるカスタムフック内で呼び出す
  const auth = useAuth();

  const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    // URLの構築
    const url = `${API_BASE_URL}${endpoint}`;

    // ヘッダーを設定
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {})
    };

    // トークンがあれば追加
    if (auth.token) {
      headers['Authorization'] = `Bearer ${auth.token}`;
    }

    // リクエスト設定
    const config: RequestInit = {
      ...options,
      credentials: 'include', // HTTPOnly Cookieを送信するため
      headers,
    };

    try {
      let response = await fetch(url, config);

      // 401エラー（認証切れ）でトークンリフレッシュを試みる
      if (response.status === 401 && auth.token) {
        const refreshed = await auth.refreshToken();

        if (refreshed) {
          // トークンリフレッシュが成功したら、新しいトークンでリクエスト再試行
          headers['Authorization'] = `Bearer ${auth.token}`;
          config.headers = headers;
          response = await fetch(url, config);
        } else {
          // リフレッシュ失敗時はログアウト
          await auth.logout();
          throw new Error('Authentication expired. Please login again.');
        }
      }

      // 204 No Content の場合は空オブジェクトを返す
      if (response.status === 204) {
        return {};
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || response.statusText);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  };

  return apiClient;
};