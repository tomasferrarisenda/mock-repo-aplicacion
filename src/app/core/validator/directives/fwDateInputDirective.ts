/**
 * @author 			emansilla
 * @description 	Cambio en vista de input
 */
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		ngModule.directive('saDateInput', fwDateInput);
		// ngModule.directive('fwDateInput', fwDateInput);

		fwDateInput.$inject = ['$window', 'moment'];
		function fwDateInput($window, moment) {

			return {
				require: '^ngModel',
				scope: {
					saDateInput: '<',
					max: '<?',
					min: '<?'
				},
				restrict: 'A',
				link: function (scope, elm, attrs, controller) {
					
					var dateFormat = scope.saDateInput;

					scope.$watch(() => {
						return scope.saDateInput;
					}, updateViewFromDateInput);

					scope.$watch(() => {
						return controller.$modelValue;
					}, updateViewFromModel);

					scope.$watch(() => {
						return scope.max;
					}, updateMaxDate);

					scope.$watch(() => {
						return scope.min;
					}, updateMinDate);

					function updateMaxDate(newValue) {
						scope.dateMax = new Date(newValue);
					}

					function updateMinDate(newValue) {
						scope.dateMin = new Date(newValue);
					}

					function updateViewFromModel(pModel) {
						updateViewFromDateInput(dateFormat);
					}

					function updateViewFromDateInput(pFormat) {
						if (!controller.$modelValue) {

							//if (controller.$viewValue) controller.$setInvalid()
							return;
						}
						dateFormat = pFormat;
						controller.$modelValue = new Date(controller.$setViewValue);
					}

					// #region ---- FORMATEO ----

					controller.$formatters.unshift(function (modelValue) {
						scope = scope;
						if (!dateFormat || !modelValue) return "";
						var retVal = moment(modelValue).format(dateFormat);
						return retVal;
					});

					controller.$parsers.unshift(function (viewValue) {
						scope = scope;
						var date = moment(viewValue, dateFormat);
						return (date && date.isValid() && date.year() > 1900) ? date.toDate() : "";
					});

					// #endregion

					// #region ---- VALIDATORS ----

					controller.$validators.saDateInput = function (value) {
						const empty = controller.$isEmpty(value);
						const isDate = angular.isDate(value);

						if (empty) {
							if (controller.$viewValue) return isDate;
							return empty;
						} else {
							return isDate;
						}
					}

					if(attrs.max) {
						updateMaxDate(scope.max);

						if (angular.isDate(scope.dateMax)) {
							controller.$validators.saDateInputMax = function (value) {
								const empty = controller.$isEmpty(value);
								const isDate = angular.isDate(value);
								let isValid = false;
	
								if (!empty && isDate) {
									if (value <= scope.dateMax) isValid = true;
								}
	
								return (empty || isValid);
							}
						}
					}

					if (attrs.min) {
						updateMinDate(scope.min);

						if (angular.isDate(scope.dateMin)) {
							controller.$validators.saDateInputMin = function (value) {
								const empty = controller.$isEmpty(value);
								const isDate = angular.isDate(value);
								let isValid = false;

								if (!empty && isDate) {
									if (value >= scope.dateMin) isValid = true;
								}

								return (empty || isValid);
							}
						}

					}

					// #endregion
				}
			};
		}

		// ngModule.directive('saChangeProxy', fwChangeProxy);
		// // ngModule.directive('fwChangeProxy', fwChangeProxy);

		// fwChangeProxy.$inject = ['$parse', 'moment'];
		// function fwChangeProxy($parse, moment) {

		// 	return {
		// 		require: '^ngModel',
		// 		restrict: 'A',
		// 		link: function (scope, elm, attrs, ctrl) {
		// 			var proxyExp = attrs.saChangeProxy;
		// 			var modelExp = attrs.ngModel;
		// 			scope.$watch(proxyExp, function (nVal) {
		// 				if (nVal != ctrl.$modelValue)
		// 					$parse(modelExp).assign(scope, nVal);
		// 			});
		// 			elm.bind('blur', function () {
		// 				var proxyVal = scope.$eval(proxyExp);
		// 				if (ctrl.$modelValue != proxyVal) {
		// 					scope.$apply(function () {
		// 						$parse(proxyExp).assign(scope, ctrl.$modelValue);
		// 					});
		// 				}
		// 			});
		// 		}
		// 	};
		// }
	};

	return module;

})();