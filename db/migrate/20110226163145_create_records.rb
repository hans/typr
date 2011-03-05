class CreateRecords < ActiveRecord::Migration
  def self.up
    create_table :records do |t|
      t.references :user
      t.references :profile
      
      t.integer :words
      t.float :duration
      t.float :wpm
      t.float :cpm

      t.timestamps
    end
  end

  def self.down
    drop_table :records
  end
end
