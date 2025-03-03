class Rack::Attack
  # レート制限の設定
  throttle('req/ip', limit: 300, period: 5.minutes) do |req|
    req.ip
  end

  # ログイン試行制限
  throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
    if req.path == '/users/sign_in' && req.post?
      req.ip
    end
  end
end