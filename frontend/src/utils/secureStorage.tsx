'use client';

import CryptoJS from 'crypto-js';

// ユーザーID + ブラウザ固有の情報を組み合わせてキーを生成
const generateSecretKey = (userId: string) => {
  const browserInfo = navigator.userAgent;
  return CryptoJS.SHA256(`${userId}-${browserInfo}-${process.env.NEXT_PUBLIC_SECURE_STORAGE_KEY || 'fallback'}`).toString();
};

export const createSecureStorage = (userId: string) => {
  const SECRET_KEY = generateSecretKey(userId);

  return {
    // 暗号化して保存
    setItem: (key: string, value: any): void => {
      try {
        const valueStr = JSON.stringify(value);
        const encrypted = CryptoJS.AES.encrypt(valueStr, SECRET_KEY).toString();
        sessionStorage.setItem(key, encrypted);
      } catch (error) {
        console.error('Encryption error:', error);
      }
    },

    // 復号化して取得
    getItem: (key: string): any => {
      try {
        const encrypted = sessionStorage.getItem(key);
        if (!encrypted) return null;

        const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY).toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
      } catch (error) {
        console.error('Decryption error:', error);
        return null;
      }
    },

    // 削除
    removeItem: (key: string): void => {
      sessionStorage.removeItem(key);
    },

    // 全削除
    clear: (): void => {
      sessionStorage.clear();
    }
  };
};