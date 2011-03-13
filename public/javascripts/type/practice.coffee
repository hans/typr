class Practice
	constructor: (@parent) ->
	
	# convert plain-text copy to something we can highlight more easily
	prepare: ->
		window.foo = @parent
		console.log(@parent, @parent.prepare_copy)
		$.get "/type/copy/#{@parent.copy_category}", null, (copy) =>
			split = copy['copy']['content'].split ' '
			@parent.prepare_copy split, copy['copy']['note']
			this.add_key_listener()
		
			@parent.poll = setInterval @parent.eval_next_in_queue, 30
			@parent.stats_poll = setInterval @parent.calculate_stats, 500
		, 'json'

	start: ->
		@parent.hide_notifications()
		@parent.start_time = new Date()

	# set up a key listener that tracks the start time and appends to a key-check queue
	add_key_listener: ->
		@parent.type_area.keyup (event) =>
			@parent.can_show_error = true
			this.start() unless @parent.start_time?
		
			@parent.check_queue.push event.keyCode