# ==============================================================================
# 請求明細モデル
# ==============================================================================
# 目的: 請求明細項目の管理
# 特徴:
# - 月次支払いとの関連付け
# - 金額の自動計算
# - 支払い合計金額の自動更新
# ==============================================================================
class InvoiceItem < ApplicationRecord
  # リレーションシップ定義
  belongs_to :monthly_payment  # 請求明細は一つの月次支払いに紐づく

  # バリデーション設定
  validates :description, presence: true  # 説明は必須
  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }  # 金額は必須かつ0以上
  validates :quantity, presence: true, numericality: { greater_than: 0 }  # 数量は必須かつ0より大きい
  validates :unit_price, presence: true, numericality: { greater_than_or_equal_to: 0 }  # 単価は必須かつ0以上

  # コールバック：数量と単価から金額を自動計算
  before_validation :calculate_amount, if: -> { quantity.present? && unit_price.present? }

  # コールバック：請求明細の保存/削除後に関連する月次支払いの合計金額を更新
  after_save :update_payment_total
  after_destroy :update_payment_total

  private

  # 数量と単価から金額を計算するメソッド
  def calculate_amount
    self.amount = (quantity * unit_price).round(2)  # 小数点以下2桁で丸める
  end

  # 関連する月次支払いの合計金額を更新するメソッド
  def update_payment_total
    monthly_payment.recalculate_total_amount
  end
end