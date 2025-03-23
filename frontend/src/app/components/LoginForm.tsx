'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
// import { login } from '../../utils/api';

import { useAuth } from '../../contexts/AuthContext';
// import { createApiClient } from '../../utils/apiClient';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [devMessage, setDevMessage] = useState('');
  const router = useRouter();
  const auth = useAuth();

  // APIと連携したログイン機能の実装
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // AuthContextのlogin関数を直接使用
      const loginResponse = await auth.login(email, password);
      console.log('Login successful, response:', loginResponse);
      console.log('Current auth.userData:', auth.userData);

      // ユーザーにログイン成功を通知
      setSuccessMessage('ログインしました');

      // 適切なダッシュボードにリダイレクト
      // userData更新が非同期の場合があるため、loginResponseからuser_typeを取得
      const userType = loginResponse.data.user_type;
      console.log('User type from response:', userType);

      setTimeout(() => {
        if (userType === 1) {
          console.log('Redirecting to admin dashboard');
          router.push('/admin/home');
        } else {
          console.log('Redirecting to user dashboard');
          router.push('/user/home');
        }
      }, 200);
    } catch (error) {
      // エラー処理
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('ログインに失敗しました。再度お試しください');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 新規登録ボタンの仮実装
  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setDevMessage('新規登録機能は現在開発中です');
    setSuccessMessage('');
    setError('');
  };

  // Googleログインの仮実装
  const handleGoogleLogin = () => {
    setDevMessage('Googleログイン機能は現在開発中です');
    setSuccessMessage('');
    setError('');
  };

  return (
    <div className='flex items-center justify-center min-h-[calc(100vh-40px)]'>
      <div className='w-full max-w-md p-8 rounded-lg'>
        <div className='text-center mb-8'>
          <Image
            src='/conductor-logo.png'
            alt='アプリロゴ'
            width={606}
            height={185}
            priority
          />
        </div>

        {/* フォーム部分の記述 */}
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div className='space-y-4'>
            {/* メールアドレス部分 */}
            <div>
              <label htmlFor='email-address' className='block text-sm font-medium text-gray-700 mb-1'>メールアドレス</label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text:sm text-gray-900'
                placeholder='xxxxxx@gmail.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* パスワード部分 */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>パスワード</label>
              <input
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900'
                placeholder='aaaaaaa'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* 開発中メッセージ表示 */}
          {devMessage && (
            <div className='rounded-md bg-yellow-50 p-4'>
              <div className='text-sm text-yellow-700'>{devMessage}</div>
            </div>
          )}

          {/* 成功メッセージ表示 */}
          {successMessage && (
            <div className='rounded-md bg-green-50 p-4'>
              <div className='text-sm text-green-700'>{successMessage}</div>
            </div>
          )}

          {/* エラーメッセージ表示 */}
          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='text-sm text-red-700'>{error}</div>
            </div>
          )}

          <div className='flex justify-center space-x-4'>
            <button
              onClick={handleRegister}
              className='py-2 px-6 border border-transparent text-sm font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
            >
              新規登録
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='py-2 px-6 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>
          </div>
        </form>

        <div className='mt-6'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-purple-50 text-gray-500'>または</span>
            </div>
          </div>

          {/* Googleログイン部分の記述 */}
          <div className='mt-6'>
            <button
              onClick={handleGoogleLogin}
              className='w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              <svg className='h-5 w-5 mr-2' viewBox='0 0 24 24'>
                <path
                  d='M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.79-1.677-4.184-2.702-6.735-2.702-5.514 0-10 4.486-10 10s4.486 10 10 10c8.837 0 10.673-8.318 9.776-11.666h-9.776z'
                  fill='#4285F4'
                />
              </svg>
              Googleでログイン
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;