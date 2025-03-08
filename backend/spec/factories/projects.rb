FactoryBot.define do
  factory :project do
    client { nil }
    name { "MyString" }
    description { "MyText" }
    start_date { "2025-03-08" }
    end_date { "2025-03-08" }
    status { "MyString" }
    budget { "9.99" }
  end
end
