class JwtBlacklist < ApplicationRecord
  # JWTトークンの失効管理のためのモデル

  # JTIMatcher戦略を使用してJWTトークンの失効管理を行う
  # JTI（JWT ID）は各トークンの一意識別子で、これを使って失効したトークンを追跡する
  # ユーザーモデルのjti属性とトークンのjtiクレームを照合し、不一致の場合はトークンを無効とみなす
  include Devise::JWT::RevocationStrategies::JTIMatcher
end