(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var ranges = {
  hours: [0, 23],
  minutes: [0, 59]
};

var validHours = /^([01]?[0-9]|2[0-3])/,
    validMinutes = /([0-5][0-9])$/,
    validTime = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

var Fugit = function Fugit($el) {

  this.$el = $el;
  this.$plugin = this.init();
  this.setTime(this.$el.val());
  this._updateInput();
};

Fugit.prototype.init = function () {

  this.$el.hide();

  var $pluginInputs = $('\n    <span class="fugit">\n      <div class="fugit-input fugit-hours" role="textbox" tabindex="0">00</div>\n      <div class="fugit-separator">:</div>\n      <div class="fugit-input fugit-minutes" role="textbox" tabindex="0">00</div>\n    </span>\n  ');

  $pluginInputs.insertAfter(this.$el);

  $pluginInputs.on('change.fugit', '.fugit-input', this._updateInput.bind(this)).on('keydown.fugit', '.fugit-input', this._handleKeyDown.bind(this));

  return $pluginInputs;
};

Fugit.prototype.setTime = function (time) {
  if (validTime.test(time)) {
    var _validTime$exec = validTime.exec(time),
        _validTime$exec2 = _slicedToArray(_validTime$exec, 3),
        t = _validTime$exec2[0],
        hours = _validTime$exec2[1],
        minutes = _validTime$exec2[2];

    this.$el.val(time).trigger('change');
    this.$plugin.find('.fugit-hours').text(hours);
    this.$plugin.find('.fugit-minutes').text(minutes);
  }
};

Fugit.prototype.setHours = function (value) {
  if (validHours.test(value)) {
    var _validHours$exec = validHours.exec(value),
        _validHours$exec2 = _slicedToArray(_validHours$exec, 2),
        t = _validHours$exec2[0],
        hours = _validHours$exec2[1];

    this.$el.val(this.$el.val().replace(validHours, hours)).trigger('change');
    this.$plugin.find('.fugit-hours').text(hours);
  }
};

Fugit.prototype.setMinutes = function (value) {
  if (validHours.test(value)) {
    var _validMinutes$exec = validMinutes.exec(value),
        _validMinutes$exec2 = _slicedToArray(_validMinutes$exec, 2),
        t = _validMinutes$exec2[0],
        minutes = _validMinutes$exec2[1];

    this.$el.val(this.$el.val().replace(validMinutes, minutes)).trigger('change');
    this.$plugin.find('.fugit-minutes').text(minutes);
  }
};

Fugit.prototype.getTime = function () {
  return this.$el.val();
};

Fugit.prototype.getHours = function () {
  return Number(this.$el.val().split(':')[0]);
};

Fugit.prototype.getMinutes = function () {
  return Number(this.$el.val().split(':')[1]);
};

Fugit.prototype.remove = function () {
  this.$el.removeData('fugit').show();
  this.$plugin.off('.fugit').remove();
};

Fugit.prototype._updateInput = function () {
  var timeParts = this.$plugin.find('.fugit-input').toArray().map(function (el) {
    return $(el).text() || '00';
  });
  this.$el.val(timeParts.join(':')).trigger('change.fugit');
};

Fugit.prototype._handleKeyDown = function (e) {

  var $input = $(e.currentTarget),
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
    var firstDir = e.key === 'ArrowRight' ? 'nextAll' : 'prevAll',
        lastDir = e.key === 'ArrowRight' ? 'prevAll' : 'nextAll';
    if ($input[firstDir]('.fugit-input').length) {
      $input[firstDir]('.fugit-input').focus();
    } else if ($input[lastDir]('.fugit-input').length) {
      $input[lastDir]('.fugit-input').focus();
    }
  }
};

exports.default = Fugit;
},{}],2:[function(require,module,exports){
'use strict';

var _fugit = require('./fugit');

var _fugit2 = _interopRequireDefault(_fugit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (factory) {

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else {
    factory(jQuery);
  }
})(function ($) {

  var pluginName = 'fugit';

  $.fn[pluginName] = function (option) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var result = void 0;

    this.each(function () {

      var $this = $(this),
          data = $this.data(pluginName);

      if (!data) {
        $this.data(pluginName, new _fugit2.default($this));
      } else if (typeof data[option] === 'function') {
        result = data[option].apply(data, args);
      }
    });

    return result || this;
  };
});
},{"./fugit":1}]},{},[2]);
