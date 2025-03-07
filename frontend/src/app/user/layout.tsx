'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getCurrentUser } from '../../utils/api';

export default function UserLayout({
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
    // APIリクエストをスキップし、すぐにローディング状態を解除
    setLoading(false);

    // 一旦、コメントアウト
    // const fetchUserData = async () => {
    //   try {
    //     // localStorageからトークンが存在するか確認
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //       // トークンがない場合はログイン画面にリダイレクト
    //       router.push('/login');
    //       return;
    //     }

    //     // ユーザー情報を取得
    //     const user = await getCurrentUser();
    //     if (user) {
    //       setUserData({
    //         id: user.id || '000000',
    //         name: user.name || '田中太郎',
    //       });
    //     }
    //   } catch (error) {
    //     console.error('Failed to fetch user data:', error);
    //     // エラー時はログイン画面にリダイレクト
    //     router.push('/login');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchUserData();
  // }, [router]);
  }, []);

  if (loading) {
    return <div className='flex justify-center items-center h-screen'>読み込み中...</div>;
  }

  return (
    <div className='flex min-h-screen text-black'>
      <Sidebar userData={userData} />
      <div className='flex-1 flex flex-col'>
        <Header userId={userData.id} />
        <main className='flex-1 pl-[50px] pr-[30px] pt-[20px]' style={{ backgroundColor: '#F5EFFA' }}>
          {children}
        </main>
      </div>
    </div>
  )
}