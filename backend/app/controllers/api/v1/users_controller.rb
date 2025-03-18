module Api
  module V1
    class UsersController < BaseController
      # 特定のユーザーを操作するアクションの前に、そのユーザーを取得
      before_action :set_user, only: [:show, :update, :destroy]

      # 管理者以外はユーザー一覧取得、作成、削除ができないように制限
      before_action :authorize_admin, only: [:index, :create, :destroy]

      # GET /api/v1/users
      # 全ユーザーの一覧を取得（管理者専用）
      def index
        # 全ユーザーを取得
        @users = User.all

        # JSONフォーマットでユーザー一覧を返す
        render json: @users, status: :ok
      end

      # GET /api/v1/users/:id
      # 特定のユーザー情報を取得
      def show
        # 自分自身または管理者のみ閲覧可能とする権限チェック
        if current_user.id == @user.id || current_user.admin?
          # ユーザー情報をJSONで返す
          render json: @user, status: :ok
        else
          # 権限がない場合は403 Forbiddenエラーを返す
          render json: { error: '権限がありません', details: 'このユーザー情報の閲覧には適切な権限が必要です' }, status: :forbidden
        end
      end

      POST /api/v1/users
      # 新規ユーザーを作成（管理者専用）
      def create
        # パラメータからユーザーオブジェクトを生成
        @user = User.new(user_params)

        # ユーザーの保存を試みる
        if @user.save
          # 成功時：作成されたユーザー情報を返す（201 Created）
          render json: @user, status: :created
        else
          # 失敗時：エラーメッセージを返す（422 Unprocessable Entity）
          render json: {
            error: 'ユーザーの作成に失敗しました',
            details: @user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      # PUT /api/v1/users/:id
      # ユーザー情報を更新
      def update
        # 自分自身または管理者のみ更新可能とする権限チェック
        if current_user.id == @user.id || current_user.admin?
          # ユーザー情報の更新を試みる
          if @user.update(user_params)
            # 成功時：更新後のユーザー情報を返す
            render json: @user, status: :ok
          else
            # 失敗時：エラーメッセージを返す
            render json: {
              error: 'ユーザー情報の更新に失敗しました',
              details: @user.errors.full_messages
            }, status: :unprocessable_entity
          end
        else
          # 権限がない場合はエラーを返す
          render json: { error: '権限がありません', details: 'このユーザー情報の更新には適切な権限が必要です' }, status: :forbidden
        end
      end

      # DELETE /api/v1/users/:id
      # ユーザーを削除（管理者専用）
      def destroy
        # ユーザーを削除
        @user.destroy

        # 削除成功時は204 No Contentを返す（レスポンスボディなし）
        head :no_content
      end

      private

      # URLパラメータからユーザーを特定するメソッド
      def set_user
        # URLのidパラメータでユーザーを検索
        # ユーザーが見つからない場合は自動的に404エラーが発生
        @user = User.find(params[:id])
      end

      # 許可されたパラメータのみを取得するストロングパラメータ設定
      def user_params
        # userパラメータの中から許可された属性のみを抽出
        params.require(:user).permit(:name, :email, :password, :password_confirmation, :hourly_rate, :role)
      end

      # 管理者権限を確認するメソッド
      def authorize_admin
        # 現在のユーザーが管理者でない場合はエラーを返す
        unless current_user.admin?
          render json: {
            error: '管理者権限が必要です',
            details: 'この操作を実行するには管理者としてログインする必要があります'
          }, status: :forbidden
        end
      end

    end
  end
end