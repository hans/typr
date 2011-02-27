// length of the countdown, in seconds
COUNTDOWN_TIME = 15

// room data container
room = null

// polls server for player / room status
server_poll = null
first_poll = true

function prepare() {
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

function init_pollers() {
	server_poll = setInterval(poll_server, 2000)
}

function poll_server() {
	if ( start_time == null ) {
		time_before_start = room.id + COUNTDOWN_TIME - ( new Date().getTime() / 1000 )
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
		done: done
	}, function(data) {
		console.log(data)
	}, 'json')
}