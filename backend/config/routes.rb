# APIモードでのルーティング設定
Rails.application.routes.draw do
  # Deviseのデフォルトルーティングをスキップし、APIに必要なルートのみを後で個別に定義
  # sessions: ログイン/ログアウト処理
  # registrations: ユーザー登録処理
  # passwords: パスワードリセット処理
  devise_for :users, skip: [:sessions, :registrations, :passwords]

  # アプリケーションの稼働状態を確認するためのヘルスチェックエンドポイント
  # ロードバランサーやモニタリングツールからの定期的なチェックに使用
  get 'api/v1/health', to: 'application#health'

  # 認証が正しく機能しているかテストするためのエンドポイント
  # 認証ヘッダーが正しく処理されているか確認する目的
  get 'test_auth', to: 'users#test_auth'

  # API v1名前空間の定義
  # すべてのAPIエンドポイントを/api/v1/プレフィックス配下に配置
  namespace :api do
    namespace :v1 do
      # Deviseの認証関連エンドポイントをカスタム定義
      devise_scope :user do
        # ログイン処理用エンドポイント - JWTトークンを発行
        # POST /api/v1/login
        post 'login', to: 'sessions#create'

        # ログアウト処理用エンドポイント - JWTトークンを無効化
        # DELETE /api/v1/logout
        delete 'logout', to: 'sessions#destroy'

        # テスト/開発用のヘルスチェックエンドポイント
        # GET /api/v1/test/health
        get 'test/health', to: 'test#health'
      end

      # ユーザー情報取得用のエンドポイント
      # 認証が必要なAPIエンドポイントの例
      # GET /api/v1/user
      resource :user, only: [:show]
    end
  end
end