class ApplicationController < ActionController::API
  # MimeRespondsモジュールを含めることで、respond_toメソッドが使えるようになる
  # これによりAPIコントローラでもフォーマット対応（JSON/XMLなど）が可能になる
  include ActionController::MimeResponds

  # デフォルトでJSONレスポンスを返すように設定
  respond_to :json

  # Deviseコントローラのアクションが実行される前に、パラメータの設定を行う
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  # Deviseのストロングパラメータを設定するメソッド
  # ユーザー登録時に'role'パラメータを許可する
  # これにより、ユーザー登録時にroleを設定できるようになる
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:role])
  end

  # システムの健全性確認（ヘルスチェック）用のメソッド
  # モニタリングツールやロードバランサーからのヘルスチェックに使用
  # 現在の時刻とともに'ok'ステータスを返す
  def health
    render json: { status: 'ok', time: Time.now.to_s }
  end
end
