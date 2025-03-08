FactoryBot.define do
  factory :client do
    name { "MyString" }
    contact_person { "MyString" }
    email { "MyString" }
    phone { "MyString" }
    address { "MyText" }
    notes { "MyText" }
  end
end
