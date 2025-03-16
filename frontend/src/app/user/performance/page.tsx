'use client';

import { useState } from 'react';
import Image from 'next/image';
import MetricCard from '../../components/MetricCard';
import PerformanceDashboard from '../../components/PerformanceDashboard';
import GoalProgress from '../../components/GoalProgress';

export default function PerformancePage() {
  // グラフのサンプルデータ
  const graphData = [
    { month: '1月', actual: 120, target: 140 },
    { month: '2月', actual: 115, target: 140 },
    { month: '3月', actual: 110, target: 140 },
  ];
  // 期間選択用のステート
  const [period, setPeriod] = useState('月間');
  // 日付範囲用のステート
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">パフォーマンス分析</h1>

      {/* 期間選択部分 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <div className="flex space-x-2 mr-8">
            <button
              className={`px-4 py-2 rounded-md cursor-pointer ${period === '月間' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPeriod('月間')}
            >
              月間
            </button>
            <button
              className={`px-4 py-2 rounded-md cursor-pointer ${period === '四半期' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPeriod('四半期')}
            >
              四半期
            </button>
            <button
              className={`px-4 py-2 rounded-md cursor-pointer ${period === '年間' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setPeriod('年間')}
            >
              年間
            </button>
          </div>

          <div className="flex items-center">
            <span className="mr-2">期間：</span>
            <input
              type="date"
              className="border rounded-md p-2 mr-2 cursor-pointer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="mx-2">〜</span>
            <input
              type="date"
              className="border rounded-md p-2 cursor-pointer"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="appearance-none bg-white border border-gray-300 rounded-md ml-2 py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-purple-500 cursor-pointer"
            onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
          >
            表示
          </button>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center cursor-pointer"
          onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          レポート出力
        </button>
      </div>

      {/* Conductor AI分析 */}
      <div className="bg-purple-500 text-white p-6 rounded-lg shadow-sm mb-6">
        <h2 className="text-xl font-bold mb-4">Conductor AI 分析</h2>

        <div className="mb-6 p-3 rounded" style={{ backgroundColor: 'rgb(217, 217, 217, 0.2)'}}>
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-bold text-xl">時給アップの可能性</p>
              <p className="text-sm mb-2">現在のパフォーマンスと納品品質から</p>
            </div>
            <div className="font-bold text-2xl">
              ¥4,000 → ¥4,200
            </div>
          </div>
          <div className="flex">
            <div className="h-[20px] w-70 rounded-full mr-2" style={{ backgroundColor: 'rgb(255, 255, 255, 0.3)' }}>
              <div className="bg-white h-[20px] rounded-full" style={{ width: '70%' }}></div>
            </div>
            <div className="text-right text-sm">70%</div>
          </div>
        </div>

        <div className="mb-6 p-3 rounded" style={{ backgroundColor: 'rgb(217, 217, 217, 0.2)'}}>
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-bold">プレミアムワーカーへの昇格可能性</p>
              <p className="text-sm">あと2件のプロジェクト完了で確実！</p>
            </div>
            <div className="font-bold text-2xl">
              残り2件
            </div>
          </div>
          <div className="flex">
            <div className="h-[20px] w-70 rounded-full mr-2" style={{ backgroundColor: 'rgb(255, 255, 255, 0.3)' }}>
              <div className="bg-white h-[20px] rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="text-right text-sm">60%</div>
          </div>
        </div>
      </div>

      {/* 稼働時間 */}
      <MetricCard
        title="総稼働時間"
        value="400時間"
        change={{ value: 5, isPositive: true }}
        txColor="#472BFF"
        bgColor="bg-blue-100"
        icon={
          <span>
            <Image
              src="/time-icon2.png"
              alt="時計アイコン"
              width={30}
              height={30}
            />
          </span>
        }
      />

      <div className="mb-6"></div>

      {/* 総収入 */}
      <MetricCard
        title="総収入"
        value="¥1,600,000"
        change={{ value: 12, isPositive: true }}
        txColor="#006215"
        bgColor="bg-green-100"
        icon={
          <span>
            <Image
              src="/money-icon2.png"
              alt="お金アイコン"
              width={30}
              height={30}
            />
          </span>
        }
      />

      <div className="mb-6"></div>

      {/* 平均時給 */}
      <MetricCard
        title="平均時給"
        value="¥4,000"
        change={{ value: 0, isPositive: true }}
        txColor="#9932B2"
        bgColor="bg-purple-100"
        icon={
          <span>
            <Image
              src="/graph-icon.png"
              alt="グラフアイコン"
              width={30}
              height={30}
            />
          </span>
        }
      />

      <div className="mb-6"></div>

      {/* 稼働率 */}
      <MetricCard
        title="稼働率"
        value="83%"
        change={{ value: 3, isPositive: true }}
        txColor="#956B07"
        bgColor="bg-yellow-100"
        icon={
          <span>
            <Image
              src="/beat-icon.png"
              alt="稼働アイコン"
              width={30}
              height={30}
            />
          </span>
        }
      />

      <div className="mb-6"></div>

      {/* タブセクション */}
      <div>
        <PerformanceDashboard />
      </div>

      {/* タスク種別稼働時間 */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
        <h3 className="text-lg font-medium mb-4">タスク種別稼働時間</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between mb-1">
              <div>
                <span className="font-medium">開発</span>
                <span className="text-gray-500 ml-4">45%</span>
              </div>
              <span className="text-sm text-gray-500">180時間</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div>
                <span className="font-medium">デザイン</span>
                <span className="text-gray-500 ml-4">30%</span>
              </div>
              <span className="text-sm text-gray-500">120時間</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div>
                <span className="font-medium">ミーティング</span>
                <span className="text-gray-500 ml-4">15%</span>
              </div>
              <span className="text-sm text-gray-500">60時間</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div>
                <span className="font-medium">その他</span>
                <span className="text-gray-500 ml-4">10%</span>
              </div>
              <span className="text-sm text-gray-500">40時間</span>
            </div>
            <div className="bg-gray-200 h-2 rounded-full">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 目標設定 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">目標設定 <span className="text-sm text-gray-500">（自己申告制）</span></h3>
          <button
            className="flex items-center bg-blue-100 px-4 py-2 rounded-full cursor-pointer"
            style={{ color: "#1030EA" }}
            onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
          >
            <span className="w-5 h-5 bg-blue-600 rounded-full text-white flex items-center justify-center mr-2">
              <Image
                src="/multi-circle-icon.png"
                alt="編集アイコン"
                width={30}
                height={30}
              />
            </span>
            <p>目標を編集</p>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <GoalProgress
            title="月間目標稼働時間"
            currentValue="160時間"
            progress={85}
            color="blue"
          />

          <GoalProgress
            title="月間目標収入"
            currentValue="¥600,000"
            progress={90}
            color="green"
          />

          <GoalProgress
            title="平均時給目標"
            currentValue="¥4,000"
            progress={100}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}