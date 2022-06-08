/**
 * @author:			Pablo Pautasso
 * @description:	Combo para sucurales pero con filtrado desde el Back-End a traves de las
 * 					excepciones
 * @type:			Directive
 **/
import * as angular from 'angular';
import sucursalTemplate = require("../templates/sa-sucursal-combo-filtrado.tpl.html");
import { ISucursalDataService } from '../../../allendeModules/support/basic/services';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function(ngModule) {

		// REUTILIZABLE: [DIRECTIVE] Select para @sucursales, con opcion para Todas (id=0). Se usa con [ng-model].
		ngModule.directive('saSucursalComboFiltrado', saSucursalComboFiltrado);

		saSucursalComboFiltrado.$inject = ['$log', 'SucursalDataService'];

		function saSucursalComboFiltrado($log, SucursalDataService: ISucursalDataService) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					title: '@?',
					loading: '=?',
					ngDisabled: '=?',
					ngRequired : '=?',
					ifLabel: '=?',
					todas: '=?'
				},
				template: sucursalTemplate,
				link: function(scope, element, attrs, controller) {

					if (!controller) return;

					scope.required = (angular.isUndefined(attrs.ngRequired)) ? false : scope.ngRequired;
					scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
					scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
					scope.opcionVacia = (scope.required) ? '--SELECCIONAR--' : 'TODAS';
					scope.sucursales = [];
					scope.selectChanged = updateModel;
					scope.ifLabel = (angular.isUndefined(scope.ifLabel)) ? true : scope.ifLabel;


					function updateModel(pSucursal) {
						controller.$setViewValue(pSucursal);
					}

					scope.$watch('loading', function(newValue, oldValue, scope) {
						updateDirective(newValue);
					});

					scope.$watch(function() {
						return controller.$modelValue || controller.$viewValue;
					}, function(newValue, oldValue, scope) {
						updateDirective(newValue);
					});

					function updateDirective(pValue) {
						if (pValue) {
							scope.sucursalSelect = pValue;
						} else {
							scope.sucursalSelect = '';
						}
					}

					SucursalDataService.getAllSucursalesConFiltro()
						.then(getAllSucursalesOk);

					function getAllSucursalesOk(pSucursales) {
						$log.debug('surcursalesDirective', pSucursales);
						scope.sucursales = pSucursales;

						if (scope.todas) {

							var sucTodas = {
								Id : 0,
								Nombre : "TODAS",
							};
							// sucTodas.Id = 0;
							// sucTodas.Nombre = "TODAS";
							scope.sucursales.unshift(sucTodas);
						}

						updateDirective(false);
					}



				}
			};
		}
	};

	return module;
	
})();
