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

          # 必要に応じてフィルタリング（クエリパラメータがある場合）
          @tasks = @tasks.where(status: params[:status]) if params[:status].present?
          @tasks = @tasks.where(priority: params[:priority]) if params[:priority].present?
        else
          # 一般ユーザー：自分のタスクのみ取得
          @tasks = current_user.tasks.includes(:project)

          # 一般ユーザーをフィルタリング
          @tasks = @tasks.where(status: params[:status]) if params[:status].present?
          @tasks = @tasks.where(priority: params[:priority]) if params[:priority].present?
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