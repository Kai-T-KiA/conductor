'use client';

// タスクデータの型定義
type Task = {
  id: number;
  title: string;
  due_date: string;
  status: string;
  priority: string;
};

type TaskListProps = {
  tasks?: Task[];
};

export default function TaskList({ tasks = [] }: TaskListProps) {
  // タスクのステータスに応じた色を取得
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'not_started': return 'text-red-500';
      case 'in_progress': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'review': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP');
  };

  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-2">直近の期限</div>
      <ul>
        {tasks.map((task) => (
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
            <span className="ml-2 text-sm">{task.title}</span>
            <span className="ml-auto text-sm text-gray-500">{formatDate(task.due_date)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}