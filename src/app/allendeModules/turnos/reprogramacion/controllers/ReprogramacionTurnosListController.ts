/**
 * @author:			Pablo Pautasso
 * @description:	Controller para la lista de turnos a reprogramar
 * @type:			Controller
 **/
import * as angular from 'angular';
import { IEstadoDeReprogramacionDataService } from '../services';


export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ReprogramacionTurnosListController', ReprogramacionTurnosListController);

		ReprogramacionTurnosListController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$state', '$timeout', '$stateParams', 'moment',
			'ModalService', 'ReprogramacionTurnosDataService', 'StateHelperService', 'AlertaService',
			'TurnoDataService', 'TurnosStorageHelperService', 'TurnosCommonLogicService', 'ReprogramacionTurnosLogicService',
			'PacienteLogicService', 'EstadoDeReprogramacionDataService'
		];

		function ReprogramacionTurnosListController(
			$location, $log, $q, $filter, $state, $timeout, $stateParams, moment,
			ModalService: IModalService, ReprogramacionTurnosDataService, StateHelperService, AlertaService,
			TurnoDataService, TurnosStorageHelperService, TurnosCommonLogicService, ReprogramacionTurnosLogicService,
			PacienteLogicService, EstadoDeReprogramacionDataService:IEstadoDeReprogramacionDataService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ReprogramacionTurnosListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				icon: $state.current.data.icon,
				page: $state.current.data.title
			};

			vm.data = {
				tipoConsulta: $stateParams.tipoConsulta,
				idConsulta: $stateParams.id,
				turnosAfectados: {},
				checkPendientes: false,
				estadosReprogramacion:{}

			};

			vm.tipoProcesoCancelacionTurno = {

				ninguno: 0,
				receso: 1,
				feriado: 2,
				cambioAgenda: 3

			};

			vm.tableOption = {
				CurrentPage: 1,
				PageSize: 6
			};

			vm.tiposProcesosCancelacion = {
				Ninguno: {
					id: 0,
					nombre: "Ninguno - Sin inicializar"
				},
				Receso: {
					id: 1,
					nombre: "Receso"
				},
				Feriado: {
					id: 2,
					nombre: "Feriado"
				},
				CambioAgenda: {
					id: 3,
					nombre: "Cambio de Agenda"
				}

			};

			vm.exportarAExcel = exportarAExcel;

			vm.table = {
				btnReasignarClick: reasignarTurno,
				btnDesistirClick: desistirDeReprogramar,
				btGestionarClick: gestionarTurno,
				btnCancelarDesisteReprogramarClick: cancelarDesisteReprogramar,
				verObservacionTurno: verObservacionTurno,
				cancelarMarcadoTurnoGestionado: cancelarMarcadoTurnoGestionado,
				verDatosContactoPaciente: verDatosContactoPaciente,
				getPage: getPage,
				marcarRellamado: marcarRellamado,
				cancelarMarcaRellamado: cancelarMarcaRellamado

			};

			vm.contextMenu = {
				pendienteTurno: pendienteTurno,
				cancelarDesisteTurno: cancelarDesisteTurno,
				cancelarGestionadoTurno: cancelarGestionadoTurno,
				observacionTurnoMenu: observacionTurnoMenu,
				observacionTurnoGestionado: observacionTurnoGestionado
			}

			vm.storage = {
				keyStorageReprogramacion: "turnos-reprogramacion-data"
			};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				volver: volver,
				buscar: buscar,
				clean: limpiarFiltros,
				changeServicioMedico: changeServicioMedico
			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function buscar() {

				$log.debug('buscando ');
				vm.formControl.loading = true;
				var _busqueda;

				var FechaDesde = moment(vm.data.fechaDesde).format("MM-DD-YYYY");
				var FechaHasta = moment(vm.data.fechaHasta).format("MM-DD-YYYY");
				// ModalService.loadingOpen();

				var _estadosReprogramacion: Array<any> = [] ;
				if(vm.data.estadosReprogramacion && vm.data.estadosReprogramacion.length){
					vm.data.estadosReprogramacion.forEach(estadoReprogramacion => {
						if(estadoReprogramacion.status){
							_estadosReprogramacion.push(estadoReprogramacion.Id);
						}
					});
				}

				//consulto la busqueda de que tipo es
				if (vm.data.servicioMedico && vm.data.recurso) {

					_busqueda = TurnoDataService.obtenerTurnosCanceladosGrilla({
						FechaDesde: angular.copy(FechaDesde), FechaHasta: angular.copy(FechaHasta),
						IdServicio: vm.data.servicioMedico.Id, IdRecurso: vm.data.recurso.Id, IdTipoRecurso: vm.data.recurso.IdTipoRecurso,
						ListaDeEstadosDeReprogramacion:_estadosReprogramacion, CurrentPage: vm.tableOption.CurrentPage, PageSize: vm.tableOption.PageSize});
					
				} else if (vm.data.servicioMedico) {

					_busqueda = TurnoDataService.obtenerTurnosCanceladosGrilla({
						FechaDesde: angular.copy(FechaDesde), FechaHasta: angular.copy(FechaHasta),
						IdServicio: vm.data.servicioMedico.Id, IdRecurso: 0, IdTipoRecurso: 0,
						ListaDeEstadosDeReprogramacion:_estadosReprogramacion, CurrentPage: vm.tableOption.CurrentPage, PageSize: vm.tableOption.PageSize});

				} else {

					_busqueda = TurnoDataService.obtenerTurnosCanceladosGrilla({
						FechaDesde: angular.copy(FechaDesde), FechaHasta: angular.copy(FechaHasta),
						IdServicio: 0, IdRecurso: 0, IdTipoRecurso: 0,
						ListaDeEstadosDeReprogramacion:_estadosReprogramacion, CurrentPage: vm.tableOption.CurrentPage, PageSize: vm.tableOption.PageSize});
				}

				$q.all([
					_busqueda
				]).then(busquedaOk, busquedaError);

				function busquedaOk(pResults) {

					vm.data.turnosAfectados = angular.copy(pResults[0]);
					ModalService.loadingClose();
					vm.formControl.loading = false;

					$log.debug('Inicializar OK.-', vm.data.turnosAfectados);
				}

				function busquedaError(pError) {

					vm.formControl.loading = false;
					ModalService.loadingClose();
					$log.error('Inicializar ERROR.-', pError);
					ModalService.error(pError.message);
				}
			}


			function buscarPorConsulta() {

				let _turnosAfectados;
				let _turnosAfectadosBuscar = false;

				var _tipoConsulta = $stateParams.tipoConsulta ? angular.copy($stateParams.tipoConsulta) : vm.data.tipoConsulta;
				var _idConsulta = $stateParams.id ? angular.copy($stateParams.id) : vm.data.idConsulta;
				ModalService.loadingOpen();

				switch (_tipoConsulta) {
					case 'feriado':
						//vengo de feriados
						_turnosAfectados = ReprogramacionTurnosDataService.obtenerTurnosAfectadosConGrilla(_idConsulta,
							vm.tipoProcesoCancelacionTurno.feriado, vm.tableOption.CurrentPage, vm.tableOption.PageSize);
						_turnosAfectadosBuscar = true;
						break;
					case 'receso':
						//vengo de recesos
						_turnosAfectados = ReprogramacionTurnosDataService.obtenerTurnosAfectadosConGrilla(_idConsulta,
							vm.tipoProcesoCancelacionTurno.receso, vm.tableOption.CurrentPage, vm.tableOption.PageSize);
						_turnosAfectadosBuscar = true;
						break;
					case 'cambioAgenda':
						//vengo de plantilla
						_turnosAfectados = ReprogramacionTurnosDataService.obtenerTurnosAfectadosConGrilla(_idConsulta,
							vm.tipoProcesoCancelacionTurno.cambioAgenda, vm.tableOption.CurrentPage, vm.tableOption.PageSize);
						_turnosAfectadosBuscar = true;
						break;
					case '':
						buscar();
						break;
				}
				if (_turnosAfectadosBuscar) {

					_turnosAfectados.then(successCallback, errorCallback);
				}


				function successCallback(pResults) {

					vm.data.turnosAfectados = pResults;
					cleanStorage();
					vm.formControl.loading = false;
					ModalService.loadingClose();
					$log.debug('Inicializar OK.-', pResults);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					ModalService.loadingClose();
					$log.error('Inicializar ERROR.-', pError);
					ModalService.error(pError.message);
				}

			}

			function limpiarFiltros() {

				$log.debug('limpiando filtros');

				delete vm.data.servicioMedico;
				delete vm.data.recurso;
				delete vm.data.turnosAfectados;
				vm.tableOption.CurrentPage = 1;
				vm.tableOption.PageSize = 8;
				cleanStorage();

			}


			function volver() {

				cleanStorage();
				StateHelperService.goToPrevState();
			}


			/**
			 * Busca por cambio de pagina o tamaño de pagina
			 * @param  {Pagination} pPagination
			 */
			function getPage(pPagination) {
				if (pPagination) {
					vm.tableOption.CurrentPage = pPagination.currentPage || 1;
					vm.tableOption.PageSize = pPagination.pageSize || 8;
				} else {
					vm.tableOption.CurrentPage = 1;
					vm.tableOption.PageSize = 8;
				}
				// Guardo la pagina actual
				// vm.filter.currentPage = pPagination.currentPage;
				var _tipoConsulta = $stateParams.tipoConsulta ? angular.copy($stateParams.tipoConsulta) : vm.data.tipoConsulta;
				if (_tipoConsulta == '')
					buscar();
				else buscarPorConsulta();
			}

			function reasignarTurno(rowTurno) {
				$log.error('rowTurno', rowTurno.row);
				var turno = angular.copy(rowTurno.row);

				if (turno.EstadoReprogramacion == "Pendiente") {
					// voy a reprogramar pero antes guardo
					setStoredData();
					// 
					// ahora si voy al state
					$state.go('main.signed.asignacionturno.list', {
						idTurnoToSearch: turno.Id
					});

				} else {
					AlertaService.NewWarning("Atencion", "El turno ya esta reprogramado")
				}

			}

			function desistirDeReprogramar(rowTurno) {
				$log.debug('desistirDeReprogramar - rowTurno:', rowTurno.row);

				var turno = angular.copy(rowTurno.row);

				// solo si el estado de reprogramación es pendiente
				if (turno.EstadoReprogramacion == "Pendiente") {

					var optionsObj = {
						ok: 'Si',
						cancel: 'No'
					};

					ModalService.confirm('¿Desea marcar que el paciente desiste de reprogramar el turno? ',
						function (_pOk) {
							if (_pOk) {
								vm.formControl.loading = true;
								ReprogramacionTurnosLogicService.desistirDeReprogramarTurno(turno.Id)
									.then(function (pResponseOk) {
										AlertaService.NewSuccess("Turno Desistido");
										vm.formControl.loading = false;
										buscarPorConsulta();
									}, function (pError) {
										$log.error('Error al desistir de reprogramar el turno', pError);
										vm.formControl.loading = false;
									});
							}
						}, "", optionsObj);

				} else {
					AlertaService.NewWarning("Atención", "El turno ya fue procesado (" + turno.EstadoReprogramacion + ")");
				}
			}

			function gestionarTurno(rowTurno) {
				$log.debug('gestionar turno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				if (turno.EstadoReprogramacion.includes("Pendiente")) {

					ModalService.textAreaModal({
						tituloModal: "Gestión de Turno para " + turno.Paciente + ", Doc: " + turno.Documento +
							", el día " + moment(turno.Fecha).format("dddd, D [de] MMMM [de] YYYY") + " a las " + turno.Hora +
							"hs. Con " + turno.Recurso,
						icon: "CONF",
						guardarOption: true,
						data: '',
						readOnly: false,
						sizeModal: "lg"
					}).then(function (pResult) {
						$log.debug('turnoGestionOk', pResult);
						vm.formControl.loading = true;
						TurnoDataService.validarMarcarTurnoComoGestionadoReprogramacion(turno.Id)
							.then(function (responseValidar) {
								if (responseValidar.IsOk) {
									TurnoDataService.marcarTurnoComoGestionadoReprogramacion(turno.Id, pResult)
										.then(function (response) {
											vm.formControl.loading = false;
											AlertaService.NewSuccess("Turno Gestionado");
											buscarPorConsulta();
										}, function (error) {
											vm.formControl.loading = false;
											$log.error('Error marcarTurnoGestionado', error);
										});
								} else {
									$log.error('responseValidar IsOK: ', responseValidar.IsOk);
									vm.formControl.loading = false;
								}
							}, function (errorValidar) {
								$log.error('turnoGestionError', errorValidar);
								vm.formControl.loading = false;
							});

					}, function (pError) {
						$log.error('turnoGestionError', pError);
					});
				} else {
					AlertaService.NewWarning("Atencion", "El turno está " + turno.EstadoReprogramacion);
				}

			}


			function cancelarDesisteReprogramar(rowTurno) {
				$log.debug('gestionar turno', rowTurno);
				var turno = angular.copy(rowTurno.row);

				ModalService.confirm('¿Desea volver el turno a estado PENDIENTE? ',
					function (_pOk) {
						if (_pOk) {

							vm.formControl.loading = true;
							TurnoDataService.validarCancelarDesisteDeReprogramar(turno.Id)
								.then(function (pResponseValidar) {

									if (pResponseValidar.IsOk) {

										TurnoDataService.cancelarDesisteDeReprogramar(turno.Id)
											.then(function (pOk) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("El turno volvió a estado Pendiente");
												buscarPorConsulta();
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
					}, "", optionsObj);

			}

			function verObservacionTurno(rowTurno) {
				$log.debug('gestionar turno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				TurnoDataService.obtenerObservacionesPorTurno(turno.IdTurno)
					.then((pObservacionOk) => {

						if (pObservacionOk.length > 0)
							TurnosCommonLogicService.openObservacionTurno(TurnosCommonLogicService.parsearObservaciones(pObservacionOk));
						else AlertaService.NewWarning("No existe ninguna observación");
					}, (pObservacionError) => {

						$log.error('Obtener ObservacionError', pObservacionError);
					});
			}

			function exportarAExcel() {

				var servicio = (vm.data.servicioMedico) ? vm.data.servicioMedico.Id : 0;
				var recurso = (vm.data.recurso) ? vm.data.recurso.Id : 0;
				var tipoRecurso = (vm.data.recurso) ? vm.data.recurso.IdTipoRecurso : 0;

				var FechaDesde = moment(vm.data.fechaDesde).format("MM-DD-YYYY");
				var FechaHasta = moment(vm.data.fechaHasta).format("MM-DD-YYYY");

				var fechaString = moment(vm.data.fechaDesde).format("DD-MM-YYYY") + ' - ' + moment(vm.data.fechaHasta).format("DD-MM-YYYY");

				TurnoDataService.reprogramacionExportarAExcel(FechaDesde, FechaHasta, servicio, recurso, tipoRecurso, vm.data.checkPendientes, fechaString)
					.then((pResultExportarAExcel) => {
						this.$log.debug('pResultExportarAExcel', pResultExportarAExcel);
					}, (pError) => {
						this.$log.error('pError', pError);
					});

			}

			function cancelarMarcadoTurnoGestionado(rowTurno) {
				$log.debug('gestionar turno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				ModalService.confirm('¿Desea volver el turno a estado PENDIENTE? ',
					function (_pOk) {
						if (_pOk) {

							vm.formControl.loading = true;
							TurnoDataService.validarCancelarMarcarTurnoComoGestionado(turno.Id)
								.then(function (pResponseValidar) {

									if (pResponseValidar.IsOk) {

										TurnoDataService.cancelarMarcarTurnoComoGestionado(turno.Id)
											.then(function (pOk) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("El turno volvió a estado Pendiente");
												buscar();
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
					}, "", optionsObj);

			}

			function marcarRellamado(rowTurno) {
				$log.debug('gestionar turno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				ModalService.confirm('¿Desea marcar el turno como RELLAMADO? ',
					function (_pOk) {
						if (_pOk) {

							vm.formControl.loading = true;
							TurnoDataService.validarMarcarRellamado(turno.Id)
								.then(function (pResponseValidar) {

									if (pResponseValidar.IsOk) {

										TurnoDataService.marcarRellamado(turno.Id)
											.then(function (pOk) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("El turno se marco para rellamado");
												buscar();
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
					}, "", optionsObj);
			}
			
			function cancelarMarcaRellamado(rowTurno) {
				$log.debug('gestionar turno', rowTurno);
				var turno = angular.copy(rowTurno.row);
				ModalService.confirm('¿Desea volver el turno a Pendiente? ',
					function (_pOk) {
						if (_pOk) {

							vm.formControl.loading = true;
							TurnoDataService.validarCancelarMarcarRellamado(turno.Id)
								.then(function (pResponseValidar) {

									if (pResponseValidar.IsOk) {

										TurnoDataService.cancelarMarcarRellamado(turno.Id)
											.then(function (pOk) {
												vm.formControl.loading = false;
												AlertaService.NewSuccess("El turno se marco como Pendiente nuevamente");
												buscar();
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
					}, "", optionsObj);
			}
			
		
			function verDatosContactoPaciente(rowTurno) {
				$log.debug('ver datos turno',rowTurno);
				PacienteLogicService.verDatosContactoPaciente(rowTurno.row.IdPaciente);
			}


			/* ---------------------------------------------- CONTEXT ---------------------------------------------- */
			function pendienteTurno(rowTurno) {
				var ret = false;
				var turno = angular.copy(rowTurno.row);
				if (turno.IdEstadoReprogramacion === 1) ret = true;
				return ret;
			}

			function cancelarDesisteTurno(rowTurno) {
				var ret = false;
				var turno = angular.copy(rowTurno.row);
				if (turno.IdEstadoReprogramacion === 3) ret = true;
				return ret;
			}

			function cancelarGestionadoTurno(rowTurno) {
				var ret = false;
				var turno = angular.copy(rowTurno.row);
				if (turno.IdEstadoReprogramacion === 4) ret = true;
				return ret;
			}

			function observacionTurnoMenu(rowTurno) {
				var ret = false;
				var turno = angular.copy(rowTurno.row);
				if (turno.IdEstadoReprogramacion === 1) ret = true;
				return ret;
			}

			function observacionTurnoGestionado(rowTurno) {
				var ret = false;
				var turno = angular.copy(rowTurno.row);
				if (turno.IdEstadoReprogramacion === 4) ret = true;
				return ret;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */


			$timeout(activate);
			// activate();

			function activate() {

				//vm.formControl.loading = true;
				$log.debug('Inicializar ON.-');

				let _estadosReprogramacion = EstadoDeReprogramacionDataService.getAll()
				.then(function (pResult) {
			
					vm.data.estadosReprogramacion = pResult;
					
					$log.debug('vm.data.estadosReprogramacion ON.-', vm.data.estadosReprogramacion);
					$log.debug('tipoConsultaReprogramacion ON.-', StateHelperService.getPrevState(), StateHelperService.getLastState());
	
					if (existStoredData()) {
						//tengo datos guardados por ende levanto
						$timeout(function () {
							getStoredData();
							vm.formControl.loading = false;
						}, 1000);
					} else {
						vm.data.fechaDesde = new Date();
						vm.data.fechaDesde.setDate(vm.data.fechaDesde.getDate());
	
						vm.data.fechaHasta = new Date();
						vm.data.fechaHasta.setDate(vm.data.fechaHasta.getDate() + 14);
						buscarPorConsulta();
					}
					
				}, function (pError) {
					$log.error('pError',pError);
					vm.formControl.loading = true;
				});


			}

			/* ---------------------------------------------- SUPPORT ---------------------------------------------- */
			function changeServicioMedico() {
				delete vm.data.recurso;
			}

			/* ---------------------------------------------- STORAGE ---------------------------------------------- */

			function getStoredData() {

				if (existStoredData()) {

					getData(TurnosStorageHelperService.getStorageObj(vm.storage.keyStorageReprogramacion));

					cleanStorage();
				}

				function getData(stored) {

					vm.data.servicioMedico = stored.servicioMedico ? angular.copy(stored.servicioMedico) : false;
					vm.data.recurso = stored.recurso ? angular.copy(stored.recurso) : false;
					vm.data.tipoConsulta = stored.tipoConsulta ? angular.copy(stored.tipoConsulta) : '';
					vm.data.idConsulta = stored.idConsulta ? angular.copy(stored.idConsulta) : '';
					vm.data.checkPendientes = stored.soloPendientes ? angular.copy(stored.soloPendientes) : false;
					vm.data.fechaDesde = stored.fechaDesde ? angular.copy(stored.fechaDesde) : '';
					vm.data.fechaHasta = stored.fechaHasta ? angular.copy(stored.fechaHasta) : '';
					vm.tableOption.CurrentPage = stored.currentPage ? angular.copy(stored.currentPage) : 1;
					vm.tableOption.PageSize = stored.pageSize ? angular.copy(stored.pageSize) : 6;
					buscarPorConsulta();
				}

			}

			function existStoredData() {
				var ret = false;
				if (TurnosStorageHelperService.existStoredObjects(vm.storage.keyStorageReprogramacion))
					ret = true;
				return ret;

			}

			function cleanStorage() {

				$log.debug('cleanStorage');
				TurnosStorageHelperService.cleanStorage(vm.storage.keyStorageReprogramacion);

			}

			function setStoredData() {

				var reprogramacionStorage;

				if ($stateParams.tipoConsulta) {

					reprogramacionStorage = {

						tipoConsulta: angular.copy($stateParams.tipoConsulta),
						idConsulta: angular.copy($stateParams.id),
						soloPendientes: angular.copy(vm.data.checkPendientes),
						fechaDesde: angular.copy(vm.data.fechaDesde),
						fechaHasta: angular.copy(vm.data.fechaHasta),
						currentPage: angular.copy(vm.tableOption.CurrentPage),
						pageSize: angular.copy(vm.tableOption.PageSize)

					};

				} else {

					reprogramacionStorage = {

						recurso: angular.copy(vm.data.recurso),
						servicioMedico: angular.copy(vm.data.servicioMedico),
						tipoConsulta: angular.copy(vm.data.tipoConsulta),
						idConsulta: angular.copy($stateParams.id),
						soloPendientes: angular.copy(vm.data.checkPendientes),
						fechaDesde: angular.copy(vm.data.fechaDesde),
						fechaHasta: angular.copy(vm.data.fechaHasta),
						currentPage: angular.copy(vm.tableOption.CurrentPage),
						pageSize: angular.copy(vm.tableOption.PageSize)

					};
				}

				TurnosStorageHelperService.setStorageObj(vm.storage.keyStorageReprogramacion, reprogramacionStorage);

			}

		}
	};

	return module;
})();