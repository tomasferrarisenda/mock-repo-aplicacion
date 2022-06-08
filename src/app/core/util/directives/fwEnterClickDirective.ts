/**
 * @author:			Ezequiel Mansilla
 * @description:	Enter as click
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Enter as click.
		ngModule.directive('saEnterClick', fwEnterClick);
		ngModule.directive('fwEnterClick', fwEnterClick);

		fwEnterClick.$inject = ['$log', 'KEY_CODES'];
		function fwEnterClick ($log, KEY_CODES) {
			return function (scope, element, attrs) {
				element.bind('keydown keypress', function (event) {
					if(event.which === KEY_CODES.ENTER) {
						scope.$apply(function (){
							scope.$eval(attrs.fwEnterClick);
						});
						event.preventDefault();
					}
				});
			};
		}
	};

	return module;
})();