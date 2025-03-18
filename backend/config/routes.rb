# APIモードでのルーティング設定
Rails.application.routes.draw do
  # Deviseのデフォルトルーティングをスキップし、APIに必要なルートのみを後で個別に定義
  # sessions: ログイン/ログアウト処理
  # registrations: ユーザー登録処理
  # passwords: パスワードリセット処理
  devise_for :users, skip: [:sessions, :registrations, :passwords]

  # ヘルスチェックと認証テスト用エンドポイント
  get 'api/v1/health', to: 'application#health'
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
      # resourcesを使うとRESTfulルートが作成される
      # onlyでは使用できるアクション（controllerで作成したメソッド）は指定したもののみ
      # onは特定のユーザーを指定
      # 認証が必要なAPIエンドポイントの例
      # GET /api/v1/user
      resource :user, only: [:show]

      # ユーザー管理API
      resources :users do
        # ユーザー固有の稼働時間を取得
        resources :work_hours, only: [:index], on: :member

        # ユーザー固有のタスクを取得
        resources :tasks, only: [:index], on: :member

        # ユーザー固有の月次支払いを取得
        resources :monthly_payments, only: [:index], on: :member
      end

      # タスク管理API
      resources :tasks do
        # タスク固有の稼働時間を取得
        resources :work_hours, only: [:index], on: :member
      end

      # 稼働時間管理API
      resources :work_hours do
        # 稼働時間サマリー取得
        collection do
          get 'summary'
        end
      end

      # プロジェクト管理API
      resources :projects do
        # プロジェクト固有のタスクを取得
        resources :tasks, only: [:index], on: :member
      end

      # ダッシュボードAPI
      get 'dashboard', to: 'dashboard#index'

    end
  end
end