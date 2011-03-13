(function() {
  $.extend({
    keys: function(obj) {
      var a, k, _i, _len;
      a = [];
      for (_i = 0, _len = obj.length; _i < _len; _i++) {
        k = obj[_i];
        a.push(k);
      }
      return a;
    }
  });
  $(document).ready(function() {
    var bind, delete_row, edit_row, save_row;
    edit_row = function(row) {
      var keyboard_input, layout_select, save_link;
      layout_select = '<select name="new_profile_layout" id="new_profile_layout"><option name="QWERTY">QWERTY</option><option name="Dvorak">Dvorak</option><option name="Colemak">Colemak</option></select>';
      row.find('td:first').html(layout_select);
      keyboard_input = $('<input type="text" name="new_profile_keyboard" id="new_profile_keyboard" data-autocomplete="/profiles/autocomplete_profile_keyboard" />');
      keyboard_input.railsAutocomplete();
      row.find('td:eq(1)').html(keyboard_input);
      save_link = '<a href="javascript: void 0;" id="save_row">Save</a>';
      row.find('td:eq(2)').html(save_link);
      row.parent().append('<tr><td></td><td></td><td><a href="javascript: void 0;" id="add_row">Add</a></td></tr>');
      return bind();
    };
    save_row = function(row) {
      var first_col, keyboard, layout, second_col;
      first_col = row.find('td:first');
      second_col = row.find('td:eq(1)');
      layout = first_col.find('select#new_profile_layout').val();
      keyboard = second_col.find('input#new_profile_keyboard').val();
      return $.post('/profiles/save', {
        layout: layout,
        keyboard: keyboard
      }, function(data) {
        row.attr('id', data['profile']['id']);
        first_col.html(layout);
        second_col.html(keyboard);
        return row.find('td:eq(2)').html('<a href="javascript: void 0;" class="delete_row">Delete</a>');
      }, 'json');
    };
    delete_row = function(row) {
      return $.post('/profiles/delete', {
        id: row.attr('id')
      }, (function(data) {
        return row.remove();
      }), 'json');
    };
    bind = function() {
      $('#add_row').click(function() {
        return edit_row($(this.parentElement.parentElement));
      });
      $('#save_row').click(function() {
        return save_row($(this.parentElement.parentElement));
      });
      return $('.delete_row').click(function() {
        return delete_row($(this.parentElement.parentElement));
      });
    };
    return bind();
  });
}).call(this);
