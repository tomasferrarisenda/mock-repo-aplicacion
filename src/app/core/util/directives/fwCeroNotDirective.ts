/**
 * @author:			Ezequiel Mansilla
 * @description:	Pone en blanco los cero al hacer blur
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Pone en blanco los cero al hacer blur.
		ngModule.directive('saCeroNot', fwCeroNot);
		ngModule.directive('fwCeroNot', fwCeroNot);

		fwCeroNot.$inject = ['$log'];
		function fwCeroNot ($log) {
			return {
				restrict : 'A',
				link: function (scope, element, attrs) {
					element.blur(function () {
						if (element[0].value === 0) {
							$log.debug('igual a cero');
							element[0].value = '';
						}
					});
				}
			};
		}
	};
	
	return module;

})();