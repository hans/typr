// length of the countdown, in seconds
COUNTDOWN_TIME = 15
countdown_el = null

// room data container
room = null

// polls server for player / room status
server_poll = null
first_poll = true

server_started = false

function prepare() {
	countdown_el = $('#countdown')
	find_room()
}

function add_key_listener() {
	type_area.keyup(function(event) {
		can_show_error = true
		check_queue.push(event.keyCode)
	})
}

function find_room() {
	$.get('/type/compete/room/find', null, function(_room) {
		// set the global room object, and make sure its ID is an int
		// (for use in the countdown)
		room = _room;
		room[0] = parseInt(room[0])
		
		$.each(room[1], function(idx, player) {
			add_player_row(idx, player)
			show_player_update(idx, player)
		})
		
		prepare_copy(room[2][0].split(' '), room[2][1])
		init_pollers()
	}, 'json')
}

function start() {
	$.get('/type/compete/room/' + room[0] + '/start', null, function(data) {
		hide_notifications()
		start_time = new Date()
		stats_poll = setInterval(calculate_stats, 500)
		
		type_area.removeAttr('disabled').focus()
		add_key_listener()
	})
}

// process stats received from the server
function update_player_stats(players) {
	$.each(players, function(idx, player) {
		if ( room[1][idx] == undefined ) {
			room[1][idx] = player
			add_player_row(idx, player)
		} else {
			room[1][idx].wpm = player.wpm
			room[1][idx].cpm = player.cpm
			room[1][idx].cur_word_idx = player.cur_word_idx
			room[1][idx].done = player.done
		}
		
		show_player_update(idx, player)
	})
}

// add a row into the stats table for a given player
function add_player_row(cur_player_id, player) {
	$('table.stats').append('<tr id="player-' + cur_player_id + '"><td>' + player.name + '</td><td></td><td>' + player.wpm + '</td><td>' + player.cpm + '</td></tr>')
	$($('table.stats tr#player-' + cur_player_id + ' td')[1]).progressbar();
}

// update a certain player's progress bar and stats
function show_player_update(cur_player_id, player) {
	var columns = $('table.stats tr#player-' + cur_player_id + ' td')
	$(columns[1]).progressbar('value', get_player_progress(player.cur_word_idx) * 100)
	$(columns[2]).text(player.wpm)
	$(columns[3]).text(player.cpm)
}

function get_player_progress(player_cur_word_idx) {
	return player_cur_word_idx / num_words
}

function show_countdown(time_left) {
	countdown_el.text(time_left)
}

function highlight_leader() {
	sorted_players = $.keys(room[1])
	sorted_players = sorted_players.sort(function(a, b) {
		return room[1][b].cur_word_idx - room[1][a].cur_word_idx
	})
	
	// highlight the leader in red.
	// if the current user is the leader, highlight the user in second place
	if ( sorted_players[0].id == player_id && sorted_players[1] != undefined ) {
		words.removeClass('leader-highlight')
		$(words[room[1][sorted_players[1]].cur_word_idx]).addClass('leader-highlight')
	} else {
		words.removeClass('leader-highlight')
		$(words[room[1][sorted_players[0]].cur_word_idx]).addClass('leader-highlight')
	}
}

function init_pollers() {
	server_poll = setInterval(poll_server, 2000)
	poll = setInterval(eval_next_in_queue, 30)
}

function poll_server() {
	if ( start_time == null ) {
		var time_before_start = room[0] + COUNTDOWN_TIME - ( new Date().getTime() / 1000 )
		show_countdown(Math.round(time_before_start))
		
		if ( !server_started && time_before_start < 0 ) {
			server_started = true;
			start()
		} else {
			// hack - get this code to re-run every one second until things get started
			setTimeout(poll_server, 1000)
		}
		
		return
	}
	
	if ( first_poll ) {
		first_poll = false
		return
	}
	
	url = '/type/compete/room/' + room[0] + '/' + player_id
	$.post(url, {
		player_id: player_id,
		player_name: player_name,
		wpm: stat_wpm,
		cpm: stat_cpm,
		cur_word_idx: cur_word_idx,
		done: is_done
	}, function(data) {
		update_player_stats(data[1])
		highlight_leader()
	}, 'json')
}