'use client';

import { useState, useEffect, useRef } from 'react';
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
    // const [authChecked, setAuthChecked] = useState(false);
    const [displayUserData, setDisplayUserData] = useState({
      id: '000000',
      name: '読み込み中...'
    });

    // 認証チェックの実行状態を追跡
    const checkingAuthRef = useRef(false);
    const initialCheckDoneRef = useRef(false);

    useEffect(() => {
      // すでに初回チェックが完了していて、かつチェック中でない場合のみ実行
      if (initialCheckDoneRef.current && !checkingAuthRef.current) {
        // ルートが'/login'の場合は認証チェックをスキップ
        if (window.location.pathname === '/login') {
          setLoading(false);
          return;
        }

        // 認証状態やユーザーデータが変更された場合に再チェック
        const checkAuth = async () => {
          // チェック中フラグを設定
          checkingAuthRef.current = true;

          try {
            // ログインしていない場合はリダイレクト
            if (!isAuthenticated) {
              // トークンのリフレッシュを試みる
              const refreshSuccess = await refreshToken();

              if (!refreshSuccess) {
                console.log('認証されていません。ログインページにリダイレクトします');
                router.replace('/login');
                return;
              }
            }

            // ユーザータイプに基づいたリダイレクト
            const userType = userData?.user_type !== undefined ? Number(userData.user_type) : null;
            console.log('ユーザータイプ:', userType);

            if (userType !== null) {
              // 管理者ページに一般ユーザーがアクセスしようとしている場合
              if (window.location.pathname.startsWith('/admin') && userType !== 1) {
                console.log('一般ユーザーが管理者ページにアクセスしています。リダイレクトします');
                router.replace('/user/home');
                return;
              }

              // 一般ユーザーページに管理者がアクセスしようとしている場合
              if (window.location.pathname.startsWith('/user') && userType === 1) {
                console.log('管理者がユーザーページにアクセスしています。リダイレクトします');
                router.replace('/admin/home');
                return;
              }
            }

            // 表示用ユーザーデータの設定
            if (userData) {
              setDisplayUserData({
                id: userData.id || '000000',
                name: userData.name || 'ユーザー',
              });
            }
          } catch (error) {
            console.error('認証チェックに失敗しました:', error);
            router.replace('/login');
          } finally {
            setLoading(false);
            // チェック完了フラグをリセット
            checkingAuthRef.current = false;
          }
        };

        // 認証チェックを実行
        checkAuth();
      }
    }, [isAuthenticated, userData, router, refreshToken]);



    // 初回マウント時の処理
    useEffect(() => {
      // 初回チェックがまだ行われていない場合のみ実行
      if (!initialCheckDoneRef.current && !checkingAuthRef.current) {
        // 初回チェックを行うフラグを設定
        checkingAuthRef.current = true;

        const initialCheck = async () => {
          try {
            // ログインしていない場合はリダイレクト
            if (!isAuthenticated) {
              // トークンのリフレッシュを試みる
              const refreshSuccess = await refreshToken();

              if (!refreshSuccess) {
                console.log('認証されていません。ログインページにリダイレクトします');
                router.replace('/login');
                return;
              }
            }

            // ユーザータイプに基づいたリダイレクト
            const userType = userData?.user_type !== undefined ? Number(userData.user_type) : null;
            console.log('初回チェック - ユーザータイプ:', userType);

            if (userType !== null) {
              // 管理者ページに一般ユーザーがアクセスしようとしている場合
              if (window.location.pathname.startsWith('/admin') && userType !== 1) {
                console.log('一般ユーザーが管理者ページにアクセスしています。リダイレクトします');
                router.replace('/user/home');
                return;
              }

              // 一般ユーザーページに管理者がアクセスしようとしている場合
              if (window.location.pathname.startsWith('/user') && userType === 1) {
                console.log('管理者がユーザーページにアクセスしています。リダイレクトします');
                router.replace('/admin/home');
                return;
              }
            }

            // 表示用ユーザーデータの設定
            if (userData) {
              setDisplayUserData({
                id: userData.id || '000000',
                name: userData.name || 'ユーザー',
              });
            }
          } catch (error) {
            console.error('初回認証チェックに失敗しました:', error);
            router.replace('/login');
          } finally {
            setLoading(false);
            // 初回チェック完了フラグを設定
            initialCheckDoneRef.current = true;
            // チェック中フラグをリセット
            checkingAuthRef.current = false;
          }
        };

        // 初回チェックを実行
        initialCheck();
      }
    }, []);

    if (loading) {
      return <div className='flex justify-center items-center h-screen'>読み込み中...</div>;
    }

    return <LayoutComponent userData={displayUserData}>{children}</LayoutComponent>;
  };
}