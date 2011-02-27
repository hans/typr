// room data container
room = null

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