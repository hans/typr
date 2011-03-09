class ProfilesController < ApplicationController
  before_filter :authenticate_user!, :except => [:view]
  autocomplete :profile, :keyboard
  
  def view
    @profile = Profile.find params[:id]
    
    @records = @profile.records.sort do |a, b|
      a.created_at - b.created_at
    end
    
    @wpm_data = @records.map do |rec|
      rec.wpm
    end
    
    @cpm_data = @records.map do |rec|
      rec.cpm
    end
  end
  
  # Add or create a profile and associate it with the current user.
  respond_to :json
  def save
    profile = Profile.find_or_create_by_keyboard_and_layout params[:keyboard], params[:layout]
    current_user.profiles << profile
    
    respond_with profile
  end
  
  # Delete a profile from a user's account.
  # (This doesn't actually delete the profile, just the association.)
  respond_to :json
  def delete
    current_user.profiles.delete Profile.find(params[:id])
    render :json => true
  end
  
  def choose
    if params[:profile_id] and params[:type]
      p params[:profile_id], params[:type]
      session[:profile_id] = params[:profile_id]
      
      if params[:type] == 'practice'
        redirect_to :controller => 'type', :action => 'practice'
      elsif params[:type] == 'compete'
        redirect_to :controller => 'type', :action => 'compete'
      end
    else
      @profiles = current_user.profiles
    end
  end
  
  def profile_url something
    ""
  end
end
