class CreateCopies < ActiveRecord::Migration
  def self.up
    create_table :copies do |t|
      t.integer :category
      t.text :content
      t.string :extra

      t.timestamps
    end
  end

  def self.down
    drop_table :copies
  end
end
