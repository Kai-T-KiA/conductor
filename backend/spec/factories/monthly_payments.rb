FactoryBot.define do
  factory :monthly_payment do
    user { nil }
    client { nil }
    year_month { "2025-03-08" }
    total_amount { "9.99" }
    currency { "MyString" }
    payment_date { "2025-03-08" }
    payment_status { "MyString" }
    payment_method { "MyString" }
  end
end
