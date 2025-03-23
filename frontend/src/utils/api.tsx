/**
 * API基本設定
 * 環境に応じてURLが自動的に切り替わる
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
// デバッグ用に出力
console.log('API_BASE_URL:', API_BASE_URL);

/**
 * 共通のAPIリクエスト関数
 * @param endpoint - APIエンドポイント（先頭のスラッシュは含める）
 * @param options - fetchオプション
 * @param token - 認証トークン（AuthContextから取得）
 */
export async function fetchAPI(endpoint: string, options: RequestInit = {}, token: string | null = null) {
  // URLの構築
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making request to: ${url}`);

  // ヘッダーを明示的な型で定義
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  // トークンがあれば追加
  console.log('Token from context exists:', Boolean(token));
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // リクエスト設定(特定の値のみを許可するRequestCredentials型を設定)
  const config:RequestInit = {
    ...options,
    credentials: 'include', // HTTPOnly Cookieを送信可能に
    headers,
  };

  // リクエストヘッダーの確認
  console.log('Request headers:', headers);

  // APIリクエスト実行
  try {
    const response = await fetch(url, config);

    // 204 No Content の場合は空オブジェクトを返す
    if (response.status === 204) {
      return {};
    }

    // レスポンスのJSONパース
    const data = await response.json();

    // エラーレスポンスの処理
    if (!response.ok) {
      const errorMessage = data.status?.message || data.error || response.statusText;
      const error = new Error(errorMessage) as Error & { status?: number };
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser() {
  return fetchAPI('/api/v1/user');
}

/**
 * ユーザーのタスク一覧を取得
 */
export async function getUserTasks() {
  return fetchAPI('/api/v1/tasks');
}

/**
 * 特定のタスク情報を取得
 * @param taskId - タスクID
 */
export async function getTask(taskId: string | number) {
  return fetchAPI(`/api/v1/tasks/${taskId}`);
}

/**
 * 認証状態を検証
 * @returns 認証有効の場合はtrue、無効の場合はfalse
 */
export async function validateAuth() {
  try {
    // ヘルスチェックエンドポイントを使用して認証状態を検証
    await fetchAPI('/api/v1/test/health');
    return true;
  } catch (error) {
    console.error('Auth validation error:', error);
    // 401/403エラーの場合は認証無効
    if ((error as any).status === 401 || (error as any).status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user_type');
      }
      return false;
    }
    // その他のエラーは再スロー
    // throw error;

    // 404や500などのエラーの場合も認証失敗とみなす
    // 本来なら認証済みユーザーがアクセスできるエンドポイントのため
    return false;
  }
}