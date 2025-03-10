'use client';

import React from 'react';

const AdminHome: React.FC = () => {
  // 稼働状況データ
  const workStatusData = [
    { name: '稼働中', value: 10, percentage: 26, color: '#6b21a8' },
    { name: '予定', value: 2, percentage: 10, color: '#22c55e' },
    { name: '休暇中', value: 3, percentage: 12, color: '#ea580c' },
    { name: '未稼働', value: 5, percentage: 20, color: '#d4d4d4' },
  ];

  // プロジェクト進捗データ
  const projectData = [
    { name: 'ECサイトリニューアル', progress: 67, delayed: false },
    { name: 'モバイルアプリ開発', progress: 81, delayed: false },
    { name: 'ECサイトリニューアル', progress: 42, delayed: true },
  ];

  // タスク状況データ
  const taskStatusData = [
    { name: '未着手', count: 29, color: '#e2e8f0' },
    { name: '進行中', count: 17, color: '#7e22ce' },
    { name: 'レビュー中', count: 13, color: '#06b6d4' },
    { name: '完了', count: 21, color: '#22c55e' },
    { name: '期限超過', count: 6, color: '#dc2626' },
  ];

  // 直近の締切データ
  const deadlineData = [
    {
      title: 'ランディングページデザイン',
      assignee: '田中太郎',
      deadline: '明日締切',
      priority: 'high',
    },
    {
      title: 'UIコンポーネント実装',
      assignee: '佐藤花子',
      deadline: '3日後締切',
      priority: 'medium',
    },
    {
      title: '週次進捗レポート作成',
      assignee: '鈴木一郎',
      deadline: '5日後締切',
      priority: 'low',
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* 上部のカード情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 稼働予定ユーザーボード */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">稼働予定ユーザー</p>
            <p className="text-3xl font-bold">35</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* 稼働中ユーザーボード */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">稼働中ユーザー</p>
            <p className="text-3xl font-bold">35</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* 進行中プロジェクトボード */}
        <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">進行中プロジェクト</p>
            <p className="text-3xl font-bold">3</p>
          </div>
          <div className="w-12 h-12 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 中部のセクション */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* 稼働状況概要 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">稼働状況概要</h2>
          <div className="flex">
            <div className="w-1/2 relative">
              {/* 円グラフを表示 */}
              <div className="w-40 h-40 mx-auto relative">
                {/* 未稼働の灰色背景（ベース） */}
                <div className="absolute inset-0 rounded-full bg-gray-200"></div>

                {/* 中央の穴 */}
                <div className="absolute inset-0 m-10 rounded-full bg-white z-10"></div>

                {/* 各セグメントをCSSの円錐グラデーション(conic-gradient)を使って表現 */}
                {/* 色 開始位置 終了位置の三つを指定 */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(
                      ${workStatusData[0].color} 0% ${workStatusData[0].percentage}%,
                      ${workStatusData[1].color} ${workStatusData[0].percentage}% ${workStatusData[0].percentage + workStatusData[1].percentage}%,
                      ${workStatusData[2].color} ${workStatusData[0].percentage + workStatusData[1].percentage}% ${workStatusData[0].percentage + workStatusData[1].percentage + workStatusData[2].percentage}%,
                      ${workStatusData[3].color} ${workStatusData[0].percentage + workStatusData[1].percentage + workStatusData[2].percentage}% 100%
                    )`
                  }}
                ></div>
              </div>
            </div>

            <div className="w-1/2">
              <ul>
                {workStatusData.map((item, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: item.color }}></span>
                    <span className="text-sm">
                      {item.name}: {item.value}名 ({item.percentage}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* プロジェクト状況 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">プロジェクト状況</h2>
          <div className="space-y-4">
            {projectData.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{project.name}</span>
                  <span className="text-sm">
                    {project.progress}%
                    {project.delayed && <span className="text-red-500 ml-2">(遅延)</span>}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${project.delayed ? 'bg-yellow-500' : 'bg-purple-600'}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 下部のセクション */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 直近の締切 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">直近の締切</h2>
          <div className="space-y-4">
            {deadlineData.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-b-0 last:pb-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">担当者: {item.assignee}</p>
                  </div>
                  <div className='w-[100px] text-center'>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        item.priority === 'high' ? 'bg-red-100 text-red-700' :
                        item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700':
                        'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {item.deadline}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* タスク状況 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">タスク状況</h2>
          <div className="space-y-3">
            {taskStatusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="w-24 text-sm">{item.name}</span>
                <div className="flex-1 bg-white-200 rounded-full h-6 mr-2">
                  <div
                    className="h-6 rounded-full"
                    style={{ width: `${(item.count / Math.max(...taskStatusData.map(d => d.count))) * 100}%`, backgroundColor: item.color }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;