// global variables
cur_word_idx = -1
cur_word = ''

// chosen copy category.
// this will be used.. later
// 1 = literary passages, 2 = news, 3 = random words
copy_category = 1

// an array of words in the copy, filled by prepare_copy()
words = null

// an array of recently-typed characters, sorted from oldest to newest.
// this is digested by eval_next_in_queue().
// adding char codes to queue + polling > event-based checks, on some slower systems
check_queue = []

// stores the interval timer so that polling can stop once typing finishes
poll = null

// prevent continuous flashing when a typing error occurs
// (since the polling function would keep noticing the error until it was fixed)
can_show_error = true

// track start time and end time for calculating stats
start_time = null
end_time = null

// used to store DOM els rather than continually fetch them
// set @ $(document).ready()
type_area = null

// convert plain-text copy to something we can highlight more easily
function prepare_copy() {
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

function eval_next_in_queue() {
	if ( check_queue.length == 0 ) return;
	
	var code = check_queue.shift()
	var typed_text = type_area.val().split(' ')[0]
	var check = cur_word.substr(0, typed_text.length)
	
	if ( code == 32 ) // spacebar
		if ( typed_text.length == cur_word.length && typed_text == check )
			next_word()
		else
			show_error()
	else
		if ( typed_text != check )
			show_error()
}

function next_word() {
	var old_word = cur_word
	cur_word_idx += 1
	
	if ( words[cur_word_idx] == undefined ) {
		done()
	} else {
		cur_word = words[cur_word_idx].innerText
	
		// remove highlighting from the old word
		if ( words[cur_word_idx - 1] != undefined )
			words[cur_word_idx - 1].style.color = 'inherit'
		
		// highlight the new word
		words[cur_word_idx].style.color = '#6fbf4d'
		
		// remove this successfully-typed word from the entry box
		// but don't remove any other things that could've been typed since the success!
		// String.replace(str) replaces the first occurrence only
		type_area.val(type_area.val().replace(old_word + ' ', ''));
	}
}

function done() {
	end_time = new Date()
	clearInterval(poll)
	type_area.css('background-color', '#6fbf4d')
	
	calculate_stats()
	$('#results').show()
}

function calculate_stats() {
	delta = ( end_time.getTime() - start_time.getTime() ) / 60000
	
	words_per_minute = words.length / delta
	characters_per_minute = $('#copy').text().length / delta
	
	$('#results-wpm').text(Math.round(words_per_minute))
	$('#results-cpm').text(Math.round(characters_per_minute))
	
	submit_results(words.length, delta, words_per_minute, characters_per_minute)
}

function submit_results(words, duration, words_per_minute, characters_per_minute) {
	$.post('/type/submit', {
		words: words,
		duration: delta,
		wpm: words_per_minute,
		cpm: characters_per_minute
	}, null, 'json')
}

function show_error() {
	if ( can_show_error ) {
		type_area.css('background-color', '#ff7878')
		setTimeout(hide_error, 500)
	}
	
	can_show_error = false
}

function hide_error() {
	type_area.css('background-color', '#fafafa')
}

$(document).ready(function() {
	type_area = $('#type_area')
	
	prepare_copy()
	
	type_area.keyup(function(event) {
		can_show_error = true
		if ( start_time == null ) start_time = new Date()
		
		check_queue.push(event.keyCode)
	})
	
	poll = setInterval(eval_next_in_queue, 100)
})