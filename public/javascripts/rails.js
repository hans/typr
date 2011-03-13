(function() {
  /*
   * Unobtrusive scripting adapter for jQuery
   *
   * Requires jQuery 1.4.3 or later.
   * https:#github.com/rails/jquery-ujs
  */  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  (function($) {
    var CSRFProtection, allowAction, disableFormElements, enableFormElements, fire, handleMethod, handleRemote, requiredValuesMissing;
    CSRFProtection = function(xhr) {
      var token;
      token = $('meta[name="csrf-token"]').attr('content');
      if (token) {
        return xhr.setRequestHeader('X-CSRF-Token', token);
      }
    };
    if (__indexOf.call($, 'ajaxPrefilter') >= 0) {
      $.ajaxPrefilter(function(options, originalOptions, xhr) {
        return CSRFProtection(xhr);
      });
    } else {
      $(document).ajaxSend(function(e, xhr) {
        return CSRFProtection(xhr);
      });
    }
    fire = function(obj, name, data) {
      var event;
      event = new $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    };
    handleRemote = function(element) {
      var button, data, dataType, method, url;
      dataType = element.attr('data-type') || ($.ajaxSettings && $.ajaxSettings.dataType);
      if (element.is('form')) {
        method = element.attr('method');
        url = element.attr('action');
        data = element.serializeArray();
        button = element.data('ujs:submit-button');
        if (button) {
          data.push(button);
          element.data('ujs:submit-button', null);
        }
      } else {
        method = element.attr('data-method');
        url = element.attr('href');
        data = null;
      }
      return $.ajax({
        url: url,
        type: method || 'GET',
        data: data,
        dataType: dataType,
        beforeSend: function(xhr, settings) {
          if (settings.dataType == null) {
            xhr.setRequestHeader('accept', "*/*;q=0.5, " + settings.accepts.script);
          }
          return fire(element, 'ajax:beforeSend', [xhr, settings]);
        },
        success: function(data, status, xhr) {
          return element.trigger('ajax:success', [data, status, xhr]);
        },
        complete: function(xhr, status) {
          return element.trigger('ajax:complete', [xhr, status]);
        },
        error: function(xhr, status, error) {
          return element.trigger('ajax:error', [xhr, status, error]);
        }
      });
    };
    handleMethod = function(link) {
      var csrf_param, csrf_token, form, href, metadata_input, method;
      href = link.attr('href');
      method = link.attr('data-method');
      csrf_token = $('meta[name=csrf-token]').attr('content');
      csrf_param = $('meta[name=csrf-param]').attr('content');
      form = $('<form method="post" action="' + href + '"></form>');
      metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';
      if ((csrf_param != null) && (csrf_token != null)) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }
      form.hide().append(metadata_input).appendTo('body');
      return form.submit();
    };
    disableFormElements = function(form) {
      return form.find('input[data-disable-with]').each(function() {
        var input;
        input = $(this);
        return input.data('ujs:enable-with', input.val()).val(input.attr('data-disable-with')).attr('disabled', 'disabled');
      });
    };
    enableFormElements = function(form) {
      return form.find('input[data-disable-with]').each(function() {
        var input;
        input = $(this);
        return input.val(input.data('ujs:enable-with')).removeAttr('disabled');
      });
    };
    allowAction = function(element) {
      var message;
      message = element.attr('data-confirm');
      return !message || (fire(element, 'confirm') && confirm(message));
    };
    requiredValuesMissing = function(form) {
      var missing;
      missing = false;
      form.find('input[name][required]').each(function() {
        if (!$(this).val()) {
          return missing = true;
        }
      });
      return missing;
    };
    $('a[data-confirm], a[data-method], a[data-remote]').live('click.rails', function(e) {
      var link;
      link = $(this);
      if (!allowAction(link)) {
        return false;
      }
      if (link.attr('data-remote') != null) {
        handleRemote(link);
        return false;
      } else if (link.attr('data-method')) {
        handleMethod(link);
        return false;
      }
    });
    $('form').live('submit.rails', function(e) {
      var form, remote;
      form = $(this);
      remote = form.attr('data-remote') != null;
      if (!allowAction(form)) {
        return false;
      }
      if (requiredValuesMissing(form)) {
        return !remote;
      }
      if (remote) {
        handleRemote(form);
        return false;
      } else {
        return setTimeout((function() {
          return disableFormElements(form);
        }), 13);
      }
    });
    $('form input[type=submit], form button[type=submit], form button:not([type])').live('click.rails', function() {
      var button, data, name;
      button = $(this);
      if (!allowAction(button)) {
        return false;
      }
      name = button.attr('name');
      data = name ? {
        name: name,
        value: button.val()
      } : null;
      return button.closest('form').data('ujs:submit-button', data);
    });
    $('form').live('ajax:beforeSend.rails', function(event) {
      if (this === event.target) {
        return disableFormElements($(this));
      }
    });
    return $('form').live('ajax:complete.rails', function(event) {
      if (this === event.target) {
        return enableFormElements($(this));
      }
    });
  })(jQuery);
}).call(this);
