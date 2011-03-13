class Game
	# convert plain-text copy to something we can highlight more easily
	prepare = ->
		$.get "/type/copy/#{copy_category}", null, (copy) ->
			split = copy['copy']['content'].split ' '
			this.parent.prepare_copy split, copy['copy']['note']
			add_key_listener()
		
			poll = setInterval eval_next_in_queue, 30
			stats_poll = setInterval calculate_stats, 500
		, 'json'

	start = ->
		this.parent.hide_notifications()
		start_time = new Date()

	# set up a key listener that tracks the start time and appends to a key-check queue
	add_key_listener = ->
		type_area.keyup (event) ->
			can_show_error = true
			this.parent.start() unless start_time?
		
			check_queue.push event.keyCode