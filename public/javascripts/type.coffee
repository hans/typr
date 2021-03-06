class Type
	constructor: ->
		@cur_word_idx = -1
		@cur_word = ''

		# chosen copy category.
		# this will be used.. later
		# 1 = literary passages, 2 = news, 3 = random words
		@copy_category = 1

		# an array of words in the copy, filled by prepare_copy()
		@words = null
		@num_words = 0

		# an array of recently-typed characters, sorted from oldest to newest.
		# this is digested by eval_next_in_queue().
		# adding char codes to queue + polling > event-based checks, on some slower systems
		@check_queue = [ ]

		# stores the interval timer so that polling can stop once typing finishes
		@poll = null
		@stats_poll = null

		# prevent continuous flashing when a typing error occurs
		# (since the polling function would keep noticing the error until it was fixed)
		@can_show_error = true

		# track start time and end time for calculating stats
		@start_time = null
		@end_time = null

		# used to store DOM els rather than continually fetch them
		# set @ $(document).ready()
		@type_area = null

		# stats
		@stat_delta = null
		@stat_wpm = null
		@stat_cpm = null
		@stat_progress = null
		@is_done = false

		# more stats
		@words_typed = 0
		@chars_typed = 0
		@total_chars = 0
	
		# store Game class
		@game = null

	prepare_copy: (words_arr, note) ->
		$('#copy').append("<span class='word'>#{word}</span>&nbsp;") for word in words_arr
	
		$('#note').text(note)
	
		@words = $('#copy span.word')
		@num_words = words_arr.length
		@total_chars = $('#copy').text().length
	
		this.next_word()

	hide_notifications: ->
		$('.notification').css 'visibility', 'hidden'

	eval_next_in_queue: =>
		return if @check_queue.length == 0
	
		code = @check_queue.shift()
		typed_text = @type_area.val().split(' ')[0]
		check = @cur_word.substr 0, typed_text.length
	
		if code == 32 # spacebar
			if typed_text.length == @cur_word.length and typed_text == check
				this.next_word()
			else
				this.show_error()
		else
			if typed_text != check
				this.show_error()
			else
				@chars_typed += 1

	next_word: =>
		old_word = @cur_word
		@cur_word_idx += 1
	
		# increase words_typed, and account for the spacebar char
		# increment chars_typed as well
		@words_typed += 1
		@chars_typed += 1
		
		if @words[@cur_word_idx]?
			@cur_word = @words[@cur_word_idx].innerHTML
	
			# remove highlighting from the old word
			if @words[@cur_word_idx - 1]?
				$(@words[@cur_word_idx - 1]).removeClass 'personal-highlight'
		
			# highlight the new word
			$(@words[@cur_word_idx]).addClass 'personal-highlight'
		
			# remove this successfully-typed word from the entry box
			# but don't remove any other things that could've been typed since the success!
			# String.replace(str) replaces the first occurrence only
			@type_area.val(@type_area.val().replace(old_word + ' ', ''));
		else
			this.done()

	done: ->
		@is_done = true
	
		clearInterval @poll
		clearInterval @stats_poll
	
		@end_time = new Date()
		@type_area.css 'background-color', '#6fbf4d'
	
		this.calculate_stats()
		this.submit_results @num_words, @stat_delta, @stat_wpm, @stat_cpm

	calculate_stats: =>
		compare_time = if @end_time? then @end_time else new Date()
		@stat_delta = ( compare_time.getTime() - @start_time.getTime() ) / 60000
	
		@stat_wpm = Math.round @words_typed / @stat_delta
		@stat_cpm = Math.round @chars_typed / @stat_delta
	
		$('#results-wpm').text @stat_wpm
		$('#results-cpm').text @stat_cpm

	submit_results: (words, duration, words_per_minute, characters_per_minute) ->
		$.post('/type/submit',
			words: words
			duration: @stat_delta
			wpm: words_per_minute
			cpm: characters_per_minute
		, null, 'json')

	show_error: ->
		if @can_show_error
			@type_area.css 'background-color', '#ff7878'
			setTimeout this.hide_error, 500
	
		@can_show_error = false

	hide_error: =>
		@type_area.css 'background-color', '#fafafa'
	
	ready: ->
		@type_area = $('#type_area')

		@game = if game_type is 'compete'
			new Compete(this)
		else if game_type is 'practice'
			new Practice(this)
		
		@game.prepare()

$(document).ready ->
	new Type().ready()