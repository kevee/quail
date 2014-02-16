quail.scriptFocusIndicatorVisible = function() {
  quail.html.find(quail.focusElements).each(function() {

    // Preparation for test: remove focus indicators done with CSS
    var sheet, rules, rule;

    for (var i = 0, l = document.styleSheets.length; i < l; ++i) {
      sheet = document.styleSheets[i];
      rules = sheet.cssRules || sheet.rules;

      for (var j = rules.length - 1; j >= 0; --j) {
        rule = rules[j];

        // TODO: make sure it does not delete in-context `:focus` like `a[attr="yada:focusyada"]`
        if (rule.selectorText.indexOf(':focus') !== -1) {
          sheet.deleteRule(j);
        }
      }
    }

    var noFocus = {
      borderWidth : $(this).css('border-width'),
      borderColor : $(this).css('border-color'),
      backgroundColor : $(this).css('background-color'),
      boxShadow : $(this).css('box-shadow')
    };
    $(this).focus();
    if(noFocus.backgroundColor !== $(this).css('background-color')) {
      $(this).blur();
      return;
    }
    
    var borderWidth = quail.components.convertToPx($(this).css('border-width'));
    if(borderWidth > 2 && borderWidth !== quail.components.convertToPx(noFocus.borderWidth)) {
      $(this).blur();
      return;
    }
    
    var boxShadow = ($(this).css('box-shadow') && $(this).css('box-shadow') !== 'none') ? $(this).css('box-shadow').match(/(-?\d+px)|(rgb\(.+\))/g) : false;
    if(boxShadow && $(this).css('box-shadow') !== noFocus.boxShadow && quail.components.convertToPx(boxShadow[3]) > 3) {
      $(this).blur();
      return;
    }
    $(this).blur();
    quail.testFails('focusIndicatorVisible', $(this));

    // TODO : re-add the deleted CSS here
  });
};