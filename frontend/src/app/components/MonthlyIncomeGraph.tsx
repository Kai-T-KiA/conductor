'use client';

import React from 'react';

// グラフデータの型定義
interface IncomeData {
  month: string;
  income: number;
}

interface MonthlyIncomeProps {
  data: IncomeData[];
}

const MonthlyIncomeGraph: React.FC<MonthlyIncomeProps> = ({ data }) => {
  const maxValue = 1000000;

  // Y軸の目盛りを作成
  const yLabels = [
    { value: 1000000, label: '100万円' },
    { value: 750000, label: '75万円' },
    { value: 500000, label: '50万円' },
    { value: 250000, label: '25万円' },
    { value: 0, label: '0円' }
  ];

  return (
    <div className="w-full px-6">
      <div className="relative h-80 mb-10">
        {/* Y軸ラベルとグリッドライン */}
        {yLabels.map((label, i) => (
          <div
            key={i}
            className="absolute w-full"
            style={{ top: `${(i * 100) / (yLabels.length - 1)}%` }}
          >
            <div className="absolute -left-14 -top-2 text-xs text-gray-500 w-12 text-right">
              {label.label}
            </div>
            <div className="border-t border-gray-200 w-full h-0" />
          </div>
        ))}

        {/* グラフ本体 */}
        <div className="absolute inset-0 pt-1">
          <div className="flex h-full items-end relative">
            {data.map((_, index) => (
              <div
                key={`grid-${index}`}
                className="absolute border-l border-gray-200 h-full"
                style={{ left: `${((index + 0.5) * 100) / data.length}%` }}
              />
            ))}

            {data.map((item, index) => (
              <div key={index} className="flex-1 flex justify-center items-end h-full">
                <div className="relative mx-2 h-full">
                  <div
                    className="w-12 bg-green-500 rounded-t-sm"
                    style={{
                      height: `${(item.income / maxValue) * 100}%`,
                      minHeight: '10px',
                      position: 'absolute',
                      bottom: 0,
                      left: -22
                    }}
                  >
                    <div className="absolute -top-6 w-12 text-center text-xs text-gray-600">
                      {(item.income / 10000).toFixed(1)}万
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X軸ラベル */}
      <div className="flex border-t border-gray-300 px-2 -mt-6">
        {data.map((item, index) => (
          <div key={`label-${index}`} className="flex-1 text-center text-sm font-medium pt-2">
            {item.month}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyIncomeGraph;