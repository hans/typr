class Profile < ActiveRecord::Base
  has_many :records
  
  def name
    self.layout + " / " + self.keyboard
  end
end
