'use client';

import { useState } from 'react';

// 報酬データの型定義
export type Reward = {
  id: string;
  name: string;
  skills: string;
  amount: number;
  comparison: number;
  status: '支払い済み' | '支払い待ち' | '未払い';
};

type RewardTableProps = {
  rewards: Reward[];
  onViewDetail?: (id: string) => void;
  onMakePayment?: (id: string) => void;
  onEdit?: (id: string) => void;
};

export default function RewardTable({
  rewards,
  onViewDetail = () => {},
  onMakePayment = () => {},
  onEdit = () => {}
}: RewardTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold flex justify-between">
          <span>フリーランサー報酬一覧</span>
          <span className="text-gray-500 text-sm">全{rewards.length}件</span>
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">スキル</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">当月報酬</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">前月比</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状態</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rewards.map((reward) => (
              <tr key={reward.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reward.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reward.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reward.skills}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{reward.amount.toLocaleString()}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  reward.comparison > 0
                    ? 'text-green-600'
                    : reward.comparison < 0
                      ? 'text-red-600'
                      : 'text-gray-900'
                }`}>
                  {reward.comparison > 0 ? '+' : ''}{reward.comparison}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reward.status === '支払い済み'
                      ? 'bg-green-100 text-green-800'
                      : reward.status === '支払い待ち'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {reward.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      onClick={() => {
                        onViewDetail(reward.id);
                        window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
                      }}
                    >
                      詳細
                    </button>
                    {reward.status !== '支払い済み' && (
                      <button
                        className="text-green-600 hover:text-green-800 cursor-pointer"
                        onClick={() => {
                          onMakePayment(reward.id);
                          window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
                        }}
                      >
                        支払い
                      </button>
                    )}
                    <button
                      className="text-purple-600 hover:text-purple-800 cursor-pointer"
                      onClick={() => {
                        onEdit(reward.id);
                        window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
                      }}
                    >
                      編集
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">
          表示: 1-{rewards.length} / 全 {rewards.length} 件
        </div>
        <div className="flex space-x-2">
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            // disabled
            onClick={() => {
              setCurrentPage(currentPage - 1);
              window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
            }}
          >
            前へ
          </button>
          <span className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-purple-600 text-white hover:bg-purple-700">
            { currentPage }
          </span>
          <button
            className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer" 
            // disabled
            onClick={() => {
              setCurrentPage(currentPage + 1);
              window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
            }}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  );
}