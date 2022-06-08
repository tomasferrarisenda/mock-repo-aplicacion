/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };
	module.init = function (module) {
		module.controller('PlantillaListController', PlantillaListController);
		// Inyeccion de dependencia
		PlantillaListController.$inject = ['$scope', '$filter', '$timeout', 'orderByFilter', 'Logger', '$q', '$state', '$interval',
			'ModalService', 'PlantillaAuthService', 'PlantillaLogicService', 'SucursalDataService', 'TurnosCommonLogicService',
			'PlantillaDataService', 'moment', 'AlertaService', 'TurnosStorageHelperService', 'MantenimientoAgendaDataService',
			'User', 'ReprogramacionTurnosAuthService'

		];
		// Constructor del Controller
		function PlantillaListController($scope, $filter, $timeout, orderByFilter, $log, $q, $state, $interval,
			ModalService: IModalService, PlantillaAuthService, PlantillaLogicService, SucursalDataService, TurnosCommonLogicService,
			PlantillaDataService, moment, AlertaService, TurnosStorageHelperService, MantenimientoAgendaDataService,
			User, ReprogramacionTurnosAuthService
		) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */
			$log = $log.getInstance('PlantillaListController');
			$log.debug('ON.-');
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			var vm = this;
			vm.title = {
				page: $state.current.data.title
			};
			vm.order = {};

			vm.changesCheck = function () {
				$log.debug('cambio checkbox');
			};

			vm.formControl = {
				esAll: false,
				loading: false,
				stateLoading: false,
				reloadPage: activate,
				buscar: buscar,
				getFechaDesdeHasta: getFechaDesdeHasta,
				verHorarios: verHorarios,
				getResumenHorarios: getResumenHorarios,
				changeRecurso: changeRecurso,
				reprogramarTurnos: reprogramarTurnos,
				changeServicioMedico: changeServicioMedico,
				navegarReglasDuracion: navegarReglasDuracion,
				navegarReglasCantidadesDeTurnos: navegarReglasCantidadesDeTurnos,
				verAuditoria: verAuditoria,
				verPrestaciones: verPrestaciones,
				verSubespecialidades: verSubespecialidades
			};
			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.filter = {
				legajo: '',
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.data = {
				plantillas: '',
				recursoBuscar: {},
				alertas: [],
				recurso: null,
				duraciones: {},
				reglasDeTurnos: {},
				reglasDeSobreTurnos: {}
			};

			vm.plantillaActions = {
				new: nuevoPlantilla,
				edit: editPlantilla,
				aplicar: aplicarPlantilla,
				verDetalle: verDetallePlantilla,
				reprogramarTurnos: reprogramarTurnos,
				verTurnosPorGenerar: verTurnosPorGenerar,
				delete: borrarPlantilla
			};

			vm.validar = {
				puedeCrear: validarPuedeCrear,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEliminar,
				puedeAplicar: validarPuedeAplicar,
				puedeVerDetalle: validarPuedeVerDetalle
			};

			vm.storage = {
				keyToStorage: "turnos-plantilla-editcontroller-data",
				keyToStoragePlantillaList: "turnos-plantilla-listcontroller-data"
			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};

			/*						
			Eliminar
			*/

			vm.menuOptions = [
				// NEW IMPLEMENTATION
				{
					text: "Agregar",					
					click: ($itemScope, $event, modelValue, text, $li) => {
						$log.debug('debug menu-> Agregar');						
						vm.plantillaActions.new()
					}
				},
				{
					text: "Editar",
					displayed: function (modelValue) {
						return modelValue.plantilla.PuedeEditar;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						$log.debug('debug menu-> Editar', $itemScope.plantilla.Id);
						vm.plantillaActions.edit($itemScope.plantilla)
					}
				},
				{
					text: "Aplicar",
					displayed: function (modelValue) {
						return modelValue.plantilla.PuedeAplicar;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						$log.debug('debug menu-> Aplicar', $itemScope.plantilla.Id);
						vm.plantillaActions.aplicar($itemScope.plantilla.Id)
					}
				},
				{
					text: "Reprogramar",
					displayed: function (modelValue) {
						return modelValue.plantilla.PuedeReprogramar;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						$log.debug('debug menu-> Reprogramar', $itemScope.plantilla.Id);
						vm.plantillaActions.reprogramarTurnos($itemScope.plantilla.Id)
					}
				},
				{
					text: "Eliminar",
					displayed: function (modelValue) {
						return modelValue.plantilla.PuedeEliminar;
					},
					click: ($itemScope, $event, modelValue, text, $li) => {
						$log.debug('debug menu-> Eliminar', $itemScope.plantilla.Id);
						vm.plantillaActions.delete($itemScope.plantilla.Id)
					}
				},

				{
					text: 'Ver Detalle',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('debug menu-> Ver Detalle', $itemScope.plantilla);
						vm.plantillaActions.verDetalle($itemScope.plantilla.Id)
					}
				},

				{
					text: 'Ver Turnos que genera la plantilla',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('debug menu-> Ver turnos que genera', $itemScope.plantilla);
						vm.plantillaActions.verTurnosPorGenerar($itemScope.plantilla.Id)
					}
				},
				{
					text: 'Copiar Plantilla',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('debug menu-> copiar plantilla', $itemScope.plantilla);

						if (PlantillaAuthService.puedeCopiarPlantilla(User)) {
							//levanto el confirm para consultar si realmente quiere copiar
							ModalService.confirm('Esta seguro que desea copiar la plantilla ' + $itemScope.plantilla.Id + '?',
								function (_pOk) {

									if (_pOk) {

										PlantillaDataService.crearCopiaDePlantilla($itemScope.plantilla.Id)
											.then(function (pResult) {

												$log.debug('pResult crearCopiarPlantilla', pResult);
												AlertaService.NewSuccess("Confirmado",
													"La plantilla ha sido copiada con id: " + pResult.Id);
												buscar();

											}, function (pError) {
												$log.error('error crearCopiarPlantilla', pError);
											});
									}

								}, "", optionsObj);

						} else AlertaService.NewWarning("Atención", "No tiene PERMISO para copiar plantilla");

					}

				},
				{
					text: 'Editar observación Interna',
					click: function ($itemScope, $event, modelValue, text, $li) {

						if (PlantillaAuthService.puedeEditarObservacionInterna(User)) {

							$log.debug('debug menu-> Editar observación Interna', $itemScope.plantilla);

							var ObservacionesItem = {
								observacionToShow: '',
								observacionConTags: '',
							}

							ObservacionesItem.observacionConTags = angular.copy($itemScope.plantilla.Observaciones);

							TurnosCommonLogicService.openObservacionesPorSucursal(ObservacionesItem, vm.data.sucursalesHabilitadas, false, true)
								.then(function (pResult) {

									$log.debug('result de editar observ', pResult);
									vm.formControl.loading = true;

									var _observacionObj = {
										IdPlantilla: $itemScope.plantilla.Id,
										Observaciones: pResult.observacionConTags
									}
									PlantillaDataService.actualizarObservacionesInternasPlantilla(_observacionObj)
										.then(function (actualizarObservacionOk) {
											AlertaService.NewSuccess("", "Observacion actualizada correctamente");
											vm.formControl.loading = false
											buscar();
										}, function (pError) {
											$log.error('error en actualizar', pError);
											vm.formControl.loading = false;
										});

								}, function (pError) {
									$log.error('error observaciones', pError);
								});
						} else AlertaService.NewWarning("Atención", "No tiene PERMISO para editar observación interna");

					}
				},
				{
					text: 'Editar observación para Portal Web',
					click: function ($itemScope, $event, modelValue, text, $li) {

						if (PlantillaAuthService.puedeEditarObservacionInterna(User)) {

							var ObservacionesItem = {
								observacionToShow: '',
								observacionConTags: '',
							}

							ObservacionesItem.observacionConTags = angular.copy($itemScope.plantilla.ObservacionesPortal);

							TurnosCommonLogicService.openObservacionesPorSucursal(ObservacionesItem, vm.data.sucursalesHabilitadas, false, true)
								.then(function (pResult) {

									$log.debug('result de editar observ', pResult);
									vm.formControl.loading = true;
									var _observacionObj = {
										IdPlantilla: $itemScope.plantilla.Id,
										Observaciones: pResult.observacionConTags
									}
									PlantillaDataService.actualizarObservacionesPortalPlantilla(_observacionObj)
										.then(function (actualizarObservacionOk) {

											AlertaService.NewSuccess("", "Observacion actualizada correctamente");
											vm.formControl.loading = false;
											buscar();

										}, function (actualizarObservacionError) {

											$log.error('error en actualizar', actualizarObservacionError);
											vm.formControl.loading = false;

										});

								}, function (pError) {
									$log.error('error observaciones', pError);
								});
						} else AlertaService.NewWarning("Atención", "No tiene PERMISO para editar observación del portal");


					}
				},
				{
					text: 'Ver Auditoría Plantilla',
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.verAuditoria($itemScope.plantilla);
					}
				}

			];

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function reprogramarTurnos(plantillaId) {

				$log.debug('plantilla ', plantillaId);


				if (ReprogramacionTurnosAuthService.puedeReprogramar(User)) {

					setStoredData();

					$state.go('turno.reprogramacion', {
						tipoConsulta: 'cambioAgenda',
						id: plantillaId
					});
				} else AlertaService.NewWarning("Atención", "No cuenta con permisos para reprogramar turnos");
			}

			function getResumenHorarios(resumenDeHorarios) {

				var resumen = '';

				angular.forEach(resumenDeHorarios, function (value) {

					resumen = resumen + ' <BR> ' + value;
				});

				return resumen;
			}

			function verHorarios(pIdPlantilla) {

				$log.debug('verHorarios', pIdPlantilla);
				// deprecated
				// for (var i = vm.data.plantillas.length - 1; i >= 0; i--) {
				// 	if (vm.data.plantillas[i].Id == pIdPlantilla) {
				// 		vm.data.plantillas[i].VerItems = !vm.data.plantillas[i].VerItems;
				// 	}
				// }

			}

			function getFechaDesdeHasta(fechaDesde, fechaHasta) {
				return moment(fechaDesde).format("DD/MM/YYYY") + " - " + moment(fechaHasta).format("DD/MM/YYYY");
			}

			function verAuditoria(receso) {
				let _options: IAuditoriaPorIdModalOptions = {};
				_options.dataService = "PlantillaDataService";
				_options.method = "obtenerAuditoriaPlantillaDeTurnosPorId";
				_options.idElemento = receso.Id;
				_options.tituloModal = "Auditoría Plantilla";
				
				ModalService.openAuditoriaElementoPorId(_options);
			}

			function buscar() {
				$log.debug('buscarPlantilla');
				vm.formControl.loading = true;

				if (angular.isUndefined(vm.data.servicioMedico) || angular.isUndefined(vm.data.recurso)) {

					AlertaService.NewWarning('Alerta', 'Debe elegir recurso o servicio');

				} else {

					var estado = '';

					if (vm.data.chboxSinAplicar === true) {
						estado = "1";
						if (vm.data.chboxAplicados === true) {
							estado = estado + ",2";
							if (vm.data.chboxAnulados === true)
								estado = estado + ",3";
						} else if (vm.data.chboxAnulados === true)
							estado = estado + ",3";
					} else if (vm.data.chboxAplicados === true) {
						estado = "2";
						if (vm.data.chboxAnulados === true)
							estado = estado + ",3";
					} else if (vm.data.chboxAnulados === true)
						estado = "3";


					if (estado !== '') {
						vm.data.FechaDesde = moment(vm.data.fechaDesde).format("MM-DD-YYYY");
						vm.data.FechaHasta = moment(vm.data.fechaHasta).format("MM-DD-YYYY");

						var _plantillasBuscar;
						var _servicioMedicoId = angular.copy(vm.data.servicioMedico.Id);

						_plantillasBuscar = PlantillaDataService.obtenerEnRangoDeFecha(_servicioMedicoId,
							vm.data.recurso.IdTipoRecurso, vm.data.recurso.Id, vm.data.FechaDesde,
							vm.data.FechaHasta, estado);


						var _sucursalesHabilitadas = SucursalDataService.obtenerSucursalXRecursoXServicio(vm.data.recurso.Id,
							vm.data.recurso.IdTipoRecurso, vm.data.servicioMedico.Id);

						$q.all([_plantillasBuscar, _sucursalesHabilitadas])
							.then(buscarOk, buscarError);


						// Buscar reglas de Duración, Cantidad de Turnos y Cantidad de SobreTurnos

						if (!angular.isUndefined(_servicioMedicoId && vm.data.recurso.Id && vm.data.recurso.IdTipoRecurso)) {

							obtenerReglasDeDuracionMasCantidades(_servicioMedicoId, vm.data.recurso.Id, vm.data.recurso.IdTipoRecurso);
						}

					} else {
						AlertaService.NewWarning('Alerta', 'Debe elegir un filtro');
					}
				}

				function buscarOk(pResult) {
					$log.debug('resultsPlantilla', pResult);
					vm.formControl.loading = false;
					vm.data.sucursalesHabilitadas = pResult[1];
					vm.data.plantillas = pResult[0];
					vm.data.plantillas = PlantillaLogicService.setearObservacionesParaSucursales(pResult[0]);


					if (vm.data.plantillas.length === 0) AlertaService.NewWarning("Alerta", "No hay resultados para la busqueda");
				}

				function buscarError(pError) {
					vm.formControl.loading = false;
					$log.debug('plantillaBuscarError', pError);
				}

			}

			function obtenerReglasDeDuracionMasCantidades(idServicio, idRecurso, IdTipoRecurso) {
				var _reglasTurnos = PlantillaDataService.obtenerReglasPorServicioEnRecurso(vm.data.servicioMedico.Id,
					vm.data.recurso.Id,
					vm.data.recurso.IdTipoRecurso, 1);

				var _reglasDeSobreTurnos = PlantillaDataService.obtenerReglasPorServicioEnRecurso(vm.data.servicioMedico.Id,
					vm.data.recurso.Id,
					vm.data.recurso.IdTipoRecurso, 2);

				var _duraciones = PlantillaDataService.obtenerDuracionesPorServicioEnRecurso(
					vm.data.servicioMedico.Id, vm.data.recurso.Id, vm.data.recurso.IdTipoRecurso);

				$q.all([
					_duraciones,
					_reglasTurnos,
					_reglasDeSobreTurnos,
				]).then(successCallback, errorCallback);

				function successCallback(pResults) {
					vm.formControl.loading = false;
					vm.data.duraciones = pResults[0];
					vm.data.reglasDeTurnos = pResults[1];
					vm.data.reglasDeSobreTurnos = pResults[2];

					$log.debug('obtenerReglasDeDuracionMasCantidades OK.- Reglas cant.turnos: ', vm.data.reglasDeTurnos, 'Reglas cant.Sobreturnos: ', vm.data.reglasDeSobreTurnos, 'Duraciones: ', vm.data.duraciones);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}
			}

			function navegarReglasDuracion() {
				$log.debug('btnclick navegarReglasDuracion');

				if (PlantillaAuthService.puedeListaReglasDuracion(User)) {

					TurnosStorageHelperService.cleanStorage(vm.storage.keyToStorage);
					setStoredData();

					$state.go('turno.plantilla.duracionturno', {
						idServicio: vm.data.servicioMedico.Id,
						idRecurso: vm.data.recurso.Id,
						idTipoRecurso: vm.data.recurso.IdTipoRecurso

					});
				} else AlertaService.NewWarning("Atención", "No posee PERMISO para ingresar");
			}

			function navegarReglasCantidadesDeTurnos(idTipoDemanda) {

				if (PlantillaAuthService.puedeListaReglasCantidad(User)){

					$log.debug('btnclick navegarReglasCantidadesDeTurnos');
					TurnosStorageHelperService.cleanStorage(vm.storage.keyToStorage);
					setStoredData();
	
					$state.go('turno.plantilla.reglasdecantidades', {
						idServicio: vm.data.servicioMedico.Id,
						idRecurso: vm.data.recurso.Id,
						idTipoRecurso: vm.data.recurso.IdTipoRecurso,
						idTipoDemanda: idTipoDemanda // 1: Turno // 2:SobreTurnos
					});
				} else AlertaService.NewWarning("Atención", "No posee PERMISO para ingresar");

			}


			function nuevoPlantilla() {

				if (PlantillaAuthService.puedeCrear(User)) {

					$log.debug('nuevoPlantilla OK.-');
					TurnosStorageHelperService.cleanStorage(vm.storage.keyToStorage);

					setStoredData();
					$state.go('turno.plantilla.editplantilla', {
						recurso: angular.copy(vm.data.recurso),
						servicio: angular.copy(vm.data.servicioMedico)
					});
				} else AlertaService.NewWarning("Atención", "No posee permiso para crear una plantilla");

			}

			function verTurnosPorGenerar(idPlantilla) {
				// Visualiza los turnos que generaría la plantilla (turno por turno)

				$log.debug('Ver Turnos Por Generar', idPlantilla);

				PlantillaLogicService.viewPlantillaTurnosPorGenerar(idPlantilla)
					.then(verTurnosPorGenerarOk, verTurnosPorGenerarError);

				function verTurnosPorGenerarOk(pResult) {
					$log.debug('verTurnosPorGenerarOk', pResult);
				}

				function verTurnosPorGenerarError(pError) {
					$log.error('verTurnosPorGenerarError', pError);
				}
			}

			function editPlantilla(pPlantilla) {

				$log.debug('editPlantilla OK.-', pPlantilla);

				if (PlantillaAuthService.puedeEditar(User)) {

					var recurso = {
						Id: angular.copy(pPlantilla.IdRecurso),
						IdTipoRecurso: angular.copy(pPlantilla.IdTipoRecurso),
						Nombre: angular.copy(pPlantilla.Recurso),
						Servicio: angular.copy(pPlantilla.Servicio)

					};

					var servicio = {
						Id: angular.copy(pPlantilla.IdServicio),
						Nombre: angular.copy(pPlantilla.Servicio)
					};

					setStoredData();

					$state.go('turno.plantilla.editplantilla', {
						recurso: recurso,
						servicio: servicio,
						plantillaEdit: angular.copy(pPlantilla.Id)
					});
				} else AlertaService.NewWarning("Atención", "No tiene PERMISO para editar una plantilla");
			}

			function aplicarPlantilla(idPlantilla) {

				if (PlantillaAuthService.puedeAplicar(User)) {

					ModalService.confirm('¿Desea aplicar la plantilla?',
						function (pResult) {
							if (pResult) {
								MantenimientoAgendaDataService.obtenerImpactoAplicarPlantilla(idPlantilla)
									.then(obtenerImpactoOk, obtenerImpactoError);
							}
						});

				} else {
					AlertaService.NewWarning("Atención", "No tiene PERMISO para aplicar una plantilla");
				}


				function obtenerImpactoOk(pResult) {
					$log.debug('impacto cantidad de turnos afectados', pResult);

					if (pResult.length > 0) {

						//levanto modal especificando que ponemos
						PlantillaLogicService.viewImpactoAplicarPlantilla(pResult)
							.then(function (pOk) {
								$log.debug('peOk', pOk);
								if (pOk) {
									aplicarPlantillaConfirm(idPlantilla);
								}
							}, function (pError) {
								$log.error('peError', pError);
							});


					} else if (pResult.length === 0) {
						$log.debug('no hay turnos afectados entonces aplico');

						aplicarPlantillaConfirm(idPlantilla);
						// ModalService.confirm('Atencion, desea aplicar la plantilla?',
						// 	function(_pOk) {

						// 		if (_pOk) {
						// 			aplicarPlantillaConfirm(idPlantilla);
						// 		}


						// 	}, "", optionsObj);

					}
				}

				function obtenerImpactoError(pError) {
					$log.error('Error', pError);
				}
			}

			function aplicarPlantillaConfirm(idPlantilla) {

				PlantillaDataService.validarAplicarPlantilla(idPlantilla)
					.then(function (result) {
						$log.debug('result aplicar', result);
						if (result.IsOk === false) {
							AlertaService.NewError("Error", result.Message);
							return;
						} else {

							PlantillaDataService.aplicarPlantilla(idPlantilla)
								.then(function (result) {
									$log.debug('result..', result);
									AlertaService.NewSuccess("Confirmado",
										"La plantilla ha sido aplicada");
									buscar();

								}, function (pError) {
									AlertaService.NewError("Error", pError.message);
									return;
								});
						}
					}, function (pError) {
						AlertaService.NewError("Error", pError.message);
						return;
					});
			}

			function verDetallePlantilla(idPlantilla) {
				$log.debug('Ver detalle de la plantilla', idPlantilla);

				PlantillaLogicService.viewPlantilla(idPlantilla, null, null).then(viewPlantillaOk, viewPlantillaError);

				function viewPlantillaOk(pResult) {
					$log.debug('viewPlantillaOk', pResult);
				}

				function viewPlantillaError(pError) {
					$log.error('viewPlantillaError', pError);
				}
			}

			function borrarPlantilla(idPlantilla) {
				$log.debug('borrar plantilla', idPlantilla);

				if (PlantillaAuthService.puedeAplicar(User)) {

					ModalService.confirm('¿Desea borrar la plantilla?',
						function (pResult) {
							if (pResult) {
								PlantillaDataService.validarEliminarPlantilla(idPlantilla)
									.then(function (result) {
										$log.debug('result eliminar', result);
										if (result.IsOk === false) {
											AlertaService.NewError("Error", result.Message);
											return;
										} else {

											PlantillaDataService.eliminarPlantilla(idPlantilla)
												.then(function (result) {
													$log.debug('result..', result);
													AlertaService.NewSuccess("Confirmado",
														"La plantilla ha sido eliminada");
													buscar();

												}, function (pError) {
													$log.error('error', pError);
													return;
												});
										}
									}, function (pError) {
										AlertaService.NewError("Error", pError);
										return;
									});
							}
						});


				} else AlertaService.NewWarning("Atención",
					"No tiene PERMISO para realizar la accion");

			}


			function changeServicioMedico() {
				// Limpia datos cuando se cambia el servicio seleccionado
				delete vm.data.recurso;
				delete vm.data.plantillas;
				limpiarDatosDeReglas();
			}

			function changeRecurso() {
				// Limpia datos cuando se cambia el recurso seleccionado
				delete vm.data.plantillas;
				limpiarDatosDeReglas();
			}

			function limpiarDatosDeReglas() {
				// Limpiar datos de reglas
				vm.data.duraciones = {};
				vm.data.reglasDeTurnos = {};
				vm.data.reglasDeSobreTurnos = {};
			}


			function verPrestaciones() {
				// 1 entidad prestacion
				// 2 entidad especialidad
				PlantillaLogicService.verPrestacionesServicioRecurso(vm.data.servicioMedico, vm.data.recurso, 1);
			}

			function verSubespecialidades() {
				// 1 entidad prestacion
				// 2 entidad especialidad
				PlantillaLogicService.verPrestacionesServicioRecurso(vm.data.servicioMedico, vm.data.recurso, 2);
			}
			/* VALIDACIONES */

			function validarPuedeCrear() {
				return PlantillaAuthService.puedeCrear(User);
			}

			function validarPuedeEditar() {
				return PlantillaAuthService.puedeEditar(User);
			}

			function validarPuedeEliminar() {
				return PlantillaAuthService.puedeEliminar(User);
			}

			function validarPuedeAplicar() {
				return PlantillaAuthService.puedeAplicar(User);
			}

			function validarPuedeVerDetalle() {
				return PlantillaAuthService.puedeVer(User);
			}


			/* PAGINACIÓN */
			function cleanFilters() {

				delete vm.data.servicioMedico;
				delete vm.data.recurso;
				delete vm.data.plantillas;
				cleanStorage();
			}

			function validarFilters() {

				if (vm.filter.legajo === null)
					vm.filter.legajo = '';
				if (vm.filter.nombre === null)
					vm.filter.nombre = '';
				if (vm.filter.nombrePlantilla === null)
					vm.filter.nombrePlantilla = '';
				if (vm.filter.tipo === null)
					vm.filter.tipo = '';

				vm.order = {
					id: 1,
					value: 'Legajo',
					descripcion: 'Legajo (Asc)',
					reverse: false
				};
			}

			function getPage() {
				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;
				vm.filter.validar();
				vm.data.usuarios = orderByFilter(vm.data.usuarios, vm.order.value, vm.order.reverse);
				vm.filter.usuarios = $filter('filter')
					(vm.data.usuarios, {
						Legajo: vm.filter.legajo,
						Nombre: vm.filter.nombre,
						UserName: vm.filter.nombreUsuario,
						Tipo: vm.filter.tipo
					});
				vm.paginacion.totalItems = vm.filter.usuarios.length;
				vm.filter.usuarios = vm.filter.usuarios.slice(begin, end);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {

				vm.formControl.loading = true;

				vm.data.fechaDesde = new Date(new Date().getFullYear(), 0, 1);
				vm.data.fechaHasta = new Date((new Date().getFullYear()) + 1, 11, 31);

				vm.data.chboxSinAplicar = true;
				vm.data.chboxAplicados = true;
				vm.data.chboxAnulados = true;

				$timeout(function () {

					getStoredData();
					vm.formControl.loading = false;

				}, 1000);

			}


			/* ---------------------------------------------- STORAGE ---------------------------------------------- */


			function getStoredData() {

				if (TurnosStorageHelperService.existStoredObjects(vm.storage.keyToStoragePlantillaList)) {

					getData(TurnosStorageHelperService.getStorageObj(vm.storage.keyToStoragePlantillaList));
					buscar();

				}

				function getData(stored) {

					vm.data.servicioMedico = stored.servicioMedico ? angular.copy(stored.servicioMedico) : {};
					vm.data.recurso = stored.recurso ? angular.copy(stored.recurso) : {};
				}
			}

			function cleanStorage() {

				$log.debug('cleanStorage');
				TurnosStorageHelperService.cleanStorage(vm.storage.keyToStoragePlantillaList);

			}

			function setStoredData() {

				var plantillaListStorage = {
					recurso: angular.copy(vm.data.recurso),
					servicioMedico: angular.copy(vm.data.servicioMedico)

				};

				TurnosStorageHelperService.setStorageObj(vm.storage.keyToStoragePlantillaList, plantillaListStorage);

			}

		}
	};
	return module;
})();