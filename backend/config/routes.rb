# Rails.application.routes.draw do
#   devise_for :users
#   # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

#   # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
#   # Can be used by load balancers and uptime monitors to verify that the app is live.
#   get "up" => "rails/health#show", as: :rails_health_check

#   # Defines the root path route ("/")
#   # root "posts#index"
# end


# 新しい記述
Rails.application.routes.draw do
  devise_for :users, skip: [:sessions, :registrations, :passwords]

  # テスト用のヘルスチェックエンドポイント
  get 'api/v1/health', to: 'application#health'

  # テスト用の認証ヘッダー確認エンドポイント
  get 'test_auth', to: 'users#test_auth'

  namespace :api do
    namespace :v1 do
      devise_scope :user do
        post 'login', to: 'sessions#create'
        delete 'logout', to: 'sessions#destroy'
        get 'test/health', to: 'test#health'
      end

      # 認証必須のAPIエンドポイント
      resource :user, only: [:show]
    end
  end
end