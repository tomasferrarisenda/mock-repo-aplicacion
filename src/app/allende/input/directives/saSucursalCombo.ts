/**
 * @author:			Ezequiel Mansilla
 * @description:	Combo para sucurales
 * @type:			Directive
 **/
import * as angular from 'angular';
import sucursalTemplate = require("../templates/sa-sucursal-combo.tpl.html");
import { ISucursalDataService } from '../../../allendeModules/support/basic/services';
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saSucursalCombo', saSucursalCombo);

		saSucursalCombo.$inject = ['$log', 'SucursalDataService'];
		function saSucursalCombo($log, SucursalDataService: ISucursalDataService) {
			return {
				restrict : 'E',
				require: '?ngModel',
				scope : {
					title : '@?',
					loading : '=?',
					ngRequired : '=?',
					ngDisabled : '=?'
				},
				template : sucursalTemplate,
				link: function (scope, element, attrs, controller) {
					
					if (!controller) return;
					
					scope.required = (angular.isUndefined(attrs.ngRequired)) ? false : scope.ngRequired;
					scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
					scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
					scope.opcionVacia = (scope.required) ? '--SELECCIONAR--' : 'TODAS';
					scope.sucursales = [];
					scope.selectChanged = updateModel;

					function updateModel (pSucursal) {
						controller.$setViewValue(pSucursal);
					}

					scope.$watch('loading', function(newValue, oldValue, scope) {
						updateDirective(newValue);
					});

					scope.$watch(function () {
						return controller.$modelValue;
					}, function(newValue, oldValue, scope) {
						updateDirective(newValue);
					});

					function updateDirective (pValue) {
						if (pValue)
							scope.sucursalSelect = controller.$modelValue || controller.$viewValue || '';
					}

					SucursalDataService.getAllSucursalesSinTodas()
						.then(getAllSucursalesOk);

					function getAllSucursalesOk (pSucursales) {
						scope.sucursales = pSucursales;
						updateDirective(false);
					}
				}
			};
		}
	};

	return module;
})();