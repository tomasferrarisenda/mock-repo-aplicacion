/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
		
		ngModule.directive('saEmail', fwEmail);
		ngModule.directive('fwEmail', fwEmail);

		function fwEmail () {

			const EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {
					if (!controller) return;

					element.attr('placeholder', 'xxx@yyy.zzz');

					const validator = function (value) {
						const empty = controller.$isEmpty(value);
						if (empty || EMAIL_REGEXP.test(value)) {
							controller.$setValidity('email', true);
							return value === '' ? null : value;
						} else {
							controller.$setValidity('email', false);
							return undefined;
						}
					};
					controller.$validators.email = function (value) {
						const empty = controller.$isEmpty(value);
						return (empty || EMAIL_REGEXP.test(value));
					};
				}
			};
		}
	};

	return module;

})();