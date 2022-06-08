/**
 * @author 			emansilla
 * @description 	description
 */
'use strict';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
		
		ngModule.directive('saDni', fwDni);
		ngModule.directive('fwDni', fwDni);

		function fwDni () {
			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {
					if (!controller) return;
					element.attr('placeholder', '99999999');
					controller.$validators.dni = function (value) {
						const empty = controller.$isEmpty(value);
						return (empty || (value.length <= 8 && !isNaN(value)));
					};
				}
			};
		}
	};

	return module;

})();