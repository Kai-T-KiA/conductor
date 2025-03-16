'use client';

import React from 'react';

// グラフデータの型定義
interface ProjectIncomeData {
  name: string;
  income: number;
}

interface ProjectIncomeProps {
  data: ProjectIncomeData[];
}

const ProjectIncomeGraph: React.FC<ProjectIncomeProps> = ({ data }) => {
  // 総収入を計算
  const totalIncome = data.reduce((sum, project) => sum + project.income, 0);

  // 円グラフの描画に必要な変数
  const radius = 120;
  const centerX = 180;
  const centerY = 150;
  let currentAngle = 0;

  // 色のパレット
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative h-80 w-80">
        <svg width="360" height="300" viewBox="0 0 360 300">
          {/* 円グラフを描画 */}
          {data.map((project, index) => {
            const percentage = (project.income / totalIncome) * 100;
            const angle = (percentage / 100) * 360;

            // 円弧の計算
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;

            // SVGパスの作成
            const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');

            // 凡例用のテキスト位置の計算
            const textAngle = startAngle + angle / 2;
            const labelRadius = radius * 0.7;
            const labelX = centerX + labelRadius * Math.cos((textAngle * Math.PI) / 180);
            const labelY = centerY + labelRadius * Math.sin((textAngle * Math.PI) / 180);

            // 角度を更新
            currentAngle += angle;

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={colors[index % colors.length]}
                  stroke="white"
                  strokeWidth="1"
                />
                {angle > 20 && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {percentage.toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 凡例 */}
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {data.map((project, index) => (
          <div key={index} className="flex items-center">
            <div
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            ></div>
            <span className="text-sm">{project.name}: {(project.income / 10000).toFixed(1)}万円</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectIncomeGraph;