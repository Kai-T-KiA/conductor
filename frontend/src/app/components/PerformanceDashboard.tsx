'use client';

import React, { useState } from 'react';
import WorkingHoursGraph from '../components/WorkingHoursGraph';
import MonthlyIncomeGraph from '../components/MonthlyIncomeGraph';
import HourlyRateGraph from '../components/HourlyRateGraph';
import ProjectIncomeGraph from '../components/ProjectIncomeGraph';

const PerformanceDashboard = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('workingHours');

  // Sample data for each graph
  const workingHoursData = [
    { month: '10月', actual: 120, target: 140 },
    { month: '11月', actual: 135, target: 140 },
    { month: '12月', actual: 115, target: 140 },
    { month: '1月', actual: 125, target: 140 },
    { month: '2月', actual: 140, target: 140 },
    { month: '3月', actual: 130, target: 140 }
  ];

  const monthlyIncomeData = [
    { month: '10月', income: 396000 },
    { month: '11月', income: 445500 },
    { month: '12月', income: 379500 },
    { month: '1月', income: 412500 },
    { month: '2月', income: 462000 },
    { month: '3月', income: 429000 }
  ];

  const hourlyRateData = [
    { month: '10月', rate: 3300 },
    { month: '11月', rate: 3300 },
    { month: '12月', rate: 3300 },
    { month: '1月', rate: 3300 },
    { month: '2月', rate: 3300 },
    { month: '3月', rate: 3300 }
  ];

  const projectIncomeData = [
    { name: 'プロジェクトA', income: 800000 },
    { name: 'プロジェクトB', income: 500000 },
    { name: 'プロジェクトC', income: 300000 },
    { name: 'プロジェクトD', income: 230000 },
    { name: 'その他', income: 150000 }
  ];

  // Render correct graph based on active tab
  const renderActiveGraph = () => {
    switch (activeTab) {
      case 'workingHours':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">月別稼働時間</h3>
            <WorkingHoursGraph data={workingHoursData} />
            <div className="flex justify-center mt-4">
              <div className="flex items-center mr-8">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span className="text-sm">実績時間</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                <span className="text-sm">目標時間</span>
              </div>
            </div>
          </>
        );
      case 'monthlyIncome':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">月別収入</h3>
            <MonthlyIncomeGraph data={monthlyIncomeData} />
            <div className="flex justify-center mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 mr-2"></div>
                <span className="text-sm">月間収入</span>
              </div>
            </div>
          </>
        );
      case 'hourlyRate':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">時給推移</h3>
            <HourlyRateGraph data={hourlyRateData} />
          </>
        );
      case 'projectIncome':
        return (
          <>
            <h3 className="text-lg font-medium mb-4">プロジェクト別収入</h3>
            <ProjectIncomeGraph data={projectIncomeData} />
          </>
        );
      default:
        return <div>No data to display</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 px-4 overflow-hidden">
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-6 py-3 cursor-pointer ${activeTab === 'workingHours' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('workingHours')}
          >
            稼働時間
          </button>
          <button
            className={`px-6 py-3 cursor-pointer ${activeTab === 'monthlyIncome' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('monthlyIncome')}
          >
            月別収入
          </button>
          <button
            className={`px-6 py-3 cursor-pointer ${activeTab === 'hourlyRate' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('hourlyRate')}
          >
            時給推移
          </button>
          <button
            className={`px-6 py-3 cursor-pointer ${activeTab === 'projectIncome' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500 hover:text-blue-600'}`}
            onClick={() => setActiveTab('projectIncome')}
          >
            プロジェクト別収入
          </button>
        </div>
      </div>

      <div className="p-6">
        {renderActiveGraph()}
      </div>
    </div>
  );
};

export default PerformanceDashboard;