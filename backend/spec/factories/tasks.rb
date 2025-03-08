FactoryBot.define do
  factory :task do
    user { nil }
    project { nil }
    title { "MyString" }
    description { "MyText" }
    start_date { "2025-03-08" }
    due_date { "2025-03-08" }
    status { "MyString" }
    priority { "MyString" }
    estimated_hours { "9.99" }
  end
end
