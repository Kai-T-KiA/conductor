module Api
  module V1
    class SessionsController < Devise::SessionsController
      # JSONレスポンスを返すように設定
      respond_to :json

      # 認証失敗時のカスタム処理を追加
      # 認証失敗時の処理をカスタマイズ
      def create
        # 通常の認証処理を試みる
        self.resource = warden.authenticate(auth_options)

        if resource
          # 認証成功
          sign_in(resource_name, resource)
          respond_with(resource)
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

      private

      # リクエストがJSONフォーマットかどうかを判定するメソッド
      # このコントローラでは主にAPIリクエスト判別に使用
      def json_request?
        request.format.json?
      end

      # ログイン成功時のレスポンスをカスタマイズするメソッド
      # Deviseのレスポンダーから呼び出される
      # @param resource [User] ログインしたユーザーオブジェクト
      # @param _opts [Hash] オプション（使用していない）
      # @return [JSON] ステータスコード、メッセージ、ユーザー情報、JWTトークンを含むJSON
      def respond_with(resource, _opts = {})
        render json: {
          status: { code: 200, message: 'ログインしました' },
          data: {
            user_id: resource.id,
            user_email: resource.email,
            user_type: resource.role,
            # warden-jwt_auth gemによって環境変数に設定されたJWTトークンを取得
            token: request.env['warden-jwt_auth.token']
          }
        }
      end

      # ログアウト成功時のレスポンスをカスタマイズするメソッド
      # 204 No Contentステータスを返す（ログアウト成功を示す）
      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end