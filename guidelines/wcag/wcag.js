	(function($) {
		$(document).ready(function() {
			var $tr = $('<tr>');
			var firstRow = true;
			$.getJSON('https://rawgithub.com/kevee/quail/yaml-config/dist/tests.json', function(tests) {
				$.getJSON('https://rawgithub.com/kevee/quail/yaml-config/dist/guidelines/wcag.json', function(guideline) {
					$.each(guideline.guidelines, function(id, sc) {
						$tr = $('<tr>');
						$tr.append('<td rowspan="' + sc.techniques.length + '"><strong>' + id + '</strong> ' + sc.title + '</td>');
						firstRow = true;
						$.each(sc.techniques, function(techniqueId, technique) {
							if(!firstRow) {
								$tr = $('<tr>');
							}
							$tr.append('<td><strong>' + technique + '</strong> ' + guideline.techniques[technique].description + '</td>');
							if(typeof guideline.techniques[technique].tests !== 'undefined') {
								$ul = $('<ul>');
								$.each(guideline.techniques[technique].tests, function(testId, test) {
									$ul.append('<li><a href="http://quail.readthedocs.org/en/latest/tests/"' + test +'.html">' + test + '</a></li>');
									delete tests[test];
								});
								$tr.append('<td>' + $ul.html() + '</td>');
							}
							else {
								$tr.append('<td><strong>No tests mapped</strong></td>');
							}
							$('#guideline tbody').append($tr);
							firstRow = false;
						});
					});
					$('#loading').remove();
					$.each(tests, function(testId, test) {
						$('#orphans').append('<li><a href="http://quail.readthedocs.org/en/latest/tests/' + testId + '.html">' + testId + '</a></li>');
					});
				});
			});
		});
	})(jQuery);