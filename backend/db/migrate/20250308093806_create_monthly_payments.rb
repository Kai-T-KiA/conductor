# =========================================================================
# MonthlyPaymentテーブル作成マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration CreateMonthlyPayments user:references client:references year_month:date total_amount:decimal currency:string payment_date:date payment_status:string payment_method:string
#
# 目的：
# 月次支払い情報を保存するテーブルを作成する
# =========================================================================
class CreateMonthlyPayments < ActiveRecord::Migration[7.1]
  def change
    create_table :monthly_payments do |t|
      # user: 支払い対象ユーザーへの外部キー（必須項目）
      t.references :user, null: false, foreign_key: true

      # client: 支払い元クライアントへの外部キー（必須項目）
      t.references :client, null: false, foreign_key: true

      # year_month: 対象年月（必須項目）- date型だが年月のみ使用
      t.date :year_month, null: false

      # total_amount: 合計金額（必須項目）
      t.decimal :total_amount, precision: 10, scale: 2, null: false

      # currency: 通貨（デフォルトは'JPY'）
      t.string :currency, default: 'JPY'

      # payment_date: 支払日
      t.date :payment_date

      # payment_status: 支払い状況（デフォルトは'pending'）
      # 想定値: pending, paid, partially_paid, cancelled
      t.string :payment_status, default: 'pending'

      # payment_method: 支払い方法
      t.string :payment_method

      # created_at, updated_at: 作成日時、更新日時を自動追加
      t.timestamps
    end

    # インデックスを追加してクエリのパフォーマンスを向上
    add_index :monthly_payments, :year_month
    add_index :monthly_payments, :payment_status
  end
end
