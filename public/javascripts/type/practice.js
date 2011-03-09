// convert plain-text copy to something we can highlight more easily
function prepare() {
	$.get('/type/copy/' + copy_category, null, function(copy) {
		split = copy['copy']['content'].split(' ')
		prepare_copy(split, copy['copy']['note'])
		add_key_listener()
		
		poll = setInterval(eval_next_in_queue, 30)
		stats_poll = setInterval(calculate_stats, 500)
	}, 'json')
}

function start() {
	hide_notifications()
	start_time = new Date()
}

// set up a key listener that tracks the start time and appends to a key-check queue
function add_key_listener() {
	type_area.keyup(function(event) {
		can_show_error = true
		if ( start_time == null ) start()
		
		check_queue.push(event.keyCode)
	})
}