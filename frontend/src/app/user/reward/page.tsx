'use client';

import { useState } from 'react';
// 型定義のインポート
import { NextPage } from 'next';

// 報酬データの型定義
type MonthlyReward = {
  month: number;
  amount: number;
};

// 仮のデータ
const rewardData = {
  yearlyTotal: 1980000,
  monthlyAverage: 165000,
  monthlyData: [
    { month: 1, amount: 400000 },
    { month: 2, amount: 500000 },
    { month: 3, amount: 600000 },
    { month: 4, amount: 450000 },
    { month: 5, amount: 580000 },
    { month: 6, amount: 500000 },
  ]
};

// 時間単価データ
const hourlyRateData = {
  yearlyTotal: 1980000,
  monthlyAverage: 165000,
  hourlyAverage: 3300,
  monthlyData: [
    { month: 1, hours: 120, amount: 400000, rate: 3333 },
    { month: 2, hours: 150, amount: 500000, rate: 3333 },
    { month: 3, hours: 180, amount: 600000, rate: 3333 },
    { month: 4, hours: 135, amount: 450000, rate: 3333 },
    { month: 5, hours: 175, amount: 580000, rate: 3314 },
    { month: 6, hours: 150, amount: 500000, rate: 3333 },
  ]
};

// タスク別データ
const taskData = {
  yearlyTotal: 1980000,
  tasks: [
    { name: "プログラミング", amount: 800000, percentage: 40.4 },
    { name: "デザイン", amount: 500000, percentage: 25.3 },
    { name: "会議", amount: 300000, percentage: 15.2 },
    { name: "ドキュメント作成", amount: 230000, percentage: 11.6 },
    { name: "その他", amount: 150000, percentage: 7.5 },
  ]
};

// 分析データ
const analysisData = {
  yearlyTotal: 1980000,
  monthlyAverage: 165000,
  bestMonth: { month: 3, amount: 600000 },
  worstMonth: { month: 1, amount: 400000 },
  growth: 25, // 前年比成長率
  monthlyTrend: [
    { month: 1, amount: 400000, lastYear: 320000 },
    { month: 2, amount: 500000, lastYear: 380000 },
    { month: 3, amount: 600000, lastYear: 450000 },
    { month: 4, amount: 450000, lastYear: 390000 },
    { month: 5, amount: 580000, lastYear: 420000 },
    { month: 6, amount: 500000, lastYear: 410000 },
  ]
};

const RewardPage: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState<'全報酬' | '時間単価' | 'タスク別' | '分析'>('全報酬');
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // CSVエクスポート機能
  const exportToCSV = () => {
    // 実際の実装では、データをCSV形式に変換してダウンロードする処理を記述
    console.log('CSVをエクスポート');
    window.alert('この機能は現在開発中です。もうしばらくお待ちください。');
  };

  return (
    <>
      <div className="p-6">
        <h1 className="text-4xl font-bold mb-6">報酬詳細</h1>

        {/* タブナビゲーション */}
        <div className="flex">
          {(['全報酬', '時間単価', 'タスク別', '分析'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-2 px-6 ${
                selectedTab === tab
                  ? 'bg-indigo-700 text-white rounded-t-lg'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* メインコンテンツエリア */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {/* 年度選択と CSVエクスポートボタン */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <span className="mr-2">{selectedYear}年</span>
              <button className="text-gray-500">
                ◀
              </button>
            </div>
            <button
              onClick={exportToCSV}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-full"
            >
              CSVを出力
            </button>
          </div>

          {selectedTab === '全報酬' && (
            <>
              {/* 年間収入サマリー */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="flex justify-between">
                  <div>
                    <span className="text-gray-600">{selectedYear}年 総収入：</span>
                    <span className="text-blue-600 font-bold text-xl ml-2">
                      {rewardData.yearlyTotal.toLocaleString()}円
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">月平均：</span>
                    <span className="text-blue-600 font-bold text-xl ml-2">
                      {rewardData.monthlyAverage.toLocaleString()}円
                    </span>
                  </div>
                </div>
              </div>

              {/* グラフタイトル */}
              <h3 className="text-lg font-medium mb-4">月別収入</h3>

              {/* グラフ表示エリア */}
              <div className="h-64 w-full">
                <div className="relative h-full">
                  {/* Y軸の目盛り */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                    <div>60万</div>
                    <div>40万</div>
                    <div>20万</div>
                    <div>0</div>
                  </div>

                  {/* グラフ本体 */}
                  <div className="ml-10 h-full flex items-end justify-around">
                    {rewardData.monthlyData.map((data) => (
                      <div key={data.month} className="flex flex-col items-center w-full">
                        <div
                          className="w-10 bg-blue-600"
                          style={{
                            height: `${Math.min((data.amount / 600000) * 100, 100)}px`,
                          }}
                        ></div>
                        <div className="mt-2">{data.month}月</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedTab === '時間単価' && (
            <>
              {/* 時間単価サマリー */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="flex justify-between">
                  <div>
                    <span className="text-gray-600">{selectedYear}年 総収入：</span>
                    <span className="text-blue-600 font-bold text-xl ml-2">
                      {hourlyRateData.yearlyTotal.toLocaleString()}円
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">平均時給：</span>
                    <span className="text-blue-600 font-bold text-xl ml-2">
                      {hourlyRateData.hourlyAverage.toLocaleString()}円
                    </span>
                  </div>
                </div>
              </div>

              {/* 月別時間単価テーブル */}
              <h3 className="text-lg font-medium mb-4">月別時間単価</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作業時間</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">報酬</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時間単価</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hourlyRateData.monthlyData.map((data) => (
                      <tr key={data.month}>
                        <td className="px-6 py-4 whitespace-nowrap">{data.month}月</td>
                        <td className="px-6 py-4 whitespace-nowrap">{data.hours}時間</td>
                        <td className="px-6 py-4 whitespace-nowrap">{data.amount.toLocaleString()}円</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{data.rate.toLocaleString()}円</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {selectedTab === 'タスク別' && (
            <>
              {/* タスク別サマリー */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div>
                  <span className="text-gray-600">{selectedYear}年 総収入：</span>
                  <span className="text-blue-600 font-bold text-xl ml-2">
                    {taskData.yearlyTotal.toLocaleString()}円
                  </span>
                </div>
              </div>

              {/* タスク別収入テーブル */}
              <h3 className="text-lg font-medium mb-4">タスク別収入</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タスク</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">割合</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taskData.tasks.map((task, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{task.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{task.amount.toLocaleString()}円</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="mr-2">{task.percentage}%</span>
                            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{ width: `${task.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {selectedTab === '分析' && (
            <>
              {/* 分析サマリー */}
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-600">年間総収入</div>
                    <div className="text-blue-600 font-bold text-xl">
                      {analysisData.yearlyTotal.toLocaleString()}円
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">前年比</div>
                    <div className="text-green-600 font-bold text-xl">
                      +{analysisData.growth}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">最高月</div>
                    <div className="text-blue-600 font-bold text-xl">
                      {analysisData.bestMonth.month}月 ({analysisData.bestMonth.amount.toLocaleString()}円)
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">最低月</div>
                    <div className="text-blue-600 font-bold text-xl">
                      {analysisData.worstMonth.month}月 ({analysisData.worstMonth.amount.toLocaleString()}円)
                    </div>
                  </div>
                </div>
              </div>

              {/* 前年比較グラフ */}
              <h3 className="text-lg font-medium mb-4">前年比較</h3>
              <div className="h-64 w-full">
                <div className="relative h-full">
                  {/* Y軸の目盛り */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
                    <div>60万</div>
                    <div>40万</div>
                    <div>20万</div>
                    <div>0</div>
                  </div>

                  {/* グラフ本体 */}
                  <div className="ml-10 h-full flex items-end justify-around">
                    {analysisData.monthlyTrend.map((data) => (
                      <div key={data.month} className="flex flex-col items-center w-full">
                        <div className="flex items-end">
                          <div
                            className="w-5 bg-gray-300 mr-1"
                            style={{
                              height: `${Math.min((data.lastYear / 600000) * 100, 100)}px`,
                            }}
                          ></div>
                          <div
                            className="w-5 bg-blue-600"
                            style={{
                              height: `${Math.min((data.amount / 600000) * 100, 100)}px`,
                            }}
                          ></div>
                        </div>
                        <div className="mt-2">{data.month}月</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RewardPage;