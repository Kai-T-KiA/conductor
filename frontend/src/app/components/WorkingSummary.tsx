'use client';

import React from 'react';

type WorkingSummaryProps = {
  totalWorkDays?: number;
  totalWorkHours?: number;
  hourlyRate?: number;
};

const WorkingSummary: React.FC<WorkingSummaryProps> = ({
  totalWorkDays = 15,
  totalWorkHours = 72,
  hourlyRate = 2000
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">稼働サマリー</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">総稼働日数：</span>
          <span className="font-medium">15日</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">総稼働時間：</span>
          <span className="font-medium">72時間</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">時間単価：</span>
          <span className="font-medium">￥2,000-</span>
        </div>
      </div>
    </div>
  );
};

export default WorkingSummary;