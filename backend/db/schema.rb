# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2025_03_22_095826) do
  create_schema "auth"
  create_schema "extensions"
  create_schema "graphql"
  create_schema "graphql_public"
  create_schema "pgbouncer"
  create_schema "pgsodium"
  create_schema "pgsodium_masks"
  create_schema "realtime"
  create_schema "storage"
  create_schema "vault"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_graphql"
  enable_extension "pg_stat_statements"
  enable_extension "pgcrypto"
  enable_extension "pgjwt"
  enable_extension "pgsodium"
  enable_extension "plpgsql"
  enable_extension "supabase_vault"
  enable_extension "uuid-ossp"

  create_table "clients", force: :cascade do |t|
    t.string "name", null: false
    t.string "contact_person"
    t.string "email"
    t.string "phone"
    t.text "address"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_clients_on_email"
    t.index ["name"], name: "index_clients_on_name"
  end

  create_table "invoice_items", force: :cascade do |t|
    t.bigint "monthly_payment_id", null: false
    t.text "description", null: false
    t.decimal "amount", precision: 10, scale: 2, null: false
    t.decimal "quantity", precision: 8, scale: 2, default: "1.0"
    t.decimal "unit_price", precision: 10, scale: 2, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monthly_payment_id"], name: "index_invoice_items_on_monthly_payment_id"
  end

  create_table "jwt_blacklists", force: :cascade do |t|
    t.string "jti"
    t.datetime "exp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["jti"], name: "index_jwt_blacklists_on_jti"
  end

  create_table "monthly_payments", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "client_id", null: false
    t.date "year_month", null: false
    t.decimal "total_amount", precision: 10, scale: 2, null: false
    t.string "currency", default: "JPY"
    t.date "payment_date"
    t.string "payment_status", default: "pending"
    t.string "payment_method"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_monthly_payments_on_client_id"
    t.index ["payment_status"], name: "index_monthly_payments_on_payment_status"
    t.index ["user_id"], name: "index_monthly_payments_on_user_id"
    t.index ["year_month"], name: "index_monthly_payments_on_year_month"
  end

  create_table "projects", force: :cascade do |t|
    t.bigint "client_id", null: false
    t.string "name", null: false
    t.text "description"
    t.date "start_date"
    t.date "end_date"
    t.string "status", default: "planning"
    t.decimal "budget", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_projects_on_client_id"
    t.index ["name"], name: "index_projects_on_name"
    t.index ["status"], name: "index_projects_on_status"
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "project_id", null: false
    t.string "title", null: false
    t.text "description"
    t.date "start_date"
    t.date "due_date"
    t.string "status", default: "not_started"
    t.string "priority", default: "medium"
    t.decimal "estimated_hours", precision: 5, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["priority"], name: "index_tasks_on_priority"
    t.index ["project_id"], name: "index_tasks_on_project_id"
    t.index ["status"], name: "index_tasks_on_status"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "jti", null: false
    t.decimal "hourly_rate", precision: 10, scale: 2
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "work_hours", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "task_id"
    t.date "work_date", null: false
    t.time "start_time", null: false
    t.time "end_time"
    t.decimal "hours_worked", precision: 5, scale: 2, null: false
    t.text "activity_description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_work_hours_on_task_id"
    t.index ["user_id"], name: "index_work_hours_on_user_id"
    t.index ["work_date"], name: "index_work_hours_on_work_date"
  end

  add_foreign_key "invoice_items", "monthly_payments"
  add_foreign_key "monthly_payments", "clients"
  add_foreign_key "monthly_payments", "users"
  add_foreign_key "projects", "clients"
  add_foreign_key "tasks", "projects"
  add_foreign_key "tasks", "users"
  add_foreign_key "work_hours", "tasks"
  add_foreign_key "work_hours", "users"
end
