class Compete
	constructor: (@parent) ->
		# length of the countdown, in seconds
		@countdown_time = 15
		@countdown_el = null

		# room data container
		@room = null

		# polls server for player / room status
		@server_poll = null
		@first_poll = true

		@server_started = false

	prepare: ->
		@countdown_el = $('#countdown')
		this.find_room()

	add_key_listener: ->
		@parent.type_area.keyup (event) =>
			@parent.can_show_error = true
			@parent.check_queue.push event.keyCode

	find_room: ->
		$.get '/type/compete/room/find', null, (_room) =>
			# set the global room object, and make sure its ID is an int
			# (for use in the countdown)
			@room = _room
			@room[0] = parseInt @room[0]
		
			$.each @room[1], (idx, player) =>
				this.add_player_row idx, player
				this.show_player_update idx, player
		
			@parent.prepare_copy @room[2][0].split(' '), @room[2][1]
			this.init_pollers()
		, 'json'

	start: ->
		$.get "/type/compete/room/#{@room[0]}/start", null, (data) =>
			@parent.hide_notifications()
			@parent.start_time = new Date()
			@parent.stats_poll = setInterval @parent.calculate_stats, 500
		
			@parent.type_area.removeAttr('disabled').focus()
			this.add_key_listener()

	# process stats received from the server
	update_player_stats: (players) ->
		$.each players, (idx, player) =>
			if @room[1][idx]?
				@room[1][idx].wpm = player.wpm
				@room[1][idx].cpm = player.cpm
				@room[1][idx].cur_word_idx = player.cur_word_idx
				@room[1][idx].done = player.done
			else
				@room[1][idx] = player
				this.add_player_row idx, player
		
			this.show_player_update idx, player

	# add a row into the stats table for a given player
	add_player_row: (cur_player_id, player) ->
		$('table.stats').append "<tr id='player-#{cur_player_id}'><td>#{player.name}</td><td></td><td>#{player.wpm}</td><td>#{player.cpm}</td></tr>"
		$($("table.stats tr#player-#{cur_player_id} td")[1]).progressbar()

	# update a certain player's progress bar and stats
	show_player_update: (cur_player_id, player) ->
		columns = $("table.stats tr#player-#{cur_player_id} td")
		$(columns[1]).progressbar 'value', this.get_player_progress(player.cur_word_idx) * 100
		$(columns[2]).text player.wpm
		$(columns[3]).text player.cpm

	get_player_progress: (player_cur_word_idx) ->
		player_cur_word_idx / @parent.num_words

	show_countdown: (time_left) ->
		@countdown_el.text time_left

	highlight_leader: ->
		sorted_players = $.keys @room[1]
		sorted_players = sorted_players.sort (a, b) ->
			@room[1][b].cur_word_idx - @room[1][a].cur_word_idx
	
		# highlight the leader in red.
		# if the current user is the leader, highlight the user in second place
		if sorted_players[0].id is player_id and sorted_players[1]?
			@parent.words.removeClass 'leader-highlight'
			$(@parent.words[@room[1][sorted_players[1]].cur_word_idx]).addClass 'leader-highlight'
		else
			@parent.words.removeClass 'leader-highlight'
			$(@parent.words[@room[1][sorted_players[0]].cur_word_idx]).addClass 'leader-highlight'

	init_pollers: ->
		@server_poll = setInterval this.poll_server, 2000
		@parent.poll = setInterval @parent.eval_next_in_queue, 30

	poll_server: =>
		unless @parent.start_time?
			time_before_start = @room[0] + @countdown_time - ( new Date().getTime() / 1000 )
			this.show_countdown Math.round time_before_start
		
			if !@server_started and time_before_start < 0
				@server_started = true
				this.start()
			else
				# hack - get this code to re-run every one second until things get started
				setTimeout this.poll_server, 1000
		
			return
	
		if @first_poll
			@first_poll = false
			return
	
		url = "/type/compete/room/#{@room[0]}/#{player_id}"
		$.post url,
			player_id: player_id
			player_name: player_name
			wpm: @parent.stat_wpm
			cpm: @parent.stat_cpm
			cur_word_idx: @parent.cur_word_idx
			done: @parent.is_done
		, (data) =>
			this.update_player_stats data[1]
			this.highlight_leader()
		, 'json'