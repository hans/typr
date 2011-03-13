(function() {
  var Compete, Practice, Type;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Compete = (function() {
    var COUNTDOWN_TIME, add_key_listener, add_player_row, countdown_el, find_room, first_poll, get_player_progress, highlight_leader, init_pollers, poll_server, prepare, room, server_poll, server_started, show_countdown, show_player_update, start, update_player_stats;
    function Compete(parent) {
      this.parent = parent;
    }
    COUNTDOWN_TIME = 15;
    countdown_el = null;
    room = null;
    server_poll = null;
    first_poll = true;
    server_started = false;
    prepare = function() {
      countdown_el = $('#countdown');
      return find_room();
    };
    add_key_listener = function() {
      return type_area.keyup(function(event) {
        var can_show_error;
        can_show_error = true;
        return check_queue.push(event.keyCode);
      });
    };
    find_room = function() {
      return $.get('/type/compete/room/find', null, function(_room) {
        room = _room;
        room[0] = parseInt(room[0]);
        $.each(room[1], function(idx, player) {
          add_player_row(idx, player);
          return show_player_update(idx, player);
        });
        this.parent.prepare_copy(room[2][0].split(' '), room[2][1]);
        return init_pollers();
      }, 'json');
    };
    start = function() {
      return $.get("/type/compete/room/" + room[0] + "/start", null, function(data) {
        var start_time, stats_poll;
        this.parent.hide_notifications();
        start_time = new Date();
        stats_poll = setInterval(calculate_stats, 500);
        type_area.removeAttr('disabled').focus();
        return add_key_listener();
      });
    };
    update_player_stats = function(players) {
      return $.each(players, function(idx, player) {
        if (room[1][idx] != null) {
          room[1][idx].wpm = player.wpm;
          room[1][idx].cpm = player.cpm;
          room[1][idx].cur_word_idx = player.cur_word_idx;
          room[1][idx].done = player.done;
        } else {
          room[1][idx] = player;
          add_player_row(idx, player);
        }
        return show_player_update(idx, player);
      });
    };
    add_player_row = function(cur_player_id, player) {
      $('table.stats').append("<tr id='player-" + cur_player_id + "'><td>" + player.name + "</td><td></td><td>" + player.wpm + "</td><td>" + player.cpm + "</td></tr>");
      return $($("table.stats tr#player-" + cur_player_id + " td")[1]).progressbar();
    };
    show_player_update = function(cur_player_id, player) {
      var columns;
      columns = $("table.stats tr#player-" + cur_player_id + " td");
      $(columns[1]).progressbar('value', get_player_progress(player.cur_word_idx) * 100);
      $(columns[2]).text(player.wpm);
      return $(columns[3]).text(player.cpm);
    };
    get_player_progress = function(player_cur_word_idx) {
      return player_cur_word_idx / num_words;
    };
    show_countdown = function(time_left) {
      return countdown_el.text(time_left);
    };
    highlight_leader = function() {
      var sorted_players;
      sorted_players = $.keys(room[1]);
      sorted_players = sorted_players.sort(function(a, b) {
        return room[1][b].cur_word_idx - room[1][a].cur_word_idx;
      });
      if (sorted_players[0].id === player_id && (sorted_players[1] != null)) {
        this.parent.words.removeClass('leader-highlight');
        return $(this.parent.words[room[1][sorted_players[1]].cur_word_idx]).addClass('leader-highlight');
      } else {
        this.parent.words.removeClass('leader-highlight');
        return $(this.parent.words[room[1][sorted_players[0]].cur_word_idx]).addClass('leader-highlight');
      }
    };
    init_pollers = function() {
      server_poll = setInterval(poll_server, 2000);
      return this.parent.poll = setInterval(eval_next_in_queue, 30);
    };
    poll_server = function() {
      var time_before_start, url;
      if (typeof start_time == "undefined" || start_time === null) {
        time_before_start = room[0] + COUNTDOWN_TIME - (new Date().getTime() / 1000);
        show_countdown(Math.round(time_before_start));
        if (!server_started && time_before_start < 0) {
          server_started = true;
          start();
        } else {
          setTimeout(poll_server, 1000);
        }
        return;
      }
      if (first_poll) {
        first_poll = false;
        return;
      }
      url = "/type/compete/room/" + room[0] + "/" + player_id;
      return $.post(url, {
        player_id: player_id,
        player_name: player_name,
        wpm: this.parent.stat_wpm,
        cpm: this.parent.stat_cpm,
        cur_word_idx: this.parent.cur_word_idx,
        done: this.parent.is_done
      }, function(data) {
        update_player_stats(data[1]);
        return highlight_leader();
      }, 'json');
    };
    return Compete;
  })();
  Practice = (function() {
    function Practice(parent) {
      this.parent = parent;
    }
    Practice.prototype.prepare = function() {
      window.foo = this.parent;
      console.log(this.parent, this.parent.prepare_copy);
      return $.get("/type/copy/" + this.parent.copy_category, null, __bind(function(copy) {
        var split;
        split = copy['copy']['content'].split(' ');
        this.parent.prepare_copy(split, copy['copy']['note']);
        this.add_key_listener();
        this.parent.poll = setInterval(this.parent.eval_next_in_queue, 30);
        return this.parent.stats_poll = setInterval(this.parent.calculate_stats, 500);
      }, this), 'json');
    };
    Practice.prototype.start = function() {
      this.parent.hide_notifications();
      return this.parent.start_time = new Date();
    };
    Practice.prototype.add_key_listener = function() {
      return this.parent.type_area.keyup(__bind(function(event) {
        this.parent.can_show_error = true;
        if (this.parent.start_time == null) {
          this.start();
        }
        return this.parent.check_queue.push(event.keyCode);
      }, this));
    };
    return Practice;
  })();
  Type = (function() {
    function Type() {
      this.hide_error = __bind(this.hide_error, this);;
      this.calculate_stats = __bind(this.calculate_stats, this);;
      this.next_word = __bind(this.next_word, this);;
      this.eval_next_in_queue = __bind(this.eval_next_in_queue, this);;      this.cur_word_idx = -1;
      this.cur_word = '';
      this.copy_category = 1;
      this.words = null;
      this.num_words = 0;
      this.check_queue = [];
      this.poll = null;
      this.stats_poll = null;
      this.can_show_error = true;
      this.start_time = null;
      this.end_time = null;
      this.type_area = null;
      this.stat_delta = null;
      this.stat_wpm = null;
      this.stat_cpm = null;
      this.stat_progress = null;
      this.is_done = false;
      this.words_typed = 0;
      this.chars_typed = 0;
      this.total_chars = 0;
      this.game = null;
    }
    Type.prototype.prepare_copy = function(words_arr, note) {
      var word, _i, _len;
      for (_i = 0, _len = words_arr.length; _i < _len; _i++) {
        word = words_arr[_i];
        $('#copy').append("<span class='word'>" + word + "</span>&nbsp;");
      }
      $('#note').text(note);
      this.words = $('#copy span.word');
      this.num_words = words_arr.length;
      this.total_chars = $('#copy').text().length;
      return this.next_word();
    };
    Type.prototype.hide_notifications = function() {
      return $('.notification').css('visibility', 'hidden');
    };
    Type.prototype.eval_next_in_queue = function() {
      var check, code, typed_text;
      if (this.check_queue.length === 0) {
        return;
      }
      code = this.check_queue.shift();
      typed_text = this.type_area.val().split(' ')[0];
      check = this.cur_word.substr(0, typed_text.length);
      if (code === 32) {
        if (typed_text.length === this.cur_word.length && typed_text === check) {
          return this.next_word();
        } else {
          return this.show_error();
        }
      } else {
        if (typed_text !== check) {
          return this.show_error();
        } else {
          return this.chars_typed += 1;
        }
      }
    };
    Type.prototype.next_word = function() {
      var old_word;
      old_word = this.cur_word;
      this.cur_word_idx += 1;
      this.words_typed += 1;
      this.chars_typed += 1;
      if (this.words[this.cur_word_idx] != null) {
        this.cur_word = this.words[this.cur_word_idx].innerHTML;
        if (this.words[this.cur_word_idx - 1] != null) {
          $(this.words[this.cur_word_idx - 1]).removeClass('personal-highlight');
        }
        $(this.words[this.cur_word_idx]).addClass('personal-highlight');
        return this.type_area.val(this.type_area.val().replace(old_word + ' ', ''));
      } else {
        return this.done();
      }
    };
    Type.prototype.done = function() {
      this.is_done = true;
      clearInterval(this.poll);
      clearInterval(this.stats_poll);
      this.end_time = new Date();
      this.type_area.css('background-color', '#6fbf4d');
      this.calculate_stats();
      return this.submit_results(this.num_words, this.stat_delta, this.stat_wpm, this.stat_cpm);
    };
    Type.prototype.calculate_stats = function() {
      var compare_time;
      compare_time = this.end_time != null ? this.end_time : new Date();
      this.stat_delta = (compare_time.getTime() - this.start_time.getTime()) / 60000;
      this.stat_wpm = Math.round(this.words_typed / this.stat_delta);
      this.stat_cpm = Math.round(this.chars_typed / this.stat_delta);
      $('#results-wpm').text(this.stat_wpm);
      return $('#results-cpm').text(this.stat_cpm);
    };
    Type.prototype.submit_results = function(words, duration, words_per_minute, characters_per_minute) {
      return $.post('/type/submit', {
        words: words,
        duration: this.stat_delta,
        wpm: words_per_minute,
        cpm: characters_per_minute
      }, null, 'json');
    };
    Type.prototype.show_error = function() {
      if (this.can_show_error) {
        this.type_area.css('background-color', '#ff7878');
        setTimeout(this.hide_error, 500);
      }
      return this.can_show_error = false;
    };
    Type.prototype.hide_error = function() {
      return this.type_area.css('background-color', '#fafafa');
    };
    Type.prototype.ready = function() {
      this.type_area = $('#type_area');
      this.game = game_type === 'compete' ? new Compete(this) : game_type === 'practice' ? new Practice(this) : void 0;
      return this.game.prepare();
    };
    return Type;
  })();
  $(document).ready(function() {
    return new Type().ready();
  });
}).call(this);
