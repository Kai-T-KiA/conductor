'use client';

import Image from 'next/image';

type HeaderProps = {
  userId: string;
};

export default function Header({ userId }: HeaderProps) {
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
      <div className="flex items-center mr-[15px] cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
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
    </div>
  );
}