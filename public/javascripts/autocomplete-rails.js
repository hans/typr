(function() {
  /*
  * Unobtrusive autocomplete
  *
  * To use it, you just have to include the HTML attribute autocomplete
  * with the autocomplete URL as the value
  *
  *   Example:
  *       <input type="text" data-autocomplete="/url/to/autocomplete">
  *
  * Optionally, you can use a jQuery selector to specify a field that can
  * be updated with the element id whenever you find a matching value
  *
  *   Example:
  *       <input type="text" data-autocomplete="/url/to/autocomplete" id_element="#id_field">
  */  $(document).ready(function() {
    return $('input[data-autocomplete]').railsAutocomplete();
  });
  (function(jQuery) {
    var self;
    self = null;
    jQuery.fn.railsAutocomplete = function() {
      return this.live('focus', function() {
        if (!this.railsAutoCompleter) {
          return this.railsAutoCompleter = new jQuery.railsAutocomplete(this);
        }
      });
    };
    jQuery.railsAutocomplete = function(e) {
      var _e;
      _e = e;
      return this.init(_e);
    };
    jQuery.railsAutocomplete.fn = jQuery.railsAutocomplete.prototype = {
      railsAutocomplete: '0.0.1'
    };
    jQuery.railsAutocomplete.fn.extend = jQuery.railsAutocomplete.extend = jQuery.extend;
    return jQuery.railsAutocomplete.fn.extend({
      init: function(e) {
        var extractLast, split;
        e.delimiter = $(e).attr('data-delimiter') || null;
        split = function(val) {
          return val.split(e.delimiter);
        };
        extractLast = function(term) {
          return split(term).pop().replace(/^\s+/, "");
        };
        return $(e).autocomplete({
          source: function(request, response) {
            return $.getJSON($(e).attr('data-autocomplete'), {
              term: extractLast(request.term)
            }, response);
          },
          search: function() {
            var term;
            term = extractLast(this.value);
            if (term.length < 2) {
              return false;
            }
          },
          focus: function() {
            return false;
          },
          select: function(event, ui) {
            var terms;
            terms = split(this.value);
            terms.pop();
            terms.push(ui.item.value);
            if (e.delimiter != null) {
              terms.push("");
              this.value = terms.join(e.delimiter);
            } else {
              this.value = terms.join("");
              if ($(this).attr('id_element')) {
                $($(this).attr('id_element')).val(ui.item.id);
              }
            }
            return false;
          }
        });
      }
    });
  })(jQuery);
}).call(this);
