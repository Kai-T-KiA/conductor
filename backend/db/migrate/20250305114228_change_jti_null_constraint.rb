class ChangeJtiNullConstraint < ActiveRecord::Migration[7.1]
  def change
    change_column_null :users, :jti, false
  end
end