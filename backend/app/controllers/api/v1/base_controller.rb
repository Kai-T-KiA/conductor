module Api
  module V1
    class BaseController < ApplicationController
      # API V1の共通処理を実装
      # before_action :authenticate_user!, except: [:index, :show]
      # before_action :authenticate_user!, except: [:show]
      # APIのJWT認証設定
      before_action :authenticate_user!

      # API例外ハンドリング
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

      # デバッグ用のログを追加
      before_action :log_request_info

      private

      def log_request_info
        Rails.logger.info "API Request: #{request.method} #{request.fullpath}"
      end

      def record_not_found(exception)
        # puts 'bbbbbbb'
        render json: { error: exception.message }, status: :not_found
      end

      def record_invalid(exception)
        render json: {
          error: 'Validation failed',
          details: exception.record.errors.full_messages
        }, status: :unprocessable_entity
      end
    end
  end
end