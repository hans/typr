(function() {
  var Game;
  Game = (function() {
    var add_key_listener, prepare, start;
    function Game() {}
    prepare = function() {
      return $.get("/type/copy/" + copy_category, null, function(copy) {
        var poll, split, stats_poll;
        split = copy['copy']['content'].split(' ');
        this.parent.prepare_copy(split, copy['copy']['note']);
        add_key_listener();
        poll = setInterval(eval_next_in_queue, 30);
        return stats_poll = setInterval(calculate_stats, 500);
      }, 'json');
    };
    start = function() {
      var start_time;
      this.parent.hide_notifications();
      return start_time = new Date();
    };
    add_key_listener = function() {
      return type_area.keyup(function(event) {
        var can_show_error;
        can_show_error = true;
        if (typeof start_time == "undefined" || start_time === null) {
          this.parent.start();
        }
        return check_queue.push(event.keyCode);
      });
    };
    return Game;
  })();
}).call(this);
