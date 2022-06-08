/**
 * @author 			ppautasso  
 * @description 	description
 */

import * as angular from 'angular';
 
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		ngModule.directive('saDateTime', fwDateTime);
		ngModule.directive('fwDateTime', fwDateTime);

		function fwDateTime() {

			return {
				restrict: 'A',
				scope: true,
				require: '?ngModel',
				link: function (scope, element, attrs, controller) {
					if (!controller) return;
					scope.fechaMaxima = new Date();
					// console.log('fwDateTime max', scope.maxDateCommon);

					scope.$watch(function () {
						return scope.maxDateCommon;
					}, function (value) {
						// console.log('Fecha maxima actrualizada', value);
						scope.fechaMaxima = value;
					});

					controller.$validators.datetime = function (modelValue, viewValue, otro) {
						const empty = controller.$isEmpty(modelValue);
						return (empty || angular.isDate(modelValue));
					};

					controller.$validators.max = function (modelValue, viewValue, otro) {
						if (modelValue < scope.maxDateCommon) return true;
						return false;
					};

					// controller.$validators.datetimeMin = function (modelValue, viewValue, otro) {
					// 	 var empty = controller.$isEmpty(modelValue);
					// 	 if (NUMBER_REGEXP.test(modelValue)) {
					// 		 return !(parseInt(modelValue) > 2147483647);
					// 	 }
					// 	 return true;
					// };

					// element.inputmask('99-99999999-9');
					// element.attr('placeholder', '99-99999999-9');
				}
			};
		}
	};

	return module;

})();