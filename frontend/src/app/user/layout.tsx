'use client';

import UserSidebar from '../components/UserSidebar';
import Header from '../components/Header';
import { withAuthLayout } from '../auth/AuthLayout';

// ユーザーレイアウトのベースコンポーネント
function UserLayoutBase({
  children,
  userData
}: {
  children: React.ReactNode;
  userData: { id: string; name: string };
}) {
  return (
    <div className='flex min-h-screen text-black' style={{ backgroundColor: '#F5EFFA' }}>
      <UserSidebar userData={userData} />
      <div className='flex-1 flex flex-col'>
        <Header userId={userData.id} />
        <main className='flex-1 pl-[50px] pr-[30px] h-[80%]' style={{ backgroundColor: '#F5EFFA' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// 認証処理を含むユーザーレイアウト
const UserLayout = withAuthLayout(UserLayoutBase);

export default UserLayout;
