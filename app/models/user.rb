class User < ActiveRecord::Base
  has_many :records, :dependent => :destroy
  has_many :authentications
  has_and_belongs_to_many :profiles
  
  validates_presence_of :email
  validates_uniqueness_of :username, :email
  
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, and :timeoutable
  devise :database_authenticatable, :omniauthable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :username, :password, :password_confirmation, :remember_me
  
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
        p data
      end
    end
  end
  
  def self.find_for_facebook_oauth access_token, signed_in_resource = nil
    data = access_token['extra']['user_hash']
    
    user = nil
    unless user = User.find_by_email(data['email'])
      user = User.create! :email => data['email'], :password => Devise.friendly_token[0, 20]
    end
    
    user.authentications.find_or_create_by_provider_and_uid(access_token['provider'], access_token['uid'])
    user
  end
  
  def self.find_for_open_id data, signed_in_resource = nil
    user = nil
    unless user = User.find_by_email(data['user_info']['email'])
      user = User.create! :email => data['user_info']['email'], :username => data['user_info']['nickname'], :password => Devise.friendly_token[0, 20]
    end
    
    user.authentications.find_or_create_by_provider_and_uid('open_id', data['uid'])
    user
  end
end