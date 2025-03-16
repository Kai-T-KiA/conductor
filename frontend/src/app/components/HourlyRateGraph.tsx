'use client';

import React from 'react';

// グラフデータの型定義
interface HourlyRateData {
  month: string;
  rate: number;
}

interface HourlyRateProps {
  data: HourlyRateData[];
}

const HourlyRateGraph: React.FC<HourlyRateProps> = ({ data }) => {
  return (
    <div className="w-full px-6">
      <div className="relative h-80 mb-10">
        {/* Y軸の目盛りを作成 */}
        {[0, 1, 2, 3, 4].map((i) => {
          const value = 5000 - i * 1000;
          return (
            <div
              key={i}
              className="absolute w-full"
              style={{ top: `${(i * 100) / 4}%` }}
            >
              <div className="absolute -left-14 -top-2 text-xs text-gray-500 w-12 text-right">
                {value.toLocaleString()}円
              </div>
              <div className="border-t border-gray-200 w-full h-0" />
            </div>
          );
        })}

        {/* ライングラフの描画 */}
        <div className="absolute inset-0 pt-1">
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* 線グラフの描画 */}
            <polyline
              points={data.map((item, index) => {
                const x = (10 + (index) * 80 / (data.length - 1)) + '%';
                const y = (100 - ((item.rate - 1000) / 4000) * 100) + '%';
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* データポイントのマーク */}
            {data.map((item, index) => {
              const x = (10 + (index) * 80 / (data.length - 1)) + '%';
              const y = (100 - ((item.rate - 1000) / 4000) * 100) + '%';
              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={(parseFloat(y) - 15) + '%'}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#4b5563"
                  >
                    {item.rate.toLocaleString()}円
                  </text>
                </g>
              );
            })}
          </svg>
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

export default HourlyRateGraph;