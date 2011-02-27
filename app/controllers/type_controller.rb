# coding: utf-8

class TypeController < ApplicationController
  def type
    @page_scripts = ['type']
  end
  
  respond_to :json
  def copy
    # TODO: dynamically generate some unique copy
    # scrape old books or something? :P
    copy = Copy.find :first, :order => 'random()'
    respond_with copy
  end
  
  respond_to :json
  def submit
    @record = Record.create :duration => params[:duration], :words => params[:words], :wpm => params[:wpm], :cpm => params[:cpm]
    @record.user = current_user
    @record.profile_id = current_user.default_profile_id
    @record.save
    
    render :json => ( @record ? true : false )
  end
  
  def record_url something
    ""
  end
end
