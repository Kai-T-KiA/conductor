module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!

      def show
        # デバッグ用にログを追加
        Rails.logger.debug "Current user: #{current_user.inspect}"

        render json: {
          # status: 200,
          # message: "認証されたユーザー",
          status: { code: 200, message: '認証されたユーザー' },
          data: {
            user: {
              id: current_user.id,
              email: current_user.email,
              role: current_user.role
            }
          }
        }
      rescue => e
        # エラー処理を追加
        Rails.logger.error "Error in users#show: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: { error: e.message }, status: 500
      end
    end
  end
end