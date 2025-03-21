module Api
  module V1
    class TasksController < BaseController
      # 特定のタスクを操作するアクションの前に、そのタスクを取得
      before_action :set_task, only: [:show, :update, :destroy]

      # GET /api/v1/tasks
      # タスク一覧を取得
      def index
        # 管理者と一般ユーザーで取得するタスクを分ける
        if current_user.admin?
          # 管理者：全てのタスクを取得（N+1問題を防ぐためincludes使用）
          @tasks = Task.includes(:user, :project).all

          # クエリパラメータによるフィルタリング
          @tasks = @tasks.where(status: params[:status]) if params[:status].present?
          @tasks = @tasks.where(priority: params[:priority]) if params[:priority].present?
          @tasks = @tasks.where(user_id: params[:user_id]) if params[:user_id].present?
          @tasks = @tasks.where(project_id: params[:project_id]) if params[:project_id].present?
        else
          # 一般ユーザー：自分のタスクのみ取得
          @tasks = current_user.tasks.includes(:project)

          # クエリパラメータによるフィルタリング
          @tasks = @tasks.where(status: params[:status]) if params[:status].present?
          @tasks = @tasks.where(priority: params[:priority]) if params[:priority].present?
          @tasks = @tasks.where(project_id: params[:project_id]) if params[:project_id].present?

          # 期日によるフィルタリング（今週、今月など）
          case params[:period]
          when 'week'
            @tasks = @tasks.where(due_date: Date.today.beginning_of_week..Date.today.end_of_week)
          when 'month'
            @tasks = @tasks.where(due_date: Date.today.beginning_of_month..Date.today.end_of_month)
          when 'overdue'
            @tasks = @tasks.where('due_date < ? AND status != ?', Date.today, 'completed')
          end

          # 特定の日付範囲のタスクのみを取得
          if params[:start_date].present? && params[:end_date].present?
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            @tasks = @tasks.where(due_date: start_date..end_date)
          end
        end

        # タスク一覧をJSON形式で返す
        render json: @tasks, status: :ok
      end

      # 特定のタスク詳細を取得
      def show
        # 自分のタスクまたは管理者の場合のみ閲覧可能とする権限チェック
        if @task.user_id == current_user.id || current_user.admin?
          # タスク情報に加えて、関連する稼働時間情報も含める
          render json: @task.as_json(
            include: {
              work_hours: { only: [:id, :work_date, :hours_worked, :activity_description] }
            }
          ), status: :ok
        else
          # 権限がない場合はエラーを返す
          render json: {
            error: '権限がありません',
            details: 'このタスク情報の閲覧には適切な権限が必要です'
          }, status: :forbidden
        end
      end

      # POST /api/v1/tasks
      # 新規タスクを作成
      def create
        # パラメータからタスクオブジェクトを生成
        @task = Task.new(task_params)

        # 一般ユーザーの場合、自分のIDを自動設定（管理者でない場合のみ）
        @task.user_id = current_user.id unless current_user.admin? || task_params[:user_id].present?

        # タスクの保存を試みる
        if @task.save
          # 成功時：作成されたタスク情報を返す（201 Created）
          render json: @task, status: :created
        else
          # 失敗時：エラーメッセージを返す
          render json: {
            error: 'タスクの作成に失敗しました',
            details: @task.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/tasks/:id
      # タスク情報を更新
      def update
        # 自分のタスクまたは管理者の場合のみ更新可能とする権限チェック
        if @task.user_id == current_user.id || current_user.admin?
          # 一般ユーザーが別ユーザーにタスクを割り当てることを防止
          if !current_user.admin? && task_params[:user_id].present? && task_params[:user_id] != current_user.id.to_s
            return render json: {
              error: '不正な操作です',
              details: '他のユーザーにタスクを割り当てることはできません'
            }, status: :forbidden
          end

          # タスク情報の更新を試みる
          if @task.update(task_params)
            # 成功時：更新後のタスク情報を返す
            render json: @task, status: :ok
          else
            # 失敗時：エラーメッセージを返す
            render json: {
              error: 'タスク情報の更新に失敗しました',
              details: @task.errors.full_messages
            }, status: :unprocessable_entity
          end
        else
          # 権限がない場合はエラーを返す
          render json: {
            error: '権限がありません',
            details: 'このタスク情報の更新には適切な権限が必要です'
          }, status: :forbidden
        end
      end

      # DELETE /api/v1/tasks/:id
      # タスクを削除
      def destroy
        # 管理者のみタスク削除可能（データの整合性確保のため）
        if current_user.admin?
          # タスクを削除
          @task.destroy
          # 削除成功時は204 No Contentを返す
          head :no_content
        else
          # 権限がない場合はエラーを返す
          render json: {
            error: 'タスクの削除には管理者権限が必要です',
            details: 'システム全体の整合性を保つため、タスクの削除は管理者のみ実行できます'
          }, status: :forbidden
        end
      end

      # GET /api/v1/tasks/calendar
      # カレンダー表示用のタスクデータを取得
      def calendar
        # 年月の指定が必要
        year = params[:year].to_i
        month = params[:month].to_i

        # 指定された年月の範囲を取得
        start_date = Date.new(year, month, 1)
        end_date = start_date.end_of_month

        # ユーザーのタスクを取得
        tasks = current_user.tasks
                          .where('due_date BETWEEN ? AND ? OR start_date BETWEEN ? AND ?', 
                                start_date, end_date, start_date, end_date)
                          .order(due_date: :asc)

        # カレンダー表示用にデータを整形
        calendar_data = {}

        tasks.each do |task|
          # タスクの開始日から期限日までの各日にタスクを配置
          task_start = [task.start_date || task.due_date, start_date].max
          task_end = [task.due_date, end_date].min

          (task_start..task_end).each do |date|
            date_str = date.strftime('%Y-%m-%d')
            calendar_data[date_str] ||= []
            calendar_data[date_str] << {
              id: task.id,
              title: task.title,
              status: task.status,
              priority: task.priority,
              is_due_date: date == task.due_date
            }
          end
        end

        render json: calendar_data, status: :ok
      end

      # GET /api/v1/tasks/summary
      # タスクのサマリー情報を取得
      def summary
        # ユーザーのタスクステータス集計
        status_counts = current_user.tasks.group(:status).count

        # 期限超過タスク数
        overdue_count = current_user.tasks
                                    .where('due_date < ? AND status != ?', Date.today, 'completed')
                                    .count

        # 今週のタスク数
        this_week_count = current_user.tasks
                                      .where(due_date: Date.today.beginning_of_week..Date.today.end_of_week)
                                      .count

        # 優先度別タスク数
        priority_counts = current_user.tasks.group(:priority).count

        # 各プロジェクトのタスク数
        project_task_counts = current_user.tasks
                                          .joins(:project)
                                          .group('projects.name')
                                          .count

        summary_data = {
          total_count: current_user.tasks.count,
          status_counts: status_counts,
          overdue_count: overdue_count,
          this_week_count: this_week_count,
          priority_counts: priority_counts,
          project_counts: project_task_counts
        }

        render json: summary_data, status: :ok
      end

      private

      # URLパラメータからタスクを特定するメソッド
      def set_task
        # URLのidパラメータでタスクを検索
        @task = Task.find(params[:id])
      end

      # 許可されたパラメータのみを取得するストロングパラメータ設定
      def task_params
        # taskパラメータの中から許可された属性のみを抽出
        params.require(:task).permit(
          :title, :description, :start_date, :due_date,
          :status, :priority, :estimated_hours, :user_id, :project_id
        )
      end

    end
  end
end