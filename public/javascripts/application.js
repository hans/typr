// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$.extend({
	keys: function(obj) {
		var a = []
		$.each(obj, function(k) {
			a.push(k)
		})
		
		return a
	}
})

$(document).ready(function() {
	function edit_row(row) {
		var layout_select = '<select name="new_profile_layout" id="new_profile_layout"><option name="QWERTY">QWERTY</option><option name="Dvorak">Dvorak</option><option name="Colemak">Colemak</option></select>'
		row.find('td:first').html(layout_select)
		
		var keyboard_input = '<input type="text" name="new_profile_keyboard" id="new_profile_keyboard" />'
		row.find('td:eq(1)').html(keyboard_input)
		
		var save_link = '<a href="javascript: void 0;" id="save_row">Save</a>'
		row.find('td:eq(2)').html(save_link)
		
		row.parent().append('<tr><td></td><td></td><td><a href="javascript: void 0;" id="add_row">Add</a></td></tr>')
		bind()
	}
	
	function save_row(row) {
		var first_col = row.find('td:first')
		var second_col = row.find('td:eq(1)')
		
		var layout = first_col.find('select#new_profile_layout').val()
		var keyboard = second_col.find('input#new_profile_keyboard').val()
		
		$.post('/profiles/save', {
			layout: layout,
			keyboard: keyboard
		}, function(data) {
			console.log(data);
			row.attr('id', data['profile']['id'])
			first_col.html(layout)
			second_col.html(keyboard)
			row.find('td:eq(2)').html('<a href="javascript: void 0;" class="delete_row">Delete</a>')
		}, 'json')
	}
	
	function delete_row(row) {
		$.post('/profiles/delete', {
			id: row.attr('id')
		}, function(data) {
			row.remove()
		}, 'json')
	}
	
	function bind() {
		$('#add_row').click(function() {
			edit_row($(this.parentElement.parentElement))
		})
		
		$('#save_row').click(function() {
			save_row($(this.parentElement.parentElement))
		})
		
		$('.delete_row').click(function() {
			delete_row($(this.parentElement.parentElement))
		})
	}
	
	bind()
})