class JwtBlacklist < ApplicationRecord
  # include Devise::JWT::RevocationStrategies::Blacklist
  # self.table_name = 'jwt_blacklist'
  include Devise::JWT::RevocationStrategies::JTIMatcher
end
