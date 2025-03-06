module Api
  module V1
    class SessionsController < Devise::SessionsController
      respond_to :json
      # APIモードでの実行ならいらない？
      # skip_before_action :verify_authenticity_token, if: :json_request?

      private

      def json_request?
        request.format.json?
      end

      def respond_with(resource, _opts = {})
        render json: {
          status: { code: 200, message: 'ログインしました' },
          data: {
            user_id: resource.id,
            user_email: resource.email,
            user_type: resource.role,
            token: request.env['warden-jwt_auth.token']
          }
        }
      end

      def respond_to_on_destroy
        head :no_content
      end
    end
  end
end