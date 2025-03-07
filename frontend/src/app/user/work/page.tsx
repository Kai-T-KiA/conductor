'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import WorkingSummary from '../../components/WorkingSummary';
import TimeReporting from '../../components/TimeReporting';
import WorkingHoursChart from '../../components/WorkingHoursChart';
import MonthlyCalendar from '../../components/MonthlyCalendar';

export default function UserWorkPage() {
  const [selectedMonth, setSelectedMonth] = useState('2025年2月');

  return (
    <>
      <main className="flex-1 overflow-y-auto p-6h h-[95%]">
          <h1 className="text-4xl font-bold mb-6">稼働状況詳細</h1>
          {/* 月選択エリア */}
          <div className="mb-6 flex items-center bg-white w-fit">
            <h2 className="text-xl m-4">年月を選択：</h2>
            <div className="relative mr-4">
              <select
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-blue-500"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
              >
                <option>2025年2月</option>
                <option>2025年3月</option>
                <option>2025年4月</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
          {/* コンテンツグリッド */}
          <div className="flex">
            {/* 左側カラム */}
            <div className="space-y-6 w-[40%] mr-[70px]">
              <WorkingSummary />
              <TimeReporting />
              <WorkingHoursChart />
            </div>
            {/* 右側カラム - カレンダー */}
            <div className='w-[100%] h-full mr-[20px]'>
              <MonthlyCalendar />
            </div>
          </div>
        </main>
    </>
  )
}