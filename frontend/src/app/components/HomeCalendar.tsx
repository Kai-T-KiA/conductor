'use client';

import { useState } from 'react';

// カレンダーデータの型定義
type CalendarProps = {
  calendarData?: Record<string, number>;
};

export default function HomeCalendar({ calendarData = {} }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // 2025年3月

  // console.log(calendarData);

  // 当月の日付を取得
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // APIから取得したデータをカレンダー形式に変換
  const processCalendarData = () => {
    const result = [];
    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hours = calendarData[dateString] || 0;

      result.push({
        day: i,
        hours: hours
      });
    }

    return result;
  };

  // 変換したデータを使用
  const calendarDataArray = processCalendarData();
  // console.log('カレンダー表示用のデータ');
  // console.log(calendarDataArray);

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // カレンダーの曜日を取得
  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  const firstDayOfMonth = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

  // 前月に移動
  // const goToPreviousMonth = () => {
  //   setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  // };

  // 翌月に移動
  // const goToNextMonth = () => {
  //   setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  // };

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

  return ( // 後で細かい動作を見直す
    <>
      {/* カレンダーナビゲーション */}
      <div className="flex justify-between items-center mb-10">
        {/* <button onClick={goToPreviousMonth} className="text-xl">◀</button> */}
        <h3 className="text-4xl font-bold mx-auto">{formatMonth(currentMonth)}</h3>
        {/* <button onClick={goToNextMonth} className="text-xl">▶</button> */}
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-[20px] text-center mb-2 text-[25px]">
        {weekdays.map((day, index) => (
          <div key={index} className="py-2">{day}</div>
        ))}
      </div>

      {/* カレンダー日付 */}
      <div className="grid grid-cols-7 gap-[20px]">
        {/* 空白セル (月初めの前) */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="h-12"></div>
        ))}

        {/* 日付セル */}
        {calendarDataArray.map((item) => {
          const dayData = calendarDataArray.find(d => d.day === item.day) || { hours: 0 };
          const isToday = item.day === 21; // 例として1日を「今日」とする

          return (
            <div
              key={item.day}
              className={`relative w-20 h-20 ${getHoursClass(dayData.hours)} flex flex-col items-center justify-center rounded-full`}
            >
              {isToday ? (
                <div className="font-bold text-[24px] text-blue-600 border-b-2 border-blue-500">
                  {item.day}
                </div>
              ) : (
                <div className="text-[24px]">{item.day}</div>
              )}
              {dayData.hours > 0 && <div className="text-[18px] mt-1">{dayData.hours}</div>}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex justify-between mt-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-100 rounded-full mr-1"></div>
          <span className="text-xl">1-4h</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-200 rounded-full mr-1"></div>
          <span className="text-xl">4-8h</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-blue-300 rounded-full mr-1"></div>
          <span className="text-xl">8h+</span>
        </div>
      </div>
    </>
  );
}