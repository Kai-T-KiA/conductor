'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
// import { getCurrentUser, validateAuth } from '../../utils/api';

// レイアウトコンポーネントのベース機能
// UserLayoutとAdminLayoutの共通機能を抽出
export function withAuthLayout(
  LayoutComponent: React.FC<{
    children: React.ReactNode;
    userData: { id: string; name: string };
  }>
) {
  return function AuthenticatedLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const router = useRouter();
    const { token, userData, isAuthenticated, refreshToken } = useAuth();
    const [loading, setLoading] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);
    const [displayUserData, setDisplayUserData] = useState({
      id: '000000',
      name: '読み込み中...'
    });

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // ログインしていない場合はリダイレクト
          if (!isAuthenticated) {
            // トークンのリフレッシュを試みる
            const refreshSuccess = await refreshToken();

            if (!refreshSuccess) {
              console.log('Not authenticated, redirecting to login');
              router.replace('/login');
              return;
            }
          }

          // ユーザータイプに基づいたリダイレクト
          const userType = userData?.user_type ? Number(userData.user_type) : null;
          console.log('User type from context:', userType);

          // 管理者ページに一般ユーザーがアクセスしようとしている場合
          if (
            window.location.pathname.startsWith('/admin') &&
            userType !== 1
          ) {
            console.log('Non-admin accessing admin page, redirecting');
            router.replace('/user/home');
            return;
          }

          // 一般ユーザーページに管理者がアクセスしようとしている場合
          if (
            window.location.pathname.startsWith('/user') &&
            userType === 1
          ) {
            console.log('Admin accessing user page, redirecting');
            router.replace('/admin/home');
            return;
          }

          // 表示用ユーザーデータの設定
          if (userData) {
            setDisplayUserData({
              id: userData.id || '000000',
              name: userData.name || 'ユーザー',
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          router.replace('/login');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [isAuthenticated, userData, router, refreshToken]);

    // 認証状態やトークンが変わったときにチェックを再実行
    useEffect(() => {
      if (!loading) {
        setLoading(true);
      }
    }, [token, isAuthenticated]);

    if (loading) {
      return <div className='flex justify-center items-center h-screen'>読み込み中...</div>;
    }

    return <LayoutComponent userData={displayUserData}>{children}</LayoutComponent>;
  };
}