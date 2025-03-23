Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # origins '*'
    # ワイルドカードの代わりに特定のオリジンを指定
    origins 'http://localhost:3000', 'https://conductor-rho.vercel.app'
    # origins 'http://localhost:3000'
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization'],
      credentials: true
  end
end