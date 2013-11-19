	(function($) {
		$(document).ready(function() {
			$.getJSON('https://rawgithub.com/kevee/quail/yaml-config/dist/tests.json', function(tests) {
				$.getJSON('https://rawgithub.com/kevee/quail/yaml-config/dist/guidelines/wcag.json', function(guideline) {
					$.each(guideline.guideline, function(sc, id) {
						$.each(sc.techniques, function(technique) {
							var $tr = $('<tr>');
							$tr.append('<td><strong>' + id + '</strong> ' + sc.title + '</td>');
							$tr.append('<td><strong>' + technique + '</strong> ' + guideline.techniques[technique].description + '</td>');
							if(typeof guideline.techniques[technique].tests !== 'undefined') {
								$ul = $('<ul>');
								$.each(guideline.techniques[technique].tests, function(test) {
									$ul.append('<li>' + test + '</li>');
								});
								$tr.append('<td>' + $ul.html() + '</td>');
							}
							else {
								$tr.append('<td><strong>No tests mapped</strong></td>');
							}
							$('#guideline tbody').append($tr);
						});
					});
				});
			});
		});
	})(jQuery);