module ApplicationHelper
  def gravatar_url user = nil
    user ||= current_user
    gravatar_id = Digest::MD5::hexdigest(user.email).downcase
    "http://gravatar.com/avatar/#{gravatar_id}.png"
  end
end
