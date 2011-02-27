// convert plain-text copy to something we can highlight more easily
function prepare() {
	$.get('/type/copy/' + copy_category, null, function(copy) {
		split = copy['copy']['content'].split(' ')
		$.each(split, function(idx, word) {
			$('#copy').append('<span class="word">' + word + '</span>&nbsp;')
		})
		
		$('#note').text(copy['copy']['note'])
		
		words = $('#copy span.word')
		next_word()
	}, 'json')
}

// set up a key listener that tracks the start time and appends to a key-check queue
function add_key_listener() {
	type_area.keyup(function(event) {
		can_show_error = true
		if ( start_time == null ) start_time = new Date()
		
		check_queue.push(event.keyCode)
	})
}