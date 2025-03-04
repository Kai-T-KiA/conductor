'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Next.jsのImageコンポーネントをインポート
import Image from 'next/image';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsLoading(true);

  //   try {
  //     // API呼び出しを実装（バックエンド連携時に実装）
  //     await new Promise(resolve => setTimeout(resolve, 1000));

  //     // ログイン成功後のリダイレクト
  //     router.push('/dashboard');
  //   } catch (err: any) {
  //     setError(err.message || 'ログインに失敗しました。再度お試しください。');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleGoogleLogin = () => {
    // Googleログイン処理を実装
    console.log('Googleでログイン');
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
        <form className='space-y-6'>
          <div className='space-y-4'>
            {/* メールアドレス部分 */}
            <div>
              <label htmlFor='email-address' className='block text-sm font-medium text-gray-700 mb-1'>メールアドレス</label>
              <input
                id='email-address'
                name='email'
                type='email'
                autoComplete='email'
                // required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text:sm'
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
                // required
                className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                placeholder='aaaaaaa'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className='rounded-md bg-red-50 p-4'>
              <div className='text-sm text-red-700'>{error}</div>
            </div>
          )}

          <div className='flex justify-center space-x-4'>
            <Link href='/register' className='py-2 px-6 border border-transparent text-sm font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2focus:ring-offset-2 focus:ring-purple-500'>
              新規登録
            </Link>
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
              // onClick={}
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