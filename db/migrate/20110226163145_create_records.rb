class CreateRecords < ActiveRecord::Migration
  def self.up
    create_table :records do |t|
      t.integer :user_id
      t.integer :profile_id
      
      t.integer :words
      t.integer :duration
      t.integer :wpm
      t.integer :cpm

      t.timestamps
    end
  end

  def self.down
    drop_table :records
  end
end