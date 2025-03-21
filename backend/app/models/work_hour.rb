# ==============================================================================
# 稼働時間モデル
# ==============================================================================
# 目的: 稼働時間情報の管理
# 特徴:
# - ユーザー、タスクとの関連付け
# - 稼働時間の自動計算
# - 稼働日、時間帯の管理
# ==============================================================================
class WorkHour < ApplicationRecord
  # リレーションシップ定義
  belongs_to :user  # 稼働時間は一人のユーザーに紐づく
  belongs_to :task, optional: true  # 稼働時間は一つのタスクに紐づく

  # バリデーション設定
  validates :work_date, presence: true  # 稼働日は必須
  validates :start_time, presence: true  # 開始時間は必須
  # end_timeとhours_workedは稼働終了時に設定するので必須にしない
  # validates :end_time, presence: true  # 終了時間は必須
  # validates :hours_worked, presence: true, numericality: { greater_than: 0 }  # 稼働時間は必須かつ0より大きい数値
  validate :end_time_after_start_time  # カスタムバリデーション：終了時間が開始時間より後か確認

  # スコープ定義（頻繁に使用されるクエリパターンをメソッド化）
  scope :for_date, ->(date) { where(work_date: date) }  # 指定日の稼働時間を抽出
  scope :for_date_range, ->(start_date, end_date) { where(work_date: start_date..end_date) }  # 期間内の稼働時間を抽出

  # コールバック：開始時間と終了時間から稼働時間を自動計算
  before_validation :calculate_hours_worked, if: -> { start_time.present? && end_time.present? }

  private

  # 開始時間と終了時間から稼働時間を計算するメソッド
  def calculate_hours_worked
    # 秒単位での差分を計算し、時間に変換（3600秒 = 1時間）
    duration = (end_time.seconds_since_midnight - start_time.seconds_since_midnight) / 3600.0
    self.hours_worked = duration.round(2)  # 小数点以下2桁で丸める
  end

  # 終了時間が開始時間より後かを確認するバリデーションメソッド
  def end_time_after_start_time
    return if start_time.blank? || end_time.blank?

    if end_time <= start_time
      errors.add(:end_time, "must be after start time")  # エラーメッセージを追加
    end
  end
end