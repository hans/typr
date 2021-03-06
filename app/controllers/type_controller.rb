# coding: utf-8

class TypeController < ApplicationController
  before_filter :authenticate_user!
  
  def compete
    redirect_to "/profiles/choose/compete" if session[:profile_id].nil?
    @page_scripts = ['jquery-ui.min', 'type']
    @page_styles = ['jquery-ui']
  end
  
  respond_to :json
  def find_room
    room_id = REDIS.srandmember 'rooms:open'
    room_copy = nil
    
    if room_id.nil?
      room_id = Time.now.to_i
      REDIS.sadd 'rooms:open', room_id
      
      room_copy = Copy.find :first, :order => 'random()'
      REDIS.set "rooms:id:#{room_id}:copy", room_copy.id
    else
      room_copy = Copy.find REDIS.get("rooms:id:#{room_id}:copy")
    end
    
    # add the user to the retrieved room
    REDIS.hset "rooms:id:#{room_id}", current_user.id, current_user.username + ":0:0:0:false"
    
    render :json => [
      room_id,
      get_players(room_id),
      [room_copy.content, room_copy.note]
    ]
  end
  
  respond_to :json
  def room_status
    room_id = params[:id]
    render :json => [room_id, get_players(room_id)]
  end
  
  respond_to :json
  def update_player_status
    data_str = [params[:player_name], params[:wpm], params[:cpm], params[:cur_word_idx], params[:done]].join ':'
    REDIS.hset "rooms:id:#{params[:room_id]}", params[:player_id], data_str
    
    render :json => [params[:room_id], get_players(params[:room_id])]
  end
  
  respond_to :json
  def start_room
    if REDIS.sismember 'rooms:open', params[:id]
      REDIS.smove 'rooms:open', 'rooms:playing', params[:id]
    end
    
    render :json => true
  end
  
  def practice
    redirect_to "/profiles/choose/practice" if session[:profile_id].nil?
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
    profile_id = session[:profile_id] || 1
    record = Record.create :duration => params[:duration], :words => params[:words], :wpm => params[:wpm], :cpm => params[:cpm], :user => current_user, :profile_id => profile_id
    
    render :json => ( record ? true : false )
  end
  
  def record_url something
    ""
  end
  
  private
  def get_players room_id
    REDIS.hgetall('rooms:id:' + room_id.to_s).map do |player_id, player_data_str|
      player_data = player_data_str.split ':'
      {'name' => player_data[0], 'wpm' => player_data[1], 'cpm' => player_data[2], 'cur_word_idx' => player_data[3], 'done' => player_data[4]}
    end
  end
end
