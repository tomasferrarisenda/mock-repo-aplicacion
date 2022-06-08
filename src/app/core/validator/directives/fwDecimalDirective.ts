/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
		
		ngModule.directive('saDecimal', fwDecimal);
		ngModule.directive('fwDecimal', fwDecimal);

		function fwDecimal () {

			const TEXT_REGEXP = /^[A-Za-zÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ¼ÃœÃ±Ã‘ ]+$/;

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {

					element.inputmask('9.999,99').attr('placeholder', '0.00');

				}
			};
		}
	};

	return module;

})();