'use client';

import React, { useState, CSSProperties } from 'react';

// デモデータ用の型定義
type UserFormProps = {
  onSubmit: (userData: {
    name: string;
    skills: string;
    status: 'active' | 'inactive';
  }) => void;
  onCancel: () => void;
};

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, skills, status });
  };

  // 型付きでスタイルを定義
  const overlayStyle: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  };

  const modalStyle: CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '28rem',
    position: 'relative',
    zIndex: 51
  };

  return (
    <div style={overlayStyle} onClick={(e) => {
      // モーダル外のクリックで閉じる
      if (e.target === e.currentTarget) {
        onCancel();
      }
    }}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">新規ユーザー登録</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              名前
            </label>
            <input
              id="name"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
              スキル（カンマ区切りで入力）
            </label>
            <input
              id="skills"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="例: JavaScript, React, Node.js"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              ステータス
            </label>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="status"
                  value="active"
                  checked={status === 'active'}
                  onChange={() => setStatus('active')}
                />
                <span className="ml-2">稼働中</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="status"
                  value="inactive"
                  checked={status === 'inactive'}
                  onChange={() => setStatus('inactive')}
                />
                <span className="ml-2">未稼働</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
              onClick={onCancel}
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer"
              onClick={() => window.alert('この機能は現在開発中です。もうしばらくお待ちください。')}
            >
              登録
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;