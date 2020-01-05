# config valid for current version and patch releases of Capistrano
lock "~> 3.11.2"

set :application, "indonesia-platform"
set :repo_url, "git@github.com:anggiaramadhan/indonesia-platform.git"

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, :develop

# Default deploy_to directory is /var/www/my_app_name
set :deploy_to, "/home/deploy/#{fetch :application}"

# Default value for :linked_files is []
append :linked_files, "config/database.yml", ".env", "config/secrets.yml"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for keep_releases is 5
set :keep_releases, 4
