/**
 * @author:			ppautasso
 * @description:	Selector de Servicios Medicos
 * @type:			Directive
 **/

import * as angular from 'angular';

import saSelectorServicioMedicoView = require('../templates/sa-selector-servicio-medico.tpl.html');

export default (function () {
	'use strict';



	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] Buscador general de @ServiciosMedicos. Se usa con [ng-model].
		module.directive('saSelectorServicioMedico', saSelectorServicioMedico);

		saSelectorServicioMedico.$inject = ['$log', '$q', '$filter', 'ServiciosGestionDataService',

			'ServiciosGestionLogicService', 'SelectorService', 'AlertaService'
		];

		function saSelectorServicioMedico($log, $q, $filter, ServiciosGestionDataService,
			ServiciosGestionLogicService, SelectorService, AlertaService) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					//loading: '=?',
					recursoDto: '=?',
					ngDisabled: '<?',
					clean: '&?',
					ifLabel: '=?',
					idrecurso: '<?',
					idsucursal: '<?',
					soloActivos: '<?',
					soloVisiblesTurnos: '<?'
				},
				template: saSelectorServicioMedicoView,
				link: link
			};

			function link(scope, attrs, element, controller) {

				if (!controller) return;

				scope.idrecurso = (angular.isUndefined(attrs.idrecurso)) ? false : scope.idrecurso;
				scope.idsucursal = (angular.isUndefined(attrs.idsucursal)) ? false : scope.idsucursal;
				scope.ifLabel = (angular.isUndefined(scope.ifLabel)) ? true : scope.ifLabel;
				scope.ifTooltip = scope.ifLabel ? false : true;

				scope.soloActivos = (angular.isUndefined(scope.soloActivos)) ? true : scope.soloActivos;
				scope.soloVisiblesTurnos = (angular.isUndefined(scope.soloVisiblesTurnos)) ? false : scope.soloVisiblesTurnos;

				ServiciosGestionDataService.getAll(scope.soloActivos, scope.soloVisiblesTurnos)
					.then(function (pResults) {
						$log.debug('servicios getall', pResults);
						scope.data.servicios = pResults;

					}, function (pError) {

						$log.error('Error Servicios', pError);

					});
				/* ----------------------------------------- API Y VARIABLES ----------------------------------------- */

				scope.data = {
					servicioSeleccionado: null,
					servicios: []
				};

				scope.filter = {
					nombreServicio: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(scope.ngDisabled)) ? false : scope.ngDisabled;
				//scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

				scope.buscar = buscar;
				scope.updateModel = updateModel;
				scope.limpiarDatos = limpiarDatos;
				scope.formControl = {
					buscando: false
				};

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */


				function updateModel(servicio) {
					controller.$setViewValue(servicio);
				}

				// scope.$watch('loading', function(newValue) {
				// 	updateDirective(newValue);
				// });

				scope.$watch(function () {
					return controller.$modelValue;
				}, function (newValue) {

					updateDirective(newValue);

				});

				function updateDirective(pValue) {


					scope.data.servicioSeleccionado = controller.$modelValue;
					if (controller.$modelValue != null) {
						scope.filter.nombreServicio = pValue.Nombre;
					} else {
						scope.filter.nombreServicio = '';
					}

				}

				function buscar() {

					scope.formControl.buscando = true;

					if (scope.idsucursal && scope.idsucursal !== 0) {

						SelectorService.newSelector({
							nombreSelector: 'Servicio Medico',
							dataService: 'ServiciosGestionDataService',
							method: 'getServiciosBySucursal',
							isTableBackEnd: false,
							columns: ['Servicio'],
							objCriterio: scope.idsucursal
						})


							// SelectorService.newSelector('lg', "Servicio Medico", 'ServiciosGestionDataService', 
							// 	'getServiciosBySucursal', 'Servicio',false, scope.idsucursal)
							.then(function (result) {

								scope.formControl.buscando = false;
								if (result) {

									result.IdRelacion = angular.copy(result.Id);
									result.Id = angular.copy(result.Idresult);
									result.Nombre = angular.copy(result.Servicio);

									scope.data.servicioSeleccionado = result;
									if (result != null) {
										scope.filter.nombreServicio = result.Nombre;
									}
									updateModel(result);
								} else {
									AlertaService.NewWarning("Alerta", "No hay datos para seleccionar");
								}
							}, function (pError) {
								scope.formControl.buscando = false;
								$log.error('error...', pError);
								limpiarDatos();
								return;
							});

					} else if (scope.idrecurso) {

						//function newSelector (pSizeModal,pNombreSelector, pDataService, pMethod,fieldColumn, 
						//isTableBackEnd, objCriterio)

						SelectorService.newSelector({
							nombreSelector: 'Servicio Medico',
							dataService: 'ServiciosGestionDataService',
							method: 'obtenerPorRecurso',
							isTableBackEnd: false,
							columns: ['Nombre'],
							objCriterio: scope.idrecurso
						})


							// SelectorService.newSelector('lg', "Servicio Medico", 'ServiciosGestionDataService', 'obtenerPorRecurso',
							// 	'Nombre', false, scope.idrecurso)
							.then(function (result) {
								scope.formControl.buscando = false;
								if (result) {
									scope.formControl.buscando = false;
									scope.data.servicioSeleccionado = result;
									if (result != null) {
										scope.filter.nombreServicio = result.Nombre;
									}
									updateModel(result);
								} else {
									AlertaService.NewWarning("Alerta", "No hay datos para seleccionar");
								}
							}, function (pError) {
								scope.formControl.buscando = false;
								$log.error('error...', pError);
								limpiarDatos();
								return;
							});

					} else {

						//function newSelector (pSizeModal,pNombreSelector, pDataService, pMethod,fieldColumn, 
						//isTableBackEnd, objCriterio)

						SelectorService.newSelector({
							nombreSelector: 'Servicio Medico',
							dataService: 'ServiciosGestionDataService',
							method: 'getAll',
							isTableBackEnd: false,
							columns: ['Nombre']
						})


							// SelectorService.newSelector('lg', "Servicio Medico", 'ServiciosGestionDataService', 'getAll','Nombre', false)
							.then(function (result) {
								scope.formControl.buscando = false;
								scope.data.servicioSeleccionado = result;
								if (result != null) {
									scope.filter.nombreServicio = result.Nombre;
								}
								updateModel(result);
							}, function (pError) {
								scope.formControl.buscando = false;
								$log.error('error...', pError);
								limpiarDatos();
								return;
							});

					}


				}


				function buscarConSucursal() {

					// if (scope.idsucursal) {
					if (!isUndefinedOrNullOrFalse(scope.idsucursal) && scope.idsucursal !== 0) {
						scope.formControl.buscando = true;

						ServiciosGestionDataService.getServiciosBySucursal(scope.idsucursal)
							.then(function (pResults) {
								$log.debug('buscar con sucursal result', pResults);

								angular.forEach(pResults, function (servicio, key) {
									servicio.IdRelacion = angular.copy(servicio.Id);
									servicio.Id = angular.copy(servicio.IdServicio);
									servicio.Nombre = angular.copy(servicio.Servicio);
								});

								scope.data.servicios = pResults;
								scope.formControl.buscando = false;


							}, function (pError) {

								$log.error('Error Servicios', pError);
								scope.formControl.buscando = false;


							});
					}else if(scope.idsucursal === 0){

						scope.formControl.buscando = true;

						ServiciosGestionDataService.getAll()
							.then(function (pResults) {
								$log.debug('buscar con sucursal 0, entonces busco todos', pResults);

								angular.forEach(pResults, function (servicio, key) {
									
									servicio.IdServicio = angular.copy(servicio.Id);
									
								});

								scope.data.servicios = pResults;
								scope.formControl.buscando = false;


							}, function (pError) {

								$log.error('Error Servicios', pError);
								scope.formControl.buscando = false;


							});
					}

				}

				function buscarConRecurso() {

					if (scope.idrecurso) {
						scope.formControl.buscando = true;

						ServiciosGestionDataService.obtenerPorRecurso(scope.idrecurso)
							.then(function (pResults) {
								scope.formControl.buscando = false;

								scope.data.servicios = pResults;

							}, function (pError) {
								scope.formControl.buscando = false;

								$log.error('Error Servicios', pError);

							});
					}
				}

				function limpiarDatos() {
					scope.data.servicioSeleccionado = null;
					scope.filter.nombreServicio = '';
					updateModel(null);
					//scope.clean();
				}

				scope.$watch(function () {
					return scope.limpiar;
				}, function (newValue, oldValue) {
					if (!isUndefinedOrNull(newValue)) {
						activate();
						scope.limpiar = false;
					}
				});

				scope.$watch(function () {
					return scope.idsucursal;
				}, function (newValue, oldValue) {
					if (!isUndefinedOrNull(newValue)) {
						buscarConSucursal();
						limpiarDatos();
					}
				});

				scope.$watch(function () {
					return scope.idrecurso;
				}, function (newValue, oldValue) {
					if (!isUndefinedOrNull(newValue)) {
						buscarConRecurso();
						limpiarDatos();
					}
				});

				scope.$watch(function () {
					return scope.ngDisabled;
				}, function (newValue) {

					scope.disabled = (angular.isUndefined(newValue)) ? false : newValue;

				});

				function isUndefinedOrNull(val) {
					return angular.isUndefined(val) || val === null
				}

				function isUndefinedOrNullOrFalse(val) {
					return angular.isUndefined(val) || val === null || val === false
				}

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {
					//$log.debug('saSelectorServicioMedico ON');
				}
			}
		}
	};

	return module;
})();