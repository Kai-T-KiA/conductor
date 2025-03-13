'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, validateAuth } from '../../utils/api';

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
    const [userData, setUserData] = useState({
      id: '000000',
      name: '田中太郎'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          // トークンがあるか確認
          const token = localStorage.getItem('token');
          if (!token) {
            // トークンがない場合はログイン画面にリダイレクト
            router.push('/login');
            return;
          }

          // トークンの有効性を検証
          const isValid = await validateAuth();
          if (!isValid) {
            // 認証が無効な場合はログイン画面にリダイレクト
            router.push('/login');
            return;
          }

          // 現在のユーザータイプを取得
          const userType = localStorage.getItem('user_type');

          // 管理者ページに一般ユーザーがアクセスしようとしている場合
          if (
            window.location.pathname.startsWith('/admin') &&
            userType !== '1'
          ) {
            router.push('/user/home');
            return;
          }

          // 一般ユーザーページに管理者がアクセスしようとしている場合
          if (
            window.location.pathname.startsWith('/user') &&
            userType === '1'
          ) {
            router.push('/admin/home');
            return;
          }

          // ユーザー情報を取得
          try {
            // const user = await getCurrentUser();
            // // if (user && user.data) {
            //   setUserData({
            //     id: user.data.id || '000000',
            //     name: user.data.name || '田中太郎',
            //   });
            // }
            setUserData({
              id: '000000',
              name: '田中太郎',
            });
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            // エラー時も処理を続行（デフォルト値を使用）
            setUserData({
              id: '000000',
              name: '田中太郎',
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          router.push('/login');
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, [router]);

    if (loading) {
      return <div className='flex justify-center items-center h-screen'>読み込み中...</div>;
    }

    return <LayoutComponent userData={userData}>{children}</LayoutComponent>;
  };
}