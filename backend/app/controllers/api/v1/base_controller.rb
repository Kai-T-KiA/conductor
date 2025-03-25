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

      rescue_from JWT::DecodeError, with: :jwt_decode_error
      rescue_from JWT::ExpiredSignature, with: :jwt_expired_error

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

      def jwt_decode_error
        render json: {
          status: { code: 401, message: 'トークンが無効です' }
        }, status: :unauthorized
      end

      def jwt_expired_error
        render json: {
          status: { code: 401, message: 'トークンの有効期限が切れています' }
        }, status: :unauthorized
      end

      def authenticate_user_with_token
        begin
          header = request.headers['Authorization']
          Rails.logger.info "Auth header: #{header}"

          if header.present?
            token = header.split(' ').last
            decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base)
            user_id = decoded_token.first['sub']

            @current_user = User.find(user_id)
          else
            render json: { error: 'Authorization header is missing' }, status: :unauthorized
          end
        rescue JWT::DecodeError => e
          Rails.logger.error "JWT decode error: #{e.message}"
          render json: { error: 'Invalid token' }, status: :unauthorized
        rescue ActiveRecord::RecordNotFound => e
          Rails.logger.error "User not found: #{e.message}"
          render json: { error: 'User not found' }, status: :unauthorized
        rescue => e
          Rails.logger.error "Auth error: #{e.class.name}: #{e.message}"
          render json: { error: 'Authentication failed' }, status: :unauthorized
        end
      end

    end
  end
end