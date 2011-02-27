class HistoryController < ApplicationController
  def index
    @records = current_user.records.sort do |a, b|
      a.created_at - b.created_at
    end
    
    @wpm = {}
    @cpm = {}
    
    @records.each do |rec|
      rec_time = rec.created_at.to_time.to_i * 1000
      @wpm[rec.profile_id] = {'label' => rec.profile.name, 'data' => []} if @wpm[rec.profile_id].nil?
      @wpm[rec.profile_id]['data'] << [rec_time, rec.wpm]
      
      @cpm[rec.profile_id] = {'label' => rec.profile.name, 'data' => []} if @cpm[rec.profile_id].nil?
      @cpm[rec.profile_id]['data'] << [rec_time, rec.cpm]
    end
    
    @wpm = @wpm.values
    @cpm = @cpm.values
    
    @page_scripts = ['excanvas.min', 'jquery.flot.min', 'history']
  end
end
