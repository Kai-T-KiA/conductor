// ミドルウェアの設定
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // HTTPOnly Cookieベースの認証を処理 (サーバー側でのみ確認可能)
  const authCookie = request.cookies.get('refresh_token');

  // ルートパスへのアクセスをログインページにリダイレクト
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ログインページへのアクセスで認証済みの場合はリダイレクト
  // リフレッシュトークンがある場合のみチェック
  // if (request.nextUrl.pathname.startsWith('/login') && authCookie) {
  //   // 認証状態確認APIを呼び出さずに、クッキーの存在だけでリダイレクト判断
  //   // 詳細な検証はページコンポーネント側で実施
  //   return NextResponse.redirect(new URL('/user/home', request.url));
  // }

  // 保護されたルートへのアクセスで未認証の場合はリダイレクト
  if ((request.nextUrl.pathname.startsWith('/user') || request.nextUrl.pathname.startsWith('/admin')) && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// ミドルウェアを適用するパスを指定
export const config = {
  matcher: ['/', '/login', '/user/:path*', '/admin/:path*']
};