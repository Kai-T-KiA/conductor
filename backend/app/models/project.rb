# ==============================================================================
# プロジェクトモデル
# ==============================================================================
# 目的: プロジェクト情報の管理
# 特徴:
# - クライアントとの関連付け
# - タスクとの関連付け
# - プロジェクト進捗や稼働時間集計機能
# ==============================================================================
class Project < ApplicationRecord
  # リレーションシップ定義
  belongs_to :client  # プロジェクトは一つのクライアントに属する
  has_many :tasks, dependent: :destroy  # プロジェクトは複数のタスクを持ち、削除時にタスクも削除

  # バリデーション設定
  validates :name, presence: true  # プロジェクト名は必須
  validates :status, inclusion: { in: %w[planning active completed on_hold cancelled] }  # ステータスは指定された値のみ許可

  # スコープ定義（頻繁に使用されるクエリパターンをメソッド化）
  scope :active, -> { where(status: 'active') }  # 進行中のプロジェクトを抽出
  scope :completed, -> { where(status: 'completed') }  # 完了済みのプロジェクトを抽出

  # プロジェクトの進捗率を計算するメソッド
  # @return [Float] 完了タスクの割合（%）
  def progress_percentage
    return 0 if tasks.empty?  # タスクがない場合は0%

    # 完了したタスク数 ÷ 全タスク数 × 100 で進捗率を計算
    completed_tasks = tasks.where(status: 'completed').count
    (completed_tasks.to_f / tasks.count * 100).round(2)
  end

  # プロジェクトの総稼働時間を計算するメソッド
  # @return [Decimal] プロジェクト全体の合計稼働時間
  def total_hours_worked
    # タスクに関連する全ての稼働時間を合計
    tasks.joins(:work_hours).sum('work_hours.hours_worked')
  end
end