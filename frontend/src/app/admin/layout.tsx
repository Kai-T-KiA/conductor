'use client';

import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';
import { withAuthLayout } from '../auth/AuthLayout';

// 管理者レイアウトのベースコンポーネント
function AdminLayoutBase({
  children,
  userData
}: {
  children: React.ReactNode;
  userData: { id: string; name: string };
}) {
  return (
    <div className='flex min-h-screen text-black' style={{ backgroundColor: '#F5EFFA' }}>
      <AdminSidebar userData={userData} />
      <div className='flex-1 flex flex-col'>
        <Header userId={userData.id} />
        <main className='flex-1 pl-[50px] pr-[30px] h-[80%]' style={{ backgroundColor: '#F5EFFA' }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// 認証処理を含む管理者レイアウト
const AdminLayout = withAuthLayout(AdminLayoutBase);

export default AdminLayout;