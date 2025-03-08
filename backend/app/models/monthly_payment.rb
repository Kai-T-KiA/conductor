# ==============================================================================
# 月次支払いモデル
# ==============================================================================
# 目的: 月次支払い情報の管理
# 特徴:
# - ユーザー、クライアントとの関連付け
# - 請求明細との関連付け
# - 支払い状況の管理
# ==============================================================================
class MonthlyPayment < ApplicationRecord
  # リレーションシップ定義
  belongs_to :user  # 月次支払いは一人のユーザーに紐づく
  belongs_to :client  # 月次支払いは一つのクライアントに紐づく
  has_many :invoice_items, dependent: :destroy  # 月次支払いは複数の請求明細を持ち、削除時に明細も削除

  # バリデーション設定
  validates :year_month, presence: true  # 対象年月は必須
  validates :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }  # 合計金額は必須かつ0以上
  validates :currency, presence: true  # 通貨は必須
  validates :payment_status, inclusion: { in: %w[pending paid partially_paid cancelled] }  # 支払い状況は指定された値のみ許可

  # スコープ定義（頻繁に使用されるクエリパターンをメソッド化）
  scope :pending, -> { where(payment_status: 'pending') }  # 未払いの支払いを抽出
  scope :paid, -> { where(payment_status: 'paid') }  # 支払い済みの支払いを抽出

  # 年月を日本語形式の文字列で取得するメソッド
  # @return [String] 「YYYY年MM月」形式の文字列
  def month_year_string
    year_month.strftime("%Y年%m月")
  end

  # 請求明細から合計金額を再計算するメソッド
  # @return [Decimal] 再計算された合計金額
  def recalculate_total_amount
    # 全ての請求明細の金額を合計
    total = invoice_items.sum('amount')
    # 合計金額を更新
    update(total_amount: total)
    total
  end
end