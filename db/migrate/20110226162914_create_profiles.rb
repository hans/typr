class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      t.string :layout
      t.string :keyboard

      t.timestamps
    end
  end

  def self.down
    drop_table :profiles
  end
end
