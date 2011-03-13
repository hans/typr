class Practice
	constructor: (@parent) ->
	
	# convert plain-text copy to something we can highlight more easily
	prepare: ->
		window.foo = @parent
		console.log(@parent, @parent.prepare_copy)
		$.get "/type/copy/#{@parent.copy_category}", null, (copy) =>
			split = copy['copy']['content'].split ' '
			@parent.prepare_copy split, copy['copy']['note']
			add_key_listener()
		
			poll = setInterval eval_next_in_queue, 30
			stats_poll = setInterval calculate_stats, 500
		, 'json'

	start: ->
		@parent.hide_notifications()
		@parent.start_time = new Date()

	# set up a key listener that tracks the start time and appends to a key-check queue
	add_key_listener: ->
		type_area.keyup (event) ->
			@parent.can_show_error = true
			@parent.start() unless @parent.start_time?
		
			@parent.check_queue.push event.keyCode