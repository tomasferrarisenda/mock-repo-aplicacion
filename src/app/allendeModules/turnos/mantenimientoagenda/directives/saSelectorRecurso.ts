/**
 * @author:			Jorge Basiluk
 * @description:	Selector de Recurso
 * @type:			Directive
 **/
import * as angular from 'angular';
import saSelectorRecursoView = require('../templates/sa-selector-recurso.tpl.html');

export default (function () {
	


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		// REUTILIZABLE: [DIRECTIVE] Buscador general de @Recursos. Se usa con [ng-model].
		module.directive('saSelectorRecurso', saSelectorRecurso);

		saSelectorRecurso.$inject = ['$log', 'RecursosDataService',
			'MantenimientoAgendaDataService', 'MantenimientoAgendaLogicService',
			'SelectorService', 'AlertaService'

		];

		function saSelectorRecurso($log, RecursosDataService,
			MantenimientoAgendaDataService, MantenimientoAgendaLogicService,
			SelectorService, AlertaService) {
			return {
				restrict: 'E',
				require: '?ngModel',
				scope: {
					loading: '=?',
					recursoDto: '=?',
					ngDisabled: '=?',
					ifLabel: '=?',
					clean: '&?',
					idservicio: '=?',
					idsucursal: '=?',
					idespecialidad: '=?',
					buscadorRecursoEnServiciosIf: '<?'
				},
				template: saSelectorRecursoView,
				link: link
			};

			function link(scope, attrs, element, controller) {

				if (!controller) return;

				scope.idservicio = (angular.isUndefined(attrs.idservicio)) ? false : scope.idservicio;
				scope.idsucursal = (angular.isUndefined(attrs.idsucursal)) ? false : scope.idsucursal;
				scope.idespecialidad = (angular.isUndefined(attrs.idespecialidad)) ? false : scope.idespecialidad;
				scope.ifLabel = (angular.isUndefined(scope.ifLabel)) ? true : scope.ifLabel;

				scope.buscadorRecursoEnServiciosIf = (scope.buscadorRecursoEnServiciosIf) ? scope.buscadorRecursoEnServiciosIf : false;

				scope.data = {
					recursoSeleccionado: null
				};

				scope.filter = {
					nombreRecurso: ''
				};

				scope.required = (attrs.ngRequired || attrs.required) ? true : false;
				scope.disabled = (angular.isUndefined(scope.ngDisabled)) ? false : scope.ngDisabled;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

				scope.buscar = buscar;
				scope.buscarRecursoEnServicios = buscarRecursoEnServicios;
				scope.updateModel = updateModel;
				scope.limpiarDatos = limpiarDatos;
				scope.formControl = {
					buscando: false
				};

				/* ----------------------------------------- IMPLEMENTACION ----------------------------------------- */


				function updateModel(recurso) {
					controller.$setViewValue(recurso);
				}

				scope.$watch('loading', function (newValue) {
					updateDirective(newValue);
				});

				scope.$watch(function () {
					return controller.$modelValue;
				}, function (newValue) {
					updateDirective(newValue);
				});

				
				scope.$watch(function () {
					return scope.ngDisabled;
				}, function (pNewVal) {
					scope.disabled = pNewVal;
					if (scope.disabled)
						limpiarDatos();
				});

				function updateDirective(pValue) {

					scope.data.recursoSeleccionado = angular.copy(controller.$modelValue);
					if (controller.$modelValue != null) {
						scope.data.nombreRecurso = angular.copy(pValue.Nombre);
					} else {
						scope.data.nombreRecurso = '';
					}
				}

				function buscar() {
					$log.debug('Buscando...', scope.idsucursal, scope.idservicio, scope.idespecialidad);

					//scope.formControl.buscando = true;
					if (scope.idsucursal && scope.idservicio && scope.idespecialidad) {


						if (scope.idsucursal.Id === 0) {

							var _relacion: any = {};
							// _relacion.IdSucursal = angular.copy(scope.idsucursal.Id);
							_relacion.IdServicio = angular.copy(scope.idservicio.Id);
							_relacion.IdEspecialidad = angular.copy(scope.idespecialidad.Id);
	
							SelectorService.newSelector({
								nombreSelector: 'Recursos',
								dataService: 'RecursosDataService',
								method: 'obtenerTodosDeUnServicioConEspecialidad',
							   isTableBackEnd: false,
								columns: ['TipoRecurso','Nombre'],
								objCriterio: _relacion
							})
							
							// SelectorService.newSelector('lg', "Recursos", 'RecursosDataService', 'obtenerTodosDeUnServicioConEspecialidad',
							// 	'Nombre', false, _relacion)


								.then(function (result) {
									scope.formControl.buscando = false;
									//$log.debug('result recurso', result);
									if (result) {
										scope.formControl.buscando = false;
	
										result.Id = angular.copy(result.Id);
										result.IdTipo = angular.copy(result.IdTipo);
	
										scope.data.recursoSeleccionado = result;
										if (result != null) {
											scope.data.nombreRecurso = result.Nombre;
										}
										updateModel(result);
									} else {
										AlertaService.NewWarning("Alerta", "No hay recursos para seleccionar con el servicio y la especialidad");
									}
								}, function (error) {
									scope.formControl.buscando = false;
									$log.debug('result error', error);
								});

						
						} else {

							var _relacion: any = {};
							_relacion.IdSucursal = angular.copy(scope.idsucursal.Id);
							_relacion.IdServicio = angular.copy(scope.idservicio.Id);
							_relacion.IdEspecialidad = angular.copy(scope.idespecialidad.Id);
	
							SelectorService.newSelector({
								nombreSelector: 'Recursos',
								dataService: 'RecursosDataService',
								method: 'obtenerTodosDeUnServicioPorSucursalPorEspecialidad',
							   isTableBackEnd: false,
								columns: ['TipoRecurso','Nombre'],
								objCriterio: _relacion
							})
							


							// SelectorService.newSelector('lg', "Recursos", 'RecursosDataService', 'obtenerTodosDeUnServicioPorSucursalPorEspecialidad',
							// 	'Nombre', false, _relacion)
								.then(function (result) {
									scope.formControl.buscando = false;
									//$log.debug('result recurso', result);
									if (result) {
										scope.formControl.buscando = false;
	
										result.Id = angular.copy(result.Id);
										result.IdTipo = angular.copy(result.IdTipo);
	
										scope.data.recursoSeleccionado = result;
										if (result != null) {
											scope.data.nombreRecurso = result.Nombre;
										}
										updateModel(result);
									} else {
										AlertaService.NewWarning("Alerta", "No hay recursos para seleccionar con el servicio");
									}
								}, function (error) {
									scope.formControl.buscando = false;
									$log.debug('result error', error);
								});


						}

						
					}
					// else if (scope.idsucursal && scope.idservicio) {
					// 	var _relacion: any = {};
					// 	_relacion.IdSucursal = angular.copy(scope.idsucursal.Id);
					// 	_relacion.IdServicio = angular.copy(scope.idservicio.Id);
					// 	SelectorService.newSelector('lg', "Recursos", 'RecursosDataService', 'obtenerPorServicioEnSucursal',
					// 		'Nombre', false, _relacion)
					// 		.then(function (result) {
					// 			scope.formControl.buscando = false;
					// 			//$log.debug('result recurso', result);
					// 			if (result) {
					// 				scope.formControl.buscando = false;

					// 				result.Id = angular.copy(result.IdRecurso);
					// 				result.IdTipo = angular.copy(result.IdTipoRecurso);

					// 				scope.data.recursoSeleccionado = result;
					// 				if (result != null) {
					// 					scope.data.nombreRecurso = result.Nombre;
					// 				}
					// 				updateModel(result);
					// 			} else {
					// 				AlertaService.NewWarning("Alerta", "No hay recursos para seleccionar con el servicio");
					// 			}
					// 		}, function (error) {
					// 			scope.formControl.buscando = false;
					// 			$log.debug('result error', error);
					// 		});

					// } 
					/*---*/
					else if (scope.idservicio && scope.idsucursal && scope.idsucursal.Id !== 0) {

						var _relacion: any = {};
						_relacion.IdServicio = angular.copy(scope.idservicio.Id);
						_relacion.IdSucursal = angular.copy(scope.idsucursal.Id);						
						
						SelectorService.newSelector({
							nombreSelector: 'Recursos',
							dataService: 'RecursosDataService',
							method: 'obtenerTodosDeUnServicioEnSucursal',
						   isTableBackEnd: false,
							columns: ['TipoRecurso','Nombre'],
							objCriterio: _relacion
						})											
							.then(function (result) {
								scope.formControl.buscando = false;
								//$log.debug('result recurso', result);
								if (result) {
									scope.formControl.buscando = false;

									result.Id = angular.copy(result.Id);
									result.IdTipo = angular.copy(result.IdTipo);

									scope.data.recursoSeleccionado = result;
									if (result != null) {
										scope.data.nombreRecurso = result.Nombre;
									}
									updateModel(result);
								} else {
									AlertaService.NewWarning("Alerta", "No hay recursos para seleccionar con el servicio en la sucursal");
								}
							}, function (error) {
								scope.formControl.buscando = false;
								$log.debug('result error', error);
							});

					}

					/*---*/
					 else if (scope.idservicio) {

						SelectorService.newSelector({
							nombreSelector: 'Recursos',
							dataService: 'RecursosDataService',
							method: 'obtenerTodosDeUnServicio',
							isTableBackEnd: false,
							columns: ['TipoRecurso','Nombre'],
							objCriterio: scope.idservicio.Id
						})
						// SelectorService.newSelector('lg', "Recursos", 'RecursosDataService', 'obtenerTodosDeUnServicio',
						// 	'Nombre', false, scope.idservicio.Id)
							.then(function (result) {
								scope.formControl.buscando = false;
								$log.debug('result recurso por servicio', result);
								if (result) {
									scope.formControl.buscando = false;

									result.Id = angular.copy(result.Id);
									result.IdTipo = angular.copy(result.IdTipoRecurso);

									scope.data.recursoSeleccionado = result;
									if (result != null) {
										scope.data.nombreRecurso = result.Nombre;
									}
									updateModel(result);
								} else {
									AlertaService.NewWarning("Alerta", "No hay recursos para seleccionar con el servicio");

								}
							}, function (error) {
								scope.formControl.buscando = false;
								$log.debug('result error', error);
							});


					} else {

						SelectorService.newSelector({
							nombreSelector: 'Recursos',
							dataService: 'MantenimientoAgendaDataService',
							method: 'obtenerRecursos',
							isTableBackEnd: false,
							columns: ['TipoRecurso','Nombre']
						})

						// SelectorService.newSelector('lg', "Recursos", 'MantenimientoAgendaDataService', 'obtenerRecursos',
						// 	'Nombre', false, null)
							.then(function (result) {
								scope.formControl.buscando = false;
								//$log.debug('result recurso', result);
								if (result) {
									scope.formControl.buscando = false;
									scope.data.recursoSeleccionado = result;
									if (result != null) {
										scope.data.nombreRecurso = result.Nombre;
									}
									updateModel(result);
								}
							}, function (error) {
								scope.formControl.buscando = false;
								$log.debug('result error', error);
							});
					}

				}


				function buscarConServicioYSucursal() {

					if (scope.idsucursal && scope.idservicio) {

						scope.formControl.buscando = true;

						//ServiciosGestionDataService.getServiciosBySucursal(scope.idsucursal)
						var _relacion: any = {};
						_relacion.IdSucursal = angular.copy(scope.idsucursal.Id);
						_relacion.IdServicio = angular.copy(scope.idservicio.Id);
						RecursosDataService.obtenerPorServicioEnSucursal(_relacion)
							.then(function (pResults) {
								//$log.debug('buscar con sucursal y servicio result', pResults);


								scope.data.recursos = pResults;
								scope.formControl.buscando = false;


							}, function (pError) {

								$log.error('Error Servicios', pError);
								scope.formControl.buscando = false;

							});
					}

				}

				function buscarConServicio() {

					if (scope.idservicio) {
						scope.formControl.buscando = true;

						RecursosDataService.obtenerTodosDeUnServicio(scope.idservicio.Id)
							.then(function (pResults) {
								scope.formControl.buscando = false;
								$log.debug('buscarConServicio result', pResults);
								scope.data.recursos = pResults;

							}, function (pError) {
								scope.formControl.buscando = false;

								$log.error('Error Servicios', pError);

							});
					}
				}


				function buscarConServicioYSucursalYEspecialidad() {

					if (scope.idsucursal && scope.idservicio && scope.idespecialidad) {

						scope.formControl.buscando = true;

						var _relacion: any = {};
						

						$log.debug('buscarConServicioYSucursalYEspecialidad', scope.idsucursal, scope.idservicio, scope.idespecialidad);

						if (scope.idsucursal.Id === 0) {

							// _relacion.IdSucursal = angular.copy(scope.idsucursal.Id);
							_relacion.IdServicio = angular.copy(scope.idservicio.Id);
							_relacion.IdEspecialidad = angular.copy(scope.idespecialidad.Id);

							RecursosDataService.obtenerTodosDeUnServicioConEspecialidad(_relacion)
								.then(getDataOk, getDataError);

						} else {

							_relacion.IdSucursal = angular.copy(scope.idsucursal.Id);
							_relacion.IdServicio = angular.copy(scope.idservicio.Id);
							_relacion.IdEspecialidad = angular.copy(scope.idespecialidad.Id);
							RecursosDataService.obtenerTodosDeUnServicioPorSucursalPorEspecialidad(_relacion)
								.then(getDataOk, getDataError);
						}
					}

					function getDataOk(pResults) {

						$log.error('getDataOk recursos', pResults);

						angular.forEach(pResults, function (recurso, key) {
							recurso.IdRecurso = angular.copy(recurso.Id)
							recurso.IdTipo = angular.copy(recurso.IdTipo);
						});

						scope.data.recursos = pResults;
						scope.formControl.buscando = false;
					}

					function getDataError(pError) {

						$log.error('Error Servicios', pError);
						scope.formControl.buscando = false;

					};

				}


				function limpiarDatos() {
					scope.data.recursoSeleccionado = null;
					scope.data.nombreRecurso = '';
					updateModel(null);

					// if(scope.idservicio){
					// 	$log.debug('servicio igual');
					// 	delete scope.idservicio;
					// }
					//scope.clean();
				}

				scope.$watch(function () {
					return scope.limpiar;
				}, function (newValue, oldValue) {
					if (newValue) {
						activate();
						scope.limpiar = false;
					}
				});

				scope.$watch(function () {
					return scope.idespecialidad;
				}, function (newValue) {
					if (newValue) {
						if (scope.idespecialidad) {
							//buscar con servicio, sucursal y especialidad
							buscarConServicioYSucursalYEspecialidad();
						}
					}
				});

				scope.$watch(function () {
					return scope.idservicio;
				}, function (newValue) {
					if (newValue) {
						if (scope.idsucursal && scope.idsucursal.Id && scope.idscursal.Id != 0) {
							buscarConServicioYSucursal();
						} else
							buscarConServicio();
						//limpiarDatos();
					}
				});


				function buscarRecursoEnServicios() {
					MantenimientoAgendaLogicService.openConsultaRecursosEnServicios();
				}

				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

				activate();

				function activate() {


					MantenimientoAgendaDataService.obtenerRecursos()
						.then(function (pResults) {
							$log.debug('recursos getall', pResults);
							scope.data.recursos = pResults;

						}, function (pError) {

							$log.error('Error Servicios', pError);

						});

					//$log.debug('saSelectorRecurso ON');
				}
			}
		}
	};

	return module;
})();