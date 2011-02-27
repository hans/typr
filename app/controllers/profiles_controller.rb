class ProfilesController < ApplicationController
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
end
