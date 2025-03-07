# app/controllers/api/v1/test_controller.rb
module Api
  module V1
    class TestController < ApplicationController
      skip_before_action :authenticate_user!, if: -> { respond_to?(:authenticate_user!) }

      def health
        render json: { status: 'ok', message: 'Health check passed', time: Time.now.to_s }
      end
    end
  end
end