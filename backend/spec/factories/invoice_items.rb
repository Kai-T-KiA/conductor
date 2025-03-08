FactoryBot.define do
  factory :invoice_item do
    monthly_payment { nil }
    description { "MyText" }
    amount { "9.99" }
    quantity { "9.99" }
    unit_price { "9.99" }
  end
end
