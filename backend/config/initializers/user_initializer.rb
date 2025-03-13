class UserSerializer
  include JSONAPI::Serializer

  attributes :id, :email, :name, :created_at

  # 機密情報は返さない
  # attributes :id, :email, :name, :created_at, :updated_at
end