'use client';

import React from 'react';

type TimeReportingProps = {
  currentReward?: number;
  projectedReward?: number;
};

const TimeReporting: React.FC<TimeReportingProps> = ({
  currentReward = 144000,
  projectedReward = 200000
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">時間報酬</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">現時点の時間報酬：</span>
          <span className="font-medium">￥144,000-</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">月末予測(ベース)：</span>
          <span className="font-medium">￥200,000-</span>
        </div>
      </div>
    </div>
  );
};

export default TimeReporting;