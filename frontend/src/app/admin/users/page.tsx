'use client';

import { useState } from 'react';
import Link from 'next/link';
import UserAddForm from '../../components/UserAddForm';

// ユーザーデータの型定義
type User = {
  id: number;
  name: string;
  skills: string;
  performance: number;
  status: 'active' | 'inactive';
  tasksCount: number;
};

export default function UserManagement() {
  // ユーザーデータのサンプル
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: '佐藤一郎', skills: 'Java,AWS', performance: 80, status: 'active', tasksCount: 3 },
    { id: 2, name: '鈴木花子', skills: 'UI/UX,Figma', performance: 72, status: 'active', tasksCount: 2 },
    { id: 3, name: '山田太郎', skills: 'Python,React', performance: 40, status: 'inactive', tasksCount: 1 },
    { id: 4, name: '高橋望', skills: 'PHP, Laravel', performance: 63, status: 'inactive', tasksCount: 3 },
    { id: 5, name: '田中一', skills: 'Swift,Rust', performance: 93, status: 'active', tasksCount: 4 },
    { id: 6, name: '花村なつき', skills: 'FinalCutPro', performance: 20, status: 'inactive', tasksCount: 1 },
  ]);

  // アクティブユーザーと非アクティブユーザーの数を計算
  const activeUsers = users.filter(user => user.status === 'active').length;
  const inactiveUsers = users.filter(user => user.status === 'inactive').length;
  const totalUsers = users.length;

  // 現在のページ番号
  const [currentPage, setCurrentPage] = useState(1);

  // モーダル表示のための状態
  const [showForm, setShowForm] = useState(false);

  // 新規ユーザー追加処理
  const handleAddUser = (userData: { name: string; skills: string; status: 'active' | 'inactive' }) => {
    const newUser = {
      id: users.length + 1,
      name: userData.name,
      skills: userData.skills,
      performance: 0, // 初期値
      status: userData.status,
      tasksCount: 0, // 初期値
    };

    setUsers([...users, newUser]);
    setShowForm(false);
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ユーザー管理</h1>

      {/* フィルターボタン */}
      <div className="flex gap-4 mb-4">
        <div className="relative">
          <button className="bg-white px-4 py-2 rounded shadow flex items-center cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
            ステータス
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button className="bg-white px-4 py-2 rounded shadow flex items-center cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
            スキル
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button className="bg-white px-4 py-2 rounded shadow flex items-center cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
            稼働率
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="ml-auto">
          <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center cursor-pointer" onClick={() => setShowForm(true)}>
            <span className="mr-1">+</span> 新規ユーザー登録
          </button>
        </div>
      </div>

      {/* ユーザーテーブル */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">名前</th>
              <th className="py-3 px-4 text-left">スキル</th>
              <th className="py-3 px-4 text-left">パフォーマンス</th>
              <th className="py-3 px-4 text-left">ステータス</th>
              <th className="py-3 px-4 text-left">担当タスク数</th>
              <th className="py-3 px-4 text-left">アクション</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.skills}</td>
                <td className="py-3 px-4">{user.performance}%</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {user.status === 'active' ? '稼働中' : '未稼働'}
                  </span>
                </td>
                <td className="py-3 px-4">{user.tasksCount}</td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 bg-blue-100 p-2 rounded cursor-pointer" onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* サマリー情報と pagination */}
      <div className="mt-6 flex flex-wrap gap-4">
        <div className="bg-blue-100 p-4 rounded flex flex-col items-center w-48">
          <div className="text-sm text-blue-800">ユーザー総数</div>
          <div className="text-3xl font-bold text-blue-500">{totalUsers}</div>
        </div>

        <div className="bg-green-100 p-4 rounded flex flex-col items-center w-48">
          <div className="text-sm text-green-800">稼働人数</div>
          <div className="text-3xl font-bold text-green-500">{activeUsers}</div>
        </div>

        <div className="bg-gray-100 p-4 rounded flex flex-col items-center w-48">
          <div className="text-sm text-gray-800">未稼働人数</div>
          <div className="text-3xl font-bold text-gray-500">{inactiveUsers}</div>
        </div>

        <div className="ml-auto flex items-center">
          <div className="flex">
            {[1, 2, 3].map(page => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded mx-1 cursor-pointer ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <span className="mx-2">・・・</span>
            <button className="mx-1 w-8 h-8 flex items-center justify-center">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* フォームモーダル */}
      {showForm && (
        <UserAddForm
          onSubmit={handleAddUser}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}