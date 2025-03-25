module Api
  module V1
    class SessionsController < Devise::SessionsController
      skip_before_action :require_no_authentication, only: [:create]

      # JSONレスポンスを返すように設定
      respond_to :json

      # 認証失敗時のカスタム処理を追加
      # 認証失敗時の処理をカスタマイズ
      def create
        Rails.logger.debug "Starting create method in SessionsController"
        # 通常の認証処理を試みる
        self.resource = warden.authenticate(auth_options)

        if resource
          # 認証成功
          sign_in(resource_name, resource)

          # アクセストークン（短期間有効）の生成
          access_token = JWT.encode(
            {
              sub: resource.id,
              email: resource.email,
              name: resource.name,
              role: resource.role,
              jti: SecureRandom.uuid,
              exp: 15.minutes.from_now.to_i # 短い有効期限
            },
            Rails.application.credentials.secret_key_base
          )

          # リフレッシュトークン（長期間有効）の生成
          refresh_token = SecureRandom.urlsafe_base64(32)
          refresh_token_expiry = 2.weeks.from_now

          # リフレッシュトークンをユーザーに関連付けて保存
          resource.update(
            refresh_token: refresh_token,
            refresh_token_expires_at: refresh_token_expiry
          )

          # HTTPOnly Cookieとしてリフレッシュトークンを設定
          cookies.signed[:refresh_token] = {
            value: refresh_token,
            httponly: true,
            secure: Rails.env.production?,
            expires: refresh_token_expiry,
            same_site: :lax
          }

          # レスポンスはアクセストークンのみを含む
          render json: {
            status: { code: 200, message: 'ログインしました' },
            data: {
              user_id: resource.id,
              user_email: resource.email,
              user_name: resource.name,
              user_type: resource.role,
              token: access_token # アクセストークンのみJSON本文に含める
            }
          }
        else
          # 認証失敗
          render json: {
            status: {
              code: 401,
              message: 'メールアドレスまたはパスワードが正しくありません'
            }
          }, status: :unauthorized
        end
      end

      def destroy
        Rails.logger.debug "Starting destroy method in SessionsController"

        # ログアウト処理
        sign_out(resource_name)

        # リフレッシュトークンをクリア
        cookies.delete(:refresh_token)

        # ユーザーのリフレッシュトークンをDBから削除
        current_user&.update(refresh_token: nil, refresh_token_expires_at: nil)

        head :no_content
      end

      # トークンリフレッシュエンドポイント
      def refresh
        Rails.logger.debug "Starting refresh method in SessionsController"
        refresh_token = cookies.signed[:refresh_token]

        if refresh_token.blank?
          return render json: { error: 'リフレッシュトークンがありません' }, status: :unauthorized
        end

        user = User.find_by(refresh_token: refresh_token)

        if user.nil? || user.refresh_token_expires_at < Time.now
          cookies.delete(:refresh_token)
          return render json: { error: 'リフレッシュトークンが無効です' }, status: :unauthorized
        end

        # 新しいアクセストークンを生成
        new_access_token = JWT.encode(
          {
            sub: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            jti: SecureRandom.uuid,
            exp: 15.minutes.from_now.to_i
          },
          Rails.application.credentials.secret_key_base
        )

        render json: {
          token: new_access_token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      end

      # 認証検証エンドポイント
      def verify
        Rails.logger.debug "Starting verify method in SessionsController"
        begin
          # デバッグログ
          Rails.logger.info "Verify endpoint called"
          Rails.logger.info "Headers: #{request.headers.select { |k, v| k.start_with?('HTTP_') }.inspect}"

          # 認証チェック
          authenticate_user!

          # ユーザー情報を返す
          render json: {
            authenticated: true,
            user: {
              id: current_user.id,
              email: current_user.email,
              name: current_user.name,
              role: current_user.role
            }
          }
        rescue => e
          # エラーのデバッグ情報
          Rails.logger.error "Verify endpoint error: #{e.class.name}: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")

          # クライアントへのエラーレスポンス
          render json: { error: 'Authentication failed', details: e.message }, status: :unauthorized
        end
      end

      private

      # リクエストがJSONフォーマットかどうかを判定するメソッド
      # このコントローラでは主にAPIリクエスト判別に使用
      def json_request?
        request.format.json?
      end

      def generate_access_token(user)
        # 短期間（15分など）有効なJWTアクセストークンを生成
        payload = {
          sub: user.id,
          jti: SecureRandom.uuid,
          iat: Time.now.to_i,
          exp: 15.minutes.from_now.to_i
        }

        JWT.encode(payload, Rails.application.credentials.secret_key_base)
      end

      def generate_refresh_token(user)
        # 長期間有効なリフレッシュトークンを生成
        SecureRandom.urlsafe_base64(32)
      end

    end
  end
end