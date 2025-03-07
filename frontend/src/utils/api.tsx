// APIのベースURL（環境変数から取得するのが望ましい）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api/v1';

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

// API情報を使用した各種データ取得関数
// ユーザー情報を取得
export async function getCurrentUser() {
  const response = await fetchWithAuth(`${API_BASE_URL}/me`);

  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  return response.json();
}

// タスク一覧を取得
export async function getTasks() {
  const response = await fetchWithAuth(`${API_BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
}

// タスクの詳細を取得
export async function getTask(id: number) {
  const response = await fetchWithAuth(`${API_BASE_URL}/tasks/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch task with id ${id}`);
  }

  return response.json();
}

// 稼働時間データを取得
export async function getWorkHours(year: number, month: number) {
  const response = await fetchWithAuth(
    `${API_BASE_URL}/work_hours?year=${year}&month=${month}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch work hours');
  }

  return response.json();
}

// 稼働時間を登録
export async function recordWorkHours(data: { date: string; hours: number; description?: string }) {
  const response = await fetchWithAuth(`${API_BASE_URL}/work_hours`, {
    method: 'POST',
    body: JSON.stringify({ work_hour: data }),
  });

  if (!response.ok) {
    throw new Error('Failed to record work hours');
  }

  return response.json();
}

// 稼働開始時間を記録
export async function startWork() {
  const response = await fetchWithAuth(`${API_BASE_URL}/work_sessions/start`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to start work session');
  }

  return response.json();
}

// 稼働終了時間を記録
export async function endWork() {
  const response = await fetchWithAuth(`${API_BASE_URL}/work_sessions/end`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to end work session');
  }

  return response.json();
}