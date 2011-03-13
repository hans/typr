(function() {
  var Game;
  Game = (function() {
    var COUNTDOWN_TIME, add_key_listener, add_player_row, countdown_el, find_room, first_poll, get_player_progress, highlight_leader, init_pollers, poll_server, prepare, room, server_poll, server_started, show_countdown, show_player_update, start, update_player_stats;
    function Game() {}
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
    return Game;
  })();
}).call(this);
