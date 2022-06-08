/**
 * @author:			Pablo Pautasso
 * @description:	Component turnos de cada paciente
 * @type:			Component
 **/
import * as angular from 'angular';

import saTurnosPacienteTemplate = require('../saTurnosPorPaciente/saTurnosPorPacienteTemplate.html');
import { ISucursalDataService } from '../../../../support/basic/services';
import { ICriterioBusquedaTurnoDataService } from '../../services/criterioBusqueda/criterioBusquedaTurnoDataService';

export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		// REUTILIZABLE: [COMPONENT] btn donde pasandole un id de usuario, trae los turnos del mismo. Se usa con [model].
		module.component('saTurnosPorPaciente', {
			template: saTurnosPacienteTemplate,
			bindings: {
				resolve: '<', // por ser Modal. An object of the modal resolve values
				close: '&', // por ser Modal. A method that can be used to close a modal, passing a result. 
				// 	Use: {$value: myResult}
				dismiss: '&', // por ser Modal. A method that can be used to dismiss a modal, passing a result.
				// 	Use: {$value: myRejectedResult}

			},
			controller: TurnosPorPacienteController,
			controllerAs: 'vm'
		});

		TurnosPorPacienteController.$inject = ['$q', 'Logger', 'moment', 'TurnoDataService', 'DateUtils', 'orderByFilter', 'CriterioBusquedaTurnoDataService',
			'$filter', 'AlertaService', 'SucursalDataService', 'TurnosCommonLogicService', 'ModalService', 'ReprogramacionTurnosLogicService',
			'AsignacionTurnoLogicService', 'AsignacionTurnoModalService'];

		function TurnosPorPacienteController($q, $log, moment, TurnoDataService, DateUtils, orderByFilter, CriterioBusquedaTurnoDataService: ICriterioBusquedaTurnoDataService,
			$filter, AlertaService, SucursalDataService: ISucursalDataService, TurnosCommonLogicService, ModalService, ReprogramacionTurnosLogicService,
			AsignacionTurnoLogicService, AsignacionTurnoModalService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('saTurnosPorPaciente');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.todayPlus4 = angular.copy(vm.today);
			vm.todayPlus4.setMonth(vm.todayPlus4.getMonth() + 4);
			vm.todayMinus12 = angular.copy(vm.today);
			vm.todayMinus12.setMonth(vm.todayMinus12.getMonth() - 12);


			vm.$onInit = activate;
			vm.$onChanges = updateComponent;
			vm.ok = ok;
			vm.cancel = cancel;
			vm.data = {
				turnosPorPaciente: {}
			};

			vm.turno = {
				select: select,
				turnoSeleccionado: '',
				turnoSeleccionadoParaEliminar: '',
				changeFiltroActivo: changeFiltroActivo,
				motivosCancelacionTurno: {},
				cancelar: formCancelarTurno,
				cancelarTurno: cancelarTurno,
				filtroServicio: false
			};

			vm.data = {
				sucursales: {},
				estadosDeTurnos: {},
				paciente: {}
			};

			vm.puedeReprogramar = false;

			vm.formControl = {
				buscar: buscarTurnosPorPaciente,
				checkEstado: checkEstadoTurno,
				showFiltroServicio: false,
				limpiarBusqueda: limpiarBusqueda,
				addObservacion: addObservacion,
				openObservacion: openObservacion,
				abrirRequerimientos: abrirRequerimientos
			};

			vm.filter = {

			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 0,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.order = {
				id: 1,
				value: 'miliseconds',
				descripcion: 'Fecha (Asc)',
				reverse: false
			};

			vm.listOrderBy = [
				{
					id: 1,
					value: 'miliseconds',
					descripcion: 'Fecha (Asc)',
					reverse: false
				},
				{
					id: 2,
					value: 'miliseconds',
					descripcion: 'Fecha (Desc)',
					reverse: true
				},
				{
					id: 3,
					value: 'Recurso',
					descripcion: 'Recurso (Asc)',
					reverse: false
				},
				{
					id: 4,
					value: 'Recurso',
					descripcion: 'Recurso (Desc)',
					reverse: true
				},
				{
					id: 5,
					value: 'Sucursal',
					descripcion: 'Sucursal (Asc)',
					reverse: false
				},
				{
					id: 6,
					value: 'Sucursal',
					descripcion: 'Sucursal (Desc)',
					reverse: true
				},
			];

			vm.loading = false;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function updateComponent() {
				// Cuando cambia algun valor de bindings
			}

			function ok() {
				vm.dismiss({
					$value: 'cancel'
				});
			}

			function cancel() {
				vm.dismiss({
					$value: 'cancel'
				});
			}

			function buscarTurnosPorPaciente() {

				var def = $q.defer();

				var _fechaDesde = angular.copy(moment(vm.data.fechaDesde).format('MM-DD-YYYY'));
				var _fechaHasta = angular.copy(moment(vm.data.fechaHasta).format('MM-DD-YYYY'));

				vm.loading = true;
				var _turnosPorPaciente;

				if (vm.data.buscarPorServicio !== false && vm.turno.filtroServicio) {
					//busco por paciente y servicio
					$log.debug('busco turnos con servicio y legacy');
					_turnosPorPaciente = TurnoDataService.obtenerTurnosPorPacienteConLegacy(vm.paciente.Id, _fechaDesde, _fechaHasta, vm.data.buscarPorServicio.Id)
				} else {
					//busco solamente por paciente
					$log.debug('busco turnos por paciente solamente');
					_turnosPorPaciente = TurnoDataService.obtenerTurnosPorPaciente(vm.paciente.Id, _fechaDesde, _fechaHasta, 0)
				}

				$q
					.all([_turnosPorPaciente])
					.then(successCallback, errorCallback);

				function successCallback(pTurnosPorPaciente) {

					vm.loading = false;
					$log.debug('turnosPorPaciente OK-', pTurnosPorPaciente);

					angular.forEach(pTurnosPorPaciente[0], function (turno) {

						turno.Fecha = angular.copy(moment(turno.Fecha).format('DD/MM/YYYY'));

						// if(turno.EsSobreTurno){
						// 	turno.TipoDeTurno = angular.copy(turno.TipoDeTurno + ' (Sobreturno)');
						// }

						if (turno.ProfesionalSolicitado !== "") {
							var recursoConProfesionalSolicitado = turno.Recurso + " (Solicitado: " + turno.ProfesionalSolicitado + ")";
							turno.Recurso = angular.copy(recursoConProfesionalSolicitado);
						}

						angular.forEach(pTurnosPorPaciente[0].Prestaciones, function (prestacion) {

							turno.Prestaciones = turno.Prestaciones + prestacion + "-";

						});
					});

					vm.data.turnosPorPaciente = pTurnosPorPaciente[0];

					conectarColorDeSucursalYEstado();
					vm.paginacion.getPage();
					def.resolve(true);

				}

				function errorCallback(pError) {
					vm.loading = false;
					$log.error('turnosPorPaciente Error-', pError);
					def.reject(pError);
				}

				vm.sort = function (keyname) {

					vm.sortKey = keyname; //set the sortKey to the param passed
					vm.reverse = !vm.reverse; //if true make it false and vice versa
				};

				return def.promise;
			}


			function conectarColorDeSucursalYEstado() {
				// Recorrer la lista de turnos del Paciente:
				// 		Agrega el color del estado del turnos
				// 		Agrega el color de la sucursal
				// 	Ya que ambas cosas se traen por separado por performance

				// por cada turno, ver ambas cosas
				angular.forEach(vm.data.turnosPorPaciente, function (turno) {

					if (turno.Estado == "Cancelado") {
						if (turno.EstadoReprogramacion !== '')
							turno.Estado = turno.Estado + " (" + turno.EstadoReprogramacion + ")";
					}

					// Completo el color de la sucursal
					angular.forEach(vm.data.sucursales, function (sucursal) {
						if (turno.IdSucursal === sucursal.Id) {
							turno.ColorSucursal = angular.copy(sucursal.Color);
						}
					});

					// Completo el color del estado del turno
					angular.forEach(vm.data.estadosDeTurnos, function (estadoDeTurno) {
						if (turno.IdEstado == estadoDeTurno.Id) {
							turno.ColorEstado = angular.copy(estadoDeTurno.Color);
						}
					});

					//creo una propiedad de los objetos para que la fecha sea tipo entero

					turno.FechaYHora = turno.Fecha + ' ' + turno.Hora;
					turno.miliseconds = moment(turno.FechaYHora, "DD/MM/YYYY HH:mm").valueOf();


				});

			}

			function select(turno) {
				$log.debug('turno', turno);
				vm.turno.turnoSeleccionado = angular.copy(turno);
				vm.turno.turnoSeleccionado.fechaConDia = moment(vm.turno.turnoSeleccionado.Fecha, "DD/MM/YYYY").format("dddd, D [de] MMMM [de] YYYY");
				vm.turno.turnoSeleccionadoParaEliminar = '';
			}

			function formCancelarTurno(turno) {

				$log.error('cancelar ', turno);
				vm.turno.turnoSeleccionadoParaEliminar = angular.copy(turno);
				vm.turno.turnoSeleccionado = '';
			}

			function cancelarTurno() {

				vm.loading = true;
				$log.error('cancelar turno', vm.turno.motivoCancelacionTurno,
					vm.turno.turnoSeleccionadoParaEliminar, vm.turno.observacionesParaEliminar);

				var cancelarTurnoDto = {
					IdTurno: vm.turno.turnoSeleccionadoParaEliminar.Id,
					IdMotivoDeAnulacionTurno: vm.turno.motivoCancelacionTurno,
					Observaciones: vm.turno.observacionesParaEliminar
				}

				// casos donde se puede eliminar un turno
				TurnoDataService.cancelarTurnoPaciente(cancelarTurnoDto)
					.then(cancelarTurnoOk, cancelarTurnoError);

				function cancelarTurnoOk(pResult) {
					$log.debug('cancelarTurnoOk', pResult);
					vm.loading = false;
					AlertaService.NewSuccess("", "Turno Cancelado");
					vm.turno.turnoSeleccionadoParaEliminar = null;
					delete vm.turno.motivoCancelacionTurno;
					vm.turno.observacionesParaEliminar = "";
					activate();
				}

				function cancelarTurnoError(pError) {
					$log.debug('cancelarTurnoError', pError);
					vm.loading = false;
					AlertaService.NewError("Atencion", "El tuno no se pudo cancelar");
					vm.turno.turnoSeleccionadoParaEliminar = null;

					activate();

				}
			}

			function checkEstadoTurno(turno) {
				if (turno.Estado.includes("Cancelado") || turno.Estado.includes("Anulado") || turno.Estado.includes("Receptado") || turno.Estado.includes("Ausente") ||
					(turno.hasOwnProperty('EsDeTurneroNuevo') && turno.EsDeTurneroNuevo == false)) return true;
				else return false;
			}

			function limpiarBusqueda() {
				delete vm.filter.turnos;
				delete vm.data.turnosPorPaciente;
				vm.paginacion.totalItems = 0;
			}

			function addObservacion() {
				ModalService.textAreaModal({
					tituloModal: "Agregar Observación",
					icon: "NEW",
					guardarOption: true,
					data: null,
					readOnly: false,
					sizeModal: "md",
					maxlength: 300
				}).then(function (pResult) {
					//tengo nueva observacion -> guardo
					$log.debug('pResult agregar observacion', vm.turno.turnoSeleccionado.Id, pResult);
					vm.loading = true;


					// Deprecated por no soportar caracter "." para guardar
					// TurnoDataService.actualizarObservacionesPrincipales(vm.turno.turnoSeleccionado.Id, pResult)

					vm.observacionDto.IdTurno = vm.turno.turnoSeleccionado.Id;
					vm.observacionDto.Observaciones = pResult;

					TurnoDataService.actualizarObservacionesPrincipalesDto(vm.observacionDto)
						.then(function (pResult) {
							$log.debug('pResultActualizarObservacion', pResult);
							vm.loading = false;
							buscarTurnosPorPaciente()
								.then(function (pOkBusqueda) {
									var _turnoASeleccionar = vm.filter.turnos.find(x => x.Id === vm.turno.turnoSeleccionado.Id);
									if (_turnoASeleccionar)
										vm.turno.select(_turnoASeleccionar);
								}, function (pErrorBusqueda) {
									$log.error('error busqueda', pErrorBusqueda);
								})
						}, function (pError) {
							$log.error('pErrorActualizarObservacion', pError);
							vm.loading = false;
						})

				}, function (pError) {
					//cancelo no hago nada
					$log.error('pError agregar observacion', pError);
				})
			}

			function openObservacion() {
				ModalService.textAreaModal({
					tituloModal: "Observación",
					icon: "VIEW",
					guardarOption: false,
					data: vm.turno.turnoSeleccionado.Observaciones,
					readOnly: true,
					sizeModal: "md",
					maxlength: 300
				});
			}

			// #region SUPPORT
			function abrirRequerimientos(turno) {

				// Abre el popup de Requerimientos (administrativos) y Preparaciones (médicas) de las prestaciones para las que se quiere dar el turno
				var turnos: Array<any> = [];
				let _turno = angular.copy(turno);
				var dataTurnoRequerimiento;
				// Controllo si ya se seleccionó el paciente y luego las prestaciones
				var pacienteId = (vm.paciente) ? vm.paciente.Id : 0;

				if (pacienteId == 0) {
					// No hay paciente seleccionado, no habrá pestaciones ni criterio de búsqueda
					this.AlertaService.NewWarning("Atención", "Debe seleccionar un paciente");
					return;
				}

				var criterio;
				CriterioBusquedaTurnoDataService.obtenerPartiendoDeUnTurno(turno.Id)
					.then((pResult) => {
						$log.debug('pResult', pResult);
						// obtuve el criterio de busqueda
						criterio = angular.copy(pResult);

						_turno.Fecha = new Date(_turno.miliseconds);

						//tengo un turno del dia seleccionado, continuo entonces con ese
						turnos.push(_turno);
						$log.debug('turnos de requerimientos', turnos);
						if (turnos) {

							dataTurnoRequerimiento = getDataTurnoParaOtorgar(turnos);
							AsignacionTurnoModalService.openRequerimientosMasPreparaciones(dataTurnoRequerimiento, turnos, criterio);
						}
						else return;

					}, (pError) => {
						$log.error('pError', pError);
					});


			}

			function getDataTurnoParaOtorgar(turno) {

				let _servicio = {
					Id: turno[0].IdServicio,
					Nombre: turno[0].Servicio
				}

				return AsignacionTurnoLogicService.getDataTurnoParaOtorgarLogic(turno, null, vm.paciente,
					_servicio);
			}

			// #endregion

			/* --------------------------------------------- PAGINACION -------------------------------------------- */

			function changeFiltroActivo() {

				if (vm.turno.filtroActivos) vm.filter.estado = 'Asignado';
				else vm.filter.estado = '';

				vm.paginacion.getPage();

			}

			function getPage() {

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				if (vm.data.turnosPorPaciente && vm.data.turnosPorPaciente.length > 0) {
					vm.data.turnosPorPaciente = orderByFilter(vm.data.turnosPorPaciente, vm.order.value, vm.order.reverse);

					vm.filter.turnos = $filter('filter')
						(vm.data.turnosPorPaciente, {

							Estado: vm.filter.estado

						});


					vm.paginacion.totalItems = vm.filter.turnos.length;
					vm.filter.turnos = vm.filter.turnos.slice(begin, end);
				}
			}

			/* ---------------------------------------------- MENU CONTEXTUAL ---------------------------------------------- */
			function inicializarMenuOptions() {
				vm.menuOptions = [
					{
						text: 'Ver Motivo Cancelación',
						displayed: function (modelValue) {

							vm.turno.select(modelValue.turno);
							var ret = false;
							if (modelValue.turno.IdEstado === 6) ret = true;
							return ret;

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('item', $itemScope);
							TurnosCommonLogicService.openMotivosCancelacionDeUnTurno($itemScope.turno.Id);

						}
					},
					{
						text: 'Cancelar Turno',
						displayed: function (modelValue) {

							return !checkEstadoTurno(modelValue.turno);

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('item', $itemScope);
							formCancelarTurno($itemScope.turno);
							// TurnosCommonLogicService.openMotivosCancelacionDeUnTurno($itemScope.turno.Id);

						}
					},
					{
						text: 'Desiste de Reprogramar',
						displayed: function (modelValue) {

							var ret = false;
							if (modelValue.turno.IdEstadoDeReprogramacion === 1) ret = true;
							return ret;

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							//llamamos a metodo de desiste de reprogramar
							ReprogramacionTurnosLogicService.desistirDeReprogramarTurno($itemScope.turno.Id)
								.then(function (pResponseOk) {
									AlertaService.NewSuccess("Turno Desistido");
									buscarTurnosPorPaciente();
								}, function (pError) {
									$log.error('Error al desistir de reprogramar el turno', pError);
								})
						}
					},
					{
						text: 'Reprogramar',
						displayed: function (modelValue) {

							var ret = false;
							if (modelValue.turno.IdEstadoDeReprogramacion === 1 && vm.puedeReprogramar) ret = true;
							return ret;

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('turno a reprogramar', $itemScope);
							vm.close({
								$value: {
									accion: 'Reprogramar',
									idTurno: $itemScope.turno.Id
								}
							});
						}
					},
					{
						text: 'Cancelar Marcado Turno Gestionado',
						displayed: function (modelValue) {

							var ret = false;
							if (modelValue.turno.IdEstadoDeReprogramacion === 4 && vm.puedeReprogramar) ret = true;
							return ret;

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('turno a cancelar marcado gestionado', $itemScope);
							ModalService.confirm('¿Desea volver el turno a estado PENDIENTE? ',
								function (_pOk) {
									if (_pOk) {

										vm.formControl.loading = true;
										TurnoDataService.validarCancelarMarcarTurnoComoGestionado($itemScope.turno.Id)
											.then(function (pResponseValidar) {

												if (pResponseValidar.IsOk) {

													TurnoDataService.cancelarMarcarTurnoComoGestionado($itemScope.turno.Id)
														.then(function (pOk) {
															vm.formControl.loading = false;
															AlertaService.NewSuccess("El turno volvió a estado Pendiente");
															buscarTurnosPorPaciente();
														}, function (pError) {
															vm.formControl.loading = false;
															$log.error('pError', pError);
														});
												} else {
													$log.error('Message');
													vm.formControl.loading = false;
												}

											}, function (pErrorValidar) {
												$log.error('pErrorValidar', pErrorValidar);
												vm.formControl.loading = false;
											});
									}
								}, "", vm.optionsObj);
						}
					}, {
						text: 'Cancelar Marcado Rellamado',
						displayed: function (modelValue) {

							var ret = false;
							if (modelValue.turno.IdEstadoDeReprogramacion === 5 && vm.puedeReprogramar) ret = true;
							return ret;

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('turno a cancelar marcado rellamado', $itemScope);
							ModalService.confirm('¿Desea volver el turno a Pendiente? ',
								function (_pOk) {
									if (_pOk) {

										vm.formControl.loading = true;
										TurnoDataService.validarCancelarMarcarRellamado($itemScope.turno.Id)
											.then(function (pResponseValidar) {

												if (pResponseValidar.IsOk) {

													TurnoDataService.cancelarMarcarRellamado($itemScope.turno.Id)
														.then(function (pOk) {
															vm.formControl.loading = false;
															AlertaService.NewSuccess("El turno se marco como Pendiente nuevamente");
															buscarTurnosPorPaciente();
														}, function (pError) {
															vm.formControl.loading = false;
															$log.error('pError', pError);
														});
												} else {
													$log.error('Message');
													vm.formControl.loading = false;
												}

											}, function (pErrorValidar) {
												$log.error('pErrorValidar', pErrorValidar);
												vm.formControl.loading = false;
											});
									}
								}, "", vm.optionsObj);
						}
					},
					{
						text: 'Cancelar Desiste de Reprogramar',
						displayed: function (modelValue) {

							var ret = false;
							if (modelValue.turno.IdEstadoDeReprogramacion === 3 && vm.puedeReprogramar) ret = true;
							return ret;

						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('turno a cancelar marcado rellamado', $itemScope);
							ModalService.confirm('¿Desea volver el turno a estado PENDIENTE? ',
								function (_pOk) {
									if (_pOk) {

										vm.formControl.loading = true;
										TurnoDataService.validarCancelarDesisteDeReprogramar($itemScope.turno.Id)
											.then(function (pResponseValidar) {

												if (pResponseValidar.IsOk) {

													TurnoDataService.cancelarDesisteDeReprogramar($itemScope.turno.Id)
														.then(function (pOk) {
															vm.formControl.loading = false;
															AlertaService.NewSuccess("El turno volvió a estado Pendiente");
															buscarTurnosPorPaciente();
														}, function (pError) {
															vm.formControl.loading = false;
															$log.error('pError', pError);
														});
												} else {
													$log.error('Message');
													vm.formControl.loading = false;
												}

											}, function (pErrorValidar) {
												$log.error('pErrorValidar', pErrorValidar);
												vm.formControl.loading = false;
											});
									}
								}, "", vm.optionsObj);
						}
					},
					{
						text: 'Sin acciones disponibles',
						displayed: function (modelValue) {
							return checkEstadoTurno(modelValue.turno) && (modelValue.turno.IdEstado !== 6);
						},
						enabled: false
					}

				];
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			function initData() {

				if (vm.data.esHistorico) {
					//busco historico desde hoy y 12 meses para atras
					vm.data.fechaDesde = angular.copy(vm.todayMinus12);
					vm.data.fechaHasta = angular.copy(vm.today);

				} else {
					//busco desde hoy y 3 meses en adelante
					vm.data.fechaDesde = angular.copy(vm.today);
					vm.data.fechaHasta = angular.copy(vm.todayPlus4);

				}

				buscarTurnosPorPaciente();

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 6;
				vm.formControl.loading = false;
				vm.formControl.stateLoading = false;
			}

			function activate() {

				$log.debug('$onInit');
				if (vm.resolve.paciente && vm.resolve.paciente.Id) {

					// vm.id = vm.resolve.paciente.Id;
					vm.paciente = angular.copy(vm.resolve.paciente);
					vm.busquedaPaciente = false;
					//seteamos buscador paciente off
				} else {
					//seteamos buscador de paciente en on
					vm.busquedaPaciente = true;
				}
				// seteamos si es historico o futuro
				vm.data.esHistorico = angular.copy(vm.resolve.EsHistorico);
				// seteamos si puede reprogramar desde el llamado
				vm.puedeReprogramar = angular.copy(vm.resolve.PuedeReprogrmar);
				vm.data.buscarPorServicio = angular.copy(vm.resolve.BusquedaPorServicio);
				if (vm.data.buscarPorServicio !== false) {
					vm.turno.filtroServicio = true;
					vm.formControl.showFiltroServicio = true;
				}

				var _sucursales = SucursalDataService.obtenerTodasSinExcepciones();
				var _estadosDeTurnos = TurnoDataService.obtenerTiposEstadoTurnos();
				var _motivosCancelacionTurnos = TurnoDataService.obtenerMotivosCancelacionTurno();
				var _obtenerNuevoActualizarObservacionesPrincipales = TurnoDataService.obtenerNuevoActualizarObservacionesPrincipales();

				$q.all([
					_sucursales,
					_estadosDeTurnos,
					_motivosCancelacionTurnos,
					_obtenerNuevoActualizarObservacionesPrincipales
				]).then(successCallback, errorCallback);

				function successCallback(pResults) {
					vm.data.sucursales = pResults[0];
					vm.data.estadosDeTurnos = pResults[1];
					vm.turno.motivosCancelacionTurno = pResults[2];
					vm.observacionDto = pResults[3];
					inicializarMenuOptions();
					$log.debug('Inicializar OK.-', pResults);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}

				if (vm.busquedaPaciente === false) {
					initData();
				} else {
					//busco historico desde hoy y 12 meses para atras
					vm.data.fechaDesde = angular.copy(vm.today);
					vm.data.fechaHasta = angular.copy(vm.today);
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 6;
					vm.formControl.loading = false;
					vm.formControl.stateLoading = false;
				}
				$log.debug('$onInit: OK');
			}

		}
	};

	return module;
})();
