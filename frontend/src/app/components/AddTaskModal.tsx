'use client';

import { useState, CSSProperties } from 'react';

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

// 新規タスク（ID以外）の型定義
type NewTask = Omit<Task, 'id'> & {
  hours: string | number;
};

// AddTaskModalのProps定義
interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
}

/**
 * 新規タスク追加用モーダルコンポーネント
 */
const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  // 初期値の設定
  const [taskForm, setTaskForm] = useState<NewTask>({
    name: '',
    assignee: '',
    deadline: '',
    priority: 'medium',
    status: 'not_started',
    hours: 0,
  });

  // フォームの値が変更された時の処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm({
      ...taskForm,
      [name]: value,
    });
  };

  // フォーム送信時の処理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 簡単なバリデーション
    if (!taskForm.name || !taskForm.assignee || !taskForm.deadline || !taskForm.hours) {
      alert('必須項目を入力してください');
      return;
    }

    // 親コンポーネントに新しいタスクを渡す
    onAddTask({
      ...taskForm,
      id: Date.now(), // 仮のID
      hours: Number(taskForm.hours),
    } as Task);

    // フォームをリセット
    setTaskForm({
      name: '',
      assignee: '',
      deadline: '',
      priority: 'medium',
      status: 'not_started',
      hours: 0,
    });

    // モーダルを閉じる
    onClose();
  };

  // モーダルが閉じている場合は何も表示しない
  if (!isOpen) return null;

  // 型付きでスタイルを定義
  const overlayStyle: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  };

  return (
    // <div className="fixed inset-0 flex items-center justify-center z-50">
    <div style={overlayStyle} onClick={(e) => {
      // モーダル外のクリックで閉じる
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">新規タスク追加</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              タスク名 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={taskForm.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="assignee">
              担当者 <span className="text-red-500">*</span>
            </label>
            <input
              id="assignee"
              name="assignee"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={taskForm.assignee}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deadline">
              期限 <span className="text-red-500">*</span>
            </label>
            <input
              id="deadline"
              name="deadline"
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={taskForm.deadline}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
              優先度
            </label>
            <select
              id="priority"
              name="priority"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={taskForm.priority}
              onChange={handleChange}
            >
              <option value="low">低</option>
              <option value="medium">中</option>
              <option value="high">高</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              ステータス
            </label>
            <select
              id="status"
              name="status"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={taskForm.status}
              onChange={handleChange}
            >
              <option value="not_started">未着手</option>
              <option value="in_progress">進行中</option>
              <option value="review">レビュー</option>
              <option value="done">完了</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hours">
              見積時間（時間） <span className="text-red-500">*</span>
            </label>
            <input
              id="hours"
              name="hours"
              type="number"
              min="1"
              step="0.5"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={taskForm.hours}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              className="mr-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;