# =========================================================================
# Taskテーブル作成マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration CreateTasks user:references project:references title:string description:text start_date:date due_date:date status:string priority:string estimated_hours:decimal
#
# 目的：
# タスク情報を保存するテーブルを作成する
# =========================================================================
class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      # user: 担当ユーザーへの外部キー（必須項目）
      t.references :user, null: false, foreign_key: true

      # project: 所属プロジェクトへの外部キー（必須項目）
      t.references :project, null: false, foreign_key: true

      # title: タスク名（必須項目）
      t.string :title, null: false

      # description: タスク詳細説明
      t.text :description

      # start_date: 開始日
      t.date :start_date

      # due_date: 期限日
      t.date :due_date

      # status: 進行状況（デフォルトは'not_started'）
      # 想定値: not_started(未着手), in_progress(進行中), review(レビュー), completed(完了)
      t.string :status, default: 'not_started'

      # priority: 優先度（デフォルトは'medium'）
      # 想定値: low, medium, high, urgent
      t.string :priority, default: 'medium'

      # estimated_hours: 見積もり時間（数値型、小数点以下2桁まで）
      # 最大3桁+小数点以下2桁まで（例: 999.99）
      t.decimal :estimated_hours, precision: 5, scale: 2

      # created_at, updated_at: 作成日時、更新日時を自動追加
      t.timestamps
    end

    # インデックスを追加してクエリのパフォーマンスを向上
    add_index :tasks, :status
    add_index :tasks, :priority
  end
end
