FactoryBot.define do
  factory :jwt_blacklist do
    jti { "MyString" }
    exp { "2025-03-04 10:56:03" }
  end
end
