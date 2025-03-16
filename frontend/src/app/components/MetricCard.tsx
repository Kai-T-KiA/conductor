'use client';

import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: {
    value: number;
    isPositive: boolean;
  }
  txColor: string;
  bgColor: string;
  icon: ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, txColor, bgColor, icon }) => {
  return (
    <div className={`${bgColor} p-6 rounded-lg shadow-sm flex justify-between items-center`}>
      <div>
        <div className="mb-1">
          <p className="text-sm" style={{ color: `${txColor}` }}>{title}</p>
        </div>
        <div className="flex ml-3">
          <p className="text-2xl font-bold mr-3" style={{ color: `${txColor}` }}>{value}</p>
          <div className="mt-auto mb-auto" style={{ color: `${txColor}` }}>
            {change.isPositive ? '+' : '-'}{Math.abs(change.value)}% 前期比
          </div>
        </div>
      </div>
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white">
        {icon}
      </div>
    </div>
  );
};

export default MetricCard;