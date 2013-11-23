(function($) {
  $(document).ready(function() {
    var messages = { imgHasAlt : 'Your images are missing alt text here. Better fix that.',
                     documentAbbrIsUsed : 'This abbreviation needs to be wrapped in an abbr or acronym tag.'
    }
    $('.demonstration').quail({jsonPath : 'http://webprojects.csumb.edu/quail/mirror.php?p=kevee/quail/master/src/resources', 
                               guideline : [ 'imgHasAlt', 'documentAbbrIsUsed' ],
                               testFailed : function(event) {
          	                    if(event.testName == 'documentAbbrIsUsed') {
            	                    event.element.html(event.element.html().replace(event.options.acronym, '<span class="quail-result moderate" title="' + messages[event.testName] +'">' + event.options.acronym + '</span>'));
          	                    }
          	                    else {
            	                    event.element.addClass('quail-result')
          	                           .addClass(event.severity)
          	                           .attr('title', messages[event.testName]);
          	                    }
          	                    $('.quail-result').tooltip();
        	                    }});
    });
    if($('#tests').length) {
      $.getJSON('/tests/test_texts.json', function(data) {
        $.each(data, function(index, test) {
          $('#tests tbody').append('<tr><td>' + test.readableName +'</td><td>' + index + '</td><td>' + test.type + '</td><td>' + test.severity +'</td><td></td></tr>');
        });
      });
    }
})(jQuery);
