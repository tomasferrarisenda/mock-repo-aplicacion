/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
		
		ngModule.directive('saPhone', fwPhone);
		ngModule.directive('fwPhone', fwPhone);

		function fwPhone () {
			const NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/;

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {
					if (!controller) return;

					element.attr('placeholder', '0');

					controller.$validators.integer = function (value) {
						const empty = controller.$isEmpty(value);
						return (empty || NUMBER_REGEXP.test(value));

					};
				}
			};
		}
	};

	return module;

})();