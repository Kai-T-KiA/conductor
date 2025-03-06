// 認証後のAPIリクエスト用のユーティリティ関数
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    ...options,
  };

  return fetch(url, defaultOptions);
};