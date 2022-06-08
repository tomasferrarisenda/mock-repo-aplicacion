/**
 * @author:			piter
 * @description:	Selector de Mutuales
 * @type:			Directive
 **/
import * as angular from 'angular';
import selectorMutualTemplate = require('../templates/sa-selector-mutual.tpl.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		// REUTILIZABLE: [DIRECTIVE] Buscador general de @Mutuales. Se usa con [ng-model].
		module.directive('saSelectorMutual', saSelectorMutual);

		saSelectorMutual.$inject = ['$log', '$q', '$filter', 'MutualDataService', 'MutualLogicService', 'SelectorService'];

		function saSelectorMutual($log, $q, $filter, MutualDataService, MutualLogicService, SelectorService) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					loading: '=?',
					ngDisabled: '=?',
					clean: '&?',
					ifLabel: '=?'
				},
				template: selectorMutualTemplate,
				link: link
			};

			function link(scope, attrs, element, controller) {

				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					mutualSeleccionada: null,
					mutuales: []
				};

				scope.filter = {
					nombreMutual: ''
				};

				scope.formControl = {
					buscando: false
				};

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function updateModel(mutual) {
					controller.$setViewValue(mutual);
				}

				scope.$watch('loading', function(newValue) {
					updateDirective(newValue);
				});

				scope.$watch(function() {
					return controller.$modelValue;
				}, function(newValue) {
					updateDirective(newValue);
				});

				function updateDirective(pValue) {
					scope.data.mutualSeleccionada = controller.$modelValue;
					if (controller.$modelValue != null) {
						scope.filter.nombreMutual = pValue.Nombre;
					} else {
						scope.filter.nombreMutual = '';
					}
				}

				function buscar() {
					scope.formControl.buscando = true;
					// SelectorService.newSelector('lg', "Mutual", 'MutualDataService', 'obtenerTodos','Nombre', false)

					SelectorService.newSelector({
						nombreSelector: 'Mutual',
						dataService: 'MutualDataService',
						method: 'obtenerTodos',
						isTableBackEnd: false,
						columns: ['Nombre']
					})



					.then(function(result) {
						scope.formControl.buscando = false;
						scope.data.mutualSeleccionada = result;
						if (result != null) {
							scope.filter.nombreMutual = result.Nombre;
						}
						updateModel(result);
					}, function(pError) {
						scope.formControl.buscando = false;
						$log.error('Error ', pError);
						limpiarDatos();
						return;
					});
				}

				function limpiarDatos() {
					scope.data.mutualSeleccionada = null;
					scope.filter.nombreMutual = '';
					updateModel(null);
				}

				scope.$watch(function() {
					return scope.limpiar;
				}, function(newValue) {
					if (newValue) {
						activate();
						scope.limpiar = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {
					if (!controller) return;
					scope.ifLabel = (angular.isUndefined(scope.ifLabel)) ? true : scope.ifLabel;
					scope.ifTooltip = scope.ifLabel ? false : true;

					MutualDataService.obtenerTodos()
					.then(function(pResults) {
						$log.debug('Message',pResults);
						scope.data.mutuales = pResults;
					}, function(pError) {
						$log.error('Error Mutuales', pError);

					});

					scope.required = (attrs.ngRequired || attrs.required) ? true : false;
					scope.disabled = (angular.isUndefined(scope.ngDisabled)) ? false : scope.ngDisabled;
					scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

					scope.buscar = buscar;
					scope.updateModel = updateModel;
					scope.limpiarDatos = limpiarDatos;
				}
			}
		}
	};

	return module;

})();