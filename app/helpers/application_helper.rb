module ApplicationHelper
  def gravatar_url user = nil
    user ||= current_user
    gravatar_id = Digest::MD5::hexdigest(user.email).downcase
    "http://gravatar.com/avatar/#{gravatar_id}.png?s=40"
  end
end

class String
  def provider_titleize
    ( self == 'open_id' ? 'OpenID' : self.titleize )
  end
end