'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MetricCard from '../../components/MetricCard';
import PerformanceDashboard from '../../components/PerformanceDashboard';
import GoalProgress from '../../components/GoalProgress';

// ユーザーデータの型定義
type UserData = {
  id: string;
  name: string;
  workingHours: number;
  workingRate: number;
  totalIncome: number;
  hourlyRate: number;
  monthlyChange: number;
  skills: string[];
};

export default function AdminPerformancePage() {
  // 期間選択用のステート
  const [period, setPeriod] = useState('月間');
  // 日付範囲用のステート
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  // ユーザー選択用のステート
  const [selectedUser, setSelectedUser] = useState('すべて');
  // 表示データ用のステート
  const [displayData, setDisplayData] = useState({
    totalWorkingHours: '2,800時間',
    totalPayment: '¥11,200,000',
    averageHourlyRate: '¥4,000',
    totalWorkingRate: '78%',
    changeRate: 8,
    performanceStatus: '良好',
    performanceRate: 75,
    warningUsers: 2
  });

  // サンプルユーザーリスト
  const usersList = ['すべて', '田中太郎', '佐藤花子', '鈴木一郎', '高橋望', '山田優子'];

  // サンプルユーザーデータ
  const usersData: Record<string, UserData> = {
    '田中太郎': {
      id: '001',
      name: '田中太郎',
      workingHours: 160,
      workingRate: 88,
      totalIncome: 640000,
      hourlyRate: 4000,
      monthlyChange: 5,
      skills: ['開発', 'プロジェクト管理']
    },
    '佐藤花子': {
      id: '002',
      name: '佐藤花子',
      workingHours: 140,
      workingRate: 75,
      totalIncome: 560000,
      hourlyRate: 4000,
      monthlyChange: 3,
      skills: ['デザイン', '開発']
    },
    '鈴木一郎': {
      id: '003',
      name: '鈴木一郎',
      workingHours: 120,
      workingRate: 65,
      totalIncome: 540000,
      hourlyRate: 4500,
      monthlyChange: -2,
      skills: ['開発', 'データ分析']
    },
    '高橋望': {
      id: '004',
      name: '高橋望',
      workingHours: 150,
      workingRate: 82,
      totalIncome: 600000,
      hourlyRate: 4000,
      monthlyChange: 4,
      skills: ['プロジェクト管理', 'デザイン']
    },
    '山田優子': {
      id: '005',
      name: '山田優子',
      workingHours: 90,
      workingRate: 50,
      totalIncome: 360000,
      hourlyRate: 4000,
      monthlyChange: -15,
      skills: ['デザイン', 'その他']
    }
  };

  // 選択したユーザーに基づいてデータを更新
  useEffect(() => {
    if (selectedUser === 'すべて') {
      // 全体データを表示
      setDisplayData({
        totalWorkingHours: '2,800時間',
        totalPayment: '¥11,200,000',
        averageHourlyRate: '¥4,000',
        totalWorkingRate: '78%',
        changeRate: 8,
        performanceStatus: '良好',
        performanceRate: 75,
        warningUsers: 2
      });
    } else {
      // 個別ユーザーのデータを表示
      const userData = usersData[selectedUser];
      if (userData) {
        setDisplayData({
          totalWorkingHours: `${userData.workingHours}時間`,
          totalPayment: `¥${userData.totalIncome.toLocaleString()}`,
          averageHourlyRate: `¥${userData.hourlyRate.toLocaleString()}`,
          totalWorkingRate: `${userData.workingRate}%`,
          changeRate: userData.monthlyChange,
          performanceStatus: userData.monthlyChange >= 0 ? '良好' : '要注意',
          performanceRate: userData.workingRate,
          warningUsers: 0
        });
      }
    }
  }, [selectedUser]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">パフォーマンス分析</h1>

      {/* 期間選択部分 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex space-x-2">
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
          </div>

          {/* ユーザー選択ドロップダウン - 管理者専用 */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label htmlFor="user-select" className="whitespace-nowrap">ユーザー：</label>
            <select
              id="user-select"
              className="border rounded-md p-2 cursor-pointer min-w-36"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {usersList.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </select>
            <button
              className="appearance-none bg-white border border-gray-300 rounded-md p-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:border-purple-500 cursor-pointer"
              onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
            >
              表示
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center cursor-pointer"
            onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            レポート出力
          </button>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center cursor-pointer"
            onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            一括分析
          </button>
        </div>
      </div>

      {/* Conductor AI分析 */}
      <div
        className="p-6 rounded-lg shadow-sm mb-6 text-white"
        style={{ background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)' }}
      >
        <h2 className="text-xl font-bold mb-4">Conductor AI 分析結果</h2>

        <div className="mb-6 p-3 rounded" style={{ backgroundColor: 'rgb(217, 217, 217, 0.2)'}}>
          <div className="flex justify-between mb-2">
            <div>
              <p className="font-bold text-xl">
                {selectedUser === 'すべて' ? '全体のパフォーマンス状況' : `${selectedUser}さんのパフォーマンス`}
              </p>
              <p className="text-sm mb-2">
                {selectedUser === 'すべて'
                  ? '前月比 +5% の成長、特に「デザイン」スキル保有者の稼働率が向上'
                  : `前月比 ${displayData.changeRate}% ${displayData.changeRate >= 0 ? 'の成長' : 'の低下'}、${usersData[selectedUser]?.skills.join('と')}スキルを活かして活躍中`}
              </p>
            </div>
            <div className="font-bold text-2xl">
              {displayData.performanceStatus}
            </div>
          </div>
          <div className="flex">
            <div className="h-[20px] w-70 rounded-full mr-2" style={{ backgroundColor: 'rgb(255, 255, 255, 0.3)' }}>
              <div className="bg-white h-[20px] rounded-full" style={{ width: `${displayData.performanceRate}%` }}></div>
            </div>
            <div className="text-right text-sm">{displayData.performanceRate}%</div>
          </div>
        </div>

        {selectedUser === 'すべて' && (
          <div className="mb-6 p-3 rounded" style={{ backgroundColor: 'rgb(217, 217, 217, 0.2)'}}>
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-bold">警告</p>
                <p className="text-sm">パフォーマンスが低下しているワーカーが{displayData.warningUsers}名います</p>
              </div>
              <div className="font-bold text-2xl">
                {displayData.warningUsers}名
              </div>
            </div>
            <div className="flex">
              <div className="h-[20px] w-70 rounded-full mr-2" style={{ backgroundColor: 'rgb(255, 255, 255, 0.3)' }}>
                <div className="bg-red-500 h-[20px] rounded-full" style={{ width: '15%' }}></div>
              </div>
              <div className="text-right text-sm">要対応</div>
            </div>
          </div>
        )}

        {selectedUser !== 'すべて' && usersData[selectedUser]?.monthlyChange < 0 && (
          <div className="mb-6 p-3 rounded" style={{ backgroundColor: 'rgb(217, 217, 217, 0.2)'}}>
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-bold">改善提案</p>
                <p className="text-sm">パフォーマンスの向上のためにミーティングを設定することをお勧めします</p>
              </div>
              <div className="font-bold text-2xl">
                要対応
              </div>
            </div>
            <div className="flex">
              <div className="h-[20px] w-70 rounded-full mr-2" style={{ backgroundColor: 'rgb(255, 255, 255, 0.3)' }}>
                <div className="bg-red-500 h-[20px] rounded-full" style={{ width: '25%' }}></div>
              </div>
              <div className="text-right text-sm">優先度高</div>
            </div>
          </div>
        )}
      </div>

      {/* 稼働関連指標 */}
      <div>
        <MetricCard
          title={selectedUser === 'すべて' ? "総稼働時間" : "稼働時間"}
          value={displayData.totalWorkingHours}
          change={{ value: displayData.changeRate, isPositive: displayData.changeRate >= 0 }}
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
          title={selectedUser === 'すべて' ? "総支払額" : "総収入"}
          value={displayData.totalPayment}
          change={{ value: displayData.changeRate, isPositive: displayData.changeRate >= 0 }}
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
          title={selectedUser === 'すべて' ? "平均時給" : "時給"}
          value={displayData.averageHourlyRate}
          change={{ value: displayData.changeRate, isPositive: displayData.changeRate >= 0 }}
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
          title={selectedUser === 'すべて' ? "全体稼働率" : "稼働率"}
          value={displayData.totalWorkingRate}
          change={{ value: displayData.changeRate, isPositive: displayData.changeRate >= 0 }}
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
      </div>

      <div className="mb-6"></div>

      {/* タブセクション */}
      <div>
        <PerformanceDashboard />
      </div>

      {/* ユーザー別パフォーマンス表 */}
      {selectedUser === 'すべて' && (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h3 className="text-lg font-medium mb-4">ユーザー別パフォーマンス</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー名</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">稼働時間</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">稼働率</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総収入</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">時給</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">前月比</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(usersData).map((user) => (
                  <tr key={user.id} className={selectedUser === user.name ? "bg-blue-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.workingHours}時間</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.workingRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">¥{user.totalIncome.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">¥{user.hourlyRate.toLocaleString()}</td>
                    <td className={`px-6 py-4 whitespace-nowrap ${user.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {user.monthlyChange >= 0 ? '+' : ''}{user.monthlyChange}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() => setSelectedUser(user.name)}
                        >
                          選択
                        </button>
                        <button
                          className="text-purple-600 hover:text-purple-800 cursor-pointer"
                          onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
                        >
                          詳細
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 個別ユーザーのスキル詳細 */}
      {selectedUser !== 'すべて' && (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{selectedUser}さんのスキル詳細</h3>
            <button
              className="text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => setSelectedUser('すべて')}
            >
              全体表示に戻る
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {usersData[selectedUser]?.skills.map((skill, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <div>
                    <span className="font-medium">{skill}</span>
                    <span className="text-gray-500 ml-4">{index === 0 ? '70%' : '30%'}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {index === 0 ? (Math.round(usersData[selectedUser].workingHours * 0.7)) : (Math.round(usersData[selectedUser].workingHours * 0.3))}時間
                  </span>
                </div>
                <div className="bg-gray-200 h-2 rounded-full">
                  <div className={`h-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-purple-600'}`} style={{ width: `${index === 0 ? '70%' : '30%'}` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="font-medium mb-2">パフォーマンス詳細</h4>
            <div className="bg-gray-100 p-4 rounded">
              <p className="mb-2"><span className="font-medium">プロジェクト参加数:</span> 3件</p>
              <p className="mb-2"><span className="font-medium">完了タスク数:</span> 12件</p>
              <p className="mb-2"><span className="font-medium">平均タスク完了時間:</span> 2.5日</p>
              <p><span className="font-medium">クライアント評価:</span> ★★★★☆ (4.0/5.0)</p>
            </div>
          </div>
        </div>
      )}

      {/* スキル別分析 - 全体表示時のみ */}
      {selectedUser === 'すべて' && (
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <h3 className="text-lg font-medium mb-4">スキル別稼働時間</h3>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">開発</span>
                  <span className="text-gray-500 ml-4">40%</span>
                </div>
                <span className="text-sm text-gray-500">1,120時間</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">デザイン</span>
                  <span className="text-gray-500 ml-4">25%</span>
                </div>
                <span className="text-sm text-gray-500">700時間</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">プロジェクト管理</span>
                  <span className="text-gray-500 ml-4">20%</span>
                </div>
                <span className="text-sm text-gray-500">560時間</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <div>
                  <span className="font-medium">その他</span>
                  <span className="text-gray-500 ml-4">15%</span>
                </div>
                <span className="text-sm text-gray-500">420時間</span>
              </div>
              <div className="bg-gray-200 h-2 rounded-full">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 目標設定 - 全体/個別で表示切替 */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">
            {selectedUser === 'すべて' ? '会社目標設定' : `${selectedUser}さんの目標設定`}
          </h3>
          {selectedUser === 'すべて' && (
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
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {selectedUser === 'すべて' ? (
            <>
              <GoalProgress
                title="月間目標稼働時間"
                currentValue="2,800時間"
                progress={85}
                color="blue"
              />

              <GoalProgress
                title="月間目標収入"
                currentValue="¥12,000,000"
                progress={90}
                color="green"
              />

              <GoalProgress
                title="稼働率目標"
                currentValue="85%"
                progress={78}
                color="purple"
              />
            </>
          ) : (
            <>
              <GoalProgress
                title="月間目標稼働時間"
                currentValue={`${usersData[selectedUser]?.workingRate > 80 ? 160 : 140}時間`}
                progress={Math.round((usersData[selectedUser]?.workingHours / (usersData[selectedUser]?.workingRate > 80 ? 160 : 140)) * 100)}
                color="blue"
              />

              <GoalProgress
                title="月間目標収入"
                currentValue={`¥${(usersData[selectedUser]?.hourlyRate * (usersData[selectedUser]?.workingRate > 80 ? 160 : 140)).toLocaleString()}`}
                progress={Math.round((usersData[selectedUser]?.totalIncome / (usersData[selectedUser]?.hourlyRate * (usersData[selectedUser]?.workingRate > 80 ? 160 : 140))) * 100)}
                color="green"
              />

              <GoalProgress
                title="稼働率目標"
                currentValue="85%"
                progress={Math.round((usersData[selectedUser]?.workingRate / 85) * 100)}
                color="purple"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}