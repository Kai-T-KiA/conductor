'use client';

import { useEffect, useState } from 'react';
import { fetchWithAuth } from '@/utils/api';

export default function TestAuth() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:3001/api/v1/user');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError('ユーザーデータの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className='text-black'>読み込み中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-4">認証テスト</h1>
      <pre className="bg-gray-100 p-4 rounded text-black">
        {JSON.stringify(userData, null, 2)}
      </pre>
    </div>
  );
}