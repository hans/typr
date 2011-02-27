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
		room = _room;
		prepare_copy(room['copy'][0].split(' '), room['copy'][1])
	}, 'json')
}

function init_pollers() {
	server_poll = setInterval(poll_server, 1000)
}

function poll_server() {
	if ( first_poll ) {
		first_poll = false
		return
	}
	
	stats = calculate_stats()
	url = '/type/compete/room/' + room['id'] + '/' + player_id + '/' + player_name ',' + stat_wpm + ',' + stat_cpm + done
	$.get(url, null, function(data) {
		console.log(data)
	})
}