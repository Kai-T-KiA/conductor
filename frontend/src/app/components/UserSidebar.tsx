'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

type SidebarProps = {
  userData: {
    id: string;
    name: string;
  };
};

export default function UserSidebar({ userData }: SidebarProps) {
  const pathname = usePathname();

  // アクティブなメニュー項目を判定する関数
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-[168px] text-center flex flex-col min-h-screen " style={{ backgroundColor: '#C8C5DC' }}>
      <div className="py-6 border-indigo-200">
        <Image
          src='/conductor-logo.png'
          alt='アプリロゴ'
          width={150}
          height={45}
          priority
          className='ml-[9px] mt-[25px] mb-[20px]'
        />
        <div className="border-b border-black mx-4"></div>
        <div className="text-xs mt-6 mb-1 text-[16px]">ユーザーID</div>
        <div className="text-xs text-[16px]">{userData.id}</div>
        <div className="text-xs mt-6 mb-1 text-[16px]">ユーザー名</div>
        <div className="text-xs text-[16px]">{userData.name}</div>
        <div className="border-b border-black mx-4 mt-6"></div>
      </div>

      <Link
        href="/user/home"
        className={`py-4 text-center text-[20px] ${isActive('/user/home') ? 'bg-indigo-200' : ''}`}
      >
        ホーム
      </Link>
      <Link
        href="/user/work"
        className={`py-4 text-center text-[20px] ${isActive('/user/work') ? 'bg-indigo-200' : ''}`}
      >
        稼働状況
      </Link>
      <Link
        href="/user/task"
        className={`py-4 text-center text-[20px] ${isActive('/user/task') ? 'bg-indigo-200' : ''}`}
      >
        タスク
      </Link>
      <Link
        href="/user/reward"
        className={`py-4 text-center text-[20px] ${isActive('/user/reward') ? 'bg-indigo-200' : ''}`}
      >
        報酬
      </Link>
      <Link
        href="/user/performance"
        className={`py-4 text-center text-[20px] ${isActive('/user/performance') ? 'bg-indigo-200' : ''}`}
      >
        パフォーマンス
      </Link>
    </div>
  );
}