# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)
require 'rake'

Typr::Application.load_tasks

require 'coffee-script'
require 'find'

desc 'Compile CoffeeScript files to JavaScript'
task :coffee do
  files_to_compile = []
  
  Dir.chdir File.join(Rails.root.to_s, 'public', 'javascripts') do
    Find.find(Dir.pwd) do |path|
      if FileTest.directory? path
        if File.basename(path)[0] == ?.
          Find.prune
        else
          next
        end
      elsif path.match /\.coffee$/
        files_to_compile << path
      end
    end
    
    File.open 'type.js', 'w' do |js|
      js.write `coffee -pj #{files_to_compile.join(' ')}`
    end
  end
end