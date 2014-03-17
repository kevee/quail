quail.doNotUseGraphicalSymbolToConveyInformation = function() {
  quail.html.find(quail.textSelector).each(function() {
    // @todo: add a list of allowed values.
    var text = $(this).text();
    if (text.length === 1) {
      // Check regularly used single character symbols.
      if ('?xo[]()+-!*xX'.indexOf(text) >= 0) {
        quail.testFails('doNotUseGraphicalSymbolToConveyInformation', $(this));
      }
    }
    else {
      // @todo add support for other languages.
      // Remove all alphanumeric characters.
      var textLeft = text.replace(/[\W\s]+/g, '');
      // If we have an empty string something is wrong.
      if (textLeft.length === 0) {
        quail.testFails('doNotUseGraphicalSymbolToConveyInformation', $(this));
      }
    }
  });
};
