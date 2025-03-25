// ミドルウェアの設定
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ルートパスへのアクセスをログインページにリダイレクト
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 将来的に認証状態に基づいたリダイレクトロジックを追加する
  // 例：ログイン済みのユーザーがログインページにアクセスした場合はダッシュボードへリダイレクト
  // if (request.nextUrl.pathname.startsWith('/login') && isAuthenticated()) {
  //   return NextResponse.redirect(new URL('/dashboard', request.url));
  // }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ['/', '/login']
};