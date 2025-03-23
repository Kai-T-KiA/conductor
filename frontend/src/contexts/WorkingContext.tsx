'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
// import { secureStorage } from '../utils/secureStorage';
import { createApiClient } from '../utils/apiClient';

interface WorkingState {
  isWorking: boolean;
  startTime: number | null;
  workHourId: number | null;
}

interface WorkingContextType {
  workingState: WorkingState;
  elapsedTime: number;
  startWorking: () => Promise<void>;
  stopWorking: () => Promise<void>;
}

const WorkingContext = createContext<WorkingContextType | undefined>(undefined);

export const WorkingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const auth = useAuth();
  const apiClient = createApiClient();

  const [workingState, setWorkingState] = useState<WorkingState>({
    isWorking: false,
    startTime: null,
    workHourId: null
  });

  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // アプリ起動時にsessionStorageから状態を復元
  useEffect(() => {
    if (auth.isAuthenticated && auth.userData?.id && auth.secureStorage) {
      try {
        const savedState = auth.secureStorage.getItem('workingState');

        if (savedState &&
            typeof savedState === 'object' &&
            'isWorking' in savedState &&
            'startTime' in savedState &&
            'workHourId' in savedState) {

          // 稼働中の状態が保存されている場合
          if (savedState.isWorking && savedState.startTime) {
            setWorkingState(savedState);

            // 経過時間を計算
            const nowMs = Date.now();
            const elapsedMs = nowMs - savedState.startTime;
            setElapsedTime(Math.floor(elapsedMs / 1000));
          }
        }
      } catch (error) {
        console.error('作業状態の復元エラー:', error);
      }
    }
  }, [auth.isAuthenticated, auth.userData, auth.secureStorage]);

  // 経過時間の更新
  useEffect(() => {
    let timerId: NodeJS.Timeout | null = null;

    if (workingState.isWorking && workingState.startTime) {
      // 1秒ごとに経過時間を更新
      timerId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [workingState.isWorking, workingState.startTime]);

  // 稼働状態が変更されたらsecureStorageに保存
  useEffect(() => {
    if (auth.isAuthenticated && auth.userData?.id && auth.secureStorage) {
      auth.secureStorage.setItem('workingState', workingState);
    }
  }, [workingState, auth.isAuthenticated, auth.userData, auth.secureStorage]);


  // 稼働開始
  const startWorking = async () => {
    try {
      if (!auth.isAuthenticated) {
        throw new Error('認証が必要です');
      }

      const now = new Date();
      const startTime = now.toTimeString().split(' ')[0].substring(0, 5);

      // APIリクエスト
      const response = await apiClient('/api/v1/work_hours', {
        method: 'POST',
        body: JSON.stringify({
          work_hour: {
            work_date: now.toISOString().split('T')[0],
            start_time: startTime,
            activity_description: '稼働開始'
          }
        })
      });

      // 現在のタイムスタンプ
      const currentTimeMs = Date.now();

      // 状態を更新
      const newWorkingState = {
        isWorking: true,
        startTime: currentTimeMs,
        workHourId: response.id
      };

      setWorkingState(newWorkingState);
      setElapsedTime(0);

      // secureStorageに保存
      if (auth.secureStorage) {
        auth.secureStorage.setItem('workingState', newWorkingState);
      }
    } catch (error) {
      console.error('稼働開始エラー:', error);
      throw error;
    }
  };

  // 稼働終了
  const stopWorking = async () => {
    try {
      if (!auth.isAuthenticated) {
        throw new Error('認証が必要です');
      }

      if (!workingState.workHourId) {
        throw new Error('稼働IDが見つかりません');
      }

      const now = new Date();
      const endTime = now.toTimeString().split(' ')[0].substring(0, 5);

      // 経過時間（時間単位）
      let hoursWorked = 0;
      if (workingState.startTime) {
        const elapsedMs = Date.now() - workingState.startTime;
        hoursWorked = parseFloat((elapsedMs / (1000 * 60 * 60)).toFixed(2));
      }

      // APIリクエスト
      await apiClient(`/api/v1/work_hours/${workingState.workHourId}`, {
        method: 'PUT',
        body: JSON.stringify({
          work_hour: {
            end_time: endTime,
            hours_worked: hoursWorked,
            activity_description: '稼働完了'
          }
        })
      });

      // 状態をリセット
      const resetState = {
        isWorking: false,
        startTime: null,
        workHourId: null
      };

      setWorkingState(resetState);
      setElapsedTime(0);

      // secureStorageからも削除
      if (auth.secureStorage) {
        auth.secureStorage.setItem('workingState', resetState);
      }
    } catch (error) {
      console.error('稼働終了エラー:', error);
      throw error;
    }
  };


  const value = {
    workingState,
    elapsedTime,
    startWorking,
    stopWorking
  };

  return <WorkingContext.Provider value={value}>{children}</WorkingContext.Provider>;
};

export const useWorking = (): WorkingContextType => {
  const context = useContext(WorkingContext);
  if (context === undefined) {
    throw new Error('useWorking must be used within a WorkingProvider');
  }
  return context;
};