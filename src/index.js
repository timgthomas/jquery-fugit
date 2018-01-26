import Fugit from './fugit';

(function(factory) {

  if (typeof define === 'function' && define.amd) {
    define([ 'jquery' ], factory);
  } else {
    factory(jQuery);
  }

})(function($) {

  const pluginName = 'fugit';

  $.fn[pluginName] = function(option, ...args) {

    let result;

    this.each(function() {

      let $this = $(this),
          data = $this.data(pluginName);

      if (!data) {
        $this.data(pluginName, new Fugit($this));
      } else if (typeof data[option] === 'function') {
        result = data[option].apply(data, args);
      }

    });

    return result || this;

  };

});
