'use client';

import React, { useState, useEffect } from 'react';

interface WorkingTimerProps {
  isWorking: boolean;
  startTime: number | null; // Unix timestamp (milliseconds)
  onTimerUpdate?: (seconds: number) => void;
}

const WorkingTimer: React.FC<WorkingTimerProps> = ({
  isWorking,
  startTime,
  onTimerUpdate
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // 経過時間を更新するタイマー
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (isWorking && startTime) {
      console.log('タイマー開始、startTime:', startTime);

      // 初期経過時間を設定
      const nowMs = Date.now();
      const initialElapsedMs = nowMs - startTime;
      const initialSeconds = Math.floor(initialElapsedMs / 1000);

      console.log('初期経過時間（秒）:', initialSeconds);
      setElapsedTime(initialSeconds);

      if (onTimerUpdate) {
        onTimerUpdate(initialSeconds);
      }

      // 1秒ごとに経過時間を更新
      timerId = setInterval(() => {
        setElapsedTime(prevTime => {
          const newTime = prevTime + 1;
          if (onTimerUpdate) {
            onTimerUpdate(newTime);
          }
          return newTime;
        });
      }, 1000);
    } else {
      setElapsedTime(0);
      if (onTimerUpdate) {
        onTimerUpdate(0);
      }
    }

    // クリーンアップ関数
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [isWorking, startTime, onTimerUpdate]);

  // 経過時間を時:分:秒の形式に変換
  const formatElapsedTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  if (!isWorking) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-md text-center">
      <p className="text-lg font-semibold mb-1">現在の稼働時間</p>
      <p className="text-3xl font-bold text-blue-600">{formatElapsedTime(elapsedTime)}</p>
      <p className="text-xs text-gray-500 mt-1">
        開始時刻: {startTime ? new Date(startTime).toLocaleTimeString() : ''}
      </p>
    </div>
  );
};

export default WorkingTimer;