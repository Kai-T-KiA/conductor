Devise.setup do |config|
  # API用の設定
  config.navigational_formats = [:json]

  # アプリケーションからのメール送信に使うデフォルトの送信元アドレス
  # パスワードリセットや確認メールなどの送信元になります
  config.mailer_sender = 'please-change-me-at-config-initializers-devise@example.com'

  # Deviseで使用するORMを指定（今回はActiveRecord）
  require 'devise/orm/active_record'

  # メールアドレスの大文字小文字を区別しない設定
  # 例：example@mail.comとEXAMPLE@mail.comを同一と扱う
  config.case_insensitive_keys = [:email]

  # メールアドレスの前後の空白を自動的に削除する設定
  config.strip_whitespace_keys = [:email]

  # HTTPベーシック認証でのセッション保存をスキップする設定
  # APIモードでは通常セッションを使わないのでこれは適切
  config.skip_session_storage = [:http_auth]

  # パスワードハッシュ化の強度設定
  # 本番環境では12回のストレッチング、テスト環境では処理速度向上のため1回に設定
  config.stretches = Rails.env.test? ? 1 : 12

  # メールアドレス確認プロセスを再確認可能にする設定
  # メールアドレス変更時に確認メールを送信するかどうか
  config.reconfirmable = true

  # ログアウト時に「remember me」の全てのセッションを削除する設定
  config.expire_all_remember_me_on_sign_out = true

  # パスワードの長さの制限（6文字以上128文字以下）
  config.password_length = 6..128

  # メールアドレスのバリデーション用正規表現
  # 基本的なメールアドレス形式のチェック
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # パスワードリセットリンクの有効期限（6時間）
  config.reset_password_within = 6.hours

  # ログアウト方法の指定（DELETEリクエスト）
  config.sign_out_via = :delete

  # レスポンダーのエラーステータスコード設定
  # バリデーションエラー時に422(Unprocessable Entity)を返す
  config.responder.error_status = :unprocessable_entity

  # リダイレクト時のステータスコード設定
  # 303(See Other)を使用
  config.responder.redirect_status = :see_other

  # JWT認証関連の設定
  config.jwt do |jwt|
    # JWTの署名に使用する秘密鍵の設定
    # Rails.application.credentials.secret_key_baseを使用（安全に環境変数で管理）
    jwt.secret = Rails.application.credentials.secret_key_base

    # JWTトークンを発行するリクエストパターンの設定
    # POSTリクエストで/api/v1/loginへのアクセス時にトークンを発行
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/login$}]
    ]

    # JWTトークンを無効化するリクエストパターンの設定
    # DELETEリクエストで/api/v1/logoutへのアクセス時にトークンを無効化
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/logout$}]
    ]

    # JWTトークンの有効期限設定（24時間）
    # この期間が過ぎるとトークンは無効になり、再ログインが必要
    jwt.expiration_time = 24.hours.to_i
  end
end