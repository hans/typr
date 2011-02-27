// length of the countdown, in seconds
COUNTDOWN_TIME = 15
countdown_el = null

// room data container
room = null

// polls server for player / room status
server_poll = null
first_poll = true

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
		room.id = parseInt(room.id)
		room.players = []; // hack
		
		prepare_copy(room['copy'][0].split(' '), room['copy'][1])
		poll = setInterval(eval_next_in_queue, 30)
	}, 'json')
}

function start() {
	$.get('/type/compete/room/' + room.id + '/start', null, function(data) {
		console.log(data)
		start_time = new Date()
		add_key_listener()
	})
}

// process stats received from the server
function update_player_stats(players) {
	$.each(players, function(idx, player) {
		console.log(idx, player)
		if ( room.players[idx] == undefined ) {
			room.players[idx] = player
			$('table.stats').append('<tr id="player-' + idx + '"><td>' + player.name + '</td><td></td><td>' + player.wpm + '</td><td>' + player.cpm + '</td></tr>')
			$($('table.stats tr#player-' + idx + ' td')[1]).progressbar();
		} else {
			room.players[idx].wpm = player.wpm
			room.players[idx].cpm = player.cpm
			room.players[idx].done = player.done
		}
		
		show_player_update(idx, player)
	})
}

// update a certain player's progress bar and stats
function show_player_update(cur_player_id, player) {
	var columns = $('#table.stats tr#player-' + cur_player_id + ' td')
	$(columns[1]).progressbar('value', player.progress)
	$(columns[2]).text(player.wpm)
	$(columns[3]).text(player.cpm)
}

function show_countdown(time_left) {
	countdown_el.text(time_left)
}

function init_pollers() {
	server_poll = setInterval(poll_server, 2000)
}

function poll_server() {
	if ( start_time == null ) {
		var time_before_start = room.id + COUNTDOWN_TIME - ( new Date().getTime() / 1000 )
		show_countdown(Math.round(time_before_start))
		
		if ( time_before_start < 0 )
			start()
		return
	}
	
	if ( first_poll ) {
		first_poll = false
		return
	}
	
	stats = calculate_stats()
	url = '/type/compete/room/' + room['id'] + '/' + player_id
	$.post(url, {
		player_id: player_id,
		player_name: player_name,
		wpm: stat_wpm,
		cpm: stat_cpm,
		done: is_done
	}, function(data) {
		console.log(data.players)
		update_player_stats(data.players)
	}, 'json')
}