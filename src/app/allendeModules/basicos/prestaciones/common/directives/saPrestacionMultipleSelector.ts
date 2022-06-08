/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Recurso
 * @type:			Directive
 **/
import * as angular from 'angular';
import saPrestacionMultipleSelectorTemplate = require('../templates/sa-prestacion-multiple-selector.tpl.html');

export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.directive('saPrestacionMultipleSelector', saPrestacionMultipleSelector);

		saPrestacionMultipleSelector.$inject = ['$log', 'PrestacionGestionLogicService'];

		function saPrestacionMultipleSelector($log, PrestacionGestionLogicService) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					loading: '=?',
					recursoDto: '=?',
					ngDisabled: '=?',
					clean: '&?',
					idservicio: '=?',
					idsucursal: '=?'
				},
				template: saPrestacionMultipleSelectorTemplate,
				link: link
			};

			function link(scope, attrs, element, controller) {

				if (!controller) return;

				scope.idservicio = (angular.isUndefined(attrs.idservicio)) ? false : scope.idservicio;
				scope.idsucursal = (angular.isUndefined(attrs.idsucursal)) ? false : scope.idsucursal;
				//$log.debug('saBusquedaInternado fechaAlta',scope.fechaAltaIf);
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					recursoSeleccionado: null
				};

				scope.filter = {
					nombreRecurso: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(attrs.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

				scope.buscar = buscar;
				scope.limpiarDatos = limpiarDatos;

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */

				function updateModel(recurso) {
					controller.$setViewValue(recurso);
				}

				scope.$watch('loading', function(newValue, oldValue, scope) {
					updateDirective(newValue);
				});

				scope.$watch(function() {
					return controller.$modelValue;
				}, function(newValue, oldValue, scope) {
					updateDirective(newValue);
				});

				scope.$watch(function() {
					return scope.idservicio;
				}, function(newValue, oldValue, scope) {
					if(newValue !== oldValue){
					}
				});

				function updateDirective(pValue) {

					//$log.debug('Nuevo VVV',pValue);
					//$log.debug('modelValue',controller.$modelValue);

					//if (!pValue) {
					scope.data.recursoSeleccionado = controller.$modelValue;
					if (controller.$modelValue != null) {
						scope.filter.nombreRecurso = pValue.Nombre;
					} else {
						scope.filter.nombreRecurso = '';
					}
					//}
				}

				function buscar() {

					$log.debug('scope.idservicio', scope.idservicio);

						PrestacionGestionLogicService.openSelectorPrestacion(scope.idservicio)
							.then(function(result) {
								scope.data.recursoSeleccionado = result;
								if (result != null) {
									scope.filter.nombreRecurso = result.Nombre;
								}
								updateModel(result);
							}, function(pError) {
								limpiarDatos();
								return;
							});				
				}

				function limpiar() {

				}

				function limpiarDatos() {
					scope.data.recursoSeleccionado = null;
					scope.filter.nombreRecurso = '';
					updateModel(null);
					//scope.clean();
				}

				scope.$watch(function() {
					return scope.limpiar;
				}, function(newValue, oldValue) {
					if (newValue) {
						activate();
						scope.limpiar = false;
					}
				});

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {
					//$log.debug('saSelectorRecurso ON');
				}
			}
		}
	}

	return module;

})();