# Place your application-specific JavaScript functions and classes here
# This file is automatically included by javascript_include_tag :defaults
$.extend
	keys: (obj) ->
		a = []
		a.push k for k in obj
		a

$(document).ready ->
	edit_row = (row) ->
		layout_select = '<select name="new_profile_layout" id="new_profile_layout"><option name="QWERTY">QWERTY</option><option name="Dvorak">Dvorak</option><option name="Colemak">Colemak</option></select>'
		row.find('td:first').html layout_select
		
		keyboard_input = $('<input type="text" name="new_profile_keyboard" id="new_profile_keyboard" data-autocomplete="/profiles/autocomplete_profile_keyboard" />')
		keyboard_input.railsAutocomplete()
		row.find('td:eq(1)').html keyboard_input
		
		save_link = '<a href="javascript: void 0;" id="save_row">Save</a>'
		row.find('td:eq(2)').html save_link
		
		row.parent().append '<tr><td></td><td></td><td><a href="javascript: void 0;" id="add_row">Add</a></td></tr>'
		bind()
	
	save_row = (row) ->
		first_col = row.find 'td:first'
		second_col = row.find 'td:eq(1)'
		
		layout = first_col.find('select#new_profile_layout').val()
		keyboard = second_col.find('input#new_profile_keyboard').val()
		
		$.post '/profiles/save',
			layout: layout
			keyboard: keyboard
		, (data) ->
			row.attr 'id', data['profile']['id']
			first_col.html layout
			second_col.html keyboard
			row.find('td:eq(2)').html '<a href="javascript: void 0;" class="delete_row">Delete</a>'
		, 'json'
	
	delete_row = (row) ->
		$.post '/profiles/delete',
			id: row.attr 'id'
		, ( (data) -> row.remove() ),
		'json'
	
	bind = ->
		$('#add_row').click ->
			edit_row $(this.parentElement.parentElement)
		
		$('#save_row').click ->
			save_row $(this.parentElement.parentElement)
		
		$('.delete_row').click ->
			delete_row $(this.parentElement.parentElement)
	
	bind()