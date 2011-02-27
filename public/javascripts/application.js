// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
$.extend({
	keys: function(obj) {
		var a = []
		$.each(obj, function(k) {
			a.push(k)
		})
	}
})