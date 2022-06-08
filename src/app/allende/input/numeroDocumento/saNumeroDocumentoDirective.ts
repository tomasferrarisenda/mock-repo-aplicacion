/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import numeroDocumentoTemplate = require('./sa-numero-documento.html');
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {


		// REUTILIZABLE: [DIRECTIVE] Input para el número de documento unificado. Se usa con [ng-model]
		ngModule.directive('saNumeroDocumento', saNumeroDocumento);

		// saNumeroDocumento.$inject = [''];
		function saNumeroDocumento () {
			return {
				restrict : 'E',
				require : '?ngModel',
				scope : {
					ngDisabled : '=?',
					ngRequired : '=?',
					marginBottom: '<?',
					error : '=?',
					blured : '&?',
					// para busqueda
					forSearch : '=?',
					clickSearch : '&?',
					hideSearch : '=?',
					disabledSearch : '=?'
				},
				template : numeroDocumentoTemplate,
				link : link
			};

			function link(scope, element, attrs, controller) {

				var name = (!angular.isUndefined(attrs.name)) ? attrs.name : '';

				if (name) $('#txt_numero_documento').attr("name", name);

				if (!controller) return;

				scope.marginBottom = (angular.isUndefined(attrs.marginBottom)) ? false : scope.marginBottom;
				scope.disabled = angular.isUndefined(scope.ngDisabled) ? false : scope.ngDisabled;
				scope.required = angular.isUndefined(scope.ngRequired) ? false : scope.ngRequired;


				scope.updateModel = updateModel;

				scope.$watch(function () {
					return controller.$modelValue || controller.$viewValue;
				}, updateDirective);

				scope.$watch(function () {
					return scope.ngRequired;
				}, updateRequired);

				function updateRequired(value) {
					scope.required = angular.isUndefined(scope.ngRequired) ? false : scope.ngRequired;
				}

				function updateDirective(pNewVal) {
					scope.model = pNewVal;
				}

				function updateModel(pModel) {
					controller.$setViewValue(pModel);
				}
			}
		}
	};

	return module;

})();