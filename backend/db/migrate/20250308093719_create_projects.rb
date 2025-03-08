# =========================================================================
# Projectテーブル作成マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration CreateProjects client:references name:string description:text start_date:date end_date:date status:string budget:decimal
#
# 目的：
# プロジェクト情報を保存するテーブルを作成する
# =========================================================================
class CreateProjects < ActiveRecord::Migration[7.1]
  def change
    create_table :projects do |t|
      # client: クライアントへの外部キー（必須項目）
      # foreign_key: true で外部キー制約を設定
      t.references :client, null: false, foreign_key: true

      # name: プロジェクト名（必須項目）
      t.string :name, null: false

      # description: プロジェクト説明
      t.text :description

      # start_date: 開始日
      t.date :start_date

      # end_date: 終了予定日
      t.date :end_date

      # status: 進行状況（デフォルトは'planning'）
      # 想定値: planning, active, completed, on_hold, cancelled
      t.string :status, default: 'planning'

      # budget: 予算額（数値型、小数点以下2桁まで）
      t.decimal :budget, precision: 10, scale: 2

      # created_at, updated_at: 作成日時、更新日時を自動追加
      t.timestamps
    end

    # インデックスを追加してクエリのパフォーマンスを向上
    add_index :projects, :name
    add_index :projects, :status
  end
end
