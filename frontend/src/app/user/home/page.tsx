'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useWorking } from '../../../contexts/WorkingContext';
import { createApiClient } from '../../../utils/apiClient';


import Link from 'next/link';
import HomeCalendar from '../../components/HomeCalendar';
import TaskList from '../../components/TaskList';
import WorkingTimer from '../../components/WorkingTimer';

import { API_BASE_URL, fetchAPI } from '../../../utils/api';

// ダッシュボードデータの型定義
interface DashboardData {
  user: {
    id: number;
    name: string;
    email: string;
    hourly_rate: number;
  };
  working_hours: {
    daily_hours: Record<string, number>;
    current_month_total: number;
    last_month_total: number;
    month_change_percentage: number;
  };
  tasks: {
    upcoming: {
      id: number;
      title: string;
      due_date: string;
      status: string;
      priority: string;
    }[];
    status_counts: Record<string, number>;
    total_count: number;
    completed_count: number;
  };
  weekly_tasks: {
    id: number;
    title: string;
    due_date: string;
    status: string;
    priority: string;
  }[];
  calendar_data: Record<string, number>;
  last_updated: string;
}

// taskStatusNumberの型を明示的に定義
type TaskStatusCounts = {
  completed: number;
  in_progress: number;
  uncompleted: number;
}

// 稼働情報の型定義
interface WorkingState {
  isWorking: boolean;
  startTime: number | null; // Unix timestamp (milliseconds)
  workHourId: number | null;
}

export default function UserHomePage() {
  const auth = useAuth();
  const { token } = useAuth(); // AuthContextからトークンを取得
  const { workingState, elapsedTime, startWorking, stopWorking } = useWorking();
  const apiClient = createApiClient();

  // ダッシュボードデータの状態
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const [dashboardData, setDashboardData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  // 稼働状態を管理するステート
  // const [workingState, setWorkingState] = useState<WorkingState>({
  //   isWorking: false,
  //   startTime: null,
  //   workHourId: null
  // });

  // 現在の経過時間（秒）
  // const [elapsedTime, setElapsedTime] = useState<number>(0);

  // localStorage から稼働状態を読み込む useEffect
  // useEffect(() => {
  //   try {
  //     const savedStateString = localStorage.getItem('workingState');
  //     if (savedStateString) {
  //       const savedState = JSON.parse(savedStateString);
  //       console.log('ストレージから読み込まれた稼働状態:', savedState);

  //       // 正しく構造化されたオブジェクトであることを確認
  //       if (savedState &&
  //           typeof savedState === 'object' &&
  //           'isWorking' in savedState &&
  //           'startTime' in savedState &&
  //           'workHourId' in savedState) {

  //         // 稼働中の状態が保存されている場合
  //         if (savedState.isWorking && savedState.startTime) {
  //           // 現在の経過時間を計算（ミリ秒→秒変換）
  //           const nowMs = Date.now();
  //           const elapsedMs = nowMs - savedState.startTime;
  //           const elapsedSeconds = Math.floor(elapsedMs / 1000);

  //           console.log('計算された経過時間（秒）:', elapsedSeconds);

  //           // 状態を復元
  //           setWorkingState(savedState);
  //           setElapsedTime(elapsedSeconds);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error('localStorage からの状態復元エラー:', error);
  //     // エラーが発生した場合は初期状態に戻す
  //     localStorage.removeItem('workingState');
  //   }
  // }, []);

  // // 経過時間を更新するタイマー
  // useEffect(() => {
  //   let timerId: NodeJS.Timeout | null = null;

  //   if (workingState.isWorking && workingState.startTime) {
  //     // 初期経過時間を設定
  //     const nowMs = Date.now();
  //     const initialElapsedMs = nowMs - workingState.startTime;
  //     setElapsedTime(Math.floor(initialElapsedMs / 1000));

  //     // 1秒ごとに経過時間を更新
  //     timerId = setInterval(() => {
  //       setElapsedTime(prev => prev + 1);
  //     }, 1000);
  //   }

  //   // クリーンアップ関数
  //   return () => {
  //     if (timerId) {
  //       clearInterval(timerId);
  //     }
  //   };
  // }, [workingState.isWorking, workingState.startTime]);

  // // 稼働状態が変更されたらローカルストレージに保存
  // useEffect(() => {
  //   localStorage.setItem('workingState', JSON.stringify(workingState));
  // }, [workingState]);

  // ダッシュボードデータを取得する関数
  const fetchDashboardData = async () => {
    if (!token) {
      console.error('No token available');
      setError('認証情報が見つかりません。再度ログインしてください。');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // api.tsxのfetchAPI関数を使用
      const data = await fetchAPI('/api/v1/dashboard', {}, token);
      setDashboardData(data);

      // // 本日の稼働記録をチェックして稼働中かどうかを判定
      // const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
      // const todayHours = data.working_hours.daily_hours[today] || 0;

      // // すでに稼働中状態でない場合のみ実行
      // if (!workingState.isWorking) {
      //   // 本日の稼働時間記録があり、まだ稼働中（end_timeがない）の記録を取得
      //   if (todayHours > 0) {
      //     // 本日の稼働記録を取得
      //     const todayWorkHours = await fetchAPI(`/api/v1/work_hours?start_date=${today}&end_date=${today}`);

      //     // 稼働中のレコードがあるか確認（end_timeが空のレコードを探す）
      //     const activeWorkHour = todayWorkHours.find((wh: any) =>
      //       !wh.end_time || wh.end_time === '' || wh.end_time === null
      //     );

      //     if (activeWorkHour) {
      //       // 稼働開始時刻をUNIXタイムスタンプ（ミリ秒）に変換
      //       const startDate = new Date(today);
      //       const [hours, minutes] = activeWorkHour.start_time.split(':').map(Number);
      //       startDate.setHours(hours, minutes, 0, 0);

      //       setWorkingState({
      //         isWorking: true,
      //         startTime: startDate.getTime(),
      //         workHourId: activeWorkHour.id
      //       });
      //     }
      //   }
      // }

      setError(null);
    } catch (err) {
      console.error('API error details:', err);
      // エラーの詳細情報をより具体的に表示
      setError(err instanceof Error ? `${err.message} (${err.name})` : JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  // コンポーネントマウント時にデータを取得
  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchDashboardData();
      // 10分ごとにダッシュボードデータを更新
      const intervalId = setInterval(fetchDashboardData, 600000);
      return () => clearInterval(intervalId);
    }
  }, [auth.isAuthenticated]);

  // 稼働開始/終了ボタンのクリックイベントハンドラ
  // const handleWorkToggle = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       throw new Error('認証情報が見つかりません');
  //     }

  //     if (workingState.isWorking && workingState.workHourId) {
  //       // 稼働終了処理
  //       const now = new Date();
  //       const endTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MMフォーマット

  //       // 経過時間（時間単位）- 小数点以下2桁まで
  //       let hoursWorked = 0;
  //       if (workingState.startTime) {
  //         const elapsedMs = Date.now() - workingState.startTime;
  //         hoursWorked = parseFloat((elapsedMs / (1000 * 60 * 60)).toFixed(2));
  //       }

  //       const response = await fetch(`${API_BASE_URL}/api/v1/work_hours/${workingState.workHourId}`, {
  //         method: 'PUT',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           work_hour: {
  //             end_time: endTime,
  //             hours_worked: hoursWorked, // 実際の稼働時間を設定
  //             activity_description: '稼働完了'
  //           }
  //         })
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(`稼働終了に失敗しました: ${JSON.stringify(errorData)}`);
  //       }

  //       window.alert('稼働を終了しました');
  //       setWorkingState({
  //         isWorking: false,
  //         startTime: null,
  //         workHourId: null
  //       });
  //       setElapsedTime(0);

  //     } else {
  //       const now = new Date();
  //       const startTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MMフォーマット

  //       // NOT NULL制約があるため、仮の終了時間を設定
  //       const tempEndTime = new Date(now.getTime() + 60000).toTimeString().split(' ')[0].substring(0, 5);

  //       const response = await fetch(`${API_BASE_URL}/api/v1/work_hours`, {
  //         method: 'POST',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({
  //           work_hour: {
  //             work_date: now.toISOString().split('T')[0],
  //             start_time: startTime,
  //             end_time: tempEndTime, // 仮の終了時間（NULL制約対応）
  //             hours_worked: 0.01, // 最小値を設定
  //             activity_description: '稼働開始'
  //             // task_idは指定しない
  //           }
  //         })
  //       });

  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         throw new Error(`稼働開始に失敗しました: ${JSON.stringify(errorData)}`);
  //       }

  //       // 作成された稼働レコードを取得
  //       const createdWorkHour = await response.json();

  //       // 現在の正確なタイムスタンプを取得（ミリ秒単位）
  //       const currentTimeMs = Date.now();

  //       // 明示的に現在の時刻を設定
  //       const newWorkingState = {
  //         isWorking: true,
  //         startTime: currentTimeMs, // 必ず値を設定
  //         workHourId: createdWorkHour.id
  //       };

  //       console.log('新しい稼働状態:', newWorkingState);

  //       // 状態を更新
  //       setWorkingState(newWorkingState);

  //       // localStorage への保存も明示的に行う（念のため）
  //       localStorage.setItem('workingState', JSON.stringify(newWorkingState));

  //       window.alert('稼働を開始しました');
  //       setElapsedTime(0);
  //     }

  //     // ダッシュボードデータを再取得
  //     fetchDashboardData();
  //   } catch (error) {
  //     console.error('稼働処理エラー:', error);
  //     window.alert(error instanceof Error ? error.message : '不明なエラー');
  //   }
  // };

  // 稼働開始/終了ボタンのクリックイベントハンドラ
  const handleWorkToggle = async () => {
    try {
      if (workingState.isWorking) {
        await stopWorking();
        window.alert('稼働を終了しました');
      } else {
        await startWorking();
        window.alert('稼働を開始しました');
      }

      // ダッシュボードデータを再取得
      fetchDashboardData();
    } catch (error) {
      console.error('稼働処理エラー:', error);
      window.alert(error instanceof Error ? error.message : '不明なエラー');
    }
  };



  // console.log('dashboardData')
  // console.log(dashboardData);

  // 読み込み中の表示
  if (isLoading) {
    return <div className='flex justify-center items-center h-screen'>読み込み中...</div>;
  }

  // エラー表示
  if (error) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <p className='text-red-500 mb-4'>エラー: {error}</p>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={fetchDashboardData}
        >
          再読み込み
        </button>
      </div>
    );
  }

  // データがない場合
  if (!dashboardData) {
    return <div className='flex justify-center items-center h-screen'>データがありません</div>;
  }

  // ログインユーザーのタスク情報を取得
  const userTasks = dashboardData['tasks'];
  // console.log(userTasks);


  // ログインユーザーのタスクのステータス取得
  const userTasksStatus = userTasks['status_counts'];
  // console.log(userTasksStatus);

  // ログインユーザーの期限間近のタスク情報を取得
  const userTasksUpcoming = userTasks['upcoming']
  // console.log(userTasksUpcoming);

  // taskStatusNumberオブジェクトを作成
  const taskStatusNumber: TaskStatusCounts = {
    completed: userTasksStatus?.completed || 0,
    in_progress: userTasksStatus?.in_progress || 0,
    uncompleted: userTasksStatus?.not_started || 0  // not_startedをuncompletedとして扱う
  };


  return (
    <>
      <div className='grid grid-cols-2 gap-8 text-black h-full'  style={{ backgroundColor: '#F5EFFA' }}>
        {/* 稼働状況 */}
        <div className='h-full'>
          <h2 className='text-4xl font-semibold mb-4'>稼働状況</h2>
          <div className='bg-white rounded-lg p-6 shadow-sm'>
          <HomeCalendar calendarData={dashboardData?.calendar_data} />
          </div>
        </div>

        {/* タスク状況 */}
        <div>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-4xl font-semibold'>タスク状況</h2>
          </div>

          <div className='bg-white rounded-lg p-6 shadow-sm'>
            <div className='flex mb-4 h-fit'>
              <h3 className=''>タスク状況</h3>
              <Link href='/user/tasks/all' className='text-blue-500 text-sm flex items-center ml-auto'>
                詳細 <span className='ml-1'>+</span>
              </Link>
            </div>

            {/* タスク統計 */}
            <div className='grid grid-cols-4 gap-4 mb-6'>
              <div className='text-center'>
                <div className='text-xl font-bold text-yellow-500'>{taskStatusNumber['uncompleted']}</div>
                <div className='text-xs'>未完了</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-blue-500'>{taskStatusNumber['in_progress']}</div>
                <div className='text-xs'>進行中</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold text-green-500'>{taskStatusNumber['completed']}</div>
                <div className='text-xs'>完了</div>
              </div>
              <div className='text-center'>
                <div className='text-xl font-bold'>4</div>
                <div className='text-xs'>合計</div>
              </div>
            </div>

            <TaskList tasks={dashboardData.weekly_tasks} />
          </div>

          {/* 稼働開始/終了ボタン */}
          <div className='flex flex-col items-center mt-8'>
            <WorkingTimer
              isWorking={workingState.isWorking}
              startTime={workingState.startTime}
            />

            <button
              className={`w-80 h-80 ${
                workingState.isWorking
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white text-4xl font-bold rounded-full transition duration-200 cursor-pointer`}
              onClick={handleWorkToggle}
            >
              {workingState.isWorking ? '稼働終了' : '稼働開始'}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}
