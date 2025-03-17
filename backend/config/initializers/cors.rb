# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 開発環境用
    # origins ENV['CORS_ORIGINS']
    origins 'https://conductor-rho.vercel.app', 'http://localhost:3000'
    # ワイルドカードは良くないみたい
    # origins '*'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization'], # Authorization ヘッダーを公開（認証トークンのため）
      # credentials: true
  end
end