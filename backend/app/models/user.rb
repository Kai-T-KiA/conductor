# ==============================================================================
# ユーザーモデル
# ==============================================================================
# 目的: フリーランサーユーザー情報の管理と認証
# 特徴:
# - DeviseとJWTによる認証機能
# - タスク、稼働時間、月次支払いとの関連付け
# - 稼働時間や収益の集計メソッド
# ==============================================================================
class User < ApplicationRecord
  # JWTの失効管理方法と`してJTIを使用
  # JTI(JWT ID)は`トークンの一意の識別子で、失効したトークンを追跡するのに使用
  include Devise::JWT::RevocationStrategies::JTIMatcher

  # Deviseによる認証機能の設定
  # database_authenticatable: パスワードのハッシュ化と認証
  # registerable: ユーザー登録機能
  # recoverable: パスワードリセット機能
  # rememberable: ログイン状態の永続化
  # validatable: バリデーション
  # jwt_authenticatable: JWT認証
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable,
    :jwt_authenticatable, jwt_revocation_strategy: self

  # リレーションシップ定義
  # ユーザーは複数のタスク、稼働時間、月次支払いを持つ
  has_many :tasks
  has_many :work_hours
  has_many :monthly_payments

  # バリデーション設定
  validates :name, presence: true  # 名前は必須
  validates :email, presence: true, uniqueness: true  # メールアドレスは必須かつ一意
  validates :hourly_rate, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true  # 時給は0以上または未設定

  # roleの定数定義（必要に応じて）
  ROLE_USER = 0
  ROLE_ADMIN = 1

  # admin?メソッドを追加
  def admin?
    # roleカラムが1（管理者）の場合はtrue、それ以外はfalse
    role == 1 || role == ROLE_ADMIN
  end

  # ユーザーの総稼働時間を計算するメソッド
  # @return [Decimal] 全期間の合計稼働時間
  def total_hours_worked
    work_hours.sum(:hours_worked)
  end

  # ユーザーの月間稼働時間を計算するメソッド
  # @param year [Integer] 対象年
  # @param month [Integer] 対象月
  # @return [Decimal] 指定月の合計稼働時間
  def monthly_hours_worked(year, month)
    # 指定年月の最初の日と最後の日を計算
    start_date = Date.new(year, month, 1)
    end_date = start_date.end_of_month

    # 期間内の稼働時間を合計
    work_hours.where(work_date: start_date..end_date).sum(:hours_worked)
  end

  # ユーザーの月間収益を計算するメソッド
  # @param year [Integer] 対象年
  # @param month [Integer] 対象月
  # @return [Decimal] 指定月の合計収益
  def monthly_earnings(year, month)
    # PostgreSQLのEXTRACT関数を使って年月を抽出して集計
    monthly_payments.where(
    "EXTRACT(YEAR FROM year_month) = ? AND EXTRACT(MONTH FROM year_month) = ?",
    year, month
    ).sum(:total_amount)
  end

  # 稼働率を計算するメソッド（特定の期間における稼働時間 / 想定稼働時間）
  # @param year [Integer] 年
  # @param month [Integer] 月
  # @return [Float] 稼働率（パーセンテージ）
  def working_rate(year = Date.today.year, month = Date.today.month)
    # 対象月の開始日と終了日
    start_date = Date.new(year, month, 1)
    end_date = start_date.end_of_month

    # 対象月の稼働日数を計算（平日のみカウント）
    business_days = (start_date..end_date).count { |date| !date.saturday? && !date.sunday? }

    # 想定稼働時間（平日 * 8時間）
    expected_hours = business_days * 8

    # 実際の稼働時間
    actual_hours = self.work_hours.where(work_date: start_date..end_date).sum(:hours_worked)

    # 稼働率を計算（パーセンテージに変換）
    return expected_hours > 0 ? (actual_hours / expected_hours.to_f * 100).round(2) : 0
  end

  # 当日の稼働時間を取得
  # @return [Float] 当日の合計稼働時間
  def today_hours
    self.work_hours.where(work_date: Date.today).sum(:hours_worked)
  end

  # 今週の稼働時間を取得
  # @return [Float] 今週の合計稼働時間
  def this_week_hours
    start_date = Date.today.beginning_of_week
    end_date = Date.today.end_of_week
    self.work_hours.where(work_date: start_date..end_date).sum(:hours_worked)
  end

  # 今月の稼働時間を取得
  # @return [Float] 今月の合計稼働時間
  def this_month_hours
    start_date = Date.today.beginning_of_month
    end_date = Date.today.end_of_month
    self.work_hours.where(work_date: start_date..end_date).sum(:hours_worked)
  end

  # 未完了のタスク数を取得
  # @return [Integer] 未完了タスク数
  def pending_tasks_count
    self.tasks.where.not(status: 'completed').count
  end

  # 期限切れのタスク数を取得
  # @return [Integer] 期限切れタスク数
  def overdue_tasks_count
    self.tasks.where('due_date < ? AND status != ?', Date.today, 'completed').count
  end


end