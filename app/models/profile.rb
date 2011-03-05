class Profile < ActiveRecord::Base
  has_and_belongs_to_many :users
  
  def name
    self.layout + " / " + self.keyboard
  end
end
