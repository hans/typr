class User < ActiveRecord::Base
  has_many :records, :dependent => :destroy
  has_and_belongs_to_many :profiles
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, and :timeoutable
  devise :database_authenticatable, :omniauthable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  
  # Insert a default profile association on registration
  after_create :insert_default_profile
  
  # Insert a default profile association
  # Profile #1 = QWERTY / Unknown Keyboard
  #
  # This can be changed later by the user, but it needs to be set
  # so that records can be stored correctly
  def insert_default_profile
    self.profiles << Profile.find(1)
  end
  
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