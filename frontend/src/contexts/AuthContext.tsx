'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '../utils/api';
import { createSecureStorage } from '../utils/secureStorage';

// ユーザーデータの型定義
interface UserData {
  id: string;
  name?: string;
  email?: string;
  user_type: number; // 1: 管理者, 0: 一般ユーザー
  // 他に必要なプロパティがあれば追加
}

// SecureStorageの型定義
interface SecureStorageInterface {
  set: (key: string, value: any) => void;
  get: <T>(key: string) => T | null;
  remove: (key: string) => void;
  clear: () => void;
}


interface AuthContextType {
  token: string | null;
  // これを追加記述
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  userData: UserData | null;
  secureStorage: SecureStorageInterface | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setUserData: (data: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [secureStorage, setSecureStorage] = useState<any>(null);

  // ユーザーデータが変更されたらsecureStorageインスタンスを更新
  useEffect(() => {
    if (userData?.id) {
      setSecureStorage(createSecureStorage(userData.id));
    } else {
      setSecureStorage(null);
    }
  }, [userData]);

  // アプリ起動時にHTTPOnly Cookieを検証し認証状態を確認
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/verify`, {
          method: 'GET',
          credentials: 'include', // クッキーを含める
        });

        console.log('Verify response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Verify response data:', data);
          setToken(data.token);
          setUserData(data.user);
        } else {
          console.error('Auth verification failed with status:', response.status);
          const errorData = await response.json().catch(() => ({}));
          console.error('Error details:', errorData);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
      }
    };

    verifyAuth();
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/v1/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // リフレッシュトークンをクッキーとして受け取るため
      body: JSON.stringify({ user: { email, password } }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'ログインに失敗しました');
    }

    const data = await response.json();
    console.log('Login response full data:', data); // 完全なレスポンスを確認

    // data.data 構造を確認
    console.log('Login user data:', data.data);
    console.log('User type from login:', data.data?.user_type);

    // トークンをセット
    setToken(data.data.token);

    // レスポンスの確認ログ
    console.log('Login response data:', data);

    // userData を正確に設定
    const userInfo = {
      id: data.data.user_id?.toString() || '0',
      name: data.data.user_email?.split('@')[0] || 'User',
      email: data.data.user_email,
      user_type: Number(data.data.user_type) // 確実に数値に変換
    };

    console.log('Setting userData to:', userInfo);
    setUserData(userInfo);

    return data;
  };

  // ログアウト関数
  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/logout`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // secureStorageのクリア
      if (secureStorage) {
        secureStorage.clear();
      }
      setToken(null);
      setUserData(null);
    }
  };

  // トークンリフレッシュ関数
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) return false;

      const data = await response.json();
      setToken(data.token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
    userData,
    secureStorage,
    login,
    logout,
    refreshToken,
    setUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};