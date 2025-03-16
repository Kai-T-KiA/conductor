'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import AddTaskModal from '../components/AddTaskModal';

// タスクの型定義
type Task = {
  id: number;
  name: string;
  assignee: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'in_progress' | 'review' | 'done' | 'not_started';
  hours: number;
};

export default function TaskManagement() {
  // タスクデータの状態
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: 'ウェブサイトリニューアル',
      assignee: '田中太郎',
      deadline: '2025-03-15',
      priority: 'high',
      status: 'in_progress',
      hours: 35,
    },
    {
      id: 2,
      name: 'モバイルアプリUI改善',
      assignee: '佐藤花子',
      deadline: '2025-03-12',
      priority: 'medium',
      status: 'review',
      hours: 20,
    },
    {
      id: 3,
      name: 'データベース最適化',
      assignee: '鈴木一郎',
      deadline: '2025-03-10',
      priority: 'low',
      status: 'done',
      hours: 15,
    },
    {
      id: 4,
      name: 'SEO分析レポート',
      assignee: '高橋雅人',
      deadline: '2025-03-20',
      priority: 'medium',
      status: 'not_started',
      hours: 10,
    },
    {
      id: 5,
      name: 'コンテンツ作成（ブログ記事）',
      assignee: '山田優子',
      deadline: '2025-03-18',
      priority: 'high',
      status: 'in_progress',
      hours: 25,
    }
  ]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  // 表示モードの状態（list または calendar）
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 新規タスク追加ハンドラー
  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  // 選択されたタスク
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  // ポップアップの位置
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // カレンダービューの参照
  const calendarRef = useRef<HTMLDivElement>(null);

  // ESCキーでポップアップを閉じる
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedTask(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // クリックイベントでポップアップを閉じる (タスク以外をクリックした場合)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        selectedTask !== null &&
        !target.closest('.task-item') &&
        !target.closest('.task-popup')
      ) {
        setSelectedTask(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedTask]);

  // タブに基づいてタスクをフィルタリング
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'in_progress') return task.status === 'in_progress' || task.status === 'review';
    if (activeTab === 'done') return task.status === 'done';
    if (activeTab === 'overdue') {
      const today = new Date();
      const deadline = new Date(task.deadline);
      return deadline < today && task.status !== 'done';
    }
    return true;
  }).filter(task => {
    if (!searchQuery) return true;
    return task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 進行中のタスク数
  const inProgressCount = tasks.filter(task =>
    task.status === 'in_progress' || task.status === 'review'
  ).length;

  // 完了したタスク数
  const doneCount = tasks.filter(task => task.status === 'done').length;

  // 合計時間
  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);

  // ステータスに応じたスタイルとラベルを取得
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { bgColor: 'bg-blue-600', label: '進行中' };
      case 'review':
        return { bgColor: 'bg-orange-500', label: 'レビュー中' };
      case 'done':
        return { bgColor: 'bg-green-600', label: '完了' };
      case 'not_started':
        return { bgColor: 'bg-gray-400', label: '未着手' };
      default:
        return { bgColor: 'bg-gray-400', label: '不明' };
    }
  };

  // 優先度に応じたスタイルとラベルを取得
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'high':
        return { textColor: 'text-red-600', label: '高' };
      case 'medium':
        return { textColor: 'text-yellow-600', label: '中' };
      case 'low':
        return { textColor: 'text-green-600', label: '低' };
      default:
        return { textColor: 'text-gray-600', label: '不明' };
    }
  };

  // タスクがクリックされた時の処理
  const handleTaskClick = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // イベントの伝播を防止

    // タスクが選択されたら、ポップアップの位置を計算
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    // カレンダービューの位置を取得
    const calendarRect = calendarRef.current?.getBoundingClientRect() || { top: 0, left: 0 };

    // ポップアップの位置を設定
    setPopupPosition({
      top: rect.top - calendarRect.top + rect.height,
      left: rect.left - calendarRect.left,
    });

    // 既に選択されているタスクをクリックした場合は選択を解除
    if (selectedTask === taskId) {
      setSelectedTask(null);
    } else {
      setSelectedTask(taskId);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">タスク管理</h1>
        <button
          className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md flex items-center cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="mr-1">+</span> 新規タスク追加
        </button>
      </div>

      {/* タブナビゲーション */}
      <div className="flex border-b mb-4 pb-2">
        <button
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'all' ? 'bg-blue-100 text-blue-600 rounded-t-md' : 'text-gray-600'}`}
          onClick={() => setActiveTab('all')}
        >
          すべて
        </button>
        <button
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'in_progress' ? 'bg-blue-100 text-blue-600 rounded-t-md' : 'text-gray-600'}`}
          onClick={() => setActiveTab('in_progress')}
        >
          進行中
        </button>
        <button
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'done' ? 'bg-blue-100 text-blue-600 rounded-t-md' : 'text-gray-600'}`}
          onClick={() => setActiveTab('done')}
        >
          完了
        </button>
        <button
          className={`px-4 py-2 font-medium cursor-pointer ${activeTab === 'overdue' ? 'bg-blue-100 text-blue-600 rounded-t-md' : 'text-gray-600'}`}
          onClick={() => setActiveTab('overdue')}
        >
          期限超過
        </button>

        {/* 検索ボックス */}
        <div className="ml-auto flex items-center">
          <div className="relative cursor-pointer">
            <input
              type="text"
              placeholder="タスクを検索..."
              className="border rounded-md py-1 px-3 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-1.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50" className='m-auto'>
                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
              </svg>
            </span>
          </div>

          {/* 表示切り替え */}
          <div className="flex ml-2">
            <div className='mr-3'>
              <button
                className={`border p-2 rounded-l-md cursor-pointer ${viewMode === 'list' ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}
                onClick={() => setViewMode('list')}
              >
                <span className={viewMode === 'list' ? "text-blue-600" : "text-gray-600"}>
                  <Image
                    src="https://img.icons8.com/ios/50/day-view.png"
                    alt="リスト表示"
                    width={20}
                    height={20}
                  />
                </span>
              </button>
              <button
                className={`border-r border-t border-b p-2 rounded-r-md cursor-pointer ${viewMode === 'calendar' ? 'bg-blue-100 border-blue-300' : 'bg-white'}`}
                onClick={() => setViewMode('calendar')}
              >
                <span className={viewMode === 'calendar' ? "text-blue-600" : "text-gray-600"}>
                  <Image
                    src="https://img.icons8.com/material-outlined/24/calendar--v1.png"
                    alt="カレンダー表示"
                    width={20}
                    height={20}
                  />
                </span>
              </button>
            </div>
            <button className="bg-white border p-2 rounded-md mr-3 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
              <span>
                <Image
                  src="https://img.icons8.com/ios/50/filter--v1.png"
                  alt="フィルター"
                  width={20}
                  height={20}
                />
              </span>
            </button>
            <button className="bg-white border p-2 rounded-md cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
              <span>
                <Image
                  src="https://img.icons8.com/ios-filled/50/bulleted-list.png"
                  alt="項目リスト"
                  width={20}
                  height={20}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-purple-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span style={{ color: '#210EBC' }}>総タスク数</span>
            <span>
              <Image
                src="/task-icon.png"
                alt="tasks"
                width={30}
                height={30}
              />
            </span>
          </div>
          <div className="text-3xl font-bold">{tasks.length}</div>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span style={{ color: '#1B3DB7' }}>進行中</span>
            <span>
              <Image
                src="/on-progress-icon.png"
                alt="tasks"
                width={30}
                height={30}
              />
            </span>
          </div>
          <div className="text-3xl font-bold">{inProgressCount}</div>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span style={{ color: '#09740B' }}>完了</span>
            <span>
              <Image
                src="/complete-icon.png"
                alt="tasks"
                width={30}
                height={30}
              />
            </span>
          </div>
          <div className="text-3xl font-bold">{doneCount}</div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span style={{ color: '#8D710C' }}>総見積時間</span>
            <span>
              <Image
                src="/time-icon.png"
                alt="tasks"
                width={30}
                height={30}
              />
            </span>
          </div>
          <div className="text-3xl font-bold">{totalHours}h</div>
        </div>
      </div>

      {/* リスト表示 */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left">タスク名</th>
                <th className="py-3 px-4 text-left">担当者</th>
                <th className="py-3 px-4 text-left">期限</th>
                <th className="py-3 px-4 text-center">優先度</th>
                <th className="py-3 px-4 text-center">ステータス</th>
                <th className="py-3 px-4 text-center">見積時間</th>
                <th className="py-3 px-4 text-center">アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const statusStyle = getStatusStyle(task.status);
                const priorityStyle = getPriorityStyle(task.priority);

                return (
                  <tr key={task.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{task.name}</td>
                    <td className="py-3 px-4">{task.assignee}</td>
                    <td className="py-3 px-4">{task.deadline}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${priorityStyle.textColor}`}>
                        {priorityStyle.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-white text-xs ${statusStyle.bgColor}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">{task.hours}h</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src="https://img.icons8.com/ios-filled/50/edit--v1.png"
                            alt="edit--v1"
                            width={30}
                            height={30}
                          />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src="https://img.icons8.com/ios/50/info--v1.png"
                            alt="info--v1"
                            width={30}
                            height={30}
                          />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src="https://img.icons8.com/ios/50/connection-status-off.png"
                            alt="connection-status-off"
                            width={30}
                            height={30}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* カレンダー表示 */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-lg shadow p-4 relative" ref={calendarRef}>
          <div className="flex justify-between items-center mb-6">
            <button className="text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
              &lt; 前月
            </button>
            <h2 className="text-xl font-bold">2025年3月</h2>
            <button className="text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
              次月 &gt;
            </button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '月', '火', '水', '木', '金', '土'].map(day => (
              <div key={day} className="text-center py-2 font-bold">
                {day}
              </div>
            ))}
          </div>

          {/* カレンダーグリッド */}
          <div className="grid grid-cols-7 gap-1">
            {/* 前月の日付（灰色表示） */}
            {[...Array(5)].map((_, i) => (
              <div key={`prev-${i}`} className="h-28 p-1 bg-gray-100 text-gray-400">
                <div className="text-right">{25 + i}</div>
              </div>
            ))}

            {/* 当月の日付 */}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              // その日のタスクを取得
              const dayTasks = filteredTasks.filter(task => {
                const taskDate = new Date(task.deadline);
                return taskDate.getDate() === day && taskDate.getMonth() === 2; // 3月
              });

              return (
                <div key={`day-${day}`} className="h-28 p-1 border hover:bg-blue-50">
                  <div className="text-right mb-1">{day}</div>
                  <div className="overflow-y-auto max-h-20">
                    {dayTasks.map(task => {
                      const statusStyle = getStatusStyle(task.status);
                      return (
                        <div
                          key={task.id}
                          className={`text-xs p-1 mb-1 rounded ${statusStyle.bgColor} text-white truncate cursor-pointer task-item`}
                          onClick={(e) => handleTaskClick(task.id, e)}
                        >
                          {task.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* タスク詳細ポップアップ（選択時に表示） */}
          {selectedTask !== null && (
            <div
              className="absolute bg-white shadow-lg rounded-md p-3 z-10 border border-gray-200 task-popup"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
                minWidth: '250px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const task = tasks.find(t => t.id === selectedTask);
                if (!task) return null;

                const statusStyle = getStatusStyle(task.status);
                const priorityStyle = getPriorityStyle(task.priority);

                return (
                  <>
                    <h3 className="font-bold mb-2 pb-1 border-b">{task.name}</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">担当者:</span>
                        <span className="font-medium">{task.assignee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">期限:</span>
                        <span className="font-medium">{task.deadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">優先度:</span>
                        <span className={`font-medium ${priorityStyle.textColor}`}>
                          {priorityStyle.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ステータス:</span>
                        <span className={`px-2 py-0 rounded-full text-white text-xs ${statusStyle.bgColor}`}>
                          {statusStyle.label}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">見積時間:</span>
                        <span className="font-medium">{task.hours}h</span>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-2">
                        <button className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src="https://img.icons8.com/ios-filled/50/edit--v1.png"
                            alt="edit--v1"
                            width={30}
                            height={30}
                          />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src="https://img.icons8.com/ios/50/info--v1.png"
                            alt="info--v1"
                            width={30}
                            height={30}
                          />
                        </button>
                        <button className="p-1 text-gray-600 hover:text-blue-600 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src="https://img.icons8.com/ios/50/connection-status-off.png"
                            alt="connection-status-off"
                            width={30}
                            height={30}
                          />
                        </button>
                      </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* 新規タスク追加モーダル */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}