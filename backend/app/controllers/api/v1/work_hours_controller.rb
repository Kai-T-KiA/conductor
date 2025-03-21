# app/controllers/api/v1/work_hours_controller.rb
module Api
  module V1
    class WorkHoursController < BaseController
      # 特定の稼働時間を操作するアクションの前に、その稼働時間を取得
      before_action :set_work_hour, only: [:show, :update, :destroy]

      # GET /api/v1/work_hours
      # 稼働時間一覧を取得
      def index
        # 管理者と一般ユーザーで取得する稼働時間を分ける
        if current_user.admin?
          # 管理者：全ての稼働時間を取得（N+1問題を防ぐためincludes使用）
          @work_hours = WorkHour.includes(:user, :task)

          # 日付範囲によるフィルタリング（クエリパラメータがある場合）
          if params[:start_date].present? && params[:end_date].present?
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            @work_hours = @work_hours.where(work_date: start_date..end_date)
          end

          # 特定のユーザーの稼働時間のみを取得（クエリパラメータがある場合）
          @work_hours = @work_hours.where(user_id: params[:user_id]) if params[:user_id].present?
        else
          # 一般ユーザー：自分の稼働時間のみ取得
          @work_hours = current_user.work_hours.includes(:task)

          # 日付範囲によるフィルタリング（クエリパラメータがある場合）
          if params[:start_date].present? && params[:end_date].present?
            start_date = Date.parse(params[:start_date])
            end_date = Date.parse(params[:end_date])
            @work_hours = @work_hours.where(work_date: start_date..end_date)
          end

          # 特定の年月の稼働時間取得（クエリパラメータがある場合）
          if params[:year].present? && params[:month].present?
            year = params[:year].to_i
            month = params[:month].to_i
            start_date = Date.new(year, month, 1)
            end_date = start_date.end_of_month
            @work_hours = @work_hours.where(work_date: start_date..end_date)
          end
        end

        # 稼働時間一覧をJSON形式で返す
        render json: @work_hours, status: :ok
      end

      # GET /api/v1/work_hours/summary
      # 稼働時間サマリーを取得（集計情報）
      def summary
        # リクエストパラメータから集計対象期間を取得
        start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
        end_date = params[:end_date].present? ? Date.parse(params[:end_date]) : Date.today

        # 年月指定がある場合は、その年月の範囲を設定
        if params[:year].present? && params[:month].present?
          year = params[:year].to_i
          month = params[:month].to_i
          start_date = Date.new(year, month, 1)
          end_date = start_date.end_of_month
        end

        # 管理者と一般ユーザーで取得する集計情報を分ける
        if current_user.admin?
          # 管理者：全ユーザーの集計情報
          # ユーザーごとの稼働時間集計
          user_hours = WorkHour.where(work_date: start_date..end_date)
                              .group(:user_id)
                              .sum(:hours_worked)

          # ユーザー情報と紐づけ
          users_with_hours = User.where(id: user_hours.keys).map do |user|
            {
              user_id: user.id,
              name: user.name,
              hours_worked: user_hours[user.id]
            }
          end

          # 全体の集計情報
          summary_data = {
            period: {
              start_date: start_date,
              end_date: end_date
            },
            total_hours: WorkHour.where(work_date: start_date..end_date).sum(:hours_worked),
            users: users_with_hours
          }
        else
          # 一般ユーザー：自分の集計情報のみ
          # 日別の稼働時間集計
          daily_hours = current_user.work_hours
                                  .where(work_date: start_date..end_date)
                                  .group(:work_date)
                                  .sum(:hours_worked)

          # 日付フォーマット調整
          formatted_daily_hours = daily_hours.transform_keys { |k| k.strftime('%Y-%m-%d') }

          # タスク別の稼働時間集計
          task_hours = current_user.work_hours
                                  .where(work_date: start_date..end_date)
                                  .joins(:task)
                                  .group('tasks.title')
                                  .sum(:hours_worked)

          # 週別の稼働時間集計
          weekly_hours = {}
          daily_hours.each do |date, hours|
            week_start = date.beginning_of_week.strftime('%Y-%m-%d')
            weekly_hours[week_start] ||= 0
            weekly_hours[week_start] += hours
          end

          # ユーザーの集計情報
          summary_data = {
            period: {
              start_date: start_date,
              end_date: end_date
            },
            total_hours: current_user.work_hours.where(work_date: start_date..end_date).sum(:hours_worked),
            daily_hours: formatted_daily_hours,
            weekly_hours: weekly_hours,
            task_breakdown: task_hours
          }
        end

        # 集計情報をJSON形式で返す
        render json: summary_data, status: :ok
      end

      # GET /api/v1/work_hours/:id
      # 特定の稼働時間詳細を取得
      def show
        # 自分の稼働時間または管理者の場合のみ閲覧可能とする権限チェック
        if @work_hour.user_id == current_user.id || current_user.admin?
          # 稼働時間情報に加えて、関連するタスク情報も含める
          render json: @work_hour.as_json(
            include: {
              task: { only: [:id, :title, :status, :priority] }
            }
          ), status: :ok
        else
          # 権限がない場合はエラーを返す
          render json: {
            error: '権限がありません',
            details: 'この稼働時間情報の閲覧には適切な権限が必要です'
          }, status: :forbidden
        end
      end

      # POST /api/v1/work_hours
      # 新規稼働時間を記録
      def create
        # パラメータから稼働時間オブジェクトを生成
        @work_hour = WorkHour.new(work_hour_params)

        # 一般ユーザーの場合、自分のIDを自動設定（管理者でない場合のみ）
        # これにより自分以外の稼働時間を登録できないようにする
        @work_hour.user_id = current_user.id unless current_user.admin?

        # 稼働時間の保存を試みる
        if @work_hour.save
          # 成功時：作成された稼働時間情報を返す（201 Created）
          render json: @work_hour, status: :created
        else
          # 失敗時：エラーメッセージを返す
          render json: {
            error: '稼働時間の記録に失敗しました',
            details: @work_hour.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/work_hours/:id
      # 稼働時間情報を更新
      def update
        # 自分の稼働時間または管理者の場合のみ更新可能とする権限チェック
        if @work_hour.user_id == current_user.id || current_user.admin?
          # 一般ユーザーが別ユーザーの稼働時間を変更することを防止
          if !current_user.admin? && work_hour_params[:user_id].present? && work_hour_params[:user_id].to_i != current_user.id
            return render json: {
              error: '不正な操作です',
              details: '他のユーザーの稼働時間を変更することはできません'
            }, status: :forbidden
          end

          # 稼働時間情報の更新を試みる
          if @work_hour.update(work_hour_params)
            # 成功時：更新後の稼働時間情報を返す
            render json: @work_hour, status: :ok
          else
            # 失敗時：エラーメッセージを返す
            render json: {
              error: '稼働時間情報の更新に失敗しました',
              details: @work_hour.errors.full_messages
            }, status: :unprocessable_entity
          end
        else
          # 権限がない場合はエラーを返す
          render json: {
            error: '権限がありません',
            details: 'この稼働時間情報の更新には適切な権限が必要です'
          }, status: :forbidden
        end
      end

      # DELETE /api/v1/work_hours/:id
      # 稼働時間を削除
      def destroy
        # 自分の稼働時間または管理者の場合のみ削除可能とする権限チェック
        if @work_hour.user_id == current_user.id || current_user.admin?
          # 稼働時間を削除
          @work_hour.destroy
          # 削除成功時は204 No Contentを返す
          head :no_content
        else
          # 権限がない場合はエラーを返す
          render json: {
            error: '権限がありません',
            details: 'この稼働時間の削除には適切な権限が必要です'
          }, status: :forbidden
        end
      end

      # GET /api/v1/work_hours/summary
      # 稼働時間サマリーを取得（集計情報）
      # def summary
      #   # リクエストパラメータから集計対象期間を取得
      #   start_date = params[:start_date].present? ? Date.parse(params[:start_date]) : Date.today.beginning_of_month
      #   end_date = params[:end_date].present? ? Date.parse(params[:end_date]) : Date.today

      #   # 管理者と一般ユーザーで取得する集計情報を分ける
      #   if current_user.admin?
      #     # 管理者：全ユーザーの集計情報
      #     # ユーザーごとの稼働時間集計
      #     user_hours = WorkHour.where(work_date: start_date..end_date)
      #                         .group(:user_id)
      #                         .sum(:hours_worked)

      #     # ユーザー情報と紐づけ
      #     users_with_hours = User.where(id: user_hours.keys).map do |user|
      #       {
      #         user_id: user.id,
      #         name: user.name,
      #         hours_worked: user_hours[user.id]
      #       }
      #     end

      #     # 全体の集計情報
      #     summary_data = {
      #       period: {
      #         start_date: start_date,
      #         end_date: end_date
      #       },
      #       total_hours: WorkHour.where(work_date: start_date..end_date).sum(:hours_worked),
      #       users: users_with_hours
      #     }
      #   else
      #     # 一般ユーザー：自分の集計情報のみ
      #     # 日別の稼働時間集計
      #     daily_hours = current_user.work_hours
      #                             .where(work_date: start_date..end_date)
      #                             .group(:work_date)
      #                             .sum(:hours_worked)

      #     # 日付フォーマット調整
      #     formatted_daily_hours = daily_hours.transform_keys { |k| k.strftime('%Y-%m-%d') }

      #     # タスク別の稼働時間集計
      #     task_hours = current_user.work_hours
      #                             .where(work_date: start_date..end_date)
      #                             .joins(:task)
      #                             .group('tasks.title')
      #                             .sum(:hours_worked)

      #     # ユーザーの集計情報
      #     summary_data = {
      #       period: {
      #         start_date: start_date,
      #         end_date: end_date
      #       },
      #       total_hours: current_user.work_hours.where(work_date: start_date..end_date).sum(:hours_worked),
      #       daily_hours: formatted_daily_hours,
      #       task_breakdown: task_hours
      #     }
      #   end

      #   # 集計情報をJSON形式で返す
      #   render json: summary_data, status: :ok
      # end

      private

      # URLパラメータから稼働時間を特定するメソッド
      def set_work_hour
        # URLのidパラメータで稼働時間を検索
        @work_hour = WorkHour.find(params[:id])
      end

      # 許可されたパラメータのみを取得するストロングパラメータ設定
      def work_hour_params
        # work_hourパラメータの中から許可された属性のみを抽出
        params.require(:work_hour).permit(
          :work_date, :start_time, :end_time, :hours_worked,
          :activity_description, :task_id, :user_id
        )
      end
    end
  end
end