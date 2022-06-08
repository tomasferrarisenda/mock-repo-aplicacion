/**
 * @author 			ppautasso
 * @description 	description
 */
import * as angular from 'angular';
import checkBoxTemplate = require("../templates/sa-check-box.tpl.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function(ngModule) {

		// REUTILIZABLE: [DIRECTIVE] @Slider para los @Checkbox. Se usa con [ng-model].
		ngModule.directive('saCheckBox', saCheckBox);

		saCheckBox.$inject = ['$log'];

		function saCheckBox($log) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					label: '@?',
					color: '@?',
					ngDisabled: '<?',
					labelRight: '<?',
					pullRight: '<?',
					idElement: '@?',
					stopPropagation: '<?'
				},
				template: checkBoxTemplate,
				link: function(scope, element, attrs, controller) {
					if (!controller) return;
					scope.model = controller.$viewValue || controller.$modelValue;
					scope.disabled = angular.isUndefined(scope.ngDisabled) ? false : scope.ngDisabled;
					scope.pullRight = angular.isUndefined(scope.pullRight) ? false : scope.pullRight;
					scope.idElement = angular.isUndefined(scope.idElement) ? new Date().getUTCMilliseconds() : scope.idElement;

					scope.updateModel = updateModel;

					function updateModel(pModel, event) {
						if (scope.stopPropagation) {
							event.stopPropagation();
						}
						controller.$setViewValue(pModel);
					}

					scope.$watch(function () {
						return scope.ngDisabled;
					}, function(newValue) {
						scope.disabled = newValue;
					}, true);

					scope.$watch(function() {
						return controller.$modelValue || controller.$viewValue || false;
					}, updateDirective, true);

					function updateDirective(pValue) {
						scope.model = pValue;
					}

				}
			};
		}
	};

	return module;
})();