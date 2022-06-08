/**
 * @author 			emansilla
 * @description 	Texto que permite apóstofre, acentos y ~.
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
		
		ngModule.directive('saText', fwText);
		ngModule.directive('fwText', fwText);

		function fwText () {

			const TEXT_REGEXP = /^[A-Za-zÃ¡Ã©Ã­Ã³ÃºÃÃ‰ÃÃ“ÃšÃ¼ÃœÃ±ÃÑñÜüÖöÄäáéíóúÁÉÍÓÚ‘.,' ]+$/;

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {

					if (!controller) return;

					// element.attr('placeholder', 'abc');

					controller.$validators.text = function (value) {
						const empty = controller.$isEmpty(value);
						return (empty || TEXT_REGEXP.test(value));

					};
				}
			};
		}
	};

	return module;

})();