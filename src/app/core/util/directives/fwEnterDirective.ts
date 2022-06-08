/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Enter as tab. Signo mas como shift+tab-
		ngModule.directive('saEnter', fwEnter);
		ngModule.directive('fwEnter', fwEnter);

		fwEnter.$inject = ['KEY_CODES'];
		function fwEnter(KEY_CODES) {
			return function (scope, element) {
				element.bind("keydown keypress", function (event) {
					var fields: any = '';
					var index: any = '';
					// alert(event.keyCode);
					if (event.keyCode === KEY_CODES.ENTER) {
						event.preventDefault();
						fields = $(this).parents('form:eq(0),body')
							.find('button:visible:not(:disabled):not([readonly]), input:visible:not(:disabled):not([readonly]), select:visible:not(:disabled):not([readonly])');
						// textarea:visible:not(:disabled):not([readonly]), 
						// Lo desabilito porque al entrar en el TextArea, no permite bajar de linea con el enter, sino que pasa al siguiente elemento. PF
						index = fields.index(this);
						if (index > -1 && (index + 1) < fields.length) {
							fields.eq(index + 1).focus();
							fields.eq(index + 1).select();
						}
					} else {
						if (event.keyCode === KEY_CODES.PLUS) {
							event.preventDefault();
							fields = $(this).parents('form:eq(0),body')
								.find('button:visible:not(:disabled):not([readonly]), input:visible:not(:disabled):not([readonly]), select:visible:not(:disabled):not([readonly])');
							index = fields.index(this);
							if (index > -1 && (index - 1) > -1) {
								fields.eq(index - 1).focus();
								fields.eq(index - 1).select();
							}
						}
					}
				});
			};
		}

	};
	return module;
})();