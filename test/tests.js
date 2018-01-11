const { module, test } = QUnit;

test('when initializing the plugin', assert => {

  let $input = $('<input>').appendTo('#qunit-fixture');
  $input.fugit();

  assert.ok($input.data('fugit'), 'should append the plugin data');
  assert.equal($('.fugit-input').length, 2, 'should render the pseudoinputs');
  assert.notOk($input.is(':visible'), 'should hide the initial input');

  $input.fugit('remove');

  assert.notOk($input.data('fugit'), 'should remove the plugin data');
  assert.equal($('.fugit').length, 0, 'should remove the added dom');
  assert.ok($input.is(':visible'), 'should show the initial input');

});

module('given an initialized plugin', {

  beforeEach() {
    let input = $('<input>').appendTo('#qunit-fixture');
    this.input = input.fugit();
    this.subject = this.input.parent();
  },

  afterEach() {
    this.input.fugit('remove');
  },

});

test('when no values have been entered', function(assert) {

  assert.equal(this.subject.find('input').val(), '00:00', 'should update the input');

});

test('when entering an hour value', function(assert) {

  this.subject.find('.fugit-hours').text('13').trigger('change');
  assert.equal(this.subject.find('input').val(), '13:00', 'should update the input');

});

test('when entering a minute value', function(assert) {

  this.subject.find('.fugit-minutes').text('37').trigger('change');
  assert.equal(this.subject.find('input').val(), '00:37', 'should update the input');

});

test('when entering a full value', function(assert) {

  this.subject.find('.fugit-hours').text('13').trigger('change');
  this.subject.find('.fugit-minutes').text('37').trigger('change');
  assert.equal(this.subject.find('input').val(), '13:37', 'should update the input');

});

test('when using arrow keys to change the hour value', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      input = this.subject.find('input');

  hoursInput.trigger({ type: 'keydown', key: 'ArrowUp' });
  assert.equal(input.val(), '01:00', 'should increase the value');

  hoursInput.trigger({ type: 'keydown', key: 'ArrowDown' });
  assert.equal(input.val(), '00:00', 'should decrease the value');

  hoursInput.trigger({ type: 'keydown', key: 'ArrowDown' });
  assert.equal(input.val(), '23:00', 'should roll the value down');

  hoursInput.trigger({ type: 'keydown', key: 'ArrowUp' });
  assert.equal(input.val(), '00:00', 'should roll the value up');

});

test('when using arrow keys to change the minute value', function(assert) {

  let minutesInput = this.subject.find('.fugit-minutes'),
      input = this.subject.find('input');

  minutesInput.trigger({ type: 'keydown', key: 'ArrowUp' });
  assert.equal(input.val(), '00:01', 'should increase the value');

  minutesInput.trigger({ type: 'keydown', key: 'ArrowDown' });
  assert.equal(input.val(), '00:00', 'should decrease the value');

  minutesInput.trigger({ type: 'keydown', key: 'ArrowDown' });
  assert.equal(input.val(), '00:59', 'should roll the value down');

  minutesInput.trigger({ type: 'keydown', key: 'ArrowUp' });
  assert.equal(input.val(), '00:00', 'should roll the value up');

});

test('when using arrow keys to switch between inputs', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      minutesInput = this.subject.find('.fugit-minutes');

  hoursInput.focus();
  assert.ok(hoursInput.is(':focus'));

  hoursInput.trigger({ type: 'keydown', key: 'ArrowRight' });
  assert.ok(minutesInput.is(':focus'));

  minutesInput.trigger({ type: 'keydown', key: 'ArrowRight' });
  assert.ok(hoursInput.is(':focus'));

  hoursInput.trigger({ type: 'keydown', key: 'ArrowLeft' });
  assert.ok(minutesInput.is(':focus'));

  minutesInput.trigger({ type: 'keydown', key: 'ArrowLeft' });
  assert.ok(hoursInput.is(':focus'));

});

test('when inputting a single-digit hour', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      input = this.subject.find('input');

  hoursInput.trigger({ type: 'keydown', key: '9' });

  assert.equal(input.val(), '09:00', 'should apply the value');

});

test('when inputting a double-digit hour', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      input = this.subject.find('input');

  hoursInput.trigger({ type: 'keydown', key: '1' });
  hoursInput.trigger({ type: 'keydown', key: '3' });

  assert.equal(input.val(), '13:00', 'should apply the value');

});

test('when inputting a necessarily single-digit hour', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      input = this.subject.find('input');

  this.input.fugit('setHours', '11');

  hoursInput.trigger({ type: 'keydown', key: '9' });

  assert.equal(input.val(), '09:00', 'should apply the value');

  hoursInput.trigger({ type: 'keydown', key: '8' });

  assert.equal(input.val(), '08:00', 'should apply a new value');

});

test('when backspacing a value', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      input = this.subject.find('input');

  this.input.fugit('setHours', '11');

  assert.equal(input.val(), '11:00', 'should apply the value');

  hoursInput.trigger({ type: 'keydown', key: 'Backspace' });

  assert.equal(input.val(), '01:00', 'should delete one character');

  hoursInput.trigger({ type: 'keydown', key: 'Backspace' });

  assert.equal(input.val(), '00:00', 'should delete the second character');

  hoursInput.trigger({ type: 'keydown', key: 'Backspace' });

  assert.equal(input.val(), '00:00', 'should do nothing');

});

test('when setting and getting values', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours'),
      minutesInput = this.subject.find('.fugit-minutes');

  this.input.fugit('setTime', '13:37');
  assert.equal(this.input.fugit('getTime'), '13:37', 'should set a valid value');
  assert.equal(hoursInput.text(), '13', 'should set the hours');
  assert.equal(minutesInput.text(), '37', 'should set the minutes');

  this.input.fugit('setTime', 'garbage');
  assert.equal(this.input.fugit('getTime'), '13:37', 'should not change the value for invalid input');

});

test('when setting and getting hours', function(assert) {

  let hoursInput = this.subject.find('.fugit-hours');

  this.input.fugit('setHours', '13');
  assert.equal(this.input.fugit('getHours'), 13, 'should set a valid hour value');
  assert.equal(this.input.fugit('getTime'), '13:00', 'should set a valid value');
  assert.equal(hoursInput.text(), '13', 'should set the hours');

  this.input.fugit('setTime', 'garbage');
  assert.equal(this.input.fugit('getTime'), '13:00', 'should not change the value for invalid input');

});

test('when setting and getting minutes', function(assert) {

  let minutesInput = this.subject.find('.fugit-minutes');

  this.input.fugit('setMinutes', '37');
  assert.equal(this.input.fugit('getMinutes'), 37, 'should set a valid hour value');
  assert.equal(this.input.fugit('getTime'), '00:37', 'should set a valid value');
  assert.equal(minutesInput.text(), '37', 'should set the hours');

  this.input.fugit('setTime', 'garbage');
  assert.equal(this.input.fugit('getTime'), '00:37', 'should not change the value for invalid input');

});
