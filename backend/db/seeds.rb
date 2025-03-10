# ==============================================================================
# シードデータ作成ファイル
# ==============================================================================
# 目的: 開発環境およびテスト環境用のサンプルデータを作成する
# 主な機能:
# - ユーザー、クライアント、プロジェクト、タスク、稼働時間、支払い情報のサンプルデータ作成
# - 現実的なシナリオに沿ったテストデータ
# - devise JWT認証を考慮したユーザー作成
# ==============================================================================

# ==============================================================================
# データベースのクリーンアップ
# ==============================================================================
puts "Cleaning database..."
# 外部キー制約があるため、削除順序に注意
InvoiceItem.destroy_all
MonthlyPayment.destroy_all
WorkHour.destroy_all
Task.destroy_all
Project.destroy_all
Client.destroy_all
# User.destroy_all - deviseユーザーは残しておくかもしれないので、必要に応じてコメント解除

# ==============================================================================
# テストユーザーの作成
# ==============================================================================
puts "Creating test users..."
# ユーザー1: テスト太郎 - 時給3,000円のフリーランサー
user1 = User.find_or_create_by(email: "test@example.com") do |user|
  user.name = "テスト太郎"
  user.password = "password"  # 開発環境用の簡易パスワード
  user.password_confirmation = "password"
  user.hourly_rate = 3000  # 時給3,000円
end

# ユーザー2: 山田花子 - 時給5,000円のフリーランサー
user2 = User.find_or_create_by(email: "yamada@example.com") do |user|
  user.name = "山田花子"
  user.password = "password"  # 開発環境用の簡易パスワード
  user.password_confirmation = "password"
  user.hourly_rate = 5000  # 時給5,000円
end

puts "Created #{User.count} users"

# ==============================================================================
# クライアント（企業）データの作成
# ==============================================================================
puts "Creating clients..."
clients = [
  {
    name: "株式会社テックイノベーション",
    contact_person: "佐藤雄一",
    email: "sato@tech-innovation.co.jp",
    phone: "03-1234-5678",
    address: "東京都渋谷区代々木1-1-1",
    notes: "大手IT企業。月末請求で翌月末払い。"
  },
  {
    name: "グローバルウェブ株式会社",
    contact_person: "田中誠",
    email: "tanaka@globalweb.com",
    phone: "03-8765-4321",
    address: "東京都新宿区新宿3-3-3",
    notes: "外資系企業。英語でのコミュニケーションが必要。"
  },
  {
    name: "スタートアップネクスト",
    contact_person: "鈴木みどり",
    email: "suzuki@startup-next.jp",
    phone: "03-2468-1357",
    address: "東京都目黒区中目黒2-2-2",
    notes: "スタートアップ企業。スピード重視。"
  }
]

# find_or_create_byを使って重複作成を防止
created_clients = clients.map do |client_attrs|
  Client.find_or_create_by(name: client_attrs[:name]) do |client|
    client.attributes = client_attrs
  end
end

puts "Created #{Client.count} clients"

# ==============================================================================
# プロジェクトデータの作成
# ==============================================================================
puts "Creating projects..."
projects = [
  {
    client: created_clients[0],  # 株式会社テックイノベーション
    name: "ECサイトリニューアル",
    description: "既存ECサイトのUI/UX改善とバックエンド最適化",
    start_date: Date.today - 2.months,
    end_date: Date.today + 1.month,
    status: "active",
    budget: 2000000  # 予算200万円
  },
  {
    client: created_clients[0],  # 株式会社テックイノベーション
    name: "管理画面開発",
    description: "ECサイト管理者向けダッシュボード開発",
    start_date: Date.today - 1.month,
    end_date: Date.today + 2.months,
    status: "active",
    budget: 1000000  # 予算100万円
  },
  {
    client: created_clients[1],  # グローバルウェブ株式会社
    name: "モバイルアプリ開発",
    description: "iOS/Androidクロスプラットフォームアプリ開発",
    start_date: Date.today - 3.months,
    end_date: Date.today,
    status: "completed",
    budget: 3000000  # 予算300万円
  },
  {
    client: created_clients[2],  # スタートアップネクスト
    name: "プロトタイプ開発",
    description: "新サービスのプロトタイプ開発",
    start_date: Date.today - 15.days,
    end_date: Date.today + 15.days,
    status: "active",
    budget: 500000  # 予算50万円
  }
]

# find_or_create_byを使って重複作成を防止
created_projects = projects.map do |project_attrs|
  Project.find_or_create_by(
    client: project_attrs[:client],
    name: project_attrs[:name]
  ) do |project|
    project.attributes = project_attrs
  end
end

puts "Created #{Project.count} projects"

# ==============================================================================
# タスクデータの作成
# ==============================================================================
puts "Creating tasks..."
tasks = [
  # ECサイトリニューアル プロジェクトのタスク
  {
    user: user1,  # テスト太郎
    project: created_projects[0],  # ECサイトリニューアル
    title: "要件定義ドキュメント作成",
    description: "クライアントのニーズをヒアリングし、要件定義書を作成",
    start_date: Date.today - 2.months,
    due_date: Date.today - 1.month - 20.days,
    status: "completed",  # 完了済み
    priority: "high",  # 優先度高
    estimated_hours: 20  # 見積もり20時間
  },
  {
    user: user1,  # テスト太郎
    project: created_projects[0],  # ECサイトリニューアル
    title: "UI/UXデザイン",
    description: "新しいUIデザインの作成とユーザーテスト",
    start_date: Date.today - 1.month - 25.days,
    due_date: Date.today - 1.month,
    status: "completed",  # 完了済み
    priority: "high",  # 優先度高
    estimated_hours: 40  # 見積もり40時間
  },
  {
    user: user1,  # テスト太郎
    project: created_projects[0],  # ECサイトリニューアル
    title: "フロントエンド実装",
    description: "React/Next.jsを使ったフロントエンド実装",
    start_date: Date.today - 1.month,
    due_date: Date.today,
    status: "in_progress",  # 進行中
    priority: "high",  # 優先度高
    estimated_hours: 80  # 見積もり80時間
  },
  {
    user: user2,  # 山田花子
    project: created_projects[0],  # ECサイトリニューアル
    title: "バックエンド最適化",
    description: "APIのパフォーマンス改善とデータベース最適化",
    start_date: Date.today - 15.days,
    due_date: Date.today + 15.days,
    status: "in_progress",  # 進行中
    priority: "medium",  # 優先度中
    estimated_hours: 60  # 見積もり60時間
  },

  # 管理画面開発 プロジェクトのタスク
  {
    user: user1,  # テスト太郎
    project: created_projects[1],  # 管理画面開発
    title: "ダッシュボードUI設計",
    description: "管理画面のUIデザインとワイヤーフレーム作成",
    start_date: Date.today - 1.month,
    due_date: Date.today - 15.days,
    status: "completed",  # 完了済み
    priority: "medium",  # 優先度中
    estimated_hours: 30  # 見積もり30時間
  },
  {
    user: user2,  # 山田花子
    project: created_projects[1],  # 管理画面開発
    title: "データ分析機能実装",
    description: "売上・ユーザー分析機能の実装",
    start_date: Date.today - 20.days,
    due_date: Date.today + 10.days,
    status: "in_progress",  # 進行中
    priority: "high",  # 優先度高
    estimated_hours: 50  # 見積もり50時間
  },

  # モバイルアプリ開発 プロジェクトのタスク
  {
    user: user1,  # テスト太郎
    project: created_projects[2],  # モバイルアプリ開発
    title: "Flutter環境セットアップ",
    description: "開発環境のセットアップとCI/CD構築",
    start_date: Date.today - 3.months,
    due_date: Date.today - 2.months - 15.days,
    status: "completed",  # 完了済み
    priority: "high",  # 優先度高
    estimated_hours: 15  # 見積もり15時間
  },
  {
    user: user1,  # テスト太郎
    project: created_projects[2],  # モバイルアプリ開発
    title: "認証機能実装",
    description: "ログイン・会員登録機能の実装",
    start_date: Date.today - 2.months - 15.days,
    due_date: Date.today - 2.months,
    status: "completed",  # 完了済み
    priority: "high",  # 優先度高
    estimated_hours: 25  # 見積もり25時間
  },
  {
    user: user2,  # 山田花子
    project: created_projects[2],  # モバイルアプリ開発
    title: "コアコンポーネント開発",
    description: "共通コンポーネントの設計と実装",
    start_date: Date.today - 2.months,
    due_date: Date.today - 1.month,
    status: "completed",  # 完了済み
    priority: "high",  # 優先度高
    estimated_hours: 40  # 見積もり40時間
  },
  {
    user: user2,  # 山田花子
    project: created_projects[2],  # モバイルアプリ開発
    title: "APIとの連携機能",
    description: "バックエンドAPIとの連携機能実装",
    start_date: Date.today - 1.month - 15.days,
    due_date: Date.today - 15.days,
    status: "completed",  # 完了済み
    priority: "medium",  # 優先度中
    estimated_hours: 35  # 見積もり35時間
  },

  # プロトタイプ開発 プロジェクトのタスク
  {
    user: user1,  # テスト太郎
    project: created_projects[3],  # プロトタイプ開発
    title: "MVPの設計",
    description: "最小限の機能で実現可能な製品の設計",
    start_date: Date.today - 15.days,
    due_date: Date.today - 5.days,
    status: "completed",  # 完了済み
    priority: "urgent",  # 優先度最高
    estimated_hours: 15  # 見積もり15時間
  },
  {
    user: user1,  # テスト太郎
    project: created_projects[3],  # プロトタイプ開発
    title: "プロトタイプ実装",
    description: "デモ可能なプロトタイプの開発",
    start_date: Date.today - 5.days,
    due_date: Date.today + 10.days,
    status: "in_progress",  # 進行中
    priority: "urgent",  # 優先度最高
    estimated_hours: 30  # 見積もり30時間
  }
]

# find_or_create_byを使って重複作成を防止
created_tasks = tasks.map do |task_attrs|
  Task.find_or_create_by(
    user: task_attrs[:user],
    project: task_attrs[:project],
    title: task_attrs[:title]
  ) do |task|
    task.attributes = task_attrs
  end
end

puts "Created #{Task.count} tasks"

# ==============================================================================
# 稼働時間データの作成
# ==============================================================================
puts "Creating work hours..."

# 直近3ヶ月の稼働日（平日）を生成する関数
# @param start_offset [Integer] 何日前から開始するか
# @param count [Integer] 生成する日数
# @return [Array<Date>] 生成された稼働日の配列
def generate_work_dates(start_offset, count)
  dates = []
  current_date = Date.today - start_offset

  count.times do |i|
    # 土日はスキップ（平日のみ稼働）
    while current_date.saturday? || current_date.sunday?
      current_date += 1.day
    end

    dates << current_date
    current_date += 1.day
  end

  dates
end

# テスト太郎の稼働時間データ
taro_dates = generate_work_dates(90.days, 60)  # 過去90日から60日分の稼働日
taro_work_hours = []

taro_dates.each do |date|
  # 過去の日付は完了タスクの稼働時間を記録
  if date < Date.today - 30.days
    # その日付の範囲内（開始日〜期限日）にある完了タスクを検索
    task = created_tasks.find { |t| t.user == user1 && t.status == "completed" && t.start_date <= date && t.due_date >= date }

    if task
      taro_work_hours << {
        user: user1,
        task: task,
        work_date: date,
        start_time: "09:00",  # 開始時間
        end_time: "18:00",    # 終了時間
        hours_worked: 8,      # 稼働時間
        activity_description: "#{task.title}の作業"
      }
    end
  else
    # 最近の日付は進行中タスクの稼働時間を記録
    task = created_tasks.find { |t| t.user == user1 && t.status == "in_progress" && t.start_date <= date && t.due_date >= date }

    if task
      taro_work_hours << {
        user: user1,
        task: task,
        work_date: date,
        start_time: "09:30",  # 開始時間
        end_time: "18:30",    # 終了時間
        hours_worked: 8,      # 稼働時間
        activity_description: "#{task.title}の作業を進めた"
      }
    end
  end
end

# 山田花子の稼働時間データ
hanako_dates = generate_work_dates(90.days, 55)  # 過去90日から55日分の稼働日
hanako_work_hours = []

hanako_dates.each do |date|
  # 過去の日付は完了タスクの稼働時間を記録
  if date < Date.today - 20.days
    task = created_tasks.find { |t| t.user == user2 && t.status == "completed" && t.start_date <= date && t.due_date >= date }

    if task
      hanako_work_hours << {
        user: user2,
        task: task,
        work_date: date,
        start_time: "10:00",  # 開始時間
        end_time: "19:00",    # 終了時間
        hours_worked: 8,      # 稼働時間
        activity_description: "#{task.title}の実装"
      }
    end
  else
    # 最近の日付は進行中タスクの稼働時間を記録
    task = created_tasks.find { |t| t.user == user2 && t.status == "in_progress" && t.start_date <= date && t.due_date >= date }

    if task
      hanako_work_hours << {
        user: user2,
        task: task,
        work_date: date,
        start_time: "09:00",  # 開始時間
        end_time: "17:00",    # 終了時間
        hours_worked: 7,      # 稼働時間
        activity_description: "#{task.title}の実装作業"
      }
    end
  end
end

# 稼働時間データベースへの登録
work_hour_records = taro_work_hours + hanako_work_hours
work_hour_records.each do |wh_attrs|
  WorkHour.find_or_create_by(
    user: wh_attrs[:user],
    task: wh_attrs[:task],
    work_date: wh_attrs[:work_date]
  ) do |wh|
    wh.attributes = wh_attrs
  end
end

puts "Created #{WorkHour.count} work hour records"

# ==============================================================================
# 月次支払いデータの作成
# ==============================================================================
puts "Creating monthly payments..."

# 過去3ヶ月分の支払いデータを作成
3.downto(1) do |months_ago|
  date = Date.today.beginning_of_month - months_ago.months

  # テスト太郎の支払いデータ
  taro_hours = user1.monthly_hours_worked(date.year, date.month)
  if taro_hours > 0
    # クライアントごとの稼働時間を集計
    client_hours = {}

    user1.work_hours
      .where(work_date: date.beginning_of_month..date.end_of_month)
      .includes(task: :project).each do |wh|
        client_id = wh.task.project.client_id
        client_hours[client_id] ||= 0
        client_hours[client_id] += wh.hours_worked
    end

    # クライアントごとの支払いデータを作成
    client_hours.each do |client_id, hours|
      client = Client.find(client_id)
      amount = (hours * user1.hourly_rate).round  # 稼働時間 × 時給 = 支払い金額

      # 支払い状況（過去月は支払い済み、直近月は未払い）
      payment_status = months_ago == 1 ? "pending" : "paid"
      # 支払い日（過去月のみ）
      payment_date = months_ago == 1 ? nil : (date + 1.month + 15.days)

      monthly_payment = MonthlyPayment.find_or_create_by(
        user: user1,
        client: client,
        year_month: date
      ) do |mp|
        mp.total_amount = amount
        mp.currency = "JPY"
        mp.payment_status = payment_status
        mp.payment_date = payment_date
        mp.payment_method = "bank_transfer"  # 銀行振込
      end

      # 請求明細の作成
      if monthly_payment.invoice_items.empty?
        InvoiceItem.create!(
          monthly_payment: monthly_payment,
          description: "#{date.strftime('%Y年%m月')}の#{client.name}プロジェクト稼働分",
          quantity: hours,
          unit_price: user1.hourly_rate,
          amount: amount
        )
      end
    end
  end

  # 山田花子の支払いデータ
  hanako_hours = user2.monthly_hours_worked(date.year, date.month)
  if hanako_hours > 0
    # クライアントごとの稼働時間を集計
    client_hours = {}

    user2.work_hours
      .where(work_date: date.beginning_of_month..date.end_of_month)
      .includes(task: :project).each do |wh|
        client_id = wh.task.project.client_id
        client_hours[client_id] ||= 0
        client_hours[client_id] += wh.hours_worked
    end

    # クライアントごとの支払いデータを作成
    client_hours.each do |client_id, hours|
      client = Client.find(client_id)
      amount = (hours * user2.hourly_rate).round  # 稼働時間 × 時給 = 支払い金額

      # 支払い状況（過去月は支払い済み、直近月は未払い）
      payment_status = months_ago == 1 ? "pending" : "paid"
      # 支払い日（過去月のみ）
      payment_date = months_ago == 1 ? nil : (date + 1.month + 20.days)

      monthly_payment = MonthlyPayment.find_or_create_by(
        user: user2,
        client: client,
        year_month: date
      ) do |mp|
        mp.total_amount = amount
        mp.currency = "JPY"
        mp.payment_status = payment_status
        mp.payment_date = payment_date
        mp.payment_method = "bank_transfer"  # 銀行振込
      end

      # 請求明細の作成
      if monthly_payment.invoice_items.empty?
        InvoiceItem.create!(
          monthly_payment: monthly_payment,
          description: "#{date.strftime('%Y年%m月')}の#{client.name}プロジェクト稼働分",
          quantity: hours,
          unit_price: user2.hourly_rate,
          amount: amount
        )
      end
    end
  end
end

puts "Created #{MonthlyPayment.count} monthly payments with #{InvoiceItem.count} invoice items"

# ==============================================================================
# 投入完了メッセージ
# ==============================================================================
puts "Seed data creation completed successfully!"
puts "Summary:"
puts "- Users: #{User.count}"
puts "- Clients: #{Client.count}"
puts "- Projects: #{Project.count}"
puts "- Tasks: #{Task.count}"
puts "- Work Hours: #{WorkHour.count}"
puts "- Monthly Payments: #{MonthlyPayment.count}"
puts "- Invoice Items: #{InvoiceItem.count}"