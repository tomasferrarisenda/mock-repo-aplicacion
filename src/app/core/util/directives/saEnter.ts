/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saEnter', saEnter);

		saEnter.$inject = [];
		function saEnter () {
			return function(scope, element) {
				element.bind('keydown keypress',function(event){
					if (event.which === 13) {
						event.preventDefault();
						const fields = $(this).parents('form:eq(0),body')
							.find('button:visible:not(:disabled):not([readonly]), input:visible:not(:disabled):not([readonly]), textarea:visible:not(:disabled):not([readonly]), select:visible:not(:disabled):not([readonly])');
						const index = fields.index(this);
						if (index > -1 && (index + 1) < fields.length)
							fields.eq(index + 1).focus();
					}
				});
			};
		}
		
	};
	return module;
})();