	(function($) {
		$(document).ready(function() {
			$.getJSON('https://rawgithub.com/kevee/quail/yaml-config/dist/tests.json', function(tests) {
				$.getJSON('https://rawgithub.com/kevee/quail/yaml-config/dist/guidelines/wcag.json', function(guideline) {
					$.each(guideline.guidelines, function(id, sc) {
						$.each(sc.techniques, function(techniqueId, technique) {
							var $tr = $('<tr>');
							$tr.append('<td><strong>' + id + '</strong> ' + sc.title + '</td>');
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
						});
					});
					$('#loading').remove();
					$.each(tests, function(testId, test) {
						$('#orphans').append('<li>' + testId + '</li>');
					});
				});
			});
		});
	})(jQuery);