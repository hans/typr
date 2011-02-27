class HomeController < ApplicationController
  def index
    @top_records = Record.find :all, :order => 'wpm desc'
    
    top_profile_ids = Record.find :all, :group => 'profile_id', :order => 'num_records desc',
      :select => 'count(1) as num_records, profile_id, avg(wpm) as avg_wpm, avg(cpm) as avg_cpm'
    @top_profiles = []
    p top_profile_ids
    
    top_profile_ids.each do |profile|
      @top_profiles << [Profile.find(profile.profile_id), profile.num_records, profile.avg_wpm.to_f, profile.avg_cpm.to_f]
    end
  end
end
