'use client';

import React from 'react';

type ChartDataItem = {
  day: number;
  hours: number;
};

type WorkingHoursChartProps = {
  data?: ChartDataItem[];
  startDate?: string;
  endDate?: string;
};

const WorkingHoursChart: React.FC<WorkingHoursChartProps> = ({
  data,
  startDate = '3/1',
  endDate = '3/7'
}) => {
  // グラフデータの例（実際の実装では動的にデータを取得する）
  const chartData = data || [
    { day: 1, hours: 4 },
    { day: 2, hours: 5.5 },
    { day: 3, hours: 3 },
    { day: 4, hours: 6 },
    { day: 5, hours: 4.5 },
    { day: 6, hours: 3 },
    { day: 7, hours: 6 },
  ];

  // グラフの最大値を計算
  const maxHours = Math.max(...chartData.map(item => item.hours));

  return (
    <div className="bg-white rounded-lg shadow p-6 h-[300px]">
      <h3 className="text-lg font-semibold mb-4">稼働時間推移</h3>

      <div className="h-40 flex items-end space-x-2">
        {chartData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex flex-col justify-end h-32"> {/* 明示的な高さ */}
              <div
                className="bg-cyan-400 w-full rounded-t"
                style={{ height: `${Math.max((item.hours / 6) * 32, 2)}px` }}
              >{/* ピクセル単位で指定 */}
              </div>
            </div>
            <span className="text-xs mt-1">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 border-t border-gray-200 pt-2 flex justify-between">
        <span className="text-xs text-gray-500">3/1</span>
        <span className="text-xs text-gray-500">3/7</span>
      </div>
    </div>
  );
};

export default WorkingHoursChart;

