module Api
  module V1
    class BaseController < ApplicationController
      # API V1の共通処理を実装
      before_action :authenticate_user!, except: [:index, :show]

      # API例外ハンドリング
      rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :record_invalid

      private

      def record_not_found(exception)
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