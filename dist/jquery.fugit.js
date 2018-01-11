(function($) {

  const ranges = {
    hours:   [  0, 23 ],
    minutes: [  0, 59 ],
  };

  const validHours =   /^([01]?[0-9]|2[0-3])/,
        validMinutes = /([0-5][0-9])$/,
        validTime =    /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

  let Fugit = function($el) {

    this.$el = $el;
    this.$plugin = this.init();
    this._updateInput();

  };

  Fugit.prototype.init = function() {

    this.$el.hide();

    let $pluginInputs = $(`
      <span class="fugit">
        <div class="fugit-input fugit-hours" role="textbox" tabindex="0">00</div>
        <div class="fugit-separator">:</div>
        <div class="fugit-input fugit-minutes" role="textbox" tabindex="0">00</div>
      </span>
    `);

    $pluginInputs.insertAfter(this.$el);

    $pluginInputs
      .on('change.fugit', '.fugit-input', this._updateInput.bind(this))
      .on('keydown.fugit', '.fugit-input', this._handleKeyDown.bind(this));

    return $pluginInputs;

  };

  Fugit.prototype.setTime = function(time) {
    if (validTime.test(time)) {
      let [ t, hours, minutes ] = validTime.exec(time);
      this.$el.val(time).trigger('change');
      this.$plugin.find('.fugit-hours').text(hours);
      this.$plugin.find('.fugit-minutes').text(minutes);
    }
  };

  Fugit.prototype.setHours = function(value) {
    if (validHours.test(value)) {
      let [ t, hours ] = validHours.exec(value);
      this.$el.val(this.$el.val().replace(validHours, hours)).trigger('change');
      this.$plugin.find('.fugit-hours').text(hours);
    }
  };

  Fugit.prototype.setMinutes = function(value) {
    if (validHours.test(value)) {
      let [ t, minutes ] = validMinutes.exec(value);
      this.$el.val(this.$el.val().replace(validMinutes, minutes)).trigger('change');
      this.$plugin.find('.fugit-minutes').text(minutes);
    }
  };

  Fugit.prototype.getTime = function() {
    return this.$el.val();
  };

  Fugit.prototype.getHours = function() {
    return Number(this.$el.val().split(':')[0]);
  };

  Fugit.prototype.getMinutes = function() {
    return Number(this.$el.val().split(':')[1]);
  };

  Fugit.prototype.remove = function() {
    this.$el.removeData('fugit').show();
    this.$plugin.off('.fugit').remove();
  };

  Fugit.prototype._updateInput = function() {
    let timeParts = this.$plugin.find('.fugit-input').toArray().map(el => $(el).text() || '00');
    this.$el.val(timeParts.join(':')).trigger('change.fugit');
  };

  Fugit.prototype._handleKeyDown = function(e) {

    let $input = $(e.currentTarget),
        inputType = $input.is('.fugit-hours') ? 'hours' : 'minutes',
        newValue = Number($input.text());

    if (Number(e.key) == e.key) {
      if (newValue >= 10 || Number(newValue + '' + Number(e.key)) > ranges[inputType][1]) {
        newValue = Number(e.key);
      } else {
        newValue = Number(newValue + '' + Number(e.key));
      }
    }

    if (e.key === 'ArrowUp') {
      newValue += 1;
    } else if (e.key === 'ArrowDown') {
      newValue -= 1;
    }

    if (e.key === 'Backspace') {
      newValue = Number(String(newValue).padStart(2, '0').split('').shift());
      e.preventDefault();
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Backspace' || Number(e.key) == e.key) {
      if (newValue > ranges[inputType][1]) {
        newValue = ranges[inputType][0];
      } else if (newValue < ranges[inputType][0]) {
        newValue = ranges[inputType][1];
      }
      $input.text(String(newValue).padStart(2, '0')).trigger('change');
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      let firstDir = e.key === 'ArrowRight' ? 'nextAll' : 'prevAll',
          lastDir = e.key === 'ArrowRight' ? 'prevAll' : 'nextAll';
      if ($input[firstDir]('.fugit-input').length) {
        $input[firstDir]('.fugit-input').focus();
      } else if ($input[lastDir]('.fugit-input').length) {
        $input[lastDir]('.fugit-input').focus();
      }
    }

  };

  $.fn.fugit = function(option, ...args) {

    let result;

    this.each(function() {

      var $this = $(this),
          data = $this.data('fugit');

      if (!data) {
        $this.data('fugit', new Fugit($this));
      } else if (typeof data[option] === 'function') {
        result = data[option].apply(data, args);
      }

    });

    return result || this;

  };

}(jQuery));
