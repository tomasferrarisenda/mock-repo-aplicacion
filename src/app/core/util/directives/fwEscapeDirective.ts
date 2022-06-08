/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		ngModule.directive('saEscape', fwEscape);
		ngModule.directive('fwEscape', fwEscape);

		fwEscape.$inject = [];
		function fwEscape() {
			return function (scope, element, attrs) {
				element.bind("keydown keypress", function (event) {
					if (event.which === 27) {
						scope.$apply(function () {
							scope.$eval(attrs.saEscape);
						});
						event.preventDefault();
					}
				});
			};
		}
	};
	return module;
})();