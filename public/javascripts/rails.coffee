###
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.4.3 or later.
 * https:#github.com/rails/jquery-ujs
###

( ($) ->
	# Make sure that every Ajax request sends the CSRF token
	CSRFProtection = (xhr) ->
		token = $('meta[name="csrf-token"]').attr 'content'
		xhr.setRequestHeader('X-CSRF-Token', token) if token
	
	if 'ajaxPrefilter' in $
		$.ajaxPrefilter (options, originalOptions, xhr) -> CSRFProtection(xhr)
	else
		$(document).ajaxSend (e, xhr) -> CSRFProtection(xhr)
	
	# Triggers an event on an element and returns the event result
	fire = (obj, name, data) ->
		event = new $.Event name
		obj.trigger event, data
		return event.result != false
	
	# Submits "remote" forms and links with ajax
	handleRemote = (element) ->
		dataType = element.attr('data-type') || ( $.ajaxSettings and $.ajaxSettings.dataType )

		if element.is('form')
			method = element.attr 'method'
			url = element.attr 'action'
			data = element.serializeArray()
			# memoized value from clicked submit button
			button = element.data 'ujs:submit-button'
			if button
				data.push button
				element.data 'ujs:submit-button', null
		else
			method = element.attr 'data-method'
			url = element.attr 'href'
			data = null

		$.ajax
			url: url
			type: method || 'GET'
			data: data
			dataType: dataType
			# stopping the "ajax:beforeSend" event will cancel the ajax request
			beforeSend: (xhr, settings) ->
				unless settings.dataType?
					xhr.setRequestHeader 'accept', "*/*;q=0.5, #{settings.accepts.script}"
				fire element, 'ajax:beforeSend', [xhr, settings]
			success: (data, status, xhr) ->
				element.trigger 'ajax:success', [data, status, xhr]
			complete: (xhr, status) ->
				element.trigger 'ajax:complete', [xhr, status]
			error: (xhr, status, error) ->
				element.trigger 'ajax:error', [xhr, status, error]
	
	# Handles "data-method" on links such as:
	# <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
	handleMethod = (link) ->
		href = link.attr('href')
		method = link.attr('data-method')
		csrf_token = $('meta[name=csrf-token]').attr('content')
		csrf_param = $('meta[name=csrf-param]').attr('content')
		form = $('<form method="post" action="' + href + '"></form>')
		metadata_input = '<input name="_method" value="' + method + '" type="hidden" />'

		if csrf_param? and csrf_token?
			metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />'

		form.hide().append(metadata_input).appendTo 'body'
		form.submit()
	
	disableFormElements = (form) ->
		form.find('input[data-disable-with]').each ->
			input = $(this)
			input.data('ujs:enable-with', input.val())
				.val(input.attr('data-disable-with'))
				.attr('disabled', 'disabled')
	
	enableFormElements = (form) ->
		form.find('input[data-disable-with]').each ->
			input = $(this)
			input.val(input.data('ujs:enable-with')).removeAttr 'disabled'
	
	allowAction = (element) ->
		message = element.attr 'data-confirm'
		!message || ( fire(element, 'confirm') and confirm(message) )
	
	requiredValuesMissing = (form) ->
		missing = false
		form.find('input[name][required]').each ->
			missing = true unless $(this).val()
		missing
	
	$('a[data-confirm], a[data-method], a[data-remote]').live 'click.rails', (e) ->
		link = $(this)
		return false unless allowAction(link)

		if link.attr('data-remote')?
			handleRemote link
			return false
		else if link.attr('data-method')
			handleMethod link
			return false
	
	$('form').live 'submit.rails', (e) ->
		form = $(this)
		remote = form.attr('data-remote')?
		
		return false unless allowAction(form)

		# skip other logic when required values are missing
		return !remote if requiredValuesMissing(form)
		
		if remote
			handleRemote form
			return false
		else
			# slight timeout so that the submit button gets properly serialized
			setTimeout ( -> disableFormElements(form) ), 13
	
	$('form input[type=submit], form button[type=submit], form button:not([type])').live 'click.rails', ->
		button = $(this)
		return false unless allowAction(button)
		# register the pressed submit button
		name = button.attr('name')
		data = if name then (
			name: name
			value: button.val()
		) else null
		
		button.closest('form').data 'ujs:submit-button', data
	
	$('form').live 'ajax:beforeSend.rails', (event) ->
		disableFormElements($(this)) if this is event.target
	
	$('form').live 'ajax:complete.rails', (event) ->
		enableFormElements($(this)) if this is event.target
) jQuery