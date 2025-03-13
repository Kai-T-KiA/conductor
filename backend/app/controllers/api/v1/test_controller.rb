# app/controllers/api/v1/test_controller.rb
module Api
  module V1
    class TestController < ApplicationController
      # authenticate_user!が定義されているかを実行時に確認する代わりに
      # 単純にスキップする処理を試みる
      begin
        skip_before_action :authenticate_user!
      rescue => e
        # エラーが発生した場合はログに記録するだけ
        Rails.logger.debug "Skip authentication failed: #{e.message}"
      end

      def health
        render json: { status: 'ok', message: 'Health check passed', time: Time.now.to_s }
      end
    end
  end
end
