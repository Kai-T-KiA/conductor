'use client';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'ログインが必要です。再度ログインしてください。';
      case 403:
        return 'この操作を行う権限がありません。';
      case 404:
        return 'リクエストされたリソースが見つかりません。';
      case 422:
        return '入力データにエラーがあります。';
      case 500:
      case 502:
      case 503:
        return 'サーバーエラーが発生しました。しばらく経ってからもう一度お試しください。';
      default:
        return `エラーが発生しました: ${error.message}`;
    }
  }

  return 'サービスへの接続時にエラーが発生しました。インターネット接続を確認してください。';
};