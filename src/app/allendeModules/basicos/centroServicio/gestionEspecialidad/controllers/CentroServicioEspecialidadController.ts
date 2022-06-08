/**
 * @author:			Pablo Pautasso
 * @description:	controller para centro de servicios
 * @type:			Controller
 **/
import * as angular from 'angular';
import { IServiciosGestionDataService } from '../../../servicios/gestion/services/ServiciosGestionDataService';
import { IRecursosDataService } from '../../../recursos/gestion/services/RecursosDataService';
import { IEspecialidadMedicaDataService } from '../../../especialidades/gestion/services/EspecialidadMedicaDataService';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		
		module.controller('CentroServicioEspecialidadController', CentroServicioEspecialidadController);

		CentroServicioEspecialidadController.$inject = [
			'Logger', '$q',
			'AlertaService', 'ModalService',
			'ServiciosGestionDataService', 'RecursosDataService',
			'SelectorService', 'EspecialidadMedicaDataService'
		];

		function CentroServicioEspecialidadController(
			$log, $q,
			AlertaService: IAlertaService, ModalService: IModalService,
			ServiciosGestionDataService: IServiciosGestionDataService, RecursosDataService: IRecursosDataService,
			SelectorService: ISelectorService, EspecialidadMedicaDataService: IEspecialidadMedicaDataService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CentroServicioEspecialidadController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: "CENTRO DE SERVICIOS - ESPECIALIDAD",
				icon: 'PLUS'
			};

			vm.data = {
				servicios: ''
			}

			vm.formData = {
			}
			vm.recursosXEspecialidad;

			vm.formControl = {
				loading: false,
				reloadPage: activate,
			
				changeSucursal: changeSucursal,

				selectServicio: selectServicio,
				selectRecurso: selectRecurso,
				selectEspecialidad: selectEspecialidad,
				selectEspecialidadRecurso: selectEspecialidadRecurso,

				addServicios: addServicios,
				addRecursos: addRecursos,
				addEspecialidadAServicio: addEspecialidadAServicio,
				addEspecialidadAServicioYRecurso: addEspecialidadAServicioYRecurso,

				deleteServicio: deleteServicio,
				deleteRecurso: deleteRecurso,
				deleteEspecialidadXRecurso: deleteEspecialidadXRecurso,
				deleteEspecialidadXServicio: deleteEspecialidadXServicio,

				changeActivoServicio: changeActivoServicio,
				changeActivoRecurso: changeActivoRecurso,
				changeActivoEspecialidadXServicio: changeActivoEspecialidadXServicio,
				changeActivoEspecialidadXRecurso: changeActivoEspecialidadXRecurso,

				changeVisiblePortalServicio: changeVisiblePortalServicio,
				changeVisiblePortalRecurso: changeVisiblePortalRecurso,
				changeVisiblePortalEspecialidadXServicio: changeVisiblePortalEspecialidadXServicio,
				changeVisiblePortalEspecialidadXRecurso: changeVisiblePortalEspecialidadXRecurso

			}


			vm.columnsServicios = {

				primera: 'Servicio',
				primeraBind: 'Servicio',
				segunda: 'Sucursal',
				segundaBind: 'Sucursal',
				tercera: 'Estado',
				terceraBind: 'Activo',

			};

			vm.columnsRecursos = {

				primera: 'Recurso',
				primeraBind: 'Nombre',
				segunda: 'Tipo de Recurso',
				segundaBind: 'TipoRecurso',
				tercera: 'Estado',
				terceraBind: 'Activo',

			};


			vm.columnsEspecialidadesXServicio = {

				primera: 'Especialidad',
				primeraBind: 'Nombre',
				segunda: 'Servicio',
				segundaBind: 'Servicio',
				tercera: 'Estado',
				terceraBind: 'Activo',

			};

			vm.columnsEspecialidadesXRecurso = {

				primera: 'Especialidad',
				primeraBind: 'Nombre',
				segunda: 'Servicio',
				segundaBind: 'Servicio',
				tercera: 'Estado',
				terceraBind: 'Activo',

			};

			vm.optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function changeSucursal(sucursal) {

				$log.debug('changeSucursal.-', sucursal);

				if (sucursal) {

					vm.data.recursos = [];
					vm.data.especialidadesXServicio = [];
					vm.data.especialidadesXRecurso = [];
					delete vm.data.servicioSeleccionado;
					delete vm.data.recursoSeleccionado;

					vm.formControl.loading = true;
					ServiciosGestionDataService.getServiciosBySucursal(sucursal.Id)
						.then(serviciosSucursalOk, serviciosSucursalError);

				} else delete vm.data.servicios;

				function serviciosSucursalOk(pResult) {

					$log.debug('changeSucursal.-', pResult);
					vm.data.servicios = angular.copy(pResult);
					angular.forEach(vm.data.servicios, function (servicio) {
						servicio.IdElemento = angular.copy(servicio.IdServicio);
					})
					vm.formControl.loading = false;
				}

				function serviciosSucursalError(pError) {
					$log.debug('changeSucursal.-', pError);
					vm.formControl.loading = false;

				}

			}


			function selectServicio(servicio) {

				$log.debug('servicio selected ON.-', servicio);

				vm.formControl.loading = true;

				delete vm.data.recursoSeleccionado;

				vm.data.servicioSeleccionado = angular.copy(servicio);

				var _recursosDelServicioEnSucursal = RecursosDataService.obtenerPorServicioEnSucursal(servicio);
				var _especialidadesDelServicioEnSucursal = EspecialidadMedicaDataService.
					obtenerPorServicioEnSucursal(servicio.IdSucursal, servicio.IdServicio);


				$q.all([_recursosDelServicioEnSucursal, _especialidadesDelServicioEnSucursal])
					.then(obtenerPorServicioOk, obtenerPorServicioError);

				function obtenerPorServicioOk(pResults) {

					$log.debug('obtenerPorServicioOk ON.-', pResults);
					vm.data.recursos = angular.copy(pResults[0]);
					angular.forEach(vm.data.recursos, function (recurso) {
						recurso.IdElemento = angular.copy(recurso.IdRecurso);
					})
					vm.data.especialidades = angular.copy(pResults[1]);
					angular.forEach(vm.data.especialidades, function (especialidad) {
						especialidad.IdElemento = angular.copy(especialidad.IdEspecialidad);
					})
					vm.formControl.loading = false;
				}

				function obtenerPorServicioError(pError) {

					$log.error('obtenerPorServicioError-', pError);
					vm.formControl.loading = false;


				}

			}


			function selectRecurso(recurso) {


				$log.debug('recurso selected ON.-', recurso);
				vm.formControl.loading = true;

				let _especialidades = angular.copy(vm.data.especialidades);
				_especialidades.forEach(especialidad => {
					especialidad.selected = false;
				});

				vm.data.especialidades = angular.copy(_especialidades);
				vm.data.recursoSeleccionado = angular.copy(recurso);

				EspecialidadMedicaDataService.obtenerEspecialidadXRecurso(recurso.Id)
					.then(function (pResult) {

						$log.debug('obtenerEspecialidadXRecurso ON.-', pResult);
						vm.data.especialidadesDelRecurso = angular.copy(pResult);
						angular.forEach(vm.data.especialidadesDelRecurso, function (especialidad) {
							especialidad.IdElemento = angular.copy(especialidad.IdEspecialidad);
						})
						vm.formControl.loading = false;
						
					}, function (pError) {

						$log.error('obtenerEspecialidadXRecursoERROR-', pError);
						vm.formControl.loading = false;
					});

			}

			function selectEspecialidad(especialidad) {
				
				$log.debug('especialidad selected ON.-', especialidad);

				//Seleccion una especialidad:
				//DES-Selecciono el recurso
				delete vm.data.recursoSeleccionado;
				vm.data.especialidadSeleccionada = angular.copy(especialidad);
				let _recursos = angular.copy(vm.data.recursos);
				_recursos.forEach(recurso => {
					recurso.selected = false;
				});
				vm.data.recursos = angular.copy(_recursos);
				//obtengo los recursos que la hacen
				var _relacion: any = {};
				_relacion.IdSucursal = angular.copy(vm.data.sucursal.Id);
				_relacion.IdServicio = angular.copy(vm.data.servicioSeleccionado.IdServicio);
				_relacion.IdEspecialidad = angular.copy(especialidad.IdEspecialidad);
				RecursosDataService.obtenerTodosDeUnServicioPorSucursalPorEspecialidad(_relacion)
					.then(function (pResult) {
						$log.debug('pResultSelectEspecialidad',pResult);
						vm.recursosXEspecialidad = pResult;
					}, function (pError) {
						$log.error('pErrorSelectEspecialidad',pError);
					});
			}

			function selectEspecialidadRecurso(especialidadDelRecurso) {
				$log.debug('especialidadDelRecurso selected ON.-', especialidadDelRecurso);
			}


			function addServicios() {

				$log.debug('addServicios ON.-');

				SelectorService.newSelector({
					sizeModal: 'lg', nombreSelector: "Seleccione un Servicio Medico", dataService: "ServiciosGestionDataService",
					method: "getAll", isTableBackEnd: false, columns: ["Nombre"]
				})

				// SelectorService.newSelector('lg', "Seleccione un Servicio Medico", 'ServiciosGestionDataService', 'getAll', 'Nombre', false)
				.then(function (servicioSelected) {
					$log.debug('servicioSelected ON.-', servicioSelected);
					if (servicioSelected.Id) {
						vm.formControl.loading = true;
						ServiciosGestionDataService.ValidarAsignarASucursal(servicioSelected.Id, vm.data.sucursal.Id)
							.then(function (pResponse) {
								$log.debug("ValidacionAsignacion response", pResponse);
								if (pResponse.IsOk === true) {
									vm.formControl.loading = true;
									ServiciosGestionDataService.AsignarServicioASucursal(servicioSelected.Id, vm.data.sucursal.Id)
										.then(function (pResp) {
											vm.formControl.loading = false;
											AlertaService.NewSuccess("", "Servicio Agregado a Sucursal " + vm.data.sucursal.Nombre);
											changeSucursal(vm.data.sucursal);

										}, function (pErr) {
											vm.formControl.loading = false;
											$log.error('ValidacionAsignacion .-', pErr);
										});
								} else {
									if (pResponse.Message != null)
										AlertaService.NewError("", pResponse.Message);
									else
										AlertaService.NewError("", "Error");
									vm.formControl.loading = false;
								}
							})
					}

				}, function (pError) {
					vm.formControl.loading = false;

					$log.error('obtener servicios ON.-');
				});
			}

			function addRecursos() {

				$log.debug('addRecursos ON.-');
				//agrego un recurso para un serivicio en sucursal

				SelectorService.newSelector({
					sizeModal: "lg", nombreSelector: "Seleccione un Recurso", dataService: "RecursosDataService",
					method: "getAll", columns: ["TipoRecurso", "Nombre"], isTableBackEnd: false
				})

				// SelectorService.newSelector('lg', "Seleccione un Recurso", 'RecursosDataService', 'getAll', 'Nombre', false)
				.then(function (recursoSelected) {
					$log.debug('recursoSelected ON.-', vm.data.servicioSeleccionado.Id, vm.data.sucursal.Id, recursoSelected.Id, recursoSelected.IdTipoRecurso);
					if (recursoSelected.Id) {
						vm.formControl.loading = true;
						RecursosDataService.validarAsignarAServicio(vm.data.servicioSeleccionado.IdServicio, vm.data.sucursal.Id, recursoSelected.Id, recursoSelected.IdTipoRecurso)
							.then(function (pResponse) {
								$log.debug("ValidacionAsignacion response", pResponse);
								if (pResponse.IsOk === true) {
									vm.formControl.loading = true;
									RecursosDataService.asignarAServicio(vm.data.servicioSeleccionado.IdServicio, vm.data.sucursal.Id, recursoSelected.Id, recursoSelected.IdTipoRecurso)
										.then(function (pResp) {
											vm.formControl.loading = false;
											AlertaService.NewSuccess("", "Recurso Agregado a Servicio " + vm.data.servicioSeleccionado.Servicio);
											selectServicio(vm.data.servicioSeleccionado);

										}, function (pErr) {
											vm.formControl.loading = false;
											$log.error('ValidacionAsignacion .-', pErr);
										});
								} else {
									if (pResponse.Message != null)
										AlertaService.NewError("", pResponse.Message);
									else
										AlertaService.NewError("", "Error");
									vm.formControl.loading = false;
								}
							})
					}

				}, function (pError) {
					vm.formControl.loading = false;

					$log.error('obtener recursos ON.-');
				});

			}

			function addEspecialidadAServicio() {

				$log.debug('addEspecialidadAServicio ON.-');

				SelectorService.newSelector({
					sizeModal: "lg", nombreSelector: "Seleccione una Especialidad", dataService: "EspecialidadMedicaDataService",
					method: "getAll", columns: ["Nombre"], isTableBackEnd: false
				})

					// SelectorService.newSelector('lg', "Seleccione una Especialidad", 'EspecialidadMedicaDataService', 'getAll', 'Nombre', false, undefined, undefined)
					.then(function (prestacionSelected) {
						$log.debug('prestacionSelected ON.-', prestacionSelected);
						if (prestacionSelected.Id) {
							vm.formControl.loading = true;
							EspecialidadMedicaDataService.validarAsignarAServicio(vm.data.servicioSeleccionado.IdServicio, vm.data.sucursal.Id, prestacionSelected.Id)
								.then(function (pResponse) {
									$log.debug("ValidacionAsignacion response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										EspecialidadMedicaDataService.asignarAServicio(vm.data.servicioSeleccionado.IdServicio, vm.data.sucursal.Id, prestacionSelected.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Especialidad Asignada a Servicio " + vm.data.servicioSeleccionado.Servicio);
												selectServicio(vm.data.servicioSeleccionado);

											}, function (pErr) {
												vm.formControl.loading = false;
												$log.error('ValidacionAsignacion .-', pErr);
											});
									} else {
										if (pResponse.Message != null)
											AlertaService.NewError("", pResponse.Message);
										else
											AlertaService.NewError("", "Error");
										vm.formControl.loading = false;
									}
								})
						}

					}, function (pError) {
						vm.formControl.loading = false;

						$log.error('obtener prestaciones ON.-');
					});


			}

			function addEspecialidadAServicioYRecurso() {

				$log.debug('addEspecialidadAServicioYRecurso ON.-');

				SelectorService.newSelector({
					sizeModal: "lg", nombreSelector: "Seleccione una Especialidad", dataService: "EspecialidadMedicaDataService",
					method: "getEspecialidadXServicioId", isTableBackEnd: false, objCriterio: vm.data.servicioSeleccionado.Id, labelWait: undefined, columns: ["Nombre"]
				})

				// SelectorService.newSelector('lg', "Seleccione una Especialidad", 'EspecialidadMedicaDataService', 'getEspecialidadXServicioId', 'Nombre', false, vm.data.servicioSeleccionado.Id, undefined)
				.then(function (prestacionSelected) {
					$log.debug('prestacionSelected ON.-', prestacionSelected);
					if (prestacionSelected.Id) {
						vm.formControl.loading = true;
						EspecialidadMedicaDataService.validarAsignarARecurso(prestacionSelected.Id, vm.data.recursoSeleccionado.Id)
							.then(function (pResponse) {
								$log.debug("ValidacionAsignacion response", pResponse);
								if (pResponse.IsOk === true) {
									vm.formControl.loading = true;
									EspecialidadMedicaDataService.asignarARecurso(prestacionSelected.Id, vm.data.recursoSeleccionado.Id)
										.then(function (pResp) {
											vm.formControl.loading = false;
											AlertaService.NewSuccess("", "Especialidad Asignada a Recurso " + vm.data.recursoSeleccionado.Nombre);
											selectRecurso(vm.data.recursoSeleccionado);

										}, function (pErr) {
											vm.formControl.loading = false;
											$log.error('ValidacionAsignacion .-', pErr);
										});
								} else {
									if (pResponse.Message != null)
										AlertaService.NewError("", pResponse.Message);
									else
										AlertaService.NewError("", "Error");
									vm.formControl.loading = false;
								}
							})
					}

				}, function (pError) {
					vm.formControl.loading = false;
					$log.error('obtener prestaciones ON.-');
				});
			}

			/* ----------------------------------------- DELETE RELACIONES ------------------------------------------ */

			function deleteServicio(pServicio) {
				$log.error('deleteServicio ON.-', pServicio);
				ModalService.confirm("Desea eliminar el servicio '" + pServicio.Servicio + "' de la sucursal '" + pServicio.Sucursal + "'?",
					function (pResponse) {

						if (pResponse) {

							vm.formControl.loading = true;
							ServiciosGestionDataService.validarEliminarServicioEnSucursal(pServicio.Id)
								.then(function (pResponse) {
									$log.debug("deleteServicio response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										ServiciosGestionDataService.eliminarServicioEnSucursal(pServicio.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Servicio eliminado de la sucursal " + vm.data.sucursal.Nombre);
												delete vm.data.servicioSeleccionado;
												changeSucursal(vm.data.sucursal);

											}, function (pErr) {
												vm.formControl.loading = false;
												$log.error('ValidacionAsignacion .-', pErr);
											});
									} else {
										if (pResponse.Message != null)
											AlertaService.NewError("", pResponse.Message);
										else
											AlertaService.NewError("", "Error");
										vm.formControl.loading = false;
									}
								}, function (pError) {
									vm.formControl.loading = false;

									$log.error('deleteServicio ON.-');
								})
						}


					}, undefined, vm.optionsObj);

			}

			function deleteRecurso(pRecurso) {
				$log.error('deleteRecurso ON.-', pRecurso);

				ModalService.confirm("Desea eliminar el recurso '" + pRecurso.Nombre + "' del servicio '" + pRecurso.Servicio + "'?",
					function (pResponse) {

						if (pResponse) {

							vm.formControl.loading = true;
							RecursosDataService.validarEliminarXServicio(pRecurso.Id)
								.then(function (pResponse) {
									$log.debug("deleteRecurso response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										RecursosDataService.eliminarXServicio(pRecurso.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Recurso eliminado del servicio " + vm.data.servicioSeleccionado.Servicio);
												delete vm.data.recursoSeleccionado;
												selectServicio(vm.data.servicioSeleccionado);

											}, function (pErr) {
												vm.formControl.loading = false;
												$log.error('ValidacionAsignacion .-', pErr);
											});
									} else {
										if (pResponse.Message != null)
											AlertaService.NewError("", pResponse.Message);
										else
											AlertaService.NewError("", "Error");
										vm.formControl.loading = false;
									}
								}, function (pError) {
									vm.formControl.loading = false;

									$log.error('deleteServicio ON.-');
								})
						}


					}, undefined, vm.optionsObj);

			}

			function deleteEspecialidadXServicio(pEspecialidadServicio) {
				$log.error('deleteEspecialidadXServicio ON.-', pEspecialidadServicio);

				ModalService.confirm("Desea eliminar la prestación '" + pEspecialidadServicio.Nombre + "' del servicio '" + pEspecialidadServicio.Servicio + "'?",
					function (pResponse) {

						if (pResponse) {

							vm.formControl.loading = true;
							EspecialidadMedicaDataService.validarEliminarDelServicio(pEspecialidadServicio.Id)
								.then(function (pResponse) {
									$log.debug("deleteRecurso response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										EspecialidadMedicaDataService.eliminarDelServicio(pEspecialidadServicio.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Prestación eliminada del servicio " + vm.data.servicioSeleccionado.Servicio);

												selectServicio(vm.data.servicioSeleccionado);

											}, function (pErr) {
												vm.formControl.loading = false;
												$log.error('ValidacionAsignacion .-', pErr);
											});
									} else {
										if (pResponse.Message != null)
											AlertaService.NewError("", pResponse.Message);
										else
											AlertaService.NewError("", "Error");
										vm.formControl.loading = false;
									}
								}, function (pError) {
									vm.formControl.loading = false;

									$log.error('deleteServicio ON.-');
								})
						}


					}, undefined, vm.optionsObj);

			}

			function deleteEspecialidadXRecurso(pEspecialidadRecurso) {
				$log.error('deleteEspecialidadXRecurso ON.-', pEspecialidadRecurso);

				ModalService.confirm("Desea eliminar la prestación '" + pEspecialidadRecurso.Nombre + "' del recurso '" + pEspecialidadRecurso.Recurso + "' en el servicio '" +
					pEspecialidadRecurso.Servicio + "'?",
					function (pResponse) {

						if (pResponse) {

							vm.formControl.loading = true;
							EspecialidadMedicaDataService.validarEliminarDelRecurso(pEspecialidadRecurso.Id)
								.then(function (pResponse) {
									$log.debug("deleteRecurso response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										EspecialidadMedicaDataService.eliminarDelRecurso(pEspecialidadRecurso.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Prestación eliminada del recurso " + vm.data.recursoSeleccionado.Nombre);
												selectRecurso(vm.data.recursoSeleccionado);


											}, function (pErr) {
												vm.formControl.loading = false;
												$log.error('ValidacionAsignacion .-', pErr);
											});
									} else {
										if (pResponse.Message != null)
											AlertaService.NewError("", pResponse.Message);
										else
											AlertaService.NewError("", "Error");
										vm.formControl.loading = false;
									}
								}, function (pError) {
									vm.formControl.loading = false;

									$log.error('deleteServicio ON.-');
								})
						}


					}, undefined, vm.optionsObj);


			}


			/* --------------------------------------- CHANGE ACTIVO/DESACTIVO -------------------------------------- */

			function changeActivoServicio(pServicio) {
				$log.error('changeActivoServicio ON.-', pServicio);

				if (!pServicio.Activo) {
				
								vm.formControl.loading = true;
								ServiciosGestionDataService.validarDesactivarServicioEnSucursal(pServicio.Id)
									.then(function (pResponse) {
										$log.debug("desactivar Servicio response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											ServiciosGestionDataService.desactivarServicioEnSucursal(pServicio.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Servicio DESACTIVADO");

												}, function (pErr) {
													pServicio.Activo = true;
													vm.formControl.loading = false;
													$log.error('ValidacionAsignacion .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}
											vm.formControl.loading = false;
											pServicio.Activo = true;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pServicio.Activo = true;
										$log.error('deleteServicio ON.-');
									});
						
				}
				else {
				
								vm.formControl.loading = true;
								ServiciosGestionDataService.validarActivarServicioEnSucursal(pServicio.Id)
									.then(function (pResponse) {
										$log.debug("desactivar Servicio response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											ServiciosGestionDataService.activarServicioEnSucursal(pServicio.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Servicio ACTIVADO");

												}, function (pErr) {
													vm.formControl.loading = false;
													pServicio.Activo = false;
													$log.error('ValidacionAsignacion .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}
											pServicio.Activo = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pServicio.Activo = false;
										$log.error('deleteServicio ON.-');
									})
						
				}
			}

			function changeActivoRecurso(pRecurso) {
				$log.error('changeActivoRecurso ON.-', pRecurso);

				if (!pRecurso.Activo) {

				
								vm.formControl.loading = true;
								RecursosDataService.validarDesactivar(pRecurso.Id)
									.then(function (pResponse) {
										$log.debug("desactivar Recurso response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											RecursosDataService.desactivar(pRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Recurso '" + pRecurso.Nombre + "' DESACTIVADO");

												}, function (pErr) {
													pRecurso.Activo = true;
													vm.formControl.loading = false;
													$log.error('ValidacionAsignacion .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}
											vm.formControl.loading = false;
											pRecurso.Activo = true;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pRecurso.Activo = true;
										$log.error('desactivar recurso error.-');
									});
						
				} else {

				
								vm.formControl.loading = true;
								RecursosDataService.validarActivar(pRecurso.Id)
									.then(function (pResponse) {
										$log.debug("validarActivar (recurso) response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											RecursosDataService.activar(pRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Recuso '" + pRecurso.Nombre + "' ACTIVADO");

												}, function (pErr) {
													vm.formControl.loading = false;
													pRecurso.Activo = false;
													$log.error('Activar  .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											pRecurso.Activo = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pRecurso.Activo = false;
										$log.error('recurso validarActivar ERROR.-');
									})
						
				}
			}

			function changeActivoEspecialidadXServicio(pEspecialidadServicio) {
				$log.error('changeActivoEspecialidadXServicio ON.-', pEspecialidadServicio);

				if (!pEspecialidadServicio.Activo) {
				
							vm.formControl.loading = true;
							EspecialidadMedicaDataService.validarDesactivarDelServicio(pEspecialidadServicio.Id)
								.then(function (pResponse) {
									$log.debug("validarDesactivarDelServicio response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										EspecialidadMedicaDataService.desactivarDelServicio(pEspecialidadServicio.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadServicio.Nombre + "' DESACTIVADA");

											}, function (pErr) {
												vm.formControl.loading = false;
												pEspecialidadServicio.Activo = true;
												$log.error('desactivarDelServicio (EspecialidadMedicaDataService).-', pErr);
											});
									} else {
										if (pResponse.Message != null) {
											AlertaService.NewError("", pResponse.Message);
										}
										else {
											AlertaService.NewError("", "Error");
										}

										vm.formControl.loading = false;
										pEspecialidadServicio.Activo = true;
									}
								}, function (pError) {
									vm.formControl.loading = false;
									pEspecialidadServicio.Activo = true;
									$log.error('validarDesactivarDelServicio especialidad del servicio error.-');
								});
						
				} else {

				
								vm.formControl.loading = true;
								EspecialidadMedicaDataService.validarActivarDelServicio(pEspecialidadServicio.Id)
									.then(function (pResponse) {
										$log.debug("validarActivar Especialidad response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.activarDelServicio(pEspecialidadServicio.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadServicio.Nombre + "' ACTIVADA");

												}, function (pErr) {
													vm.formControl.loading = false;
													pEspecialidadServicio.Activo = false;
													$log.error('activarDelServicio .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											pEspecialidadServicio.Activo = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pEspecialidadServicio.Activo = false;
										$log.error('validarActivarDelServicio ERROR.-');
									})
					
				}
			}

			function changeActivoEspecialidadXRecurso(pEspecialidadRecurso) {
				$log.error('changeActivoEspecialidadXRecurso ON.-', pEspecialidadRecurso);

				if (!pEspecialidadRecurso.Activo) {
			
								vm.formControl.loading = true;
								EspecialidadMedicaDataService.validarDesactivarDelRecurso(pEspecialidadRecurso.Id)
									.then(function (pResponse) {
										$log.debug("desactivar prestacion x recurso response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.desactivarDelRecurso(pEspecialidadRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadRecurso.Nombre + "' DESACTIVADA");

												}, function (pErr) {
													pEspecialidadRecurso.Activo = true;
													vm.formControl.loading = false;
													$log.error('ValidacionAsignacion .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											vm.formControl.loading = false;
											pEspecialidadRecurso.Activo = true;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pEspecialidadRecurso.Activo = true;
										$log.error('desactivar prestacion servicio error.-');
									});
					
				} else {
				
								vm.formControl.loading = true;
								EspecialidadMedicaDataService.validarActivarDelRecurso(pEspecialidadRecurso.Id)
									.then(function (pResponse) {
										$log.debug("desactivar prestacion response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.activarDelRecurso(pEspecialidadRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadRecurso.Nombre + "' ACTIVADA");

												}, function (pErr) {
													vm.formControl.loading = false;
													pEspecialidadRecurso.Activo = false;
													$log.error('activarDelRecurso (especialidad) .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											pEspecialidadRecurso.Activo = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pEspecialidadRecurso.Activo = false;
										$log.error('recurso activar ERROR.-');
									})
					
				}
			}

			/* --------------------------------------- CHANGE VISIBLE PORTAL WEB -------------------------------------- */

			function changeVisiblePortalServicio(pServicio) {
				$log.error('changeVisiblePortalServicio ON.-', pServicio);

				if (!pServicio.VisiblePortalWeb) {
				
								vm.formControl.loading = true;
								ServiciosGestionDataService.validarOcultarEnPortalWeb(pServicio.Id)
									.then(function (pResponse) {
										$log.debug("validarOcultarEnPortalWeb response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											ServiciosGestionDataService.ocultarEnPortalWeb(pServicio.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Servicio ocultado");

												}, function (pErr) {
													pServicio.VisiblePortalWeb = true;
													vm.formControl.loading = false;
													$log.error('ocultarEnPortalWeb .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}
											vm.formControl.loading = false;
											pServicio.VisiblePortalWeb = true;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pServicio.VisiblePortalWeb = true;
										$log.error('validarOcultarEnPortalWeb ON.-');
									});
					
				}
				else {
				

								vm.formControl.loading = true;
								ServiciosGestionDataService.validarMostrarEnPortalWeb(pServicio.Id)
									.then(function (pResponse) {
										$log.debug("validarMostrarEnPortalWeb response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											ServiciosGestionDataService.mostrarEnPortalWeb(pServicio.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Servicio visible en el portal");

												}, function (pErr) {
													vm.formControl.loading = false;
													pServicio.VisiblePortalWeb = false;
													$log.error('mostrarEnPortalWeb .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}
											pServicio.VisiblePortalWeb = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pServicio.VisiblePortalWeb = false;
										$log.error('validarMostrarEnPortalWeb ON.-');
									})
					
				}
			}

			function changeVisiblePortalRecurso(pRecurso) {
				$log.error('changeVisiblePortalRecurso ON.-', pRecurso);
				if (!pRecurso.VisiblePortalWeb) {
				
								vm.formControl.loading = true;
								RecursosDataService.validarOcultarEnPortalWeb(pRecurso.Id)
									.then(function (pResponse) {
										$log.debug("validarOcultarEnPortalWeb response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											RecursosDataService.ocultarEnPortalWeb(pRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Recurso '" + pRecurso.Nombre + "' ocultado en el portal");

												}, function (pErr) {
													vm.formControl.loading = false;
													pRecurso.VisiblePortalWeb = true;
													$log.error('ocultarEnPortalWeb .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}
											vm.formControl.loading = false;
											pRecurso.VisiblePortalWeb = true;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pRecurso.VisiblePortalWeb = true;
										$log.error('validarOcultarEnPortalWeb error.-');
									});
						
				} else {

				
								vm.formControl.loading = true;
								RecursosDataService.validarMostrarEnPortalWeb(pRecurso.Id)
									.then(function (pResponse) {
										$log.debug("validarMostrarEnPortalWeb (recurso) response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											RecursosDataService.mostrarEnPortalWeb(pRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Recuso '" + pRecurso.Nombre + "' visible en el portal");

												}, function (pErr) {
													vm.formControl.loading = false;
													pRecurso.VisiblePortalWeb = false;
													$log.error('mostrarEnPortalWeb  .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											pRecurso.VisiblePortalWeb = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pRecurso.VisiblePortalWeb = false;
										$log.error('validarMostrarEnPortalWeb ERROR.-');
									})
						
				}
			}

			function changeVisiblePortalEspecialidadXServicio(pEspecialidadServicio) {
				$log.error('changeVisiblePortalEspecialidadXServicio ON.-', pEspecialidadServicio);

				if (!pEspecialidadServicio.VisiblePortalWeb) {
				
							vm.formControl.loading = true;
							EspecialidadMedicaDataService.validarOcultarDelServicioEnPortalWeb(pEspecialidadServicio.Id)
								.then(function (pResponse) {
									$log.debug("validarOcultarDelServicioEnPortalWeb response", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										EspecialidadMedicaDataService.ocultarDelServicioEnPortalWeb(pEspecialidadServicio.Id)
											.then(function (pResp) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadServicio.Nombre + "' DESACTIVADA");

											}, function (pErr) {
												vm.formControl.loading = false;
												pEspecialidadServicio.VisiblePortalWeb = true;
												$log.error('ocultarDelServicioEnPortalWeb (EspecialidadMedicaDataService).-', pErr);
											});
									} else {
										if (pResponse.Message != null) {
											AlertaService.NewError("", pResponse.Message);
										}
										else {
											AlertaService.NewError("", "Error");
										}

										vm.formControl.loading = false;
										pEspecialidadServicio.VisiblePortalWeb = true;
									}
								}, function (pError) {
									vm.formControl.loading = false;
									pEspecialidadServicio.VisiblePortalWeb = true;
									$log.error('validarOcultarDelServicioEnPortalWeb error.-');
								});
					
				} else {

				
								vm.formControl.loading = true;
								EspecialidadMedicaDataService.validarMostrarDelServicioEnPortalWeb(pEspecialidadServicio.Id)
									.then(function (pResponse) {
										$log.debug("validarMostrarDelServicioEnPortalWeb response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.mostrarDelServicioEnPortalWeb(pEspecialidadServicio.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadServicio.Nombre + "' ACTIVADA");

												}, function (pErr) {
													vm.formControl.loading = false;
													pEspecialidadServicio.VisiblePortalWeb = false;
													$log.error('mostrarDelServicioEnPortalWeb .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											pEspecialidadServicio.VisiblePortalWeb = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pEspecialidadServicio.VisiblePortalWeb = false;
										$log.error('validarMostrarDelServicioEnPortalWeb ERROR.-');
									})
					
				}
			}

			function changeVisiblePortalEspecialidadXRecurso(pEspecialidadRecurso) {
				$log.error('changeVisiblePortalEspecialidadXRecurso ON.-', pEspecialidadRecurso);

				if (!pEspecialidadRecurso.VisiblePortalWeb) {
				
								vm.formControl.loading = true;
								EspecialidadMedicaDataService.validarOcultarDelRecursoEnPortalWeb(pEspecialidadRecurso.Id)
									.then(function (pResponse) {
										$log.debug("validarOcultarDelRecursoEnPortalWeb response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.ocultarDelRecursoEnPortalWeb(pEspecialidadRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadRecurso.Nombre + "' ocultada en el portal");

												}, function (pErr) {
													pEspecialidadRecurso.VisiblePortalWeb = true;
													vm.formControl.loading = false;
													$log.error('ocultarDelRecursoEnPortalWeb .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											vm.formControl.loading = false;
											pEspecialidadRecurso.VisiblePortalWeb = true;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pEspecialidadRecurso.VisiblePortalWeb = true;
										$log.error('validarOcultarDelRecursoEnPortalWeb error.-');
									});
						
				} else {
				
								vm.formControl.loading = true;
								EspecialidadMedicaDataService.validarMostrarDelRecursoEnPortalWeb(pEspecialidadRecurso.Id)
									.then(function (pResponse) {
										$log.debug("validarMostrarDelRecursoEnPortalWeb response", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											EspecialidadMedicaDataService.mostrarDelRecursoEnPortalWeb(pEspecialidadRecurso.Id)
												.then(function (pResp) {
													vm.formControl.loading = false;
													AlertaService.NewSuccess("", "Especialidad '" + pEspecialidadRecurso.Nombre + "' visible en el portal");

												}, function (pErr) {
													vm.formControl.loading = false;
													pEspecialidadRecurso.VisiblePortalWeb = false;
													$log.error('mostrarDelRecursoEnPortalWeb (especialidad) .-', pErr);
												});
										} else {
											if (pResponse.Message != null) {
												AlertaService.NewError("", pResponse.Message);
											}
											else {
												AlertaService.NewError("", "Error");
											}

											pEspecialidadRecurso.VisiblePortalWeb = false;
											vm.formControl.loading = false;
										}
									}, function (pError) {
										vm.formControl.loading = false;
										pEspecialidadRecurso.VisiblePortalWeb = false;
										$log.error('validarMostrarDelRecursoEnPortalWeb ERROR.-');
									})
					
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
			}

		}
	};

	return module;
})();
