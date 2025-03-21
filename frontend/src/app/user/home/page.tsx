'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HomeCalendar from '../../components/HomeCalendar';
import TaskList from '../../components/TaskList';

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
};


export default function UserHomePage() {
  // ダッシュボードデータの状態
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 稼働状態を管理するステート
  const [isWorking, setIsWorking] = useState(false);
  const [currentWorkHour, setCurrentWorkHour] = useState<number | null>(null);

  // ダッシュボードデータを取得する関数
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // api.tsxのfetchAPI関数を使用
      const data = await fetchAPI('/api/v1/dashboard');

      setDashboardData(data);

      // 本日の稼働記録をチェックして稼働中かどうかを判定
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD形式
      const todayHours = data.working_hours.daily_hours[today] || 0;

      // 本日の稼働時間記録があり、まだ稼働中（end_timeがない）の記録を取得
      if (todayHours > 0) {
        // 本日の稼働記録を取得
        const todayWorkHours = await fetchAPI('/api/v1/work_hours?start_date=' + today + '&end_date=' + today);

        // 稼働中のレコードがあるか確認（end_timeが空のレコードを探す）
        const activeWorkHour = todayWorkHours.find((wh: any) =>
          !wh.end_time || wh.end_time === '' || wh.end_time === null
        );

        if (activeWorkHour) {
          setIsWorking(true);
          setCurrentWorkHour(activeWorkHour.id);
        }
      }

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
    fetchDashboardData();
  }, []);

  // 稼働開始/終了ボタンのクリックイベントハンドラ
  const handleWorkToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証情報が見つかりません');
      }

      if (isWorking && currentWorkHour) {
        // 稼働終了処理
        const now = new Date();
        const endTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MMフォーマット

        const response = await fetch(`${API_BASE_URL}/api/v1/work_hours/${currentWorkHour}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            work_hour: {
              end_time: endTime,
              // 稼働時間は自動計算されるのでここでは設定しない
              activity_description: '稼働完了'
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`稼働終了に失敗しました: ${JSON.stringify(errorData)}`);
        }

        window.alert('稼働を終了しました');
        setIsWorking(false);
        setCurrentWorkHour(null);

      } else {
        const now = new Date();
        const startTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MMフォーマット

        // end_timeに仮の値を設定（バックエンドでのバリデーション対応）
        const tempEndTime = new Date(now.getTime() + 60000).toTimeString().split(' ')[0].substring(0, 5);

        const response = await fetch(`${API_BASE_URL}/api/v1/work_hours`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            work_hour: {
              work_date: now.toISOString().split('T')[0],
              start_time: startTime,
              end_time: tempEndTime, // 仮の終了時間
              hours_worked: 0.01, // 最小値を設定
              activity_description: '稼働開始'
              // task_idは指定しない
            }
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`稼働開始に失敗しました: ${JSON.stringify(errorData)}`);
        }

        // 作成された稼働レコードを取得
        const createdWorkHour = await response.json();

        window.alert('稼働を開始しました');
        setIsWorking(true);
        setCurrentWorkHour(createdWorkHour.id);
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
          <div className='flex justify-center mt-25'>
            <button
              className={`w-80 h-80 ${
                isWorking
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-purple-500 hover:bg-purple-600'
              } text-white text-4xl font-bold rounded-full transition duration-200 cursor-pointer`}
              onClick={handleWorkToggle}
            >
              {isWorking ? '稼働終了' : '稼働開始'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
