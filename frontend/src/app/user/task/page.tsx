'use client';


import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CircleProgress from '../../components/CircleProgress';

// タスクの型定義
interface Task {
  id: string;
  name: string;
  deadline: string;
  priority: '高' | '中' | '低';
  status: '進行中' | 'レビュー' | '完了' | '未着手';
}

export default function TaskDashboard() {
  // タスクの状態管理
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'T0001', name: 'ロゴ修正', deadline: '2025/03/05', priority: '高', status: '進行中' },
    { id: 'T0005', name: '機能修正', deadline: '2025/03/12', priority: '中', status: 'レビュー' },
    { id: 'T0012', name: 'UI改善', deadline: '2025/03/06', priority: '高', status: '完了' },
    { id: 'T0016', name: '要件定義', deadline: '2025/03/17', priority: '低', status: '未着手' },
    { id: 'T0051', name: '動画制作', deadline: '2025/03/23', priority: '低', status: '未着手' },
  ]);

  // 検索機能の状態管理
  const [searchQuery, setSearchQuery] = useState('');

  // フィルター状態の管理
  const [activeFilter, setActiveFilter] = useState('すべて');

  // タスクのフィルタリング
  const filteredTasks = tasks.filter(task => {
    // 検索クエリでフィルタリング
    const matchesSearch = task.name.toLowerCase().includes(searchQuery.toLowerCase()) || task.id.toLowerCase().includes(searchQuery.toLowerCase());

    // タブでフィルタリング
    let matchesFilter = true;
    if (activeFilter === '今週中') {
      // 現在の日付から1週間以内のタスクをフィルタリング
      const taskDate = new Date(task.deadline);
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      matchesFilter = taskDate <= oneWeekLater;
    } else if (activeFilter === '完了済') {
      matchesFilter = task.status === '完了';
    }

    return matchesSearch && matchesFilter;
  });

  // 各ステータスのタスク数をカウント
  const inProgressCount = tasks.filter(task => task.status === '進行中').length;
  const reviewCount = tasks.filter(task => task.status === 'レビュー').length;
  const completionRate = Math.round((tasks.filter(task => task.status === '完了').length / tasks.length) * 100);
  const overdueCount = tasks.filter(task => {
    const today = new Date();
    const deadline = new Date(task.deadline);
    return deadline < today && task.status !== '完了';
  }).length;

  return (
    <>
      <h1 className="text-4xl font-bold mb-4">タスク状況詳細</h1>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8">

          {/* フィルタータブとサーチバー */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex">
              {['すべて', '今週中', '完了済'].map((filter) => (
                <button
                  key={filter}
                  className={`px-6 py-2 rounded-md border ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative flex-grow max-w-md" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
              <input
                type="text"
                placeholder="タスクを検索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image
                  src='/search-icon.png'
                  alt='検索アイコン'
                  width={25}
                  height={25}
                  priority
                />
              </div>
            </div>
          </div>

          {/* ステータスカード */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* 進行中 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">進行中</h3>
                  <p className="text-2xl font-bold">{inProgressCount}</p>
                </div>
                <div className="w-12 h-12">
                  <CircleProgress
                    percentage={Math.min(inProgressCount * 10, 100)}
                    color="#3B82F6"
                    size={48}
                  />
                </div>
              </div>
            </div>

            {/* 期限遅い */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">期限遅い</h3>
                  <p className="text-2xl font-bold">{reviewCount}</p>
                </div>
                <div className="w-12 h-12">
                  <CircleProgress
                    percentage={Math.min(reviewCount * 20, 100)}
                    color="#FBBF24"
                    size={48}
                  />
                </div>
              </div>
            </div>

            {/* 完了率 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">完了率</h3>
                  <p className="text-2xl font-bold">{completionRate}%</p>
                </div>
                <div className="w-12 h-12">
                  <CircleProgress
                    percentage={completionRate}
                    color="#10B981"
                    size={48}
                  />
                </div>
              </div>
            </div>

            {/* 期限超過 */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">期限超過</h3>
                  <p className="text-2xl font-bold">{overdueCount}</p>
                </div>
                <div className="w-12 h-12">
                  <CircleProgress
                    percentage={Math.min(overdueCount * 20, 100)}
                    color="#EF4444"
                    size={48}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* タスクテーブル */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タスク名
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    タスクID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    期限
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    優先度
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {task.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.deadline}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex text-ms font-medium ${
                          task.priority === '高' ? 'text-red-600' :
                          task.priority === '中' ? 'text-yellow-600' : 'text-green-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === '進行中' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'レビュー' ? 'bg-yellow-100 text-yellow-800' :
                          task.status === '完了' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src='/pen-icon.png'
                            alt='ペンアイコン'
                            width={27}
                            height={27}
                            priority
                          />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src='/info-icon.png'
                            alt='情報アイコン'
                            width={27}
                            height={27}
                            priority
                          />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                          <Image
                            src='/other-icon.png'
                            alt='その他アイコン'
                            width={27}
                            height={27}
                            priority
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
