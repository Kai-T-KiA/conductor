# app/controllers/api/v1/projects_controller.rb
module Api
  module V1
    class ProjectsController < BaseController
      # 特定のプロジェクトを操作するアクションの前に、そのプロジェクトを取得
      before_action :set_project, only: [:show, :update, :destroy]

      # プロジェクトの作成・更新・削除は管理者のみ可能
      before_action :authorize_admin, only: [:create, :update, :destroy]

      # GET /api/v1/projects
      # プロジェクト一覧を取得
      def index
        # プロジェクト一覧を取得（N+1問題を防ぐためincludes使用）
        @projects = Project.includes(:client)

        # ステータスによるフィルタリング（クエリパラメータがある場合）
        @projects = @projects.where(status: params[:status]) if params[:status].present?

        # クライアントIDによるフィルタリング（クエリパラメータがある場合）
        @projects = @projects.where(client_id: params[:client_id]) if params[:client_id].present?

        # プロジェクト一覧をJSON形式で返す
        # 各プロジェクトの進捗率と関連タスク数も含める
        project_data = @projects.map do |project|
          {
            id: project.id,
            name: project.name,
            description: project.description,
            start_date: project.start_date,
            end_date: project.end_date,
            status: project.status,
            budget: project.budget,
            client: {
              id: project.client.id,
              name: project.client.name
            },
            progress_percentage: project.progress_percentage,
            tasks_count: project.tasks.count
          }
        end

        render json: project_data, status: :ok
      end

      # GET /api/v1/projects/:id
      # 特定のプロジェクト詳細を取得
      def show
        # プロジェクト情報に加えて、関連するタスク情報も含める
        project_data = @project.as_json(
          include: {
            client: { only: [:id, :name, :contact_person, :email] },
            tasks: {
              only: [:id, :title, :status, :priority, :due_date],
              include: {
                user: { only: [:id, :name] }
              }
            }
          }
        )

        # 追加の計算情報
        project_data[:progress_percentage] = @project.progress_percentage
        project_data[:total_hours_worked] = @project.total_hours_worked

        # タスクのステータス別集計
        status_counts = @project.tasks.group(:status).count
        project_data[:task_status_counts] = status_counts

        render json: project_data, status: :ok
      end

      # POST /api/v1/projects
      # 新規プロジェクトを作成（管理者専用）
      def create
        # パラメータからプロジェクトオブジェクトを生成
        @project = Project.new(project_params)

        # プロジェクトの保存を試みる
        if @project.save
          # 成功時：作成されたプロジェクト情報を返す（201 Created）
          render json: @project, status: :created
        else
          # 失敗時：エラーメッセージを返す
          render json: {
            error: 'プロジェクトの作成に失敗しました',
            details: @project.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/projects/:id
      # プロジェクト情報を更新（管理者専用）
      def update
        # プロジェクト情報の更新を試みる
        if @project.update(project_params)
          # 成功時：更新後のプロジェクト情報を返す
          render json: @project, status: :ok
        else
          # 失敗時：エラーメッセージを返す
          render json: {
            error: 'プロジェクト情報の更新に失敗しました',
            details: @project.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/projects/:id
      # プロジェクトを削除（管理者専用）
      def destroy
        # プロジェクト削除前に関連するタスクがないか確認（データ整合性確保）
        if @project.tasks.exists?
          return render json: {
            error: 'タスクが関連付けられているプロジェクトは削除できません',
            details: '削除前に関連するタスクをすべて削除するか、別のプロジェクトに移動してください',
            tasks_count: @project.tasks.count
          }, status: :unprocessable_entity
        end

        # プロジェクトを削除
        @project.destroy

        # 削除成功時は204 No Contentを返す
        head :no_content
      end

      private

      # URLパラメータからプロジェクトを特定するメソッド
      def set_project
        # URLのidパラメータでプロジェクトを検索
        @project = Project.find(params[:id])
      end

      # 許可されたパラメータのみを取得するストロングパラメータ設定
      def project_params
        # projectパラメータの中から許可された属性のみを抽出
        params.require(:project).permit(
          :name, :description, :start_date, :end_date,
          :status, :budget, :client_id
        )
      end

      # 管理者権限を確認するメソッド
      def authorize_admin
        # 現在のユーザーが管理者でない場合はエラーを返す
        unless current_user.admin?
          render json: {
            error: '管理者権限が必要です',
            details: 'プロジェクトの作成・更新・削除は管理者のみ実行できます'
          }, status: :forbidden
        end
      end

    end
  end
end