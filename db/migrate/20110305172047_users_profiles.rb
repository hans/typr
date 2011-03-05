class UsersProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles_users, :id => false do |t|
      t.references :user
      t.references :profile
    end
  end

  def self.down
    drop_table :profiles_users
  end
end
