# =========================================================================
# Clientテーブル作成マイグレーション
# =========================================================================
# マイグレーションコマンド：
# rails g migration CreateClients name:string contact_person:string email:string phone:string address:text notes:text
#
# 目的：
# クライアント（企業）情報を保存するテーブルを作成する
# =========================================================================
class CreateClients < ActiveRecord::Migration[7.1]
  def change
    create_table :clients do |t|
      # name: クライアント名/企業名（必須項目）
      t.string :name, null: false

      # contact_person: 担当者名
      t.string :contact_person

      # email: 連絡先メールアドレス
      t.string :email

      # phone: 電話番号
      t.string :phone

      # address: 住所
      t.text :address

      # notes: 備考・特記事項
      t.text :notes

      # created_at, updated_at: 作成日時、更新日時を自動追加
      t.timestamps
    end

    # インデックスを追加してクエリのパフォーマンスを向上
    add_index :clients, :name
    add_index :clients, :email
  end
end
