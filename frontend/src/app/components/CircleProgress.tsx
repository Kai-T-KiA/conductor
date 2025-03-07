import React from 'react';

interface CircleProgressProps {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  color,
  size = 48,
  strokeWidth = 3,
}) => {
  // 円周の計算
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      {/* 背景の円 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E6E6E6"
        strokeWidth={strokeWidth}
      />

      {/* 進捗を表す円 */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{
          transition: 'stroke-dashoffset 0.5s ease-in-out',
        }}
      />
    </svg>
  );
};

export default CircleProgress;