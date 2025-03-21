# ==============================================================================
# タスクモデル
# ==============================================================================
# 目的: タスク情報の管理
# 特徴:
# - ユーザー（担当者）、プロジェクトとの関連付け
# - 稼働時間との関連付け
# - 稼働時間の計算、ステータス管理
# ==============================================================================
class Task < ApplicationRecord
  # リレーションシップ定義
  belongs_to :user  # タスクは一人のユーザーに割り当てられる
  belongs_to :project  # タスクは一つのプロジェクトに属する
  has_many :work_hours, dependent: :destroy  # タスクは複数の稼働時間記録を持ち、削除時に稼働時間も削除

  # バリデーション設定
  validates :title, presence: true  # タスク名は必須
  validates :status, inclusion: { in: %w[pending in_progress on_hold completed cancelled] }  # ステータスは指定された値のみ許可
  validates :priority, inclusion: { in: %w[low medium high urgent] }  # 優先度は指定された値のみ許可

  # スコープ定義（頻繁に使用されるクエリパターンをメソッド化）
  scope :not_started, -> { where(status: 'not_started') }  # 未着手のタスクを抽出
  scope :in_progress, -> { where(status: 'in_progress') }  # 進行中のタスクを抽出
  scope :review, -> { where(status: 'review') }  # レビュー中のタスクを抽出
  scope :completed, -> { where(status: 'completed') }  # 完了済みのタスクを抽出
  scope :high_priority, -> { where(priority: ['high', 'urgent']) }  # 優先度が高いタスクを抽出

  # 実際の稼働時間を計算するメソッド
  # @return [Decimal] タスクの合計稼働時間
  def actual_hours_worked
    work_hours.sum(:hours_worked)
  end

  # 残りの稼働時間を計算するメソッド
  # @return [Decimal] 残りの見積もり時間
  def remaining_hours
    # 完了済みタスクは残り時間0
    return 0 if status == 'completed'
    # 実績がない場合は見積もり時間をそのまま返す
    return estimated_hours || 0 if actual_hours_worked == 0

    # 見積もり時間から実績を引いて残りを計算（負にならないようにする）
    remaining = (estimated_hours || 0) - actual_hours_worked
    [remaining, 0].max  # 0未満にならないよう調整
  end

  # 残りの見積もり時間に基づいて予想完了日を計算
  # @return [Date] 予想完了日
  def estimated_completion_date
    # タスクがすでに完了している場合は nil を返す
    return nil if status == 'completed'

    # 残りの見積もり時間を取得
    remaining = remaining_hours

    # 残り時間が0以下の場合は今日を返す
    return Date.today if remaining <= 0

    # 1日あたりの平均稼働時間を計算（過去7日間）
    recent_work_hours = user.work_hours.where(work_date: 7.days.ago..Date.today)
    daily_hours = recent_work_hours.any? ? recent_work_hours.sum(:hours_worked) / 7.0 : 4.0

    # 平均稼働時間が極端に小さい場合はデフォルト値を使用
    daily_hours = 4.0 if daily_hours < 1.0

    # 残り日数を計算（残り時間 / 1日の稼働時間）
    days_needed = (remaining / daily_hours).ceil

    # 予想完了日を計算（土日を考慮しない単純計算）
    return Date.today + days_needed.days
  end
end