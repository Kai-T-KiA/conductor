module Api
  module V1
    class DashboardController < BaseController
      # BaseControllerのデフォルト設定を上書き
      before_action :authenticate_user!

      # デバッグ用のエラーハンドリングを追加
      rescue_from StandardError, with: :handle_standard_error

      # GET /api/v1/dashboard
      # ユーザー種別に応じたダッシュボードデータを取得
      def index
        # デバッグ情報をログに出力
        Rails.logger.info "DashboardController#index called"
        Rails.logger.info "Current user: #{current_user.id}"
        Rails.logger.info "User role: #{current_user.role}"
        Rails.logger.info "Is admin? #{current_user.respond_to?(:admin?) ? current_user.admin? : 'method not defined'}"

        # ユーザーの種別（管理者か一般ユーザーか）によって表示データを分ける
        if current_user.admin?
          # 管理者向けダッシュボードデータ
          dashboard_data = admin_dashboard
        else
          # 一般ユーザー向けダッシュボードデータ
          dashboard_data = user_dashboard
        end

        # ダッシュボードデータをJSON形式で返す
        render json: dashboard_data, status: :ok
      end

      private

      # エラーハンドリング用のメソッド
      def handle_standard_error(exception)
        Rails.logger.error "DashboardController Error: #{exception.class.name}: #{exception.message}"
        Rails.logger.error exception.backtrace.join("\n")

        render json: {
          error: "Dashboard data fetching failed",
          details: exception.message,
          type: exception.class.name
        }, status: :internal_server_error
      end

      # 一般ユーザー向けダッシュボードデータを生成
      def user_dashboard
        # 現在日時
        today = Date.today

        # ユーザー基本情報
        user_info = {
          id: current_user.id,
          name: current_user.name,
          email: current_user.email,
          hourly_rate: current_user.hourly_rate
        }

        # 今月の稼働時間データ取得
        # work_date: はデータベースのカラム
        # current_month_work_hoursはActive Recordオブジェクト
        current_month_work_hours = current_user.work_hours
                                      .where(work_date: today.beginning_of_month..today)
                                      .order(work_date: :asc)

        # 日別の稼働時間集計
        daily_hours = current_month_work_hours.group(:work_date)
                                        .sum(:hours_worked)
                                        .transform_keys { |k| k.strftime('%Y-%m-%d') }

        # 月初から今日までの稼働時間合計
        current_month_total_hours = current_user.work_hours
                                          .where(work_date: today.beginning_of_month..today)
                                          .sum(:hours_worked)

        # 前月の稼働時間合計（同日まで）
        last_month_date = today.prev_month
        last_month_total_hours = current_user.work_hours
                                      .where(work_date: last_month_date.beginning_of_month..last_month_date.change(day: [today.day, last_month_date.end_of_month.day].min))
                                      .sum(:hours_worked)

        # 月間の稼働時間変化率
        month_change_percentage = last_month_total_hours > 0 ?
                                 ((current_month_total_hours - last_month_total_hours) / last_month_total_hours.to_f * 100).round(2) :
                                  nil

        # 稼働時間データ
        working_hours_data = {
          daily_hours: daily_hours,
          current_month_total: current_month_total_hours,
          last_month_total: last_month_total_hours,
          month_change_percentage: month_change_percentage
        }

        # タスク情報の取得
        # 未完了タスク（期限が近い順）
        upcoming_tasks = current_user.tasks
                                    .where.not(status: 'completed')
                                    .order(due_date: :asc)
                                    .limit(5)
                                    .as_json(only: [:id, :title, :due_date, :status, :priority])

        # タスクのステータス別集計
        task_status_counts = current_user.tasks.group(:status).count

        # タスクデータ
        tasks_data = {
          upcoming: upcoming_tasks,
          status_counts: task_status_counts,
          total_count: current_user.tasks.count,
          completed_count: task_status_counts['completed'] || 0
        }

        # 週間予定のタスク（現在の週のタスク）
        start_of_week = today.beginning_of_week
        end_of_week = today.end_of_week
        weekly_tasks = current_user.tasks
                                  .where('due_date BETWEEN ? AND ?', start_of_week, end_of_week)
                                  .order(due_date: :asc)
                                  .as_json(only: [:id, :title, :due_date, :status, :priority])

        # ホーム画面用のカレンダーデータ（当月の稼働日と時間）
        start_of_month = today.beginning_of_month
        end_of_month = today.end_of_month
        calendar_data = current_user.work_hours
                                    .where(work_date: start_of_month..end_of_month)
                                    .group(:work_date)
                                    .sum(:hours_worked)
                                    .transform_keys { |k| k.strftime('%Y-%m-%d') }
        # 統合ダッシュボードデータ
        {
          user: user_info,
          working_hours: working_hours_data,
          tasks: tasks_data,
          weekly_tasks: weekly_tasks,
          calendar_data: calendar_data,
          last_updated: Time.now
        }
      end

      # 管理者向けダッシュボードデータを生成
      def admin_dashboard
        # 現在日時
        today = Date.today

        # ユーザー統計
        user_stats = {
          total_count: User.count,
          active_count: User.joins(:work_hours)
                            .where(work_hours: { work_date: 30.days.ago..today })
                            .distinct.count
        }

        # プロジェクト統計
        project_stats = {
          total_count: Project.count,
          active_count: Project.where(status: 'active').count,
          completed_count: Project.where(status: 'completed').count,
          delayed_count: Project.where("end_date < ? AND status != 'completed'", today).count
        }

        # タスク統計
        task_stats = {
          total_count: Task.count,
          status_counts: Task.group(:status).count,
          overdue_count: Task.where("due_date < ? AND status != 'completed'", today).count
        }

        # 稼働時間統計
        current_month_hours = WorkHour.where(work_date: today.beginning_of_month..today).sum(:hours_worked)
        last_month_date = today.prev_month
        last_month_hours = WorkHour.where(
          work_date: last_month_date.beginning_of_month..last_month_date.change(day: [today.day, last_month_date.end_of_month.day].min)
        ).sum(:hours_worked)

        work_hour_stats = {
          current_month_total: current_month_hours,
          last_month_total: last_month_hours,
          month_change_percentage: last_month_hours > 0 ?
                                  ((current_month_hours - last_month_hours) / last_month_hours.to_f * 100).round(2) :
                                  nil
        }

        # 月次支払い統計
        current_month_amount = MonthlyPayment.where(
          "EXTRACT(YEAR FROM year_month) = ? AND EXTRACT(MONTH FROM year_month) = ?",
          today.year, today.month
        ).sum(:total_amount)

        last_month_amount = MonthlyPayment.where(
          "EXTRACT(YEAR FROM year_month) = ? AND EXTRACT(MONTH FROM year_month) = ?",
          last_month_date.year, last_month_date.month
        ).sum(:total_amount)

        payment_stats = {
          current_month_total: current_month_amount,
          last_month_total: last_month_amount,
          month_change_percentage: last_month_amount > 0 ?
                                  ((current_month_amount - last_month_amount) / last_month_amount.to_f * 100).round(2) :
                                  nil,
          pending_amount: MonthlyPayment.where(payment_status: 'pending').sum(:total_amount)
        }

        # 最近の活動
        # 最近追加されたタスク
        recent_tasks = Task.order(created_at: :desc).limit(5).as_json(
          only: [:id, :title, :status, :created_at],
          include: {
            user: { only: [:id, :name] },
            project: { only: [:id, :name] }
          }
        )

        # 最近の稼働時間記録
        recent_work_hours = WorkHour.includes(:user, :task)
                                    .order(created_at: :desc)
                                    .limit(5)
                                    .as_json(
                                      only: [:id, :work_date, :hours_worked, :created_at],
                                      include: {
                                        user: { only: [:id, :name] },
                                        task: { only: [:id, :title] }
                                      }
                                    )


        # 統合ダッシュボードデータ
        {
          users: user_stats,
          projects: project_stats,
          tasks: task_stats,
          working_hours: work_hour_stats,
          payments: payment_stats,
          recent_activity: {
            tasks: recent_tasks,
            work_hours: recent_work_hours,
          },
          attention_required: {
            delayed_projects: Project.where("end_date < ? AND status != 'completed'", today)
                                    .limit(5)
                                    .as_json(only: [:id, :name, :end_date, :status])
          },
          last_updated: Time.now
        }
      end

    end
  end
end