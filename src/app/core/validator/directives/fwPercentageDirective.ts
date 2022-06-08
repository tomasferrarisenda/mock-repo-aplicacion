/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {
	
		ngModule.directive('saPercentage', fwPercentage);
		ngModule.directive('fwPercentage', fwPercentage);

		fwPercentage.$inject = ['$log'];
		function fwPercentage ($log) {

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {
					// element.inputmask('9[9][9][.99]').attr('placeholder', '0.00');
					element.attr('placeholder', '0.00');
					
					controller.$validators.percentage = function (value) {
						const empty = controller.$isEmpty(value);
						// $log.debug(value, ' empty:', empty, ' comillas:', value == '');
						return ((empty || value <= 100 && value >= 0));
					};

				}
			};
		}
	};

	return module;

})();