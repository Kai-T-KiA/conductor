Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'https://conductor-rho.vercel.app', 'http://localhost:3000'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization'], # Authorization ヘッダーを公開（認証トークンのため
  end
end