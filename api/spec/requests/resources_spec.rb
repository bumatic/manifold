require "rails_helper"

RSpec.describe "Resources API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  describe "sends a resource" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_resources_path
        expect(response).to have_http_status(200)
      end
    end
  end
end
