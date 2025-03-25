declare module 'crypto-js' {
  export namespace AES {
    function encrypt(message: string, key: string): any;
    function decrypt(ciphertext: any, key: string): any;
  }

  export namespace enc {
    const Utf8: any;
  }

  // SHA256の宣言を追加
  export function SHA256(message: string): any;
}