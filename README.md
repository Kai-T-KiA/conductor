<p align="center"><a href="" target="_blank"><img src="frontend/public/conductor-logo.png" width="400" alt="Conductor logo"></a></p>

# [Conductor](https://conductor-rho.vercel.app/)


## アプリの概要・作成背景・開発コンセプト

フリーランスの稼働状況を管理するWebアプリ。

## 使用言語・OS・フレームワーク・開発ツール・API

### フロントエンド
- Next.js 14(App router)
- TypeScript
- TailwindCSS

### バックエンド
- Ruby on Rails7（APIモードでの使用）
- Supabase
- Redis

## デプロイ環境
フロントエンドはVercel、バックエンドはRailway。

## 実装したい機能

- 稼働状況管理
- タスク管理
- 報酬管理
- パフォーマンス分析

## 注力した機能

バックエンドを全て実装し終えた際に記載。

## 環境構築の手順

## ログイン機能実装の手順


## テストアカウント

アプリURL　[https://conductor-rho.vercel.app/]

ユーザー

メールアドレス　test@example.com

パスワード　password

管理者

メールアドレス　yamada@example.com

パスワード　password


## 動作確認上の注意

現在、デプロイしているものは、ログイン機能とユーザーのホーム画面のみバックエンドの実装をしています。

そのため、ユーザーのホーム画面以外は、表示されている数値やデータはフロントエンド側で仮置きしたデータを表示しているものになります。（ユーザーのホーム画面については、SupabaseのDBからデータを取得し表示しています。）

ユーザー側のホーム画面を除く画面、管理者の画面につきましては順次バックエンドの実装を行っていますので、「こういう感じで作ろうとしているんだな。」くらいの温度感で見ていただけるとありがたいです。

それと、動作パフォーマンスまでは手が回ってないので、ページのロードなど少し時間がかかるところがあります。




## 今後の改修予定

- ユーザー、管理者のバックエンド処理の順次実装
