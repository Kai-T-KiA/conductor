# =========================================================================
# InvoiceItemテーブル作成マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration CreateInvoiceItems payment:references description:text amount:decimal quantity:decimal unit_price:decimal
#
# 目的：
# 請求明細項目を保存するテーブルを作成する
# =========================================================================
class CreateInvoiceItems < ActiveRecord::Migration[7.1]
  def change
    create_table :invoice_items do |t|
      # monthly_payment: 関連する月次支払いへの外部キー（必須項目）
      t.references :monthly_payment, null: false, foreign_key: true

      # description: 明細項目の説明（必須項目）
      t.text :description, null: false

      # amount: 金額（必須項目）- quantity * unit_price で自動計算
      t.decimal :amount, precision: 10, scale: 2, null: false

      # quantity: 数量（デフォルトは1）
      t.decimal :quantity, precision: 8, scale: 2, default: 1

      # unit_price: 単価（必須項目）
      t.decimal :unit_price, precision: 10, scale: 2, null: false

      # created_at, updated_at: 作成日時、更新日時を自動追加
      t.timestamps
    end
  end
end
