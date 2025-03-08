# =========================================================================
# WorkHourテーブル作成マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration CreateWorkHours user:references task:references work_date:date start_time:time end_time:time hours_worked:decimal activity_description:text
#
# 目的：
# 稼働時間情報を保存するテーブルを作成する
# =========================================================================
class CreateWorkHours < ActiveRecord::Migration[7.1]
  def change
    create_table :work_hours do |t|
      # user: 稼働ユーザーへの外部キー（必須項目）
      t.references :user, null: false, foreign_key: true

      # task: 関連タスクへの外部キー（必須項目）
      t.references :task, null: false, foreign_key: true

      # work_date: 稼働日（必須項目）
      t.date :work_date, null: false

      # start_time: 開始時間（必須項目）
      t.time :start_time, null: false

      # end_time: 終了時間（必須項目）
      t.time :end_time, null: false

      # hours_worked: 稼働時間数（数値型、小数点以下2桁まで）（必須項目）
      # 最大3桁+小数点以下2桁まで（例: 999.99）
      t.decimal :hours_worked, precision: 5, scale: 2, null: false

      # activity_description: 作業内容詳細
      t.text :activity_description

      # created_at, updated_at: 作成日時、更新日時を自動追加
      t.timestamps
    end

    # インデックスを追加して日付による検索を高速化
    add_index :work_hours, :work_date
  end
end
