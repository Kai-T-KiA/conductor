'use client';

import React, { useState } from 'react';

// カレンダーデータの型定義
type CalendarDayData = {
  day: number;
  hours: number;
};

const MonthlyCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // 2025年3月

  // カレンダーの日付と稼働時間のデータ(実際はAPIで取得してくる)
  const calendarData: CalendarDayData[] = [
    { day: 1, hours: 0 },
    { day: 2, hours: 8.5 },
    { day: 3, hours: 0 },
    { day: 4, hours: 7.5 },
    { day: 5, hours: 6 },
    { day: 6, hours: 8 },
    { day: 7, hours: 9 },
    { day: 8, hours: 4 },
    { day: 9, hours: 0 },
    { day: 10, hours: 0 },
    { day: 11, hours: 7.5 },
    { day: 12, hours: 8 },
    { day: 13, hours: 0 },
    { day: 14, hours: 0 },
    { day: 15, hours: 0 },
    { day: 16, hours: 0 },
    { day: 17, hours: 0 },
    { day: 18, hours: 0 },
    { day: 19, hours: 0 },
    { day: 20, hours: 0 },
    { day: 21, hours: 0 },
    { day: 22, hours: 0 },
  ];

  // 当月の日付を取得
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // カレンダーの曜日を取得
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // 労働時間に応じた背景色のクラスを取得
  const getHoursClass = (hours: number): string => {
    if (hours === 0) return '';
    if (hours >= 1 && hours < 4) return 'bg-blue-100';
    if (hours >= 4 && hours < 8) return 'bg-blue-200';
    if (hours >= 8) return 'bg-blue-300';
    return '';
  };

  // 曜日の配列
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // 月の日本語表記
  const formatMonth = (date: Date): string => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 w-[100%] h-[700px]">
      <div className="flex justify-between items-center mb-7">
        <h3 className="text-[30px] font-semibold">{formatMonth(currentMonth)}の稼働詳細</h3>

        {/* 凡例 */}
        <div className="flex space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded-sm mr-1"></div>
            <span className="text-sm text-gray-600">1-4h</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-200 rounded-sm mr-1"></div>
            <span className="text-sm text-gray-600">4-8h</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-300 rounded-sm mr-1"></div>
            <span className="text-sm text-gray-600">8h+</span>
          </div>
        </div>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-[35px] mb-2">
        {weekdays.map((day, index) => (
          <div
            key={index}
            className="text-center py-1 font-medium text-gray-600"
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div className="grid grid-cols-7 gap-9">
        {/* 空白セル (月初めの前) */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-16"></div>
        ))}

        {/* 日付セル */}
        {calendarData.map((item) => (
          <div
            key={item.day}
            className={`relative rounded-full w-16 h-16 flex flex-col items-center justify-center ${getHoursClass(item.hours)} m-auto`}
          >
            <span className="text-lg">{item.day}</span>
            {item.hours > 0 && (
              <span className="text-xs text-gray-600">{item.hours}h</span>
            )}
          </div>
        ))}
      </div>

      {/* CSV出力ボタン */}
      <div className="mt-12 flex justify-end">
        <button
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full cursor-pointer"
          onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
        >
          CSVを出力
        </button>
      </div>
    </div>
  );
};

export default MonthlyCalendar;