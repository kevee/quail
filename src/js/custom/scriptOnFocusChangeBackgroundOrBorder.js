/**
 * Test scriptOnFocusChangeBackgroundOrBorder.
 */
quail.scriptOnFocusChangeBackgroundOrBorder = function(quail, test, Case) {

  test.get('$scope').find('input,button,a').each(function() {
    var $this = $(this);

    var noFocus = {
      background: $this.css('background'),
      border: $this.css('border')
    };

    this.focus();

    var withFocus = {
      background: $this.css('background'),
      border: $this.css('border')
    };

    var sameBackground = noFocus.background === withFocus.background;
    var sameBorder = noFocus.border === noFocus.border;

    var status = 'passed';
    if (sameBackground && sameBorder) {
      status = 'failed';
    }

    test.add(Case({
      element: $this,
      expected: $this.closest('[data-expected]').data('expected'),
      message: JSON.stringify([noFocus, withFocus]),
      //message: 'Using script to change the background color or border of the element with focus',
      status: status
    }));

  });

};
