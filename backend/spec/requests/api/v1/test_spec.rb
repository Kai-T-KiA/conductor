require 'rails_helper'

RSpec.describe "Api::V1::Tests", type: :request do
  describe "GET /health" do
    it "returns http success" do
      get "/api/v1/test/health"
      expect(response).to have_http_status(:success)
    end
  end

end
