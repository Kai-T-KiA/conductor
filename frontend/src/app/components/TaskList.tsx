'use client';

// import { Circle } from 'lucide-react';

// タスクデータの型定義
type Task = {
  id: number;
  name: string;
  date: string;
  status: '未完了' | '進行中' | '完了';
};

export default function TaskList() {
  // タスクデータ（実際の実装ではAPIから取得）
  const taskData: Task[] = [
    { id: 1, name: '週次進捗レポート作成', date: '2025/3/4', status: '未完了' },
    { id: 2, name: 'ランディングページのデザイン更新', date: '2025/3/5', status: '進行中' },
    { id: 3, name: 'UIコンポーネント実装', date: '2025/3/7', status: '完了' }
  ];

  // タスクのステータスに応じた色を取得
  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case '未完了': return 'text-red-500';
      case '進行中': return 'text-blue-500';
      case '完了': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-2">直近の期限</div>
      <ul>
        {taskData.map((task) => (
          <li key={task.id} className="flex items-center mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${
              getStatusColor(task.status).replace('text-', 'bg-')
            } flex items-center justify-center`}>
              <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${getStatusColor(task.status)}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="stroke-current"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <span className="ml-2 text-sm">{task.name}</span>
            <span className="ml-auto text-sm text-gray-500">{task.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}