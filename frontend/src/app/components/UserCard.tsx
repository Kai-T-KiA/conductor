'use client';

import React from 'react';

type UserCardProps = {
  id: number;
  name: string;
  skills: string;
  performance: number;
  status: 'active' | 'inactive';
  tasksCount: number;
  onEdit: (id: number) => void;
};

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  skills,
  performance,
  status,
  tasksCount,
  onEdit
}) => {
  return (
    <div className="bg-white rounded shadow p-4 mb-4">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg">{name}</h3>
        <button
          onClick={() => onEdit(id)}
          className="text-blue-500 bg-blue-100 p-2 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">スキル</div>
        <div className="flex flex-wrap gap-1">
          {skills.split(',').map((skill, index) => (
            <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {skill.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <div className="text-sm text-gray-600 mb-1">パフォーマンス</div>
          <div className="font-semibold">{performance}%</div>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">ステータス</div>
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === 'active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'
          }`}>
            {status === 'active' ? '稼働中' : '未稼働'}
          </span>
        </div>

        <div>
          <div className="text-sm text-gray-600 mb-1">タスク数</div>
          <div className="font-semibold">{tasksCount}</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;