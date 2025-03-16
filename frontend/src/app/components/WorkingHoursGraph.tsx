'use client';

import React from 'react';

// グラフデータの型定義
interface WorkingHoursData {
  month: string;
  actual: number;
  target: number;
}

interface WorkingHoursGraphProps {
  data: WorkingHoursData[];
}

const WorkingHoursGraph: React.FC<WorkingHoursGraphProps> = ({ data }) => {
  // 最大値を少し大きめにして余白を作る
  const maxValue = 150;

  // Y軸の目盛りを作成
  const yLabels = [
    { value: 150, label: '150h' },
    { value: 112.5, label: '112.5h' },
    { value: 75, label: '75h' },
    { value: 37.5, label: '37.5h' },
    { value: 0, label: '0h' }
  ];

  return (
    <div className="w-full px-6">
      {/* グラフのコンテナ */}
      <div className="relative h-80 mb-10">
        {/* Y軸ラベルとグリッドライン */}
        {yLabels.map((label, i) => (
          <div
            key={i}
            className="absolute w-full"
            style={{ top: `${(i * 100) / (yLabels.length - 1)}%` }}
          >
            {/* Y軸ラベル */}
            <div className="absolute -left-12 -top-2 text-xs text-gray-500 w-10 text-right">
              {label.label}
            </div>
            {/* 水平グリッドライン */}
            <div className="border-t border-gray-200 w-full h-0" />
          </div>
        ))}

        {/* グラフ本体 - 下部に配置 */}
        <div className="absolute inset-0 pt-1">
          <div className="flex h-full items-end relative">
            {/* 垂直グリッドライン */}
            {data.map((_, index) => (
              <div
                key={`grid-${index}`}
                className="absolute border-l border-gray-200 h-full"
                style={{ left: `${((index + 0.5) * 100) / data.length}%` }}
              />
            ))}

            {data.map((item, index) => (
              <div key={index} className="flex-1 flex justify-center items-end h-full">
                <div className="flex justify-center items-end gap-4 mr-8 h-full">
                  {/* 実績棒グラフ */}
                  <div className="relative mx-2 h-full">
                    <div
                      className="w-8 bg-blue-500 rounded-t-sm"
                      style={{
                        height: `${(item.actual / maxValue) * 100}%`,
                        minHeight: '10px',
                        position: 'absolute',
                        bottom: 0,
                        left: 0
                      }}
                    >
                      <div className="absolute -top-6 w-8 text-center text-xs text-gray-600">
                        {item.actual}h
                      </div>
                    </div>
                  </div>

                  {/* 目標棒グラフ */}
                  <div className="relative mx-2 h-full">
                    <div
                      className="w-8 bg-gray-300 rounded-t-sm"
                      style={{
                        height: `${(item.target / maxValue) * 100}%`,
                        minHeight: '10px',
                        position: 'absolute',
                        bottom: 0,
                        left: 0
                      }}
                    >
                      <div className="absolute -top-6 w-8 text-center text-xs text-gray-600">
                        {item.target}h
                      </div>
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

export default WorkingHoursGraph;