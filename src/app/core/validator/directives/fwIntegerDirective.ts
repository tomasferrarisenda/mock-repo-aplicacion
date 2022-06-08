import * as angular from 'angular';

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
		
		ngModule.directive('saInteger', fwInteger);
		ngModule.directive('fwInteger', fwInteger);

		function fwInteger () {

			const NUMBER_REGEXP = /^[0-9]+$/;

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
					controller.$validators.integerMax = function (value) {
						const empty = controller.$isEmpty(value);
						if (NUMBER_REGEXP.test(value)) {
							return !(parseInt(value) > 2147483647);
						}
						return true;
					};

					if (attrs.min) {
						const min = +attrs.min;
						if (angular.isNumber(min)) {

							controller.$validators.integerMin = function (value) {
								const empty = controller.$isEmpty(value);
								if (NUMBER_REGEXP.test(value)) {
									return (parseInt(value) >= min);
								}
								return true;
							};
						}

					}
				}
			};
		}
	};

	return module;

})();