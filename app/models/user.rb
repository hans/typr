class User < ActiveRecord::Base
  has_many :records, :dependent => :destroy
  has_one :profile, :foreign_key => :default_profile_id
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, and :timeoutable
  devise :database_authenticatable, :omniauthable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  
  def self.new_with_session params, session
    super.tap do |user|
      if data = session['devise.facebook_data'] and session['devise.facebook_data']['extra']['user_hash']
        user.email = data['email']
      end
    end
  end
  
  def self.find_for_facebook_oauth access_token, signed_in_resource = nil
    data = access_token['extra']['user_hash']
    if user = User.find_by_email(data['email'])
      user
    else # Create a user with a stub password.
      User.create! :email => data['email'], :password => Devise.friendly_token[0, 20]
    end
  end
end