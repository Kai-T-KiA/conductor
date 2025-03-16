'use client';

import { useState } from 'react';
import Image from 'next/image';
import RewardTable, { Reward } from '../../components/RewardTable';

export default function RewardManagement() {
  // 月の選択状態
  const [selectedMonth, setSelectedMonth] = useState('2025年3月'); // 表示用
  const [selectedMonthValue, setSelectedMonthValue] = useState('2025-03'); // input用

  // フィルター状態
  const [filter, setFilter] = useState('すべて');

  // 検索状態
  const [searchQuery, setSearchQuery] = useState('');

  // サンプルデータ
  const rewardsData: Reward[] = [
    { id: 'FR001', name: '佐藤太郎', skills: 'フロントエンド開発', amount: 380000, comparison: 5.2, status: '支払い済み' },
    { id: 'FR002', name: '田中花子', skills: 'UIデザイン', amount: 420000, comparison: -2.1, status: '支払い待ち' },
    { id: 'FR003', name: '山田一郎', skills: 'バックエンド開発', amount: 510000, comparison: 12.4, status: '未払い' },
    { id: 'FR004', name: '鈴木健太', skills: 'プロジェクトマネジメント', amount: 650000, comparison: 0, status: '支払い済み' },
    { id: 'FR005', name: '伊藤真里', skills: 'データ分析', amount: 320000, comparison: 8.7, status: '未払い' },
  ];

  // 統計情報
  const totalAmount = 2280000;
  const unpaidAmount = 1250000;
  const activeFreelancers = 5;
  const paymentCompletionRate = 40;

  // イベントハンドラー
  const handleViewDetail = (id: string) => {
    console.log(`詳細表示: ${id}`);
    // ここに詳細表示のロジックを実装
  };

  const handleMakePayment = (id: string) => {
    console.log(`支払い処理: ${id}`);
    // ここに支払い処理のロジックを実装
  };

  const handleEdit = (id: string) => {
    console.log(`編集: ${id}`);
    // ここに編集ロジックを実装
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">報酬管理</h1>

      {/* サマリーカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <Image
              src="/money-icon.png"
              alt="お金アイコン"
              width={25}
              height={25}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">総支払額</p>
            <p className="text-xl font-bold">¥{totalAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Image
              src="/uncomplete-icon.png"
              alt="未完了アイコン"
              width={25}
              height={25}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">未払い合計</p>
            <p className="text-xl font-bold">¥{unpaidAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Image
              src="/worker-icon.png"
              alt="稼働者アイコン"
              width={25}
              height={25}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">稼働中</p>
            <p className="text-xl font-bold">{activeFreelancers}名</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
            <Image
              src="/complete-icon2.png"
              alt="支払い完了アイコン"
              width={25}
              height={25}
            />
          </div>
          <div>
            <p className="text-sm text-gray-500">支払い完了率</p>
            <p className="text-xl font-bold">{paymentCompletionRate}%</p>
          </div>
        </div>
      </div>

      {/* フィルターと検索 */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-white p-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
          <input
            type="month"
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
            value={selectedMonthValue}
            onChange={(e) => {
              setSelectedMonthValue(e.target.value);

              // 日本語表記の月に変換
              const date = new Date(e.target.value);
              setSelectedMonth(`${date.getFullYear()}年${date.getMonth() + 1}月`);
            }}
          />
          </div>

          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 text-gray-700 leading-tight focus:outline-none focus:border-purple-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>すべて</option>
              <option>支払い済み</option>
              <option>支払い待ち</option>
              <option>未払い</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <button
            className="appearance-none bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-purple-500"
            onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
          >
            表示
          </button>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="検索..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <span className="cursor-pointer">
            <Image
              src="/csv-button.png"
              alt="csv出力ボタン"
              width={99}
              height={44}
            />
          </span>
        </div>
      </div>

      {/* フリーランサー報酬一覧をコンポーネントとして使用 */}
      <RewardTable
        rewards={rewardsData}
        onViewDetail={handleViewDetail}
        onMakePayment={handleMakePayment}
        onEdit={handleEdit}
      />
    </div>
  );
}