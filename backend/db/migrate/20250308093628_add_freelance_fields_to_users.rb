# =========================================================================
# User拡張マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration AddFreelanceFieldsToUsers hourly_rate:decimal
#
# 目的：
# devise JWT で既に作成されているユーザーテーブルにフリーランサーの時給情報を追加する
# =========================================================================
class AddFreelanceFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    # hourly_rate: 時間単価（数値型、小数点以下2桁まで）
    # precision: 全体の桁数, scale: 小数点以下の桁数
    add_column :users, :hourly_rate, :decimal, precision: 10, scale: 2
  end
end
