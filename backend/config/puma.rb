max_threads_count = ENV.fetch("RAILS_MAX_THREADS") { 5 }
min_threads_count = ENV.fetch("RAILS_MIN_THREADS") { max_threads_count }
threads min_threads_count, max_threads_count

# ワーカー数を固定値に設定
if ENV["RAILS_ENV"] == "production"
  # ワーカー数を2に固定（小〜中規模アプリケーション向けの数値）
  workers ENV.fetch("WEB_CONCURRENCY") { 2 }
end

# Specifies the `worker_timeout` threshold that Puma will use to wait before
# terminating a worker in development environments.
worker_timeout 3600 if ENV.fetch("RAILS_ENV", "development") == "development"

# Specifies the `port` that Puma will listen on to receive requests; default is 3000.
port ENV.fetch("PORT", 3000)

# Specifies the `environment` that Puma will run in.
environment ENV.fetch("RAILS_ENV") { "development" }

# PIDファイルを無効化（server.pidの問題を回避）
pidfile false

# Allow puma to be restarted by `bin/rails restart` command.
plugin :tmp_restart