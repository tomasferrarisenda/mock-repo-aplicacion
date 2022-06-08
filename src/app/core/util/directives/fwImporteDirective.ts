/**
 * @author:			Ezequiel Mansilla
 * @description:	Input tipo importes
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		ngModule.directive('fwInputImporte', fwInputImporte);
		ngModule.directive('saInputImporte', fwInputImporte);

		fwInputImporte.$inject = ['$log', '$compile'];
		function fwInputImporte($log, $compile) {
			return {
				restrict: 'A',
				link: link,
				require: '?ngModel'
			};

			function link(scope, element, attrs, controller) {
				if (!controller) return;
				element
					.focus(function (event) {
						this.select();
					})
					.click(function (event) {
						this.select();
					})
					.change(function (event){
						controller.$setViewValue(this.valueAsNumber.toFixed(2));
						controller.$render();
					});

				controller.$validators.positivo = function (value) {
					const empty = controller.$isEmpty(value);
					return ((empty || value >= 0));
				};
			}
		}
	};

	return module;
})();