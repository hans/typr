module ProfilesHelper
  def current_profile
    profile_id = session[:profile_id] || 1
    Profile.find(profile_id)
  end
end
