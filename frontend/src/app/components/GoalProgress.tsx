'use client';

import React from 'react';

interface GoalProgressProps {
  title: string;
  currentValue: string | number;
  progress: number; // 0-100のパーセンテージ
  color: string; // テールウィンドのカラークラス（例: 'blue', 'green', 'purple'）
}

const GoalProgress: React.FC<GoalProgressProps> = ({ title, currentValue, progress, color }) => {
  // カラーマッピング
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600',
    yellow: 'bg-yellow-600',
    red: 'bg-red-600',
  };

  const progressColor = colorMap[color] || 'bg-blue-600';

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className="flex items-center">
        <div className="font-bold">{currentValue}</div>
        <div className="text-sm ml-auto">{progress}%</div>
      </div>
      {/* パーセンテージバー */}
      <div className="bg-gray-300 h-2 rounded-full">
        <div className={`${progressColor} h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default GoalProgress;