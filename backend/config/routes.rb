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

        # リフレッシュトークンやその認証のためのエンドポイント
        post 'auth/refresh', to: 'sessions#refresh'
        get 'auth/verify', to: 'sessions#verify'

        # テスト/開発用のヘルスチェックエンドポイント
        # GET /api/v1/test/health
        get 'test/health', to: 'test#health'
      end

      # resourcesを使うとRESTfulルートが作成される
      # onlyでは使用できるアクション（controllerで作成したメソッド）は指定したもののみ
      # onは特定のユーザーを指定

      # 現在ログインしているユーザー自身の情報を取得
      # GET /api/v1/user
      # 単数形のresourceは、IDを指定せずに現在のユーザーを参照するため
      resource :user, only: [:show]
      # resources :user, only: [:show], on: :member


      # ユーザー管理API
      # GET /api/v1/users - すべてのユーザー一覧を取得
      # POST /api/v1/users - 新規ユーザー情報を取得
      # GET /api/v1/users/:id - 特定のユーザー情報を取得
      # PUT/PATCH /api/v1/users/:id - 特定のユーザー情報を更新
      # DELETE /api/v1/users/:id - 特定のユーザーを削除
      resources :users do
        # 「on: member（特定のユーザー（ID指定）に対するという意味）」を指定するとURLには必ず親リソース（users）のIDが含まれる

        # GET /api/v1/users:id/work_hours - 特定ユーザーの稼働時間一覧を取得
        resources :work_hours, only: [:index], on: :member

        # GET /api/v1/users/:id/tasks - 特定ユーザーのタスク一覧を取得
        resources :tasks, only: [:index], on: :member

        # GET /api/v1/users/:id/monthly_payments - 特定ユーザーの月次支払い一覧を取得
        # resources :monthly_payments, only: [:index], on: :member
      end

      # タスク管理API
      # GET /api/v1/tasks - すべてのタスク一覧を取得
      # POST /api/v1/tasks - 新規タスク情報を取得
      # GET /api/v1/tasks/:id - 特定のタスク情報を取得
      # PUT/PATCH /api/v1/tasks/:id - 特定のタスク情報を更新
      # DELETE /api/v1/tasks/:id - 特定のタスクを削除
      resources :tasks do
        # タスク固有の稼働時間を取得
        # GET /api/v1/tasks/:id/work_hours - 特定タスクに関連する稼働時間一覧を取得
        resources :work_hours, only: [:index], on: :member

        # タスクサマリーとカレンダー表示用のエンドポイントを追加
        collection do
          get 'summary'
          get 'calendar'
        end
      end

      # 稼働時間管理API
      # GET /api/v1/work_hours - すべての稼働時間一覧を取得
      # POST /api/v1/work_hours - 新規稼働時間情報を取得
      # GET /api/v1/work_hours/:id - 特定の稼働時間情報を取得
      # PUT/PATCH /api/v1/work_hours/:id - 特定の稼働時間情報を更新
      # DELETE /api/v1/work_hours/:id - 特定の稼働時間を削除
      resources :work_hours do
        # 稼働時間サマリー取得
        # GET /api/v1/work_hours/summary - 稼働時間の集計情報を取得
        collection do
          get 'summary'
        end
      end

      # プロジェクト管理API
      # GET /api/v1/projects - すべてのプロジェクト一覧を取得
      # POST /api/v1/projects - 新規プロジェクト情報を取得
      # GET /api/v1/projects/:id - 特定のプロジェクト情報を取得
      # PUT/PATCH /api/v1/projects/:id - 特定のプロジェクト情報を更新
      # DELETE /api/v1/projects/:id - 特定のプロジェクトを削除
      resources :projects do
        # プロジェクト固有のタスクを取得
        # GET /api/v1/projects/:id/tasks - 特定プロジェクトに関連するタスク一覧を取得
        resources :tasks, only: [:index], on: :member
      end

      # ダッシュボードAPI
      # GET /api/v1/dashboard - ダッシュボード情報を取得
      get 'dashboard', to: 'dashboard#index'

    end
  end
end