'use client';

import { useState } from 'react';
import Link from 'next/link';
import HomeCalendar from '../../components/HomeCalendar';
import TaskList from '../../components/TaskList';

export default function UserHomePage() {
  // 稼働開始ボタンのクリックイベントハンドラ
  const handleStartWork = async () => {
    try {
      // startWork APIを呼び出す（実際の実装では）
      console.log('Work session started');
      window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
    } catch (error) {
      console.error('Failed to start work:', error);
      window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
    }
  };

  return (
    <>
      <div className='grid grid-cols-2 gap-8 text-black h-full'  style={{ backgroundColor: '#F5EFFA' }}>
        {/* 稼働状況 */}
        <div className='h-full'>
          <h2 className='text-4xl font-semibold mb-4'>稼働状況</h2>
          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <HomeCalendar />
          </div>
        </div>

        {/* タスク状況 */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-4xl font-semibold'>タスク状況</h2>
          </div>

          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='flex mb-4 h-fit'>
              <h3 className=''>タスク状況</h3>
              <Link href='/user/tasks/all' className='text-blue-500 text-sm flex items-center ml-auto'>
                詳細 <span className='ml-1'>+</span>
              </Link>
            </div>

            {/* タスク統計 */}
            <div className='grid grid-cols-4 gap-4 mb-6'>
              <div className='text-center'>
                <div className='text-xl font-bold text-yellow-500'>1</div>
                <div className='text-xs'>未完了</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-blue-500'>2</div>
                <div className='text-xs'>進行中</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-green-500'>1</div>
                <div className='text-xs'>完了</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold'>4</div>
                <div className='text-xs'>合計</div>
              </div>
            </div>

            <TaskList />
          </div>

          {/* 稼働開始ボタン */}
          <div className='flex justify-center mt-25'>
              <button
                className='w-80 h-80 bg-purple-500 hover:bg-purple-600 text-white text-4xl font-bold rounded-full transition duration-200 cursor-pointer'
                onClick={handleStartWork}
              >
                稼働開始
              </button>
            </div>
        </div>
      </div>
    </>
  )
}
