import Fugit from './fugit';

(function($) {

  $.fn.fugit = function(option, ...args) {

    let result;

    this.each(function() {

      let $this = $(this),
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
