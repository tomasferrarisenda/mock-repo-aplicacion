/**
 * @author:			Pablo Pautasso
 * @description:	Controller para la asignacion de turnos multiples
 * @type:			Controller
 **/
import * as angular from 'angular';
import { ISucursalDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';



	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('AsignacionTurnoMultiplesController', AsignacionTurnoMultiplesController);

		AsignacionTurnoMultiplesController.$inject = [
			'$location', 'Logger', '$q', '$filter', '$state', '$stateParams', 'StateHelperService', 'moment', '$scope', 'User',
			'$timeout', 'uiCalendarConfig', 'uiGridConstants', 'AlertaService', 'ModalService', 'DateUtils', 'RecepcionTurnosAuthService',
			'SucursalDataService', 'PlantillaDataService', 'TurnoDataService', 'PrestacionGestionDataService', 'AsignacionTurnoLogicService',
			'AsignacionTurnoDataService', 'AsignacionTurnoLogicService', 'AsignacionTurnoModalService', 'TurnosCommonLogicService','AsignacionTurnoAuthService'
		];

		function AsignacionTurnoMultiplesController(
			$location, $log, $q, $filter, $state, $stateParams, StateHelperService, moment, $scope, User,
			$timeout, uiCalendarConfig, uiGridConstants, AlertaService, ModalService: IModalService, DateUtils, RecepcionTurnosAuthService,
			SucursalDataService: ISucursalDataService, PlantillaDataService, TurnoDataService, PrestacionGestionDataService, AsignacionTurnoLogicService,
			AsignacionTurnoDataService, LogicService, AsignacionTurnoModalService, TurnosCommonLogicService, AsignacionTurnoAuthService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AsignacionTurnoMultiplesController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = $state.current.data.title;

			var filedsOrderby = ["Fecha", "Hora"];


			vm.pacienteControl = {

				select: selectPaciente,
				deletePacienteList: deletePacienteList
			};

			vm.data = {
				paciente: $stateParams.pacienteObj,
				pacientes: [],
				criterios: [],
				gridRecursosBusqueda: false,
				turnosSeleccionadosPorPaciente: [],
				extraColumn: '',
				turnoSelected: {}

			};

			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				save: methodSave,
				volver: volver,
				agregarPaciente: agregarPaciente,
				deletePacienteList: deletePacienteList,
				agregarCriterio: agregarCriterio,

				cargarDatosPrestacion: cargarDatosPrestacion,

				eliminarCriterioBusqueda: eliminarCriterioBusqueda,

				toggleBusquedaRecursos: toggleBusquedaRecursos,
				loadPrestacionesBtn: loadPrestacionesBtn,
				buscar: buscar,
				limpiar: limpiar,
				pacienteSearchBool: true,

				selectTurno: selectTurno,
				setCriterioSelected: setCriterioSelected,
				isMutualActiva: isMutualActiva,
				getMutualPaciente: getMutualPaciente,
				abrirObservaciones: abrirObservaciones,
				abrirRequerimientos:abrirRequerimientos,
				filtrarPrestacionesPorTipoDeTurno: filtrarPrestacionesPorTipoDeTurno
		
			};

			vm.grid = {

			};

			vm.turno = {

				seleccionarTurno: seleccionarTurno,
				quitarTurno: quitarTurno

			};

			vm.coloresEstadoTurno = LogicService.getcoloresEstadoTurno();
			var confirmOptions = LogicService.getConfirmOptions();

			//clases o colores para criterios
			vm.criteriosClass = [
				{
					id: 0,
					class: 'color-lila',
				},
				{
					id: 1,
					class: 'color-verde-pastel-prefactura',
				},
				{
					id: 2,
					class: 'color-amarillo-autorizacion',
				},
				{
					id: 3,
					class: 'color-naranja-sucursales',
				},
				{
					id: 4,
					class: 'turnos-Atendido-color',
				},
			]

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			function scrollToButton() {
				//funcion para scroll abajo
				var elm:any = document.querySelector("#wrapper");
				if (elm)
					window.scrollTo(0, elm.scrollHeight);

			}

			function selectTurno(turno) {

				if (turno.selected) {

					vm.data.turnoSelected = angular.copy(turno);

					angular.forEach(vm.data.observacionTurnoPlantilla, function (items, key) {

						angular.forEach(items, function (itemObservacionPlantilla) {

							if (turno.IdRecurso === itemObservacionPlantilla.IdRecurso &&
								moment(turno.Fecha).isBetween(itemObservacionPlantilla.FechaDesde, itemObservacionPlantilla.FechaHasta, 'days', '[]')) {

								$log.error("hay un turno igual");
								// vm.data.observacionesPlantilla = angular.copy(itemObservacionPlantilla.Observaciones);
								vm.data.observacionesPlantilla = AsignacionTurnoLogicService.getObservacionesPorSucursalParseadas(itemObservacionPlantilla.Observaciones,
									vm.data.sucursalesParaObservaciones);
							}

						});
					});
				} else vm.data.observacionesPlantilla = "";
			}

			function methodSave() {

				$log.debug('otorgar turno', vm.data.turnosSeleccionadosPorPaciente, vm.data.criterioBusquedaList.Criterios,
					vm.data.pacientes);

				var _existenTurnosDistintaSucursal = false;

				if (vm.data.turnosSeleccionadosPorPaciente.length > 0) {
					var _primerTurnoSeleccionado = vm.data.turnosSeleccionadosPorPaciente[0];
					angular.forEach(vm.data.turnosSeleccionadosPorPaciente, function (turnoSeleccionado) {

						if (_primerTurnoSeleccionado.IdSucursal !== turnoSeleccionado.IdSucursal) {

							_existenTurnosDistintaSucursal = true;
						}
					});

					if (_existenTurnosDistintaSucursal) {

						ModalService.confirm("Atencion. Está  por dar turnos en diferentes sucursal. ¿Está seguro?",
							function (response) {
								if (response) {
									abrirModalParaOtorgarTurnos();
								}
							}, "", confirmOptions);
					} else {
						abrirModalParaOtorgarTurnos();
					}

				} else {
					limpiarGrillaYCalendario();
					AlertaService.NewWarning("Atención", "No hay turnos seleccionados para ningun paciente");
				}

				function abrirModalParaOtorgarTurnos() {

					if (AsignacionTurnoAuthService.tienePermisoCallCenter(User)) {

						if (RecepcionTurnosAuthService.tienePermisoRecepcion(User)) {
							// tengo permiso de recepcion entonces guardo turno ok
							AsignacionTurnoModalService.openAsignarTurnoVariosPacientes(vm.data.turnosSeleccionadosPorPaciente, vm.data.criterioBusquedaList.Criterios,
								vm.data.pacientes)
								.then(openAsignarTurnoOk, openAsignarTurnoError);
						} else {
							// tengo permiso de callcenter pero no de recepcion por lo que no puedo otorgar DNP ni reservado
							// consulto si el tipo de turno seleccionado es DNP, entonces puedo buscar pero no asignar}

							if (existeTurnoDnpOReservado()) {
								AlertaService.NewWarning("Atención", "No se puede asignar un turno con Tipo De Turno igual a DNP o Reservado");
							} else {
								AsignacionTurnoModalService.openAsignarTurnoVariosPacientes(vm.data.turnosSeleccionadosPorPaciente, vm.data.criterioBusquedaList.Criterios,
									vm.data.pacientes)
									.then(openAsignarTurnoOk, openAsignarTurnoError);
							}
						}
	
					} else {
						// tengo permiso de recepcion entonces guardo turno ok
						if (RecepcionTurnosAuthService.tienePermisoRecepcion(User)) {
							AsignacionTurnoModalService.openAsignarTurnoVariosPacientes(vm.data.turnosSeleccionadosPorPaciente, vm.data.criterioBusquedaList.Criterios,
								vm.data.pacientes)
								.then(openAsignarTurnoOk, openAsignarTurnoError);
						}
					}
					
				}

				function existeTurnoDnpOReservado(){
					let _ret = true;
					angular.forEach(vm.data.criterioBusquedaList.Criterios, function (criterio) {
						if(criterio.IdTipoDeTurno == 7 || criterio.IdTipoDeTurno == 4) _ret = true;
					})
					return _ret;
				}

				function openAsignarTurnoOk(pResult) {
					if (pResult) 
						volver();
				}

				function openAsignarTurnoError(pError) {
					$log.debug('openAsignarTurnoError', pError);
				}

			}


			function buscar() {

				if(vm.data.criterios && vm.data.criterios.length > 1){

					vm.formControl.loading = true;
					//limpio grillas y calendario por si hago una re-busqueda
					limpiarGrillaYCalendario();
	
					$log.debug('busqueda multirecurso', vm.data.criterios);
	
					//declaro duracion para la llamada
					var _duracionDeTurno;
	
					//seteo la lista de criterios de busqueda en 0 -> limpio la lista
					vm.data.criterioBusquedaList.Criterios.length = 0;
	
					//seteo los criterios uno x uno a la lista
					angular.forEach(vm.data.criterios, function (criterio) {
	
						vm.data.criterioBusquedaList.Criterios.push(criterio);
	
					});
	
					$log.debug('busqueda criterioBusquedaList', vm.data.criterioBusquedaList);
	
					//voy a armar la lista de llamadas para duracion
					var _criterioDuracion;
					var _llamadasDuracion: Array<any> = [];
	
					angular.forEach(vm.data.criterioBusquedaList.Criterios, function (criterio) {
	
						//seteo el criterio de duracion
						_criterioDuracion = setearCriterioDuracion(criterio);
						//lo agrego a las llamadas
						_llamadasDuracion.push(AsignacionTurnoDataService.obtenerDuracionNecesariaParaRecursoEnServicio(
							_criterioDuracion
						));
	
					});
	
	
					$q.all(_llamadasDuracion)
					.then(buscarOkCallback, buscarErrorCallback);
				}else {
					AlertaService.NewWarning("Atención", "Debe seleccionar mas de 1 criterio de busqueda");
				}


				function buscarOkCallback(pResultDuraciones) {

					$log.debug('Buscar duraciones Ok', pResultDuraciones);

					var _result: Array<any> = [];
					_result = angular.copy(pResultDuraciones);

					_result = _result.filter(function (n) { return n != null });

					if (_result !== null){

						for (let index = 0; index < _result.length; index++) {
							
							_result[index].IdCriterio = vm.data.criterioBusquedaList.Criterios[index].Id;
							
						}

						vm.data.duracionesTurnoObtenido = angular.copy(_result);
					}
					else delete vm.data.duracionesTurnoObtenido;

					AsignacionTurnoDataService.obtenerTurnosAsignablesVariosMedicosElMismoDia(vm.data.criterioBusquedaList)
						.then(function (pResult) {

							$log.debug('results busqueda', pResult);

							if (pResult) {

								//voy a setear los datos para la observacio
								var fechaDesdeCalendario = moment(pResult.SituacionesPorDia[0].Fecha).format("MM-DD-YYYY");

								$timeout(function () {
									uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
										"gotoDate",
										fechaDesdeCalendario
									);

								}, 200);

								setearObservaciones(fechaDesdeCalendario);

								vm.data.turnosCalendario = setearBusquedaTurnos(pResult);

								$timeout(function () {

									uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar('prev');
									uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar('next');

								}, 200);

								// vm.data.gridRecursosBusqueda = false;
								$log.debug('turnos del CALENDARIO', vm.data.turnosCalendario);
								vm.formControl.loading = false;

								setTimeout(() => {
									scrollToButton();
									
								}, 175);


							} else {
								AlertaService.NewWarning(
									"Alerta",
									"No hay turnos disponibles para la busqueda realizada"
								);
								vm.formControl.loading = false;

							}


						}, function (pError) {
							$log.debug('error', pError);
							vm.formControl.loading = false;

						});

				}

				function buscarErrorCallback(pError) {
					$log.error('Buscar Duraciones Error', pError);
					vm.formControl.loading = false;
				}



			}

			function volver() {
				StateHelperService.goToPrevState();
			}

			function agregarPaciente() {

				$log.debug('seleccionar paciente', vm.data.pacienteBuscar);

				var ret = false;
				var tieneMutualDefecto = false;

				angular.forEach(vm.data.pacientes, function (pacienteL) {

					if (pacienteL.Id === vm.data.pacienteBuscar.Id) {
						ret = true;
					}
				});

				if (ret === false) {

					angular.forEach(vm.data.pacienteBuscar.Afiliaciones, function (afiliacion) {
						if (afiliacion.PorDefecto === true)
							tieneMutualDefecto = true;
					});

					if (tieneMutualDefecto) {

						angular.forEach(vm.data.pacientes, function (pac) {

							pac.Seleccionado = false;

						});

						vm.data.pacienteBuscar.Seleccionado = true;
						vm.data.pacientes.push(angular.copy(vm.data.pacienteBuscar));
					} else AlertaService.NewWarning("Atención!", "No hay ninguna mutual seleccionada");
				}

				
			}

			function selectPaciente(paciente) {

				$log.debug('select paciente', paciente);

				angular.forEach(vm.data.pacientes, function (pac) {

					if (paciente.Id !== pac.Id) pac.Seleccionado = false;

				});

				paciente.Seleccionado = (paciente.Seleccionado) ? false : true;

				if (paciente.Seleccionado) {
					vm.data.pacienteBuscar = angular.copy(paciente);
				} else {
					delete vm.data.pacienteBuscar;
				}

			}

			function deletePacienteList(paciente) {

				$log.debug('paciente to pop', paciente);

				vm.data.pacientes = $.grep(vm.data.pacientes, function (e: any) {
					return e.Id != paciente.Id;
				});


			}

			function setCriterioSelected() {
				if (LogicService.existePacienteSeleccionado(vm.data.pacientes)) {

					vm.data.criterioSelected = angular.copy(obtenerCriterioArmado());
					$log.debug('seteando criterio',vm.data.criterioSelected);
				}
			}

			function agregarCriterio() {

				$log.debug('agregando recurso para buscar');
				
				if(LogicService.existePacienteSeleccionado(vm.data.pacientes)){
					
					if (vm.data.servicioMedico){

						if (vm.data.tipoTurno){

							if(vm.data.sucursal){

								var criterioNuevo = obtenerCriterioArmado();
				
									//voy a buscar si ya tengo un recurso como criterio ya agregado pero distinto paciente
									vm.data.criterios.push(criterioNuevo);
									vm.data.gridRecursosBusqueda = true;
									limpiarHeader();
									limpiarCalendario();
							} else AlertaService.NewWarning("Atencion!", "Debe seleccionar una sucursal");
						} else AlertaService.NewWarning("Atencion!", "Debe seleccionar un tipo de turno");
						
					}else {
						AlertaService.NewWarning("Atencion!", "Debe seleccionar un servicio")
					}

				}else AlertaService.NewWarning("Atencion!","Debe seleccionar un paciente");

			}

			function limpiarHeader() {

				vm.data.servicioMedico = '';
				vm.data.tipoTurno = {};
				angular.forEach(vm.data.testPrestaciones, function (value) {
					value.status = false;
				});

				vm.data.recurso = '';
				vm.data.sucursal = '';
			}

			function limpiarCalendario() {
				delete vm.data.turnosCalendario;
				delete vm.data.turnosDisponiblesDelDia;
				vm.data.turnosSeleccionadosPorPaciente = [];
				$timeout(function () {
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
						"prev"
					);
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
						"next"
					);
				}, 200);
			}

			function limpiar() {

				delete vm.data.servicioMedico;
				delete vm.data.recurso;
				delete vm.data.testPrestaciones;
				delete vm.data.turnosCalendario;
				delete vm.data.turnosDisponiblesDelDia;
				delete vm.data.tipoTurno;
				vm.data.turnosSeleccionadosPorPaciente = [];
				vm.data.criterios = [];
				delete vm.data.sucursal;

				$timeout(function () {
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
						"prev"
					);
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
						"next"
					);
				}, 200);

			}

			function limpiarGrillaYCalendario() {

				delete vm.data.turnosCalendario;
				vm.data.turnosDisponiblesDelDia = [];
				vm.data.turnosSeleccionadosPorPaciente = [];
				$timeout(function () {
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
						"prev"
					);
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar(
						"next"
					);
				}, 200);
			}



			function cargarDatosPrestacion(pServicio) {

				if (pServicio !== null) {

					PrestacionGestionDataService.getTodasPrestacionesXServicio(pServicio.Id)
						.then(getPrestacionesXServicioOk, getPrestacionesXServicioError);
				}

				function getPrestacionesXServicioOk(pResults) {

					if (pResults.length !== 0) {
						vm.data.testPrestaciones = angular.copy(pResults);
						vm.data.prestaciones = angular.copy(pResults);

						var _ifConsulta = vm.data.testPrestaciones.find(x => x.Nombre == "CONSULTA");
						if (_ifConsulta) {

							vm.data.testPrestaciones.find(x => x.Id === _ifConsulta.Id).status = true;

						} else {
							vm.data.testPrestaciones[0].status = true;
						}
					}

				}

				function getPrestacionesXServicioError(pError) {
					$log.error('getPrestacionesXServicioError', pError);
				}

			}

			function toggleBusquedaRecursos() {

				vm.data.gridRecursosBusqueda = (vm.data.gridRecursosBusqueda) ? false : true;
				$log.debug('toggle busqueda', vm.data.gridRecursosBusqueda);
			}

			/**
			 * metodo para agregar el turno a la lista de turnos seleccionados por paciente
			 * para despues otorgarlos
			 * @param turno turno seleccionado
			 */
			function seleccionarTurno(turno) {

				$log.debug('seleccionar turno - turno', turno);
				
				var _criterioToLook;
				
				//consultamos cuantos criterios de busqueda tiene.
				//si tiene mas de uno abrimos modal para seleccionar a cual criterio asignamos el turno.
				if (turno[0].Criterios.length > 1) {

					let options: Array<any> = [];
					for (let i = 0; i < turno[0].Criterios.length; i++) {
						options.push({
							id: turno[0].Criterios[i].Id,
							label: 'Paciente ' + turno[0].Criterios[i].Id + ':' + turno[0].Criterios[i].nombrePaciente + ' - ' + turno[0].Criterios[i].tipoDniPaciente +
								': ' + turno[0].Criterios[i].dniPaciente + ' - Edad:' + turno[0].Criterios[i].EdadPaciente
						});
					};
					
					//tengo 2 o mas criterios entonces abro modal
					ModalService.selectOptionModal(options)
						.then(function (pResult) {

							$log.debug('pResult', pResult);
							_criterioToLook = turno[0].Criterios.find(x => x.Id === pResult.id);

							/**
							 * tratamiento unico caso donde se busca con dos recursos iguales
							 * pero esos recursos son criterios diferentes
							 * 
							 * 1° tengo que tener mas de 1 criterio => ya es el caso
							 * 
							 * 2° esos criterios tiene que tener al menos 2 el mismo recurso
							 * 
							 */

							 if(LogicService.criteriosMismoRecurso(vm.data.criterios)){
								
								/*tengo dos criterios con el mismo recurso pero distinta busqueda para ese criterio
								* ejemplo: 
								* Busque Fernandez para primera vez con un paciente A y busque Fernandez para ulterior con un paciente B
								* => consulto que criterio selecciono el usuario -> _criterioToLook
								* y le asocio la duracion de ese criterio
								*/

								if(vm.data.duracionesTurnoObtenido.length > 0){

									var _duracion = vm.data.duracionesTurnoObtenido.find(x => x.IdCriterio === _criterioToLook.Id);
									$log.debug('duracion seleccionada para el recurso', _duracion);
									
									/*
									 * Una vez que tengo la duracion y el turno, deberia preguntar si la duracion alcanza
									 * y si ir preguntando si alcanza hasta tener la duracion total en _duracion.DuracionIndividual
									 */
									//if (_duracion.DuracionIndividual > turno[0].DuracionIndividualRegla)
										turno = LogicService.obtenerTurnosExtrasPorDuracion(_duracion, turno, vm.data.turnosDisponiblesDelDia);
								}
							 }

							mostrarTurnos(_criterioToLook, turno);

						}, function (pError) {
							$log.error('pError', pError);
						});

				} else {
					//tengo 1 o menos criterios entonces no abro modal y seteo datos para criterio unico
					_criterioToLook = angular.copy(turno[0].Criterios[0]);
					mostrarTurnos(_criterioToLook, turno);

				}

				function setearTurnosCriterio(_criterio, _turno) {

					angular.forEach(_turno, function (_turno_) {

						_turno_.IdGrupoTurno = 1;
						_turno_.IdPaciente = angular.copy(_criterio.IdPaciente);
						_turno_.nombrePaciente = angular.copy(_criterio.nombrePaciente);
						_turno_.Servicio = angular.copy(_criterio.nombreServicio);
						_turno_.TipoTurno = angular.copy(_criterio.nombreTipoTurno);
						_turno_.Prestaciones = angular.copy(_criterio.Prestaciones);
						_turno_.CriterioBusquedaId = angular.copy(_criterio.Id);
						_turno_.PrestacionesNombres = angular.copy(_criterio.PrestacionesNombres);

					});
				}

				function mostrarTurnos(criterio, turno) {

					setearTurnosCriterio(criterio, turno);
					//voy a consulta si existe
					var yaExisteTurno = false;

					if (vm.data.turnosSeleccionadosPorPaciente.length === 0) {

						// al ser la primera vez agrego todos los turnos con id group igual, sea uno o varios
						angular.forEach(turno, function (turnoToAdd) {
							turnoToAdd.IdGrupoTurno = 1;
							vm.data.turnosSeleccionadosPorPaciente.push(angular.copy(turnoToAdd));
						});

					}
					//tengo mas turnos en la lista de turnos seleccionados -> consulto si no estan ya
					else {

						angular.forEach(vm.data.turnosSeleccionadosPorPaciente, function (turnoSeleccionado) {

							$log.debug('turno',turno);
							$log.debug('turnoSeleccionado',turnoSeleccionado);
							if(turno && turno.length > 1){
								angular.forEach(turno, function (_turno) {
									if (_turno.Hora === turnoSeleccionado.Hora &&
										moment(new Date(turnoSeleccionado.Fecha)).date() === moment(new Date(_turno.Fecha)).date()
										&& _turno.IdRecurso === turnoSeleccionado.IdRecurso) {
										yaExisteTurno = true;
									}
								});
							}else {

								if (turno.Hora === turnoSeleccionado.Hora &&
									moment(new Date(turnoSeleccionado.Fecha)).date() === moment(new Date(turno.Fecha)).date()
									&& turno.IdRecurso === turnoSeleccionado.IdRecurso) {
									yaExisteTurno = true;
								}
							}

						});

						if (!yaExisteTurno) {

							var _lastElementId = vm.data.turnosSeleccionadosPorPaciente[vm.data.turnosSeleccionadosPorPaciente.length - 1].IdGrupoTurno;

							angular.forEach(turno, function (t) {

								if (!vm.data.turnosSeleccionadosPorPaciente.find(x => x.IdRow === t.IdRow)) {
									t.IdGrupoTurno = _lastElementId + 1;
									vm.data.turnosSeleccionadosPorPaciente.push(angular.copy(t));
								}
							});


						} else AlertaService.NewWarning("Alerta",
							"Atención, turno ya seleccionado");
					}

					//limpio los turnos seleccionados por paciente
					limpiarTurnosSelected(vm.data.turnosSeleccionadosPorPaciente);
					$log.debug('turnos para guardar', vm.data.turnosSeleccionadosPorPaciente);
				}

			}

			/**
			 * metodo para limpiar todos los turnos seleccionados
			 * 
			 * @param data = lista de todos los turnos seleccionados de la grilla
			 */
			function limpiarTurnosSelected(data) {

				angular.forEach(data, function (item) {
					item.selected = false;
				});

			}

			//funcion para pasar del quitar un turno del listado de turnos para otorgar
			function quitarTurno(turno) {

				$log.debug('quitarTurno', turno, vm.data.paciente);
				
				if (turno) {

					var _turnos = vm.data.turnosSeleccionadosPorPaciente.filter(x => x.IdGrupoTurno === turno.IdGrupoTurno);

					$log.debug('_turnos', _turnos);
					angular.forEach(_turnos, function (_turno) {

						vm.data.turnosSeleccionadosPorPaciente = $.grep(vm.data.turnosSeleccionadosPorPaciente, function (e: any) {
							return e.IdRow != _turno.IdRow;
						});
					});

				}
			}

			function loadPrestacionesBtn() {
				var ret = "Prestaciones";
				angular.forEach(vm.data.testPrestaciones, function (prestacion) {
					if (prestacion.status === true) {
						ret = "Prestacion: " + prestacion.Nombre;
					}
				});
				return ret;
			}


			function setearCriterioDuracion(criterio) {

				var ret = angular.copy(vm.data.criterioBusquedaDuracionDto);
				ret.IdServicio = angular.copy(criterio.IdServicio);

				if (criterio.IdRecurso) {
					ret.IdRecurso = angular.copy(criterio.IdRecurso);
					ret.IdTipoRecurso = angular.copy(
						criterio.IdTipoRecurso
					);
				} else {
					ret.IdRecurso = 0;
					ret.IdTipoRecurso = 0;
				}

				ret.IdTipoDeTurno = angular.copy(
					criterio.IdTipoDeTurno
				);

				angular.forEach(criterio.Prestaciones, function (prestacion, key) {
					ret.Prestaciones.push(prestacion);
				});

				ret.EdadPaciente = angular.copy(criterio.EdadPaciente);

				return ret;
			}

			function getMutualPaciente(paciente) {
				
				var mutualNombre = paciente.Afiliaciones.find(x => x.PorDefecto === true).MutualNombreCorto;

				return '(' + mutualNombre + ')';
			}

			function abrirObservaciones() {
				$log.debug('observaciones', vm.data.observacionesPlantilla);
				
				var ObservacionesItem = {
					observacionToShow: '',
					observacionConTags: '',
				}
				// ObservacionesItem.observacionToShow = angular.copy($itemScope.plantilla.Observaciones);
				TurnosCommonLogicService.openObservacionesPorSucursal(ObservacionesItem, vm.data.observacionesPlantilla, true, false);
			}

			function abrirRequerimientos() {
				$log.debug('turnoSelected',vm.data.turnoSelected);
				if(vm.data.turnoSelected && vm.data.turnoSelected.IdRow){
					// if (AsignacionTurnoLogicService.checkTurnosSeleccionados(vm.data.turnosDisponiblesDelDia)) {
					// 	//tengo un turno del dia seleccionado, continuo entonces con ese
						let turnos: Array<any> = [];
						turnos.push(vm.data.turnoSelected);
						$log.debug('turnos de requerimientos', turnos);
							// let dataTurnoRequerimiento = AsignacionTurnoLogicService.getDataTurnoParaOtorgarLogic(turnos, vm.data.prestacionesObtenidas, vm.data.paciente,
							// 	vm.data.servicioMedico);
							AsignacionTurnoModalService.openRequerimientosMasPreparaciones(null, turnos, turnos[0].Criterios[0]);
					}
				}


			function filtrarPrestacionesPorTipoDeTurno() {

				// si es tipo de turno primera vez o ulterior
				if(vm.data.tipoTurno){

					$log.debug('tipo de turno', vm.data.tipoTurno);
					if (vm.data.tipoTurno.Id === 1 || vm.data.tipoTurno.Id === 2) {
						vm.data.prestacionesFiltradasPorTipoTurno = angular.copy(vm.data.prestaciones.filter(x => x.IdTipoPrestacion === 1));
					} else if (vm.data.tipoTurno.Id === 5) {
						vm.data.prestacionesFiltradasPorTipoTurno = angular.copy(vm.data.prestaciones.filter(x => x.IdTipoPrestacion === 2));
					} else {
						vm.data.prestacionesFiltradasPorTipoTurno = angular.copy(vm.data.prestaciones);
					}
	
					if (vm.data.prestacionesFiltradasPorTipoTurno && vm.data.prestacionesFiltradasPorTipoTurno.length > 0) {
	
						vm.data.prestacionesFiltradasPorTipoTurno[0].status = true;
					} else {
						AlertaService.NewWarning("No hay prestaciones para el tipo de turno seleccionado");
					}
					vm.data.testPrestaciones = angular.copy(vm.data.prestacionesFiltradasPorTipoTurno);
					setCriterioSelected();
				}
			}
			/* ---------------------------------------------- CALENDAR ---------------------------------------------- */

			vm.uiConfig = {

				calendarTurnoMultiples: {
					schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
					height: 'auto',
					// aspectRatio: 0.80,

					defaultView: 'month',
					ignoreTimezone: false,
					timezone: 'local',
					firstDay: 1,
					editable: true,
					eventOverlap: false,

					selectable: true,

					customButtons: {
						colorButton: {
							text: "C",
							click: function () {
								//showColores();
								vm.formControl.toggleColores = vm.formControl.toggleColores ?
									false :
									true;
								calendarRender();
							}
						}
					},

					header: {
						left: "title",
						center: "colorButton",
						right: "prev,next"
					},
					// eventClick: function(calEvent, jsEvent, view) {

					// 	$log.debug('eventClick');

					// },
					events: [{

						id: 1,
						start: '2017-06-10T10:00:00',
						end: '2017-06-10T16:00:00',
						rendering: 'background'

					}],

					dayRender: function (date, cell) {

						if (!moment(date.stripTime().format()).isSameOrAfter(moment().stripTime().format())) {
							// if (date.isBefore(moment())) {

							cell.css("background-color", "rgba(170, 178, 185, 0.13)");
							cell.css("cursor", "default");

						} else if (vm.data.turnosCalendario) {

							angular.forEach(vm.data.turnosCalendario.SituacionesPorDia, function (value) {

								if (date.format("MM/DD/YYYY") === moment(new Date(value.Fecha)).format('MM/DD/YYYY')) {

									cell.addClass(value.Color);
								}
							});
						}

					},
					dayClick: function (date, jsEvent, view) {

						$log.debug('dayclick');
						// if (!date.isBefore(moment())) {
						if (moment(date.stripTime().format()).isSameOrAfter(moment().stripTime().format())) {
							if (vm.data.turnosCalendario) {

								if (vm.data.turnosCalendario.length !== 0) {
									var dateExist = false;

									angular.forEach(vm.data.turnosCalendario.SituacionesPorDia, function (value) {

										if (!dateExist) {
											if (date.format("MM/DD/YYYY") === moment(new Date(value.Fecha)).format('MM/DD/YYYY')) {

												vm.data.turnosDisponiblesDelDia = angular.copy(value.TurnosAsignables);
												//ordenar turnos por fecha creciente
												var _turnosToOrder = angular.copy(vm.data.turnosDisponiblesDelDia);
												///ordeno datos
												vm.data.turnosDisponiblesDelDia = $filter("orderBy")(_turnosToOrder,
													filedsOrderby
												);
												angular.forEach(vm.data.turnosDisponiblesDelDia, function (row, key) {
													row.IdRow = key;
													row.selected = false;
												});
												dateExist = true;
												vm.data.diaElegidoTextExtraData = '(Libr.: ' + value.CantidadAsignables + ')';

											} else {
												vm.data.turnosDisponiblesDelDia = [];
												vm.data.diaElegidoTextExtraData = '(Libr.: ' + value.CantidadAsignables + ')';
											}
										}
									});
								}
							}
						} else {
							vm.data.turnosDisponiblesDelDia = [];
							vm.data.diaElegidoTextExtraData = '(Libres: ' + 0 + ')';
						}
						vm.data.diaElegidoText = date.format('dddd, D [de] MMMM [de] YYYY');
					}
				}
			};



			function eliminarCriterioBusqueda(criterio) {

				vm.data.criterios = $.grep(vm.data.criterios, function (e: any) {
					var ret = e.Id != criterio.Id;
					return ret;
				});

			}


			/* ------------------------------------------ SUPPORT METHODS ------------------------------------------- */

			function isMutualActiva() {
				var ret = false;
				if (vm.data.pacienteBuscar && vm.data.pacienteBuscar.Afiliaciones) {
					if(vm.data.pacienteBuscar.Afiliaciones.find(x => x.PorDefecto == true)){
						if (vm.data.pacienteBuscar.Afiliaciones.find(x => x.PorDefecto == true).MutualActiva == false) {
							ret = true;
						} else if (vm.data.pacienteBuscar.Afiliaciones.find(x => x.PorDefecto == true).VisibleEnTurnos == false){
							ret = true;
						}
					}else {
						AlertaService.NewWarning("Atención", "No hay ninguna mutual seleccionada");

					}
				}
				return ret;
			}

			function showAlertaIsMutualActiva(afiliaciones) {
				if(afiliaciones && afiliaciones.length){
					if(afiliaciones.find(x => x.PorDefecto == true)){
						if (afiliaciones.find(x => x.PorDefecto == true).MutualActiva == false) {
							AlertaService.NewWarning("Atención", "La mutual seleccionada no esta activa")
						} else if (afiliaciones.find(x => x.PorDefecto == true).VisibleEnTurnos == false) {
							ModalService.warn("No se pueden otorgar turnos para esta mutual.");
						}
					}else {
						AlertaService.NewWarning("Atención", "No hay ninguna mutual seleccionada");
					}
				}else {
					if (vm.data.pacienteBuscar && vm.data.pacienteBuscar.Afiliaciones) {
						if (vm.data.pacienteBuscar.Afiliaciones.find(x => x.PorDefecto == true).MutualActiva == false) {
							AlertaService.NewWarning("Atención", "La mutual seleccionada no esta activa")
						} else if (vm.data.paciente.Afiliaciones.find(x => x.PorDefecto == true).VisibleEnTurnos == false) {
							ModalService.warn("No se pueden otorgar turnos para esta mutual.");
						}
					}
				}

			}

			function obtenerCriterioArmado() {

				var criterioBase = angular.copy(vm.data.criterioBusqueda);
				var pacienteSeleccionado;

				$log.debug('criterio busqueda', criterioBase);
				angular.forEach(vm.data.pacientes, function (pac) {

					if (pac.Seleccionado === true) {
						pacienteSeleccionado = angular.copy(pac);
					}
				});
				angular.forEach(pacienteSeleccionado.Afiliaciones, function (mutual) {

					if (mutual.PorDefecto === true) {

						criterioBase.IdFinanciador = mutual.IdMutual;
						criterioBase.IdPlan = mutual.IdPlanMutual
						criterioBase.MutualNombreCorto = mutual.MutualNombreCorto || mutual.MutualNombre;

					}
				});

				criterioBase.IdPaciente = (pacienteSeleccionado.Id) ? pacienteSeleccionado.Id : 0;
				criterioBase.nombrePaciente = (pacienteSeleccionado.Nombre) ? pacienteSeleccionado.Nombre : '';
				criterioBase.nombrePaciente = criterioBase.nombrePaciente + ((pacienteSeleccionado.Apellido) ? ' ' + pacienteSeleccionado.Apellido : '');
				criterioBase.tipoDniPaciente = (pacienteSeleccionado.TipoDocumento) ? pacienteSeleccionado.TipoDocumento : '';
				criterioBase.dniPaciente = (pacienteSeleccionado.NumeroDocumento) ? pacienteSeleccionado.NumeroDocumento : '';
				criterioBase.EdadPaciente = (pacienteSeleccionado.Edad) ? pacienteSeleccionado.Edad : 0;

				criterioBase.nombreObraSocialPaciente = criterioBase.nombrePaciente + ' (' + criterioBase.MutualNombreCorto +')';

				var _strPrestaciones = '';

				angular.forEach(vm.data.testPrestaciones, function (prestacion) {
					if (prestacion.status === true) {
						prestacion.IdPrestacion = angular.copy(prestacion.Id);
						criterioBase.Prestaciones.push(prestacion.IdPrestacion);
						_strPrestaciones = _strPrestaciones + ' - ' + prestacion.Nombre;
					}
				});

				criterioBase.PrestacionesNombres = angular.copy(_strPrestaciones);

				criterioBase.IdRecurso = vm.data.recurso ? angular.copy(vm.data.recurso.Id) : 0;
				criterioBase.nombreRecurso = vm.data.recurso ? angular.copy(vm.data.recurso.Nombre) : '';


				criterioBase.IdServicio =
					vm.data.servicioMedico ? angular.copy(vm.data.servicioMedico.Id) : 0;
				criterioBase.nombreServicio =
					vm.data.servicioMedico ? angular.copy(vm.data.servicioMedico.Nombre) : '';

				criterioBase.IdSucursal = vm.data.sucursal ? angular.copy(vm.data.sucursal.Id) : 0;
				criterioBase.nombreSucursal = vm.data.sucursal ? angular.copy(vm.data.sucursal.Nombre) : '';


				criterioBase.IdTipoDeTurno = vm.data.tipoTurno ? angular.copy(vm.data.tipoTurno.Id) : 0;
				criterioBase.nombreTipoTurno = vm.data.tipoTurno ? angular.copy(vm.data.tipoTurno.Nombre) : '';

				criterioBase.IdTipoRecurso =
					vm.data.recurso ? angular.copy(vm.data.recurso.IdTipoRecurso) : 0;

				criterioBase.SexoPaciente = pacienteSeleccionado.NombreTipoSexo.charAt(0);


				//se le agrega un id al criterio base, siempre manteniendo el orden
				if (vm.data.criterios.length === 0) {
					criterioBase.Id = 1;
				} else {
					criterioBase.Id = vm.data.criterios.length + 1;
				}

				//tengo que setear colores o clases para cada criterio
				//los deberia sacar de una lista ya predefinida de criterios
				criterioBase.criterioClass = vm.criteriosClass[vm.data.criterios.length || 0];

				return criterioBase;
			}

			function setearObservaciones(fechaInicio) {

				var _llamadasObservacionCriterio: Array<any> = [];;

				//pIdServicio, pIdTipoRecurso, pIdRecurso, pFechaDesde, pFechaHasta
				var fechaHastaObservacionPorServicioRecurso = moment(fechaInicio).add(6, "M").format("MM-DD-YYYY");
				//

				angular.forEach(vm.data.criterioBusquedaList.Criterios, function (criterio) {

					//lo agrego a las llamadas
					_llamadasObservacionCriterio.push(PlantillaDataService.obtenerPlantillasConObservacionesPorServicioRecurso(
						criterio.IdServicio,
						criterio.IdTipoRecurso,
						criterio.IdRecurso,
						fechaInicio,
						DateUtils.parseToBe(fechaHastaObservacionPorServicioRecurso)
					));

				});


				$q.all(
					_llamadasObservacionCriterio,

				).then(buscarObservacionOkCallback, buscarObservacionErrorCallback);


				function buscarObservacionOkCallback(pResults) {
					$log.debug('observaciones obtenidas por criterio OK', pResults);
					vm.data.observacionTurnoPlantilla = pResults;
				}


				function buscarObservacionErrorCallback(pError) {
					$log.error('observaciones obtenidas por criterio ERROR', pError);
				}

			}

			///seteamos la busqueda con todos los
			function setearBusquedaTurnos(calendarObtenido) {
				$log.debug("seteando busqueda de turnos para todos los recuros..");

				var _calendar = angular.copy(calendarObtenido);

				angular.forEach(_calendar.SituacionesPorDia, function (value) {
					angular.forEach(vm.data.situacionesGralDia, function (situacionDia) {
						if (value.IdSituacionGeneral === situacionDia.Id) {
							value.Color = angular.copy(situacionDia.Color);
							value.SituacionDetallada = angular.copy(situacionDia.Nombre);
						}
					});

					angular.forEach(value.TurnosAsignables, function (turno) {

						turno.Fecha = angular.copy(value.Fecha);
						turno.Duracion = angular.copy(turno.DuracionIndividual);
						turno.Criterios = [];


						angular.forEach(_calendar.DetallesDeTurnos, function (detalleTurno) {
							if (turno.IdItemDePlantilla === detalleTurno.IdItemDePlantilla) {
								turno.Duracion = angular.copy(detalleTurno.Duracion);

								turno.IdRecurso = angular.copy(detalleTurno.IdRecurso);
								turno.IdSucursal = angular.copy(detalleTurno.IdSucursal);
								turno.IdTipoRecurso = angular.copy(detalleTurno.IdTipoRecurso);
								turno.IdPlantillaTurno = angular.copy(
									detalleTurno.IdPlantillaTurno
								);
							}
						});

						angular.forEach(_calendar.Recursos, function (recurso) {
							if (turno.IdRecurso === recurso.IdRecurso) {
								turno.Recurso = angular.copy(recurso.Nombre);
							}
						});

						angular.forEach(vm.data.sucursalesConAbrev, function (sucursal) {
							if (turno.IdSucursal === sucursal.Id) {
								turno.AbreviaturaSucursal = angular.copy(sucursal.Abreviatura);
								turno.ColorSucursal = angular.copy(sucursal.Color);
								turno.Sucursal = angular.copy(sucursal.Nombre);
							}
						});

						if (vm.data.duracionesTurnoObtenido) {

							angular.forEach(vm.data.duracionesTurnoObtenido, function (duracion,key) {
								if (turno.IdRecurso === duracion.IdRecurso) {

									turno.DuracionConjuntaRegla = angular.copy(duracion.DuracionConjunta);
									turno.DuracionIndividualRegla = angular.copy(duracion.DuracionIndividual);

								}
							});
						}

						//seteo los criterios de busqueda para cada paciente
						angular.forEach(vm.data.criterios, function (criterio) {
							angular.forEach(turno.CBs, function (criterioId) {
								if (criterio.Id === criterioId) {
									turno.Criterios.push(criterio);
								}
							})
						});
					});

					//termina forEach general
				});

				return _calendar;
			}

			function calendarRender() {
				$timeout(function () {
					uiCalendarConfig.calendars.calendarAsignacionTurnoMultiples.fullCalendar('render');
				}, 200);
			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');

				if (!vm.data.paciente || vm.data.paciente === "") {

					StateHelperService.goToPrevState();
					//$state.go('main.signed.asignacionturno.list');

				} else {
					
					vm.data.paciente.Seleccionado = true;
					vm.data.pacientes.push(vm.data.paciente);
				}

				vm.formControl.loading = true;

				vm.data.extraColumn = {
					name: 'Paciente',
					field: 'nombrePaciente'

				};

				var _tiposDeTurnos = PlantillaDataService.obtenerTiposDeTurnos();
				var _criterioBusqueda = TurnoDataService.obtenerNuevoCriterioBusqueda();
				var _criterioBusquedaCal = TurnoDataService.obtenerNuevoCriterioBusquedaCal();
				var _situacionesGralDia = AsignacionTurnoDataService.obtenerTodosSituacionGralDia();
				var _sucursalesConColor = SucursalDataService.getAllSucursalesConFiltro();
				var _criterioBusquedaList = TurnoDataService.obtenerNuevoCriterioBusquedaList();
				var _criterioBusquedaDuracion = AsignacionTurnoDataService.obtenerNuevoCriterioBusquedaParaDuracionDto();

				$q.all([_tiposDeTurnos,
					_criterioBusqueda,
					_criterioBusquedaCal,
					_situacionesGralDia,
					_sucursalesConColor,
					_criterioBusquedaList,
					_criterioBusquedaDuracion
				])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {
					// variable = pResult[0];
					// 
					vm.data.tiposDeTurno = LogicService.obtenerTiposDeTurnoFiltrado(pResults[0]);
					vm.data.criterioBusqueda = angular.copy(pResults[1]);
					vm.data.criterioSelected = angular.copy(pResults[1]);
					vm.data.criterioBusquedaCal = pResults[2];
					vm.data.situacionesGralDia = pResults[3];
					vm.data.sucursalesConAbrev = pResults[4];
					vm.data.sucursalesParaObservaciones = pResults[4];
					vm.data.criterioBusquedaList = pResults[5];
					vm.data.criterioBusquedaDuracionDto = pResults[6];

					calendarRender();

					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}
			}


			$scope.$watch(function () {
				if (vm.data.pacienteBuscar && vm.data.pacienteBuscar.Afiliaciones) return vm.data.pacienteBuscar.Afiliaciones;
				return null;
			}, function (pNewVal) {
				showAlertaIsMutualActiva(pNewVal);
				//voy a modificar las afiliaciones del paciente
				
			}, true);


		}
	};

	return module;
})();