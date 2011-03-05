class Profile < ActiveRecord::Base
  has_and_belongs_to_many :users
  has_many :records
  
  def name
    self.layout + " / " + self.keyboard
  end
end
