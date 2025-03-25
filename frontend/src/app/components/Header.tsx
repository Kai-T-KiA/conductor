'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';


type HeaderProps = {
  userId: string;
};

export default function Header({ userId }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // メニュー外クリックで閉じる処理
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ログアウト処理の実装
  const handleLogout = () => {
    // LocalStorageからデータを削除
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('KEY_LOCALE');

    // ユーザーに通知
    window.alert('ログアウトしました');

    // ログイン画面へリダイレクト
    router.push('/login');
  };

  return (
    <div className="flex justify-between items-center p-4 h-[106px] mb-[20px]" style={{ backgroundColor: '#F5EFFA' }}>
      <div className="flex items-center ml-[10px]">
        <button
          className="flex items-center px-4 py-2 rounded-full transition-all duration-200 bg-green-50 hover:bg-green-100 cursor-pointer"
          onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: '#8FBC8F'}}>
            <Image
              src='/conductor-ai-logo.png'
              alt='アプリロゴ'
              width={60}
              height={60}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <span className="text-gray-700 font-medium">Conductor AI に聞く</span>
        </button>
      </div>

      <div className='relative' ref={menuRef}>
        <div
          className="flex items-center mr-[15px] cursor-pointer border p-1 rounded"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center">
            <Image
              src='/account-logo.png'
              alt='アプリロゴ'
              width={606}
              height={185}
              priority
            />
          </div>
          <span className="ml-2 text-gray-700">{userId}</span>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="rounded-md ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <button
                onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                アカウント設定
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}