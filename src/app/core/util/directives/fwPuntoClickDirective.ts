/**
 * @author:			Ezequiel Mansilla
 * @description:	Enter as click
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Punto como Click-
		ngModule.directive('saPuntoClick', fwPuntoClick);
		ngModule.directive('fwPuntoClick', fwPuntoClick);

		fwPuntoClick.$inject = ['$log', 'KEY_CODES'];
		function fwPuntoClick ($log, KEY_CODES) {
			return function (scope, element, attrs) {
				element.bind('keydown keypress', function (event) {
					if (event.which === KEY_CODES.DOT) {
						scope.$apply(function () {
							scope.$eval(attrs.fwPuntoClick || attrs.saPuntoClick);
						});
						event.preventDefault();
					}
				});
			};
		}
	};

	return module;
})();