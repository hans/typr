(function() {
  var Type;
  Type = (function() {
    var calculate_stats, can_show_error, chars_typed, check_queue, copy_category, cur_word, cur_word_idx, done, end_time, eval_next_in_queue, game, hide_error, hide_notifications, is_done, next_word, num_words, poll, prepare_copy, show_error, start_time, stat_cpm, stat_delta, stat_progress, stat_wpm, stats_poll, submit_results, total_chars, type_area, words, words_typed;
    function Type() {}
    cur_word_idx = -1;
    cur_word = '';
    copy_category = 1;
    words = null;
    num_words = 0;
    check_queue = [];
    poll = null;
    stats_poll = null;
    can_show_error = true;
    start_time = null;
    end_time = null;
    type_area = null;
    stat_delta = null;
    stat_wpm = null;
    stat_cpm = null;
    stat_progress = null;
    is_done = false;
    words_typed = 0;
    chars_typed = 0;
    total_chars = 0;
    game = null;
    prepare_copy = function(words_arr, note) {
      var word, _i, _len;
      for (_i = 0, _len = words_arr.length; _i < _len; _i++) {
        word = words_arr[_i];
        $('#copy').append("<span class='word'>" + word + "</span>&nbsp;");
      }
      $('#note').text(note);
      words = $('#copy span.word');
      num_words = words_arr.length;
      total_chars = $('#copy').text().length;
      return next_word();
    };
    hide_notifications = function() {
      return $('.notification').css('visibility', 'hidden');
    };
    eval_next_in_queue = function() {
      var check, code, typed_text;
      if (check_queue.length === 0) {
        return;
      }
      code = check_queue.shift();
      typed_text = type_area.val().split(' ')[0];
      check = cur_word.substr(0, typed_text.length);
      if (code === 32) {
        if (typed_text.length === cur_word.length && typed_text === check) {
          return next_word();
        } else {
          return show_error();
        }
      } else {
        if (typed_text !== check) {
          return show_error();
        } else {
          return chars_typed += 1;
        }
      }
    };
    next_word = function() {
      var old_word;
      old_word = cur_word;
      cur_word_idx += 1;
      words_typed += 1;
      chars_typed += 1;
      if (words[cur_word_idx] != null) {
        cur_word = words[cur_word_idx].innerHTML;
        if (words[cur_word_idx - 1] != null) {
          $(words[cur_word_idx - 1]).removeClass('personal-highlight');
        }
        $(words[cur_word_idx]).addClass('personal-highlight');
        return type_area.val(type_area.val().replace(old_word + ' ', ''));
      } else {
        return done();
      }
    };
    done = function() {
      is_done = true;
      clearInterval(poll);
      clearInterval(stats_poll);
      end_time = new Date();
      type_area.css('background-color', '#6fbf4d');
      calculate_stats();
      return submit_results(num_words, stat_delta, stat_wpm, stat_cpm);
    };
    calculate_stats = function() {
      var compare_time;
      compare_time = end_time != null ? end_time : new Date();
      stat_delta = (compare_time.getTime() - start_time.getTime()) / 60000;
      stat_wpm = Math.round(words_typed / stat_delta);
      stat_cpm = Math.round(chars_typed / stat_delta);
      $('#results-wpm').text(stat_wpm);
      return $('#results-cpm').text(stat_cpm);
    };
    submit_results = function(words, duration, words_per_minute, characters_per_minute) {
      return $.post('/type/submit', {
        words: words,
        duration: stat_delta,
        wpm: words_per_minute,
        cpm: characters_per_minute
      }, null, 'json');
    };
    show_error = function() {
      if (can_show_error) {
        type_area.css('background-color', '#ff7878');
        setTimeout(hide_error, 500);
      }
      return can_show_error = false;
    };
    hide_error = function() {
      return type_area.css('background-color', '#fafafa');
    };
    $(document).ready(function() {
      type_area = $('#type_area');
      game = new Game();
      game.parent = this;
      return game.prepare();
    });
    return Type;
  })();
}).call(this);
