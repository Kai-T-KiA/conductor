FactoryBot.define do
  factory :work_hour do
    user { nil }
    task { nil }
    work_date { "2025-03-08" }
    start_time { "2025-03-08 09:37:51" }
    end_time { "2025-03-08 09:37:51" }
    hours_worked { "9.99" }
    activity_description { "MyText" }
  end
end
