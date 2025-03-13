# リクエスト時に認証情報をJSON形式で受け取るための設定
Devise.setup do |config|
  # ...
  config.navigational_formats = ['*/*', :html, :json]
end
