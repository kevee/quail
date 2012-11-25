
(function() {
	tinymce.PluginManager.requireLangPack('quail');

	tinymce.create('tinymce.plugins.QuailPlugin', {

  	
		init : function(ed, url) {
  		var that = this;

			ed.addCommand('CheckContent', function() {
				var content = ed.getContent({ format: 'raw' });
				(function($) {
				  var options = ed.settings.quailOptions;
				  if(typeof options.testFailed !== 'object') {
  				  options.testFailed = function(event) {
  				    event.element.addClass('quail-result')
  	                       .addClass(event.severity);
  	                       
  				  };
				  }
				  
  				$(ed.dom.doc.activeElement).quail(options);
  				cm.setActive('quail');
				})(jQuery);
			});

			ed.addButton('quail', {
				title : 'quail.desc',
				cmd : 'CheckContent',
				image : url + '/img/quail.png'
			});

			ed.onNodeChange.add(function(ed, cm, n) {
				
			});
			
		  if (ed.settings.content_css !== false) {
				ed.contentCSS.push(url + '/css/content.css');
		  }
		},
		
		createControl : function(n, cm) {
			return null;
		},


		getInfo : function() {
			return {
				longname : 'QUAIL',
				author : 'Kevin Miller',
				authorurl : 'http://github.com/kevee/quail',
				infourl : 'http://github.com/kevee/quail',
				version : "1.0"
			};
		}
	});

	tinymce.PluginManager.add('quail', tinymce.plugins.QuailPlugin);
})();