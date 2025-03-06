class User < ApplicationRecord
  # # Include default devise modules. Others available are:
  # # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # devise :database_authenticatable, :registerable,
  #       :recoverable, :rememberable, :validatable,
  #     # 以降追加記述
  #       :jwt_authenticatable, jwt_revocation_strategy: JwtBlacklist

  #     enum role: { user: 0, admin: 1 }

      # def jwt_payload
      #   { 'role' => role }
      # end
      include Devise::JWT::RevocationStrategies::JTIMatcher

      devise :database_authenticatable, :registerable,
            :recoverable, :rememberable, :validatable,
            :jwt_authenticatable, jwt_revocation_strategy: self

      enum role: { user: 0, admin: 1 }
end
