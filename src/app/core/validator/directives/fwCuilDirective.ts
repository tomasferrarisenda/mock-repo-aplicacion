/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saCuil', fwCuil);
		ngModule.directive('fwCuil', fwCuil);

		function fwCuil () {

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {
					element.inputmask('99-99999999-9');
					element.attr('placeholder', '99-99999999-9');
				}
			};
		}
	};

	return module;

})();