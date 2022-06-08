/**
 * @author:			Pablo Pautasso
 * @description:	Controller para Asignacion de turnos
 * @type:			Controller
 **/
import * as angular from 'angular';
import { ISucursalDataService } from '../../../support/basic/services';
import { IPacienteDataService } from '../../../persona/paciente/services';
import { IProfesionalesDataService } from 'src/app/allendeModules/profesionales';
import { IObservacionesRecursoServicioDataService } from '../../common/services';
import { ICuestionarioService } from 'src/app/allendeModules/support/cuestionario';
import { IBateriaEstudiosDataService } from 'src/app/allendeModules/basicos/bateriaEstudios/services';

export default (function () {
	'use strict';

	const module = {
		init: (ngModule: any) => { }
	};

	module.init = function (module) {
		module.controller("AsignacionTurnoListController", AsignacionTurnoListController);

		AsignacionTurnoListController.$inject = ["Logger", "$q", "$state", "$stateParams", "$timeout", "moment", "$filter", "$scope", 'ModalService',
			"SucursalDataService", "uiCalendarConfig", "orderByFilter", "StateHelperService", "AlertaService", "DateUtils", 'AsignacionTurnoStorageHelperService',
			'PacienteDataService', "PlantillaDataService", "PrestacionGestionDataService", "AsignacionTurnoDataService", 'AsignacionTurnoModalService',
			"TurnoDataService", "PlantillaLogicService", "AsignacionTurnoLogicService", "TurnosCommonLogicService", 'MantenimientoAgendaLogicService',
			"AsignacionTurnoAuthService", 'RecepcionTurnosAuthService', 'User', 'ProfesionalesDataService', 'SelectorService', 'ObservacionesRecursoServicioDataService',
			'CuestionarioDataService', 'CuestionarioService', 'bateriaEstudiosDataService'
		];

		function AsignacionTurnoListController($log, $q, $state, $stateParams, $timeout, moment, $filter, $scope, ModalService: IModalService,
			SucursalDataService: ISucursalDataService, uiCalendarConfig, orderByFilter, StateHelperService, AlertaService, DateUtils: IDateUtils, StorageService,
			PacienteDataService: IPacienteDataService, PlantillaDataService, PrestacionGestionDataService, AsignacionTurnoDataService, AsignacionTurnoModalService,
			TurnoDataService, PlantillaLogicService, AsignacionTurnoLogicService, TurnosCommonLogicService, MantenimientoAgendaLogicService,
			AsignacionTurnoAuthService, RecepcionTurnosAuthService, User, ProfesionalesDataService: IProfesionalesDataService, SelectorService,
			ObservacionesRecursoServicioDataService: IObservacionesRecursoServicioDataService, CuestionarioDataService, CuestionarioService: ICuestionarioService,
			bateriaEstudiosDataService: IBateriaEstudiosDataService
		) {
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance("AsignacionTurnoListController");
			$log.debug("ON.-");

			/* ----------------------------------------- API Y VARIABLESES ------------------------------------------ */
			//region API Y VARIABLES
			var vm = this;
			vm.today = new Date();
			var filedsOrderby = ["Fecha", "Hora"];

			vm.title = {
				page: $state.current.data.title,
				icon: $state.current.data.icon
			};

			vm.data = {
				tiposDeTurno: [],
				servicioMedico: "",
				recursoBuscar: {},
				primerTurno: "",
				prestacionesObtenidas: [],
				turnosCalendario: "",
				turnosDisponiblesDelDia: "",
				diaElegidoText: "",
				criterioBusqueda: "",
				paciente: "",
				duracionTurnoObtenido: "",
				idTurnoToSearch: "",
				checkSobreturnos: false,
				//lapso de meses en la busqueda de turnos
				lapsoTurnos: 4,
				limpiarRecurso: false,
				tipoRecursoSeleccionado: 0,
				menuOptions: "",
				showBuscadorPrestacion: false,
				recursoAtiende: {},
				profesionalAtiendeReprogramacion: {},
				idProfesionalSolicitado: 0,
				observacionesDelServicioRecurso: {},
				observacionServRecurso: 0,
				precioParticularMutualTurno: {
					FechaConvenioFinanciadorDesde: null,
					FechaConvenioFinanciadorHasta: null,
					FechaConvenioParticularDesde: null,
					FechaConvenioParticularHasta: null,
					ImporteTotalCoseguro: null,
					ImporteTotalParticular: null,
					IdRecurso: 0
				},
				solicitudEstudioSeleccionada: null
			};

			vm.turno = {
				otorgarPrimerTurno: otorgarPrimerTurno,
				otorgarTurno: otorgarTurno
			};

			vm.reprogramacion = {
				volver: false,
				idTurno: 0
			}

			vm.order = {
				id: 5,
				value: "Fecha",
				reverse: false
			};

			vm.formControl = {
				loading: false,
				error: true, buscar: buscar, cargarTodosTiposDeTurno: cargarTodosTiposDeTurno,
				limpiar: limpiarBusqueda, cargarDatosPrestacion: cargarDatosPrestacion, cargarTiposDeTurno: cargarTiposDeTurno,
				handleEventProp: handleEventProp, turnosMultiples: turnosMultiple, loadPrestacionesBtn: loadPrestacionesBtn,
				abrirRequerimientos: abrirRequerimientos, toggleColores: false, getAgenda: getAgenda, changeSobreturnos: changeSobreturnos,
				selectPrimerTurno: selectPrimerTurno, selectTurno: selectTurno, backToState: backToState, mantenerDatos: true, controlEdad: true,
				getListaTurnosGenerados: getListaTurnosGenerados, limpiarTurnosPrimerosDisponibles: limpiarTurnosPrimerosDisponibles, cargarSucursalesXServicio:
					cargarSucursalesXServicio, getRecesosRecurso: getRecesosRecurso, limpiarGrillayCalendar: limpiarGrillayCalendar, limpiarRecursoGuardado: limpiarRecursoGuardado,
				setearCriterioBusqueda: setearCriterioBusqueda, isMutualActiva: isMutualActiva, verObservaciones: verObservaciones, openAjustesPaciente: openAjustesPaciente,
				turnoAReprogamar: turnoAReprogamar, filtrarPrestacionesPorTipoDeTurno: filtrarPrestacionesPorTipoDeTurno, afterBuscarRecursos: afterBuscarRecursos,
				turnoSeleccionadoValido: turnoSeleccionadoValido, verCalendarioRecurso: verCalendarioRecurso, clickForm: clickForm, verProfesionalesXAparato: verProfesionalesXAparato,
				getItemsNameSelected: getItemsNameSelected, consultarCuestionario: consultarCuestionario, closePrestacionesMenu: closePrestacionesMenu, buscarSolicitudesDeEstudio: buscarSolicitudesDeEstudio
			};

			vm.optionsConfig = [{
				Id: 0,
				Configuracion: "Ver Turnos del Paciente automaticamente al buscarlo.",
				Status: true
			}];

			//endregion API Y VARIABLES

			/* ----------------------------------------- SELECCIONAR TURNO ------------------------------------------ */
			//region SELECCIONAR TURNO
			/**
			 * Funcion de seleccionar turno de la primera grilla en la asignacion
			 * Mostramos todos los primeros turnos obtenidos de la grilla
			 * 
			 */
			function selectPrimerTurno(turno) {

				$log.debug("selectPrimerTurno", turno);
				//primero selecciono un turno y le hago un toggle para selected
				angular.forEach(vm.data.primerTurno, function (_turno) {
					_turno.selected = false;
				});
				turno.selected = true;

				//TODO necesito al seleccionar un turno simple de la lista de primeros, consultar si tienen duracion
				if (turno.Hora) {

					var _turnosBuscadosFecha = vm.data.turnosCalendario.SituacionesPorDia.find(x => moment(x.Fecha).format("DD-MM-YYYY") == moment(turno.Fecha).format("DD-MM-YYYY")).TurnosAsignables;
					if (_turnosBuscadosFecha[0].Fecha) {
						//selecciono el dia del calendario
						seleccionarDiaCalendario(moment(_turnosBuscadosFecha[0].Fecha));
						var _turnoBuscado = vm.data.turnosDisponiblesDelDia.find(x => x.Hora === turno.Hora && x.IdRecurso === turno.IdRecurso);
						$log.debug('turno encontrado', _turnoBuscado);
						//selecciono el mismo turno 
						$timeout(function () {
							$scope.$broadcast('selectTurnoVario', _turnoBuscado);
						}, 300);
					}
				} else {
					AlertaService.NewWarning("El recurso no tiene turnos disponibles");
					delete vm.data.turnosDisponiblesDelDia;
					vm.data.observacionesPlantilla = "";
				}

			}

			function selectTurno(turno) {

				$log.debug("selectTurno", turno);
				//voy a consultar la observacion del turno seleccionado
				if (turno.selected) {
					angular.forEach(vm.data.observacionTurnoPlantilla, function (itemObservacionPlantilla, key) {
						if (turno.IdRecurso === itemObservacionPlantilla.IdRecurso && moment(turno.Fecha).isBetween(itemObservacionPlantilla.FechaDesde, itemObservacionPlantilla.FechaHasta, 'days', '[]')) {

							vm.data.observacionesPlantilla = AsignacionTurnoLogicService.getObservacionesPorSucursalParseadas(itemObservacionPlantilla.Observaciones,
								vm.data.sucursalesParaObservaciones);
						}
					});
				} else {
					vm.data.observacionesPlantilla = "";
				}

				// se agrega consulta de requerimientos de precio del turno para mostrar
				var _turnoAGuardar: any = {};
				//vm.formControl.loading = true;
				_turnoAGuardar.TurnoElegidoDto = angular.copy(turno);
				_turnoAGuardar.TurnoElegidoDto.DuracionIndividual = angular.copy(turno.Duracion);
				_turnoAGuardar.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);

				_turnoAGuardar.CriterioBusquedaDto.IdRecurso = angular.copy(turno.IdRecurso);
				_turnoAGuardar.CriterioBusquedaDto.IdTipoRecurso = angular.copy(turno.IdTipoRecurso);
				_turnoAGuardar.TurnoElegidoDto.Fecha = angular.copy(moment(_turnoAGuardar.TurnoElegidoDto.Fecha)
					.format("MM-DD-YYYY"));


				// voy a consultar requerimientos de precio particular y precio obra social
				$log.debug('consulta requerimientos', _turnoAGuardar);
				if (vm.data.precioParticularMutualTurno.ImporteTotalParticular) {

					//puedo tener diferentes recursos una vez que ya busque 
					if (vm.data.precioParticularMutualTurno.IdRecurso == _turnoAGuardar.CriterioBusquedaDto.IdRecurso) {
						// tengo diferente recurso

						// tengo importe particular, tengo que consultar la fecha antes de buscar de nuevo
						if (vm.data.precioParticularMutualTurno.FechaConvenioParticularDesde == '0001-01-01T00:00:00' ||
							vm.data.precioParticularMutualTurno.FechaConvenioParticularHasta == '0001-01-01T00:00:00') {
							// no tengo convenio busco de nuevo	
							buscarImportesParticularCoseguro(_turnoAGuardar);
						} else {
							// tengo fechas por ende tengo que ver si la fecha del turno seleccionado no esta ya cargado
							let _fechaDesde = moment(vm.data.precioParticularMutualTurno.FechaConvenioParticularDesde)
							let _fechaHasta = moment(vm.data.precioParticularMutualTurno.FechaConvenioParticularHasta)
							if (moment(_turnoAGuardar.TurnoElegidoDto.Fecha).isBetween(_fechaDesde, _fechaHasta)) {
								// tengo turno entre las dos fechas del convenio particular => NO BUSCO para particular
								// pero puedo tener que buscar el convenio de mutual => entonces consulto de nuevo pero apuntando
								// a la mutual
								if (vm.data.precioParticularMutualTurno.ImporteTotalCoseguro) {
									// igual que en modo particular, debemos ver si el turno no esta entre las fechas
									let _fechaDesdeConvenio = moment(vm.data.precioParticularMutualTurno.FechaConvenioFinanciadorDesde)
									let _fechaHastaConvenio = moment(vm.data.precioParticularMutualTurno.FechaConvenioFinanciadorHasta)
									if (moment(_turnoAGuardar.TurnoElegidoDto.Fecha).isBetween(_fechaDesdeConvenio, _fechaHastaConvenio)) {

										$log.debug('BuscarImportesParticular: NO BUSCO');
									} else {
										// la fech del turno no esta en convenio de mutual => SI BUSCO
										buscarImportesParticularCoseguro(_turnoAGuardar);
									}
								} else $log.debug('BuscarImportesParticular: NO BUSCO');

							} else {
								// la fech del turno no esta en convenio particular => SI BUSCO
								buscarImportesParticularCoseguro(_turnoAGuardar);
							}
						}

					} else buscarImportesParticularCoseguro(_turnoAGuardar);

				} else buscarImportesParticularCoseguro(_turnoAGuardar);

			}


			function buscarImportesParticularCoseguro(_turnoAGuardar) {

				$log.debug('BuscarImportesParticular: BUSCANDO...');

				//fix para id tipo turno recomendado
				_turnoAGuardar.CriterioBusquedaDto.IdTipoDeTurno = angular.copy(_turnoAGuardar.TurnoElegidoDto.IdTipoTurnoRecomendado)

				TurnoDataService.evaluarImportesTurnoContraConvenio(_turnoAGuardar)
					.then(evaluarOk, evaluarError);

				function evaluarOk(pResult) {
					if (pResult) {
						vm.data.precioParticularMutualTurno = pResult;
						vm.data.precioParticularMutualTurno.IdRecurso = _turnoAGuardar.CriterioBusquedaDto.IdRecurso;
					}
					else vm.data.precioParticularMutualTurno = null;

					$log.debug('evaluarOk var', vm.data.precioParticularMutualTurno);
				}

				function evaluarError(pError) {
					$log.error("evaluarError", pError);
					vm.data.precioParticularMutualTurno = null;
				}
			}
			//endregion

			/* ------------------------------------------- BUTTONS TURNERO ------------------------------------------ */
			//region BOTONES TURNERO

			function turnosMultiple() {
				$log.debug("turnosmultiples");
				var tieneMutualPorDefecto = false;

				if (vm.data.paciente.Id) {
					angular.forEach(vm.data.paciente.Afiliaciones, function (mutual) {
						if (mutual.PorDefecto) {
							tieneMutualPorDefecto = true;
						}
					})
					if (tieneMutualPorDefecto) {
						$state.go("main.signed.asignacionturno.multiples", {
							pacienteObj: vm.data.paciente
						});
					} else AlertaService.NewWarning("Atención!", "No hay ninguna mutual seleccionada");
				} else
					AlertaService.NewWarning(
						"Alerta",
						"Atencion, debe buscar un paciente para asignarle turnos multiples"
					);

			}

			function getAgenda() {
				//get agenda con datos
				$log.error("obteniendo agenda de recurso");

				//levantamos la agenda por id
				PlantillaLogicService.viewPlantilla(0, vm.data.servicioMedico, vm.data.recurso)
					.then(viewPlantillaOk, viewPlantillaError);

				function viewPlantillaOk(pResult) {
					$log.debug("viewPlantillaOk", pResult);
				}

				function viewPlantillaError(pError) {
					$log.error("viewPlantillaError", pError);
				}
			}

			function changeSobreturnos() {
				$log.debug("change sobreturnos", vm.data.checkSobreturnos);
				if (vm.data.checkSobreturnos) {
					$log.debug("es true entonces busco");
					if (ifBuscarHabilitado()) {
						buscarConSobreTurnos();
					} else {
						setTimeout(function () { vm.data.checkSobreturnos = false; }, 600);
					}
				}
			}

			function getListaTurnosGenerados() {
				//voy a levantar un modal de lista de turnos generados
				//primero consulto el tipo de dia que queremos consultar
				if (vm.data.recurso) {

					if (vm.data.turnosCalendario) {

						let tipoDia = "";
						var fechaLista = vm.dateSeleccionadoCalendar;
						let turnoAbuscar = vm.data.turnosCalendario.SituacionesPorDia.find(x => moment(x.Fecha).date() === vm.dateSeleccionadoCalendar.date()
							&& moment(x.Fecha).month() === vm.dateSeleccionadoCalendar.month());

						// if(turnoAbuscar){

						// 	if (turnoAbuscar.Color === "color-celeste-turno"){			
						// 		tipoDia = "color-celeste-turno";
						// 	} else if (turnoAbuscar.Color === "color-verde-turno"){
						// 		tipoDia = "color-verde-turno";
						// 	}
						// }

						// Comento la condición de Color/Estado del día para que siempre puedan ver la lista completa del día
						//if (vm.data.recurso && vm.data.recurso.Nombre && turnoAbuscar && turnoAbuscar.Color !== "color-blanco-turno") {							
						if (vm.data.recurso && vm.data.recurso.Nombre) {

							vm.data.criterioBusquedaFecha.FechaDesde = fechaLista.format("MM-DD-YYYY");
							vm.data.criterioBusquedaFecha.FechaHasta = fechaLista.format("MM-DD-YYYY");
							vm.data.criterioBusquedaFecha.Servicio = vm.data.servicioMedico.Nombre;
							vm.data.criterioBusquedaFecha.Recurso = vm.data.recurso.Nombre;

							$log.debug('getListaTurnosGenerados criterio bsqueda fecha', vm.data.criterioBusquedaFecha);
							AsignacionTurnoModalService.openListaDeTurnosGenerados(vm.data.criterioBusquedaFecha, vm.data.paciente, fechaLista, null);
						} else {
							AlertaService.NewWarning("Atención", "No existen turnos disponibles para mostrar");
						}
					}
				} else {
					AlertaService.NewWarning("Atención", "Debe buscar por RECURSO para obtener la lista completa de turnos del mismo");
				}

			}


			function getRecesosRecurso() {
				//levanto componente de recesos
				//consulto si tengo alguna fecha en el calendario. Sino tengo selecciono fecha de hoy +- 15 dias.
				let _fechaDesde = null
				let _fechaHasta = null;

				_fechaDesde = angular.copy(moment().startOf('month'));
				_fechaHasta = angular.copy(moment().startOf('month').add(4, 'month'));

				MantenimientoAgendaLogicService.openConsultaRecesos(vm.data.servicioMedico, vm.data.recurso, _fechaDesde, _fechaHasta);
			}


			function abrirRequerimientos() {

				// Abre el popup de Requerimientos (administrativos) y Preparaciones (médicas) de las prestaciones para las que se quiere dar el turno
				var turnos;
				var dataTurnoRequerimiento;
				// Controllo si ya se seleccionó el paciente y luego las prestaciones
				var pacienteId = vm.data.paciente.Id ? vm.data.paciente.Id : 0;

				if (pacienteId === 0) {
					// No hay paciente seleccionado, no habrá pestaciones ni criterio de búsqueda
					AlertaService.NewWarning("Seleccione un Paciente");
					return;
				}

				setearCriterioBusqueda();

				if (AsignacionTurnoLogicService.checkTurnosSeleccionados(vm.data.turnosDisponiblesDelDia)) {
					//tengo un turno del dia seleccionado, continuo entonces con ese
					turnos = vm.data.turnosDisponiblesDelDia.filter(x => x.selected === true);
					$log.debug('turnos de requerimientos', turnos);
					if (turnos.length > 0) {

						dataTurnoRequerimiento = getDataTurnoParaOtorgar(turnos);
						AsignacionTurnoModalService.openRequerimientosMasPreparaciones(dataTurnoRequerimiento, turnos, vm.data.criterioBusqueda);
					}
					else return;

				}

			}


			function verProfesionalesXAparato() {
				// voy a levantar modal para mostar recursos por aparato
				SelectorService.newSelector({
					nombreSelector: "Ver Recursos por Profesional de " + vm.data.servicioMedico.Nombre, dataService: "ProfesionalesDataService",
					method: "obtenerPorServicioConRecursosEnQueAtienden", columns: ["Sucursal", "Recurso", "Profesional"], isTableBackEnd: false,
					objCriterio: vm.data.servicioMedico.Id
				});
				// .then( (grupoPrestacionSelected) => {
				// 		this.$log.debug('grupoPrestacionSelected ON.-', grupoPrestacionSelected);		
				// 	},  (pError) => {
				// 		this.loading = false;
				// 		this.$log.error('obtener prestaciones ON.-');
				// 	});

			}
			//endregion BOTONES TURNERO

			/* ---------------------------------------------- BUSQUEDA ---------------------------------------------- */
			//#region BUSQUEDA

			function buscar() {

				if (ifBuscarHabilitado()) {

					//estamos buscando en modo BUSQUEDA COMUN => vm.data.checkSobreturnos == false
					if (vm.data.checkSobreturnos == false) {
						//consultamos si tenemos una mutual seleccionada
						//if mutual seleccionada, sino cartel
						if (AsignacionTurnoLogicService.isMutualSelected(vm.data.paciente.Afiliaciones)) {

							//seteamos criterio busqueda general
							vm.formControl.loading = true;
							setearCriterioBusqueda();
							delete vm.data.turnosDisponiblesDelDia;

							var _duracionDeTurno;

							var criterioBusquedaDuracion = AsignacionTurnoLogicService.setearCriterioDuracionLogic(vm.data.criterioBusquedaDuracionDto,
								vm.data.criterioBusqueda, vm.data.prestacionesObtenidas, vm.data.paciente);

							//busco para TODOS LOS RECURSOS DEL SERVICIO
							if (vm.data.criterioBusqueda.IdRecurso === 0) {
								//DEPRECATED
								//var _busquedaTodosLosRecursos = AsignacionTurnoDataService.obtenerPrimerTurnoCadaRecursoServicio(vm.data.criterioBusqueda);
								//se comenta metodo para obtener turnos de todos los recursos unificado
								var _busquedaTodosLosRecursos = AsignacionTurnoDataService.obtenerTurnosDisponiblesDeCadaRecursoDelServicioUnificado(vm.data.criterioBusqueda);
								_duracionDeTurno = AsignacionTurnoDataService.obtenerDuracionNecesariaParaServicio(criterioBusquedaDuracion);

								$q.all([_busquedaTodosLosRecursos, _duracionDeTurno])
									.then(successBuscarCallback, errorBuscarCallback);

							} else {

								//busco para UN SOLO RECURSO
								var _busquedaRecursoParticular = AsignacionTurnoDataService.obtenerPrimerTurnoAsignable(vm.data.criterioBusqueda);

								_duracionDeTurno = AsignacionTurnoDataService.obtenerDuracionNecesariaParaRecursoEnServicio(criterioBusquedaDuracion);

								$q.all([_busquedaRecursoParticular, _duracionDeTurno])
									.then(successBuscarCallback, errorBuscarCallback);
							}

						} else {
							AlertaService.NewWarning("Atención!", "No hay ninguna mutual seleccionada");
						}
					}
					//estamos buscando en modo BUSQUEDA SOBRETURNO => vm.data.checkSobreturnos == true
					else {
						buscarConSobreTurnos();
					}
				}

				function successBuscarCallback(pResults) {

					$log.debug("obtenerPrimerTurnoOk", pResults);

					if (pResults[0]) {
						//declaro primer turno
						vm.data.primerTurno = [];
						vm.data.duracionesTurnoObtenido = pResults[1];

						//pregunto si es busqueda sin recurso o con recurso y asigno primeros turnos
						if (pResults[0].Recursos) {
							vm.data.primerTurno = angular.copy(pResults[0].Recursos);
						} else vm.data.primerTurno.push(pResults[0]);

						//pregunto si hay turnos
						if (vm.data.primerTurno.length !== 0) {
							//parseo fechas obtenidas
							vm.data.primerTurno = angular.copy(AsignacionTurnoLogicService.parseFecha(vm.data.primerTurno, "toFront"));
							var _primerTurnoToOrder = angular.copy(vm.data.primerTurno);

							//ordenar turnos por fecha creciente
							///ordeno datos
							vm.data.primerTurno = $filter("orderBy")(_primerTurnoToOrder, filedsOrderby);

							//macheo sucursales con el sucursalesDto obtenido
							angular.forEach(vm.data.primerTurno, function (turno) {
								angular.forEach(vm.data.sucursalesConAbrev, function (sucursal) {
									if (turno.IdSucursal === sucursal.Id) {
										turno.AbreviaturaSucursal = angular.copy(sucursal.Abreviatura);
										turno.ColorSucursal = angular.copy(sucursal.Color);
										turno.Sucursal = angular.copy(sucursal.Nombre);
									}
								});
							});

							//seteo fechas para calendario
							//fecha desde es el turno mas reciente de la fecha obtenida

							//TODO ver turnoprimerFecha
							//var primerTurnoFecha = angular.copy(vm.data.primerTurno[0].Fecha);
							var primerTurnoFecha;
							//controlo que la fecha sea valida
							if (moment(vm.data.primerTurno[0].Fecha).isValid()) {

								primerTurnoFecha = moment(vm.data.primerTurno[0].Fecha).subtract(1, "day").format("MM-DD-YYYY");

								var fechaDesdeCalendario = angular.copy(moment(primerTurnoFecha).startOf('month').format('MM-DD-YYYY'));

								vm.data.fechaPrimerTurnoObtenido = angular.copy(fechaDesdeCalendario);

								$log.debug('Fecha desde calendario para busqueda', vm.data.fechaPrimerTurnoObtenido);

								//fecha hasta, voy desde hoy hasta fin de mes y despues le agrego otro lapso definido
								var fechaHastaCalendario = moment(primerTurnoFecha).add(vm.data.lapsoTurnos, "M").format("MM-DD-YYYY");

								var _obtenerTurnosCalendar;
								var _obtenerObservacionesPlantilla;
								var _observacionesRecursoServicio;

								// Voy a buscar para todos los recursos
								// con la busqueda unificada no hace falta
								if (vm.data.criterioBusqueda.IdRecurso === 0) {

									angular.forEach(vm.data.primerTurno, function (turno) {
										turno.Recurso = turno.Nombre;
									});

									vm.data.criterioBusquedaCal.CriterioBusquedaDto = angular.copy(vm.data.criterioBusquedaFecha);

									vm.data.criterioBusquedaCal.FechaDesde = DateUtils.parseToBe(fechaDesdeCalendario);
									vm.data.criterioBusquedaCal.FechaHasta = DateUtils.parseToBe(fechaHastaCalendario);

									var _primerosTurnos = angular.copy(AsignacionTurnoLogicService.parseFecha(vm.data.primerTurno, "toBack"));

									vm.data.criterioBusquedaCal.PrimerosAsignablesDto.PrimerosTurnosDeCadaRecurso = angular.copy(_primerosTurnos);

									vm.data.criterioBusquedaCal.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);

									$log.debug("busco lista de turnos totales", vm.data.criterioBusquedaCal);

									//DEPRECATED
									//_obtenerTurnosCalendar = AsignacionTurnoDataService.obtenerTurnosCadaRecursoServicio(vm.data.criterioBusquedaCal);
									//se obtiene nueva forma de calendario
									_obtenerTurnosCalendar = AsignacionTurnoLogicService.obtenerCalendarParaTodosLosRecursos(pResults[0]);

									//Observaciones de la plantilla
									//pIdServicio, pFechaDesde, pFechaHasta
									var fechaHastaObservacion = moment(primerTurnoFecha).add(6, "M").format("MM-DD-YYYY");
									//
									_obtenerObservacionesPlantilla = PlantillaDataService.obtenerPlantillasConObservacionesPorServicioConEstado(
										vm.data.criterioBusquedaCal.CriterioBusquedaDto.IdServicio,
										vm.data.criterioBusquedaCal.FechaDesde,
										DateUtils.parseToBe(fechaHastaObservacion),
										2);

									//observaciones de diagnostico por imageness
									if (vm.data.servicioMedico && vm.data.servicioMedico.Id == 34) {

										_observacionesRecursoServicio = ObservacionesRecursoServicioDataService.obtenerPorServicioRecurso(vm.data.criterioBusquedaCal.CriterioBusquedaDto.IdServicio,
											vm.data.criterioBusquedaCal.CriterioBusquedaDto.IdRecurso, vm.data.criterioBusquedaCal.CriterioBusquedaDto.IdTipoRecurso, vm.data.criterioBusquedaCal.FechaDesde,
											DateUtils.parseToBe(fechaHastaObservacion));
									}

								} else {
									$log.debug("busco lista de turnos simples para un solo recurso");

									setearCriterioBusquedaFecha(fechaDesdeCalendario, fechaHastaCalendario);

									$log.debug("criterio busqueda fecha", vm.data.criterioBusquedaFecha);

									_obtenerTurnosCalendar = AsignacionTurnoDataService.obtenerTurnosDisponibles(vm.data.criterioBusquedaFecha);

									var fechaHastaObservacionPorServicioRecurso = moment(primerTurnoFecha).add(6, "M").format("MM-DD-YYYY");

									// observaciones de plantilla
									_obtenerObservacionesPlantilla = PlantillaDataService.obtenerPlantillasConObservacionesPorServicioRecursoConEstado(
										vm.data.criterioBusquedaFecha.IdServicio,
										vm.data.criterioBusquedaFecha.IdTipoRecurso,
										vm.data.criterioBusquedaFecha.IdRecurso,
										vm.data.criterioBusquedaFecha.FechaDesde,
										DateUtils.parseToBe(fechaHastaObservacionPorServicioRecurso),
										2
									);

									//observaciones de diagnostico por imageness
									if (vm.data.servicioMedico && vm.data.servicioMedico.Id == 34) {
										_observacionesRecursoServicio = ObservacionesRecursoServicioDataService.obtenerPorServicioRecurso(vm.data.criterioBusquedaFecha.IdServicio,
											vm.data.criterioBusquedaFecha.IdRecurso,
											vm.data.criterioBusquedaFecha.IdTipoRecurso,
											vm.data.criterioBusquedaFecha.FechaDesde,
											DateUtils.parseToBe(fechaHastaObservacionPorServicioRecurso));
									}

								}

								$q.all([_obtenerTurnosCalendar, _obtenerObservacionesPlantilla, _observacionesRecursoServicio])
									.then(obtenerCalendarOk, obtenerCalendarError);

							} else {
								AlertaService.NewWarning("Alerta", "No hay turnos disponibles para la busqueda realizada");
								limpiarGrillayCalendar();
								vm.formControl.loading = false;
							}
						} else {
							AlertaService.NewWarning("Alerta", "No hay turnos disponibles para la busqueda realizada");
							limpiarGrillayCalendar();
							vm.formControl.loading = false;
						}

					} else {
						AlertaService.NewWarning("Alerta", "No hay turnos disponibles para la busqueda realizada");
						limpiarGrillayCalendar();
						vm.formControl.loading = false;
					}

					//OBTENEMOS EL CALENDARIO SEA CUAL SEA LA BUSQUEDA
					function obtenerCalendarOk(pResult) {
						//La busqueda es para VARIOS recursos
						vm.formControl.loading = true;

						if (vm.data.criterioBusqueda.IdRecurso === 0) {

							vm.data.observacionTurnoPlantilla = pResult[1];
							setearBusquedaTurnos(pResult[0])
								.then(function (pResults) {
									vm.data.turnosCalendario = pResults;
									setearObtenerCalendarOk();
								});

						}
						else { //La busqueda es para UN SOLO RECURSO
							vm.data.observacionTurnoPlantilla = pResult[1];
							setearBusquedaTurnosParaUnSoloRecurso(pResult[0])
								.then(function (pResults) {
									vm.data.turnosCalendario = angular.copy(pResults)
									setearObtenerCalendarOk();
								});
						}

						vm.data.observacionesDelServicioRecurso = pResult[2];

						$log.debug("obtenerCalendarOk", pResult);

						function setearObtenerCalendarOk() {


							//vamos a la fecha del primer turno seleccionado
							///primero consultamos el primer dia de turnos disponible
							var _indicieDatePrimerDiaTurnoDisponible = 0;
							if (vm.data.primerTurno && vm.data.primerTurno.length) {
								setSeleccionDia();
								calendarPrevNext()
							} else {
								$timeout(function () {
									setSeleccionDia();
									calendarPrevNext()
								}, 1800);
							};

							function setSeleccionDia() {

								for (let i = 0; i < vm.data.primerTurno.length; i++) {
									if (moment(vm.data.primerTurno[i].Fecha).isValid()) {
										_indicieDatePrimerDiaTurnoDisponible = i;
										break;
									}
								}
								if (_indicieDatePrimerDiaTurnoDisponible >= 0) {
									seleccionarDiaCalendario(moment(vm.data.primerTurno[_indicieDatePrimerDiaTurnoDisponible].Fecha.getTime()));
									uiCalendarConfig.calendars.calendarAsignacionTurno.fullCalendar("gotoDate", moment(vm.data.primerTurno[_indicieDatePrimerDiaTurnoDisponible].Fecha.getTime()));
								}
								vm.formControl.loading = false;
							}
						}

					}

					function obtenerCalendarError(pError) {
						$log.error("obtenerCalendarError", pError);
						vm.formControl.loading = false;
					}
				}

				function errorBuscarCallback(pError) {
					$log.error("obtenerPrimerTurnoError", pError);
					vm.formControl.loading = false;
				}


			}

			function buscarConSobreTurnos() {

				if (AsignacionTurnoLogicService.isMutualSelected(vm.data.paciente.Afiliaciones)) {

					vm.formControl.loading = true;
					//seteamos criterio busqueda sobreturnos
					setearCriterioBusqueda();
					var fechaLista = moment().format("MM-DD-YYYY");
					var _duracionDeTurno;
					var criterioBusquedaDuracion = AsignacionTurnoLogicService.setearCriterioDuracionLogic(vm.data.criterioBusquedaDuracionDto,
						vm.data.criterioBusqueda, vm.data.prestacionesObtenidas, vm.data.paciente);

					var _obtenerObservacionesPlantilla;

					/*
					 * consulto si la busqueda realizada es para un recurso o varios
					 */

					if (vm.data.criterioBusqueda.IdRecurso !== 0) {

						/*
						 * tengo una busqueda de sobreturnos para UN SOLO recurso
						 * seteo igual a la busqueda comun de turnos
						 */

						// seteo el criterio de busqueda
						setearCriterioBusquedaFecha(fechaLista, null);

						// obtengo las duraciones del criterio de busqueda
						_duracionDeTurno = AsignacionTurnoDataService.obtenerDuracionNecesariaParaRecursoEnServicio(criterioBusquedaDuracion);

						let criterioBusquedaFechaSobreturno = angular.copy(vm.data.criterioBusquedaFecha);
						let fechaHastaCalendarioSobreturno = moment(criterioBusquedaFechaSobreturno.FechaDesde).add(2, "M").format("MM-DD-YYYY");
						criterioBusquedaFechaSobreturno.FechaHasta = angular.copy(fechaHastaCalendarioSobreturno)

						var _busquedaRecursoParticular = AsignacionTurnoDataService.obtenerDisponibilidadDeSobreturnos(criterioBusquedaFechaSobreturno);


						_obtenerObservacionesPlantilla = PlantillaDataService.obtenerPlantillasConObservacionesPorServicioRecursoConEstado(
							vm.data.criterioBusquedaFecha.IdServicio,
							vm.data.criterioBusquedaFecha.IdTipoRecurso,
							vm.data.criterioBusquedaFecha.IdRecurso,
							vm.data.criterioBusquedaFecha.FechaDesde,
							fechaLista,
							2
						);

						$q.all([_busquedaRecursoParticular, _duracionDeTurno, _obtenerObservacionesPlantilla])
							.then(function (resultBusquedaSobreturnos) {

								$log.debug('busqueda sobreturnos resultOK', resultBusquedaSobreturnos[0]);
								vm.data.duracionesTurnoObtenido = resultBusquedaSobreturnos[1];

								//obtengo las observaciones 
								$log.debug('observaciones para sobreturnos de cada recurso del servicio', resultBusquedaSobreturnos[2]);
								vm.data.observacionTurnoPlantilla = resultBusquedaSobreturnos[2];

								setearBusquedaTurnosParaUnSoloRecurso(resultBusquedaSobreturnos[0])
									.then(function (pResults) {

										if (pResults.SituacionesPorDia.find(x => x.IdSituacionGeneral === 2)) {
											vm.data.turnosCalendario = angular.copy(pResults);

											vm.data.primerTurno = AsignacionTurnoLogicService.getPrimerTurnoDeLista(vm.data.turnosCalendario);

											var _primerTurnoToOrder = angular.copy(vm.data.primerTurno);

											//ordenar turnos por fecha creciente
											///ordeno datos
											vm.data.primerTurno = $filter("orderBy")(_primerTurnoToOrder, filedsOrderby);

											setearObtenerCalendarOk();
											vm.formControl.loading = false;

										} else {
											AlertaService.NewWarning("No hay sobreturnos disponibles");
											vm.formControl.loading = false;
										}

									});
							}, function (errorBusquedaSobreturnos) {
								$log.error('error al buscar sobreturnos', errorBusquedaSobreturnos);
								vm.formControl.loading = false;
							});
					} else {

						/*
						 * tengo una busqueda de sobreturnos para VARIOS RECURSOS
						 * seteo igual a la busqueda comun de turnos
						 */

						var fechaHastaCalendario = moment(fechaLista).add(vm.data.lapsoTurnos, "M").format("MM-DD-YYYY");

						// seteo el criterio de busqueda
						setearCriterioBusquedaCal(fechaLista, fechaHastaCalendario);

						_duracionDeTurno = AsignacionTurnoDataService.obtenerDuracionNecesariaParaServicio(criterioBusquedaDuracion);

						_obtenerObservacionesPlantilla = PlantillaDataService.obtenerPlantillasConObservacionesPorServicioConEstado(
							vm.data.criterioBusquedaCal.CriterioBusquedaDto.IdServicio,
							vm.data.criterioBusquedaCal.FechaDesde,
							fechaLista,
							2
						);

						let criterioBusquedaCalSobreturno = angular.copy(vm.data.criterioBusquedaCal);
						criterioBusquedaCalSobreturno.PrimerosAsignablesDto = null;

						var _busquedaTodosLosRecursos = AsignacionTurnoDataService.obtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicio(criterioBusquedaCalSobreturno)

						$q.all([_busquedaTodosLosRecursos, _duracionDeTurno, _obtenerObservacionesPlantilla])
							.then(function (resultBusquedaSobreturnos) {

								$log.debug('busqueda obtenerDisponibilidadDeSobreturnosDeCadaRecursoDelServicioOk', resultBusquedaSobreturnos);
								vm.data.duracionesTurnoObtenido = resultBusquedaSobreturnos[1];

								//obtengo las observaciones 
								$log.debug('observaciones para sobreturnos de cada recurso del servicio', resultBusquedaSobreturnos[2]);
								vm.data.observacionTurnoPlantilla = resultBusquedaSobreturnos[2];

								if (resultBusquedaSobreturnos[0].DetallesDeTurnos.length > 0) {
									setearBusquedaTurnos(resultBusquedaSobreturnos[0])
										.then(function (pResults) {

											vm.data.turnosCalendario = pResults;

											setearObtenerCalendarOk();
											vm.data.primerTurno = AsignacionTurnoLogicService.obtenerPrimerosTurnosLista(vm.data.turnosCalendario);

											var _primerTurnoToOrder = angular.copy(vm.data.primerTurno);

											//ordenar turnos por fecha creciente
											///ordeno datos
											vm.data.primerTurno = $filter("orderBy")(_primerTurnoToOrder, filedsOrderby);

										});
									vm.formControl.loading = false;
								} else {
									AlertaService.NewWarning("No hay sobreturnos disponibles");
									vm.formControl.loading = false;
								}
							}, function (errorBusquedaSobreturnos) {
								$log.error('error al buscar sobreturnos', errorBusquedaSobreturnos);
								vm.formControl.loading = false;
							});
					}
				}

				function setearObtenerCalendarOk() {


					//vamos a la fecha del primer turno seleccionado
					///primero consultamos el primer dia de turnos disponible
					vm.formControl.loading = true;
					var _indicieDatePrimerDiaTurnoDisponible = 0;
					if (vm.data.primerTurno && vm.data.primerTurno.length) {
						setSeleccionDia();
						calendarPrevNext()

					} else {
						vm.formControl.loading = true;
						$timeout(function () {
							setSeleccionDia();
							calendarPrevNext()

						}, 1800);
					};

					function setSeleccionDia() {

						for (let i = 0; i < vm.data.primerTurno.length; i++) {
							if (moment(vm.data.primerTurno[i].Fecha).isValid()) {
								_indicieDatePrimerDiaTurnoDisponible = i;
								break;
							}
						}
						if (_indicieDatePrimerDiaTurnoDisponible >= 0) {

							seleccionarDiaCalendario(moment(vm.data.primerTurno[_indicieDatePrimerDiaTurnoDisponible].Fecha));
							uiCalendarConfig.calendars.calendarAsignacionTurno.fullCalendar("gotoDate", moment(vm.data.primerTurno[_indicieDatePrimerDiaTurnoDisponible].Fecha));
						}
						vm.formControl.loading = false;
					}
				}

			}


			//#endregion BUSQUEDA

			/* ------------------------------------------- OTORGAR TURNO -------------------------------------------- */
			//region OTORGAR TURNO
			function otorgarTurno(turno) {

				$log.debug("otorgar turno", turno, vm.data.paciente, vm.data.servicioMedico.Nombre);
				//controlo permiso para otorgar turno dependiendo si es callcenter o recepcion
				if (AsignacionTurnoAuthService.tienePermisoCallCenter(User)) {

					// tengo permiso de recepcion entonces guardo turno ok
					if (RecepcionTurnosAuthService.tienePermisoRecepcion(User)) {
						okTurnoOtorgar(turno);
					} else {

						//NO tengo permiso de recepcion por ende el turnero no puede Asignar turnos tipo:
						// *tipoturno = 4 (Reservado) y tipoturno = 7 (DNP) Pero puedo buscar turnos
						// *si el servicio es ginecologia (8) puedo asignar reservados

						// consulto si el tipo de turno seleccionado es DNP, entonces puedo buscar pero no asignar
						if (vm.data.tipoTurno.Id == 7 || vm.data.tipoTurno.Id == 4) {

							//consulto si el servicio elegido es ginecologia y el tipo de turno es reservado=> puedo otorgar
							if (vm.data.servicioMedico && vm.data.servicioMedico.Id === 8 && vm.data.tipoTurno.Id === 4 && vm.data.paciente.Afiliaciones.find(x => x.PorDefecto).EsParticular) {
								okTurnoOtorgar(turno);
							} else {
								AlertaService.NewWarning("Atención", "No se puede asignar un turno con Tipo De Turno igual a DNP o Reservado");
							}

						} else {
							okTurnoOtorgar(turno);
						}
					}

				} else {
					// tengo permiso de recepcion entonces guardo turno ok
					if (RecepcionTurnosAuthService.tienePermisoRecepcion(User)) {
						okTurnoOtorgar(turno);
					}
				}

				//ok el turno, lo otorgo
				function okTurnoOtorgar(turno) {
					if (turno.length > 0) {
						var asignarData = getDataTurnoParaOtorgar(turno);

						var _observacion = "";
						if (vm.data.observacionesPlantilla && vm.data.observacionesPlantilla.length) {
							//$log.debug('observacion',vm.data.observacionesPlantilla);
							_observacion = vm.data.observacionesPlantilla.find(x => x.Id === asignarData.sucursal.IdSucursal);
						}

						AsignacionTurnoModalService.openAsignarTurno(turno, vm.data.criterioBusqueda, asignarData.pacientes, asignarData.recurso, vm.data.servicioMedico,
							asignarData.sucursal, vm.data.tipoTurno, asignarData.prestaciones, vm.reprogramacion.idTurno, _observacion)
							.then(openAsignarTurnoOk, openAsignarTurnoError);
					}
				}


				function openAsignarTurnoOk(pResult) {

					//if tengo turnoobtenido vuelvo al state
					if (vm.reprogramacion.volver) {
						backToState();
					}
					else {
						openTurnos();
					}

					function openTurnos() {
						//abro turnos futuros para analizar si se dio el otorgamiento correctamente
						TurnosCommonLogicService.openTurnosPaciente(vm.data.paciente, false, false, false)
							.then(function (pResult) {
								$log.debug('result component turnos paciente', pResult);
								$log.debug("openAsignarTurnoOk", "limpiando...", pResult);
								limpiarBusqueda(false, true);
								limpiarRecursoGuardado();
							}, function (pError) {
								$log.error('result component turnos paciente', pError);
								$log.debug("openAsignarTurnoOk", "limpiando...", pResult);
								limpiarBusqueda(false, true);
								limpiarRecursoGuardado();
							});
					}

				}

				function openAsignarTurnoError(pError) {
					$log.debug("openAsignarTurnoError", pError);
				}
			}

			function otorgarPrimerTurno(turnosCollection) {
				$log.debug("otorgar primer turno", turnosCollection, vm.data.paciente);

				var _turnos = angular.copy(turnosCollection);

				angular.forEach(turnosCollection, function (_turno) {
					if (_turno.Hora === "") {
						_turnos.splice(_turnos.indexOf(_turno), 1);
					}
				});

				if (_turnos.length === 0) {
					//AlertaService.NewWarning("Alerta", "El turno seleccionado no esta disponible");
				} else {
					angular.forEach(_turnos, function (tur) {
						tur.IdPaciente = angular.copy(vm.data.paciente.Id);
						tur.servicioMedicoNombre = angular.copy(vm.data.servicioMedico.Nombre);
						tur.Afiliaciones = angular.copy(vm.data.paciente.Afiliaciones);
					});

					var _pacientes: Array<any> = [];
					_pacientes.push(vm.data.paciente);

					var pRecurso = {
						Id: angular.copy(_turnos[0].IdRecurso),
						Nombre: angular.copy(_turnos[0].Recurso)
					};

					var pServicio = {
						Id: angular.copy(_turnos[0].IdServicio),
						Nombre: angular.copy(_turnos[0].Servicio)
					};
					var pSucursal = {
						Id: angular.copy(_turnos[0].IdSucursal),
						Nombre: angular.copy(_turnos[0].Sucursal)
					};

					var pTipoTurno = {
						Id: 1,
						Nombre: "Turno"
					};
					if (vm.data.checkSobreturnos) {
						pTipoTurno.Id = 2;
						pTipoTurno.Nombre = "Sobreturno";
					}

					// Obtengo las prestaciones seleccionadas
					var pPrestaciones: Array<any> = [];

					angular.forEach(vm.data.prestacionesObtenidas, function (prestacion) {
						if (prestacion.status === true) {
							var prestacionParaAgregar = {
								Id: prestacion.Id,
								Nombre: prestacion.Nombre
							};
							pPrestaciones.push(prestacionParaAgregar);
						}
					});

					AsignacionTurnoModalService.openAsignarTurno(_turnos, vm.data.criterioBusqueda, _pacientes, pRecurso, pServicio,
						pSucursal, pTipoTurno, pPrestaciones, $stateParams.idTurnoToSearch
					).then(openAsignarTurnoOk, openAsignarTurnoError);
				}

				function openAsignarTurnoOk(pResult) {
					$log.debug("openAsignarTurnoOk", "limpiando...", pResult);
					limpiarBusqueda(false, true);
					limpiarRecursoGuardado();
					if (vm.data.idTurnoToSearch) {
						backToState();
					}
				}

				function openAsignarTurnoError(pError) {
					$log.debug("openAsignarTurnoError", pError);
				}
			}
			//endregion

			/* ---------------------------------------------- CALENDAR ---------------------------------------------- */
			//region CALENDAR

			vm.uiConfig = {
				calendarTurno: {
					schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
					height: "auto",
					defaultView: "month",
					timezone: false,
					firstDay: 1,
					editable: true,
					eventOverlap: false,
					selectable: true,
					customButtons: {
						colorButton: {
							text: "C",
							click: function () {
								vm.formControl.toggleColores = vm.formControl.toggleColores ? false : true;
								$timeout(function () {
									uiCalendarConfig.calendars.calendarAsignacionTurno.fullCalendar("render");
								}, 100);
							}
						}
					},
					header: {
						left: "title",
						center: "colorButton",
						right: "prev,next"
					},
					eventClick: function (calEvent, jsEvent, view) {
						$log.debug("eventClick", calEvent, jsEvent, view);
					},
					events: [],
					dayRender: function (date, cell) {
						if (!moment(date.stripTime().format()).isSameOrAfter(moment().stripTime().format())) {
							cell.css("background-color", "rgba(170, 178, 185, 0.13)");
							cell.css("cursor", "default");
						} else if (vm.data.turnosCalendario) {
							angular.forEach(vm.data.turnosCalendario.SituacionesPorDia, function (value) {
								if (date.format("MM/DD/YYYY") === moment(new Date(value.Fecha)).format("MM/DD/YYYY")) {
									cell.addClass(value.Color);
								}
							});
						}
						if (date.date() === 16) vm.data.fechaSelectedCalendario = angular.copy(date);
					},
					dayClick: function (date, jsEvent, view) {
						//aplico funcion de seleccionar dia
						seleccionarDiaCalendario(date);
					}
				}
			};

			function calendarPrevNext() {

				$timeout(function () {
					uiCalendarConfig.calendars.calendarAsignacionTurno.fullCalendar("prev");
					uiCalendarConfig.calendars.calendarAsignacionTurno.fullCalendar("next");
				}, 200);
			}

			//funcion que llamamos al seleccionar un dia del caalendario tipo mes
			function seleccionarDiaCalendario(date) {

				$log.debug('date seleccionada', date);
				vm.dateSeleccionadoCalendar = angular.copy(date);

				if (moment(date.stripTime().format()).isSameOrAfter(moment().stripTime().format())) {
					if (vm.data.turnosCalendario.length !== 0) {
						var dateExist = false;

						angular.forEach(vm.data.turnosCalendario.SituacionesPorDia, function (value) {
							if (!dateExist) {
								if (date.isSame(moment(new Date(value.Fecha)), 'day')) {


									// consulto si el IdSituacionGeneral == 3, entonces no muestro turnos
									if (value.IdSituacionGeneral != 3) {

										//ordeno datos de nuevp
										var _primerTurnoToOrder = angular.copy(
											value.TurnosAsignables
										);

										///ordeno datos
										vm.data.turnosDisponiblesDelDia = $filter("orderBy")(
											_primerTurnoToOrder,
											filedsOrderby
										);

										vm.data.turnosDisponiblesDelDia.forEach(tur => {
											tur.selected = false;
										});
										dateExist = true;
										vm.data.diaElegidoTextExtraData = "(Libres: " + value.CantidadAsignables + ")";

										//voy a consultar si tengo unos o varios recursos buscados
										//si tengo un solo recurso, la observacion se setea por dia.
										if (vm.data.recurso && vm.data.recurso.Id) {

											//tengo un solo recurso, le asigno la observacion DE LA PLANTILLA
											angular.forEach(vm.data.observacionTurnoPlantilla, function (itemObservacionPlantilla, key) {
												if (vm.data.recurso.Id === itemObservacionPlantilla.IdRecurso &&
													date.isBetween(itemObservacionPlantilla.FechaDesde, itemObservacionPlantilla.FechaHasta)) {

													//vm.data.observacionesPlantilla = angular.copy(itemObservacionPlantilla.Observaciones);
													vm.data.observacionesPlantilla = AsignacionTurnoLogicService.getObservacionesPorSucursalParseadas(itemObservacionPlantilla.Observaciones,
														vm.data.sucursalesParaObservaciones);
													$log.debug('Observaciones de plantilla', vm.data.observacionesPlantilla);
												}
											});


											//tengo un solo recurso, le asigno la OBSERVACION DEL SERVICIO RECURSO
											angular.forEach(vm.data.observacionesDelServicioRecurso, function (itemObservServicioRecurso, key) {
												if (vm.data.recurso.Id === itemObservServicioRecurso.IdRecurso &&
													date.isSame(moment(new Date(itemObservServicioRecurso.Fecha)), 'day')) {

													vm.data.observacionServRecurso = angular.copy(itemObservServicioRecurso.Observaciones);
												} else {
													vm.data.observacionServRecurso = 0;
												}
											});
										}
									} else {
										vm.data.turnosDisponiblesDelDia = [];
										vm.data.diaElegidoTextExtraData = "(Libres: " + value.CantidadAsignables + ")";
									}

								} else {
									vm.data.turnosDisponiblesDelDia = [];
									vm.data.diaElegidoTextExtraData = "(Libres: " + value.CantidadAsignables + ")";
								}
							}
						}
						);
					}
				} else {
					vm.data.turnosDisponiblesDelDia = [];
					vm.data.diaElegidoTextExtraData = "(Libres: " + 0 + ")";
				}

				if (date.isUtc())
					vm.data.diaElegidoText = date.utc().format("dddd, D [de] MMMM [de] YYYY");
				else
					vm.data.diaElegidoText = date.format("dddd, D [de] MMMM [de] YYYY");

				angular.forEach(vm.data.turnosDisponiblesDelDia, function (row, key) {
					row.IdRow = key;
				});
			}
			//endregion CALENDAR

			/* ------------------------------------------ SUPPORT METHODS ------------------------------------------- */
			//region SUPPORT

			function backToState() {
				//volvemos al state si esta activado
				$log.debug("btn volver -  backt to state");
				StateHelperService.goToPrevState();

			}

			function cargarSucursalesXServicio(servicioMedico) {
				var def = $q.defer();
				if (servicioMedico) {

					vm.formControl.loading = true;
					SucursalDataService.obtenerSucursalesXServicio(servicioMedico.Id)
						.then(obtenerOk, obtenerError);
				}
				function obtenerOk(pResult) {
					vm.formControl.loading = false;
					//agrego opcion de TODAS
					if (pResult.length > 1) {
						let _todasSucursal = {
							Nombre: "TODAS",
							Id: 0
						}
						pResult.unshift(_todasSucursal);
					} else if (pResult.length == 0) {
						AlertaService.NewWarning("Atención", "El servicio no tiene sucursales o no tiene permisos para ver ciertas sucursales");
					}
					vm.data.sucursalesXServicio = angular.copy(pResult);
					def.resolve(pResult);

				} function obtenerError(pError) {
					vm.formControl.loading = false;
					$log.error('Error al obtener sucursales x servicio', pError);
					def.reject(pError);

				};

				return def.promise;
			}

			function getDataTurnoParaOtorgar(turno) {

				return AsignacionTurnoLogicService.getDataTurnoParaOtorgarLogic(turno, vm.data.prestacionesObtenidas, vm.data.paciente,
					vm.data.servicioMedico);
			}
			function loadPrestacionesBtn() {
				return AsignacionTurnoLogicService.loadPrestacionesButton(vm.data.prestacionesObtenidas);
			}

			function handleEventProp() {
				$("#dropdownPrestaciones").click(function (e) {
					e.stopPropagation();
				});
			}

			function ifBuscarHabilitado() {
				return AsignacionTurnoLogicService.getBuscarStatus(vm.data.servicioMedico, vm.data.tipoTurno, vm.data.prestacionesObtenidas,
					vm.data.paciente, vm.data.sucursal)

			}

			function cargarTodosTiposDeTurno() {

				var def = $q.defer();
				PlantillaDataService.obtenerTiposDeTurnos()
					.then(function (pResult) {
						def.resolve(pResult);
					});
				return def.promise;

			}


			function limpiarBusqueda(borrarServicio, borroPaciente) {

				$log.debug("limpiar busqueda");

				if (vm.reprogramacion.idTurno === 0) {

					if (!borrarServicio) {

						vm.data.servicioMedico = "";
						angular.forEach(vm.data.prestacionesObtenidas, function (value) {
							value.status = false;
						});
					}
					vm.data.tipoTurno = {};
					vm.data.recurso = "";
					delete vm.data.sucursal;
					delete vm.data.primerTurno;
					delete vm.data.turnosDisponiblesDelDia;
					vm.data.turnosCalendario = [];
					vm.data.checkSobreturnos = false;

					for (var _i = 0; _i < vm.data.criterioBusqueda.length; _i++) {
						vm.data.criterioBusqueda[_i] = 0;
					}

					calendarPrevNext();

					if (!vm.formControl.mantenerDatos && borroPaciente) delete vm.data.paciente;

					delete vm.data.observacionesPlantilla;

					activate();

				}
			}

			function limpiarGrillayCalendar() {

				$log.debug("limpiar limpiarGrillayCalendar");
				delete vm.data.primerTurno;
				delete vm.data.turnosDisponiblesDelDia;
				vm.data.turnosCalendario = [];
				vm.data.precioParticularMutualTurno = {
					FechaConvenioFinanciadorDesde: null,
					FechaConvenioFinanciadorHasta: null,
					FechaConvenioParticularDesde: null,
					FechaConvenioParticularHasta: null,
					ImporteTotalCoseguro: null,
					ImporteTotalParticular: null,
					IdRecurso: 0
				};
				//vm.data.tipoRecursoSeleccionado = 0;

				for (var _i = 0; _i < vm.data.criterioBusqueda.length; _i++) {
					vm.data.criterioBusqueda[_i] = 0;
				}
				calendarPrevNext();

				// if ($stateParams.idTurnoToSearch === 0 || $stateParams.obj.idPaciente)
				// 	activate();
			}


			function limpiarRecursoGuardado() {
				$log.debug('limpiarRecursoGuardado', vm.data.limpiarRecurso);
				vm.data.limpiarRecurso = true;
				vm.data.tipoRecursoSeleccionado = 0;
				delete vm.data.recursoAtiende;
			}


			function limpiarTurnosPrimerosDisponibles() {
				angular.forEach(vm.data.primerTurno, function (_turno) {
					_turno.selected = false;
				});
			}



			function setearCriterioBusqueda() {

				if (vm.data.criterioBusqueda != "") {

					if (vm.data.paciente) {

						angular.forEach(vm.data.paciente.Afiliaciones, function (financiador) {
							if (financiador.PorDefecto === true) {
								vm.data.criterioBusqueda.IdFinanciador = angular.copy(financiador.IdMutual);
								vm.data.criterioBusqueda.IdPlan = angular.copy(financiador.IdPlanMutual);
							}
						});

						vm.data.criterioBusqueda.IdPaciente = vm.data.paciente.Id ? vm.data.paciente.Id : 0;
					}

					if (vm.data.prestacionesObtenidas && vm.data.prestacionesObtenidas.length > 0) {

						if(vm.data.solicitudEstudioSeleccionada && vm.data.solicitudEstudioSeleccionada.Id){
							vm.data.criterioBusqueda.Prestaciones.length = 0;
							angular.forEach(vm.data.prestacionesObtenidas, function (prestacion) {
								if (prestacion.status === true) {

									//tengo solicitud de estudios 
									angular.forEach(vm.data.solicitudEstudioSeleccionada.ItemsSinTurno, function(itemSinTurno) {
										if(itemSinTurno.IdPrestacionMedica == prestacion.Id){
											vm.data.criterioBusqueda.Prestaciones.push({
												IdPrestacion:prestacion.Id,
												IdItemSolicitudEstudios: itemSinTurno.Id,
											});
										}
									});

				
								}
							});
						}else {
							vm.data.criterioBusqueda.Prestaciones.length = 0;
							angular.forEach(vm.data.prestacionesObtenidas, function (prestacion) {
								if (prestacion.status === true) {
									vm.data.criterioBusqueda.Prestaciones.push({
										IdPrestacion:prestacion.Id,
										IdItemSolicitudEstudios: 0,
									});
								}
							});
						}

					
					}
					vm.data.criterioBusqueda.IdRecurso = vm.data.recurso ? angular.copy(vm.data.recurso.Id) : 0;
					vm.data.criterioBusqueda.IdServicio = vm.data.servicioMedico ? angular.copy(vm.data.servicioMedico.Id) : 0;
					vm.data.criterioBusqueda.IdSucursal = vm.data.sucursal ? angular.copy(vm.data.sucursal.Id) : 0;
					vm.data.criterioBusqueda.IdTipoDeTurno = vm.data.tipoTurno ? angular.copy(vm.data.tipoTurno.Id) : 0;
					vm.data.criterioBusqueda.IdTipoRecurso = vm.data.recurso ? angular.copy(vm.data.recurso.IdTipoRecurso) : 0;
					vm.data.criterioBusqueda.SexoPaciente = vm.data.paciente.NombreTipoSexo.charAt(0);
					vm.data.criterioBusqueda.EdadPaciente = vm.data.paciente.Edad;
					vm.data.criterioBusqueda.IdProfesionalSolicitado = (vm.data.recurso && vm.data.recurso.ProfesionalQueAtiende) ? angular.copy(vm.data.recurso.ProfesionalQueAtiende.Id) : 0;
					vm.data.criterioBusqueda.IdEspecialidad = vm.data.especialidad ? angular.copy(vm.data.especialidad.Id) : 0;

					//check control edad
					vm.data.criterioBusqueda.ControlarEdad = angular.copy(vm.formControl.controlEdad);

					//check Sobreturnos
					if (vm.data.checkSobreturnos)
						vm.data.criterioBusqueda.IdTipoBusqueda = 2;
					else
						vm.data.criterioBusqueda.IdTipoBusqueda = 1;

				}
			}

			function setearCriterioBusquedaFecha(fechaDesde, fechaHasta) {
				setearCriterioBusqueda();
				vm.data.criterioBusquedaFecha = angular.copy(vm.data.criterioBusqueda);
				vm.data.criterioBusquedaFecha.FechaDesde = angular.copy(fechaDesde);
				vm.data.criterioBusquedaFecha.FechaHasta = angular.copy(fechaHasta);
			}

			function setearCriterioBusquedaCal(fechaDesde, fechaHasta) {
				setearCriterioBusqueda();
				vm.data.criterioBusquedaCal.CriterioBusquedaDto = angular.copy(vm.data.criterioBusqueda);
				vm.data.criterioBusquedaCal.FechaDesde = angular.copy(fechaDesde);
				vm.data.criterioBusquedaCal.FechaHasta = angular.copy(fechaHasta);
			}


			function setearBusquedaTurnos(calendarObtenido) {

				var def = $q.defer();
				AsignacionTurnoLogicService.setearBusquedaTurnosLogic(calendarObtenido, vm.data.situacionesGralDia, vm.data.sucursalesConAbrev,
					vm.data.duracionesTurnoObtenido, vm.data.prestacionesObtenidas)
					.then(function (pResult) {
						def.resolve(pResult);
					});
				return def.promise;
			}

			function setearBusquedaTurnosParaUnSoloRecurso(calendarObtenido) {
				var def = $q.defer();
				AsignacionTurnoLogicService.setearBusquedaTurnosUnSoloRecursoLogic(calendarObtenido, vm.data.recurso, vm.data.sucursal,
					vm.data.prestacionesObtenidas, vm.data.duracionesTurnoObtenido, vm.data.sucursalesConAbrev)
					.then(function (pResult) {
						def.resolve(pResult);
					});
				return def.promise;

			}

			function cargarTiposDeTurno(pServicio) {
				$log.debug('cargando tipos de turno por servicio.. ', pServicio);
				var def = $q.defer();
				if (pServicio) {
					PlantillaDataService.obtenerTiposDeTurnosSeleccionablesPorServicio(pServicio.Id)
						.then((pResult) => {
							vm.data.tiposDeTurno = angular.copy(pResult);

							if (vm.data.tiposDeTurno && vm.data.tiposDeTurno.length) {
								vm.data.tipoTurno = angular.copy(vm.data.tiposDeTurno.find(x => x.PorDefecto));
								filtrarPrestacionesPorTipoDeTurno();
								def.resolve(pResult);
							} else { 
								def.reject(false);
							}
								
						}, (pError) => {
								this.$log.error('pError', pError);
								def.reject(false);
						});
				}

				return def.promise;
			}

			function cargarDatosPrestacion(pServicio) {

				var def = $q.defer();
				//tambien levanto modal si hay datos en la busqueda de turnos historico por servicio
				var _today = new Date();

				var _todayMinus12 = angular.copy(vm.today);
				_todayMinus12.setMonth(_todayMinus12.getMonth() - 12);

				//borro el recurso si cambio el servicio
				limpiarBusqueda(true, false);

				var _fechaDesde = angular.copy(moment(_todayMinus12).format('MM-DD-YYYY'));
				var _fechaHasta = angular.copy(moment(_today).format('MM-DD-YYYY'));

				//cargo las prestaciones para el servicio
				if (pServicio !== null) {

					vm.formControl.loading = true;
					vm.data.recursoBuscar.id_servicio = angular.copy(pServicio.Id);

					PrestacionGestionDataService.getTodasPrestacionesXServicio(pServicio.Id)
						.then(getPrestacionesXServicioOk, getPrestacionesXServicioError);

				}

				function getPrestacionesXServicioOk(pResults) {

					$log.debug("getPrestacionesXServicioOk", pResults);

					if (pResults.length !== 0) {
						vm.data.prestacionesObtenidas = angular.copy(pResults);
						vm.data.prestaciones = angular.copy(pResults);

						// se comenta autoseleccionado de prestaciones a tarea Improvement #2219
						// se deja solamente activada la opcion de prestacion cuando es una sola prestacion
						// sin importar cual es
						if (vm.data.prestacionesObtenidas && vm.data.prestacionesObtenidas.length == 1) {
							vm.data.prestacionesObtenidas[0].status = true;
						}
				
					} else {
						//no tengo prestaciones, por ende no cargo ninguna o borro las que estaban ya puestas
						vm.data.prestacionesObtenidas = {};
					}

					// si tengo DIAGNOSTICO POR IMAGENES (IdServicio == 30) => deberia poner por defecto el tipo de turno PRACTICAS (Id == 5)
					// if (pServicio.Id == 30) {
					// 	vm.data.tipoTurno = angular.copy(vm.data.tiposDeTurno.find(x => x.Id == 5));
					// 	vm.data.showBuscadorPrestacion = true;
					// }
					cargarTiposDeTurno(vm.data.servicioMedico);

					// al seleccionar un servicio consulto sus turnos viejos y los muestro
					if (vm.data.paciente) {

						if (vm.optionsConfig[0].Status && (!vm.reprogramar || vm.reprogramar.idTurno != 0) && !vm.data.solicitudEstudioSeleccionada) {

							var _turnosHistorico = TurnoDataService.obtenerTurnosPorPacienteConLegacy(vm.data.paciente.Id, _fechaDesde, _fechaHasta, pServicio.Id)
								.then(function (turnosPorPacientePorServicio) {
									$log.debug('turnos historico por paciente:', turnosPorPacientePorServicio);
									if (turnosPorPacientePorServicio.length !== 0) {
										TurnosCommonLogicService.openTurnosPaciente(vm.data.paciente, true, pServicio, false)
											.then(function (result) {
											}, function (error) {
											});
									}
								}, function (pErrorTurnosPorPaciente) {
								});
						}
					}

					vm.formControl.loading = false;
					def.resolve(pResults);

				}

				function getPrestacionesXServicioError(pError) {
					$log.error("getPrestacionesXServicioError", pError);
					vm.formControl.loading = false;
					def.reject(pError);
				}
				return def.promise;
			}

			function isMutualActiva() {
				var ret = false;
				if (vm.data.paciente && vm.data.paciente.Afiliaciones) {
					if (vm.data.paciente.Afiliaciones.find(x => x.PorDefecto == true)) {
						if (vm.data.paciente.Afiliaciones.find(x => x.PorDefecto == true).MutualActiva == false) {

							ret = true;
						}
					}

				}
				return ret;
			}

			function showAlertaIsMutualActiva() {
				if (vm.data.paciente && vm.data.paciente.Afiliaciones) {
					if (vm.data.paciente.Afiliaciones.find(x => x.PorDefecto == true)) {

						if (vm.data.paciente.Afiliaciones.find(x => x.PorDefecto == true).MutualActiva == false) {
							AlertaService.NewWarning("Atención", "La mutual seleccionada no esta activa");
						} else if (vm.data.paciente.Afiliaciones.find(x => x.PorDefecto == true).VisibleEnTurnos == false) {
							ModalService.warn("No se pueden otorgar turnos para esta mutual.");
						}
					}

				}
			}

			function verObservaciones() {
				$log.debug('observaciones', vm.data.observacionesPlantilla);

				var ObservacionesItem = {
					observacionToShow: '',
					observacionConTags: '',
				}
				// ObservacionesItem.observacionToShow = angular.copy($itemScope.plantilla.Observaciones);
				TurnosCommonLogicService.openObservacionesPorSucursal(ObservacionesItem, vm.data.observacionesPlantilla, true, false);
			}

			function openAjustesPaciente() {

				let config = angular.copy(vm.optionsConfig);
				ModalService.openOpcionesDeConfiguracion("Configurar Opciones", config)
					.then(function (pResult) {
						$log.debug('resultConfigOk', pResult);
						vm.optionsConfig = angular.copy(pResult);
						setStoredData();
					}, function (pError) {
						$log.error('resultConfigError', pError);
					});
			}

			function filtrarPrestacionesPorTipoDeTurno() {

				// si es tipo de turno primera vez o ulterior
				$log.debug('filtrarPrestacionesPorTipoDeTurno.. tipo de turno: ', vm.data.tipoTurno);
				if (vm.data.tipoTurno) {

					if (vm.data.tipoTurno.Id === 1 || vm.data.tipoTurno.Id === 2 || vm.data.tipoTurno.Id == 3) {
						vm.data.prestacionesFiltradasPorTipoTurno = angular.copy(vm.data.prestaciones.filter(x => x.IdTipoPrestacion === 1));
					} else if (vm.data.tipoTurno.Id === 5) {
						vm.data.prestacionesFiltradasPorTipoTurno = angular.copy(vm.data.prestaciones.filter(x => x.IdTipoPrestacion === 2));
					} else {
						vm.data.prestacionesFiltradasPorTipoTurno = angular.copy(vm.data.prestaciones);
					}

					if (vm.data.prestacionesFiltradasPorTipoTurno && vm.data.prestacionesFiltradasPorTipoTurno.length > 0) {

						//vm.data.prestacionesFiltradasPorTipoTurno[0].status = true;
					} else {
						AlertaService.NewWarning("No hay prestaciones para el tipo de turno seleccionado");
					}


					// se agrega set de consulta
					if (vm.data.prestacionesFiltradasPorTipoTurno && vm.data.prestacionesFiltradasPorTipoTurno.length) {
						vm.data.prestacionesFiltradasPorTipoTurno.forEach(pres => {
							pres.status = false;
						});

						if (vm.data.prestacionesFiltradasPorTipoTurno && vm.data.prestacionesFiltradasPorTipoTurno.length == 1) {
							vm.data.prestacionesFiltradasPorTipoTurno[0].status = true;
						}
						// var _ifConsulta = vm.data.prestacionesFiltradasPorTipoTurno.find(x => x.Nombre == "CONSULTA");
						// if (_ifConsulta) {

						// 	vm.data.prestacionesFiltradasPorTipoTurno.find(x => x.Id === _ifConsulta.Id).status = true;

						// } else {
						// 	var _ifConsultaGineco = vm.data.prestacionesFiltradasPorTipoTurno.find(x => x.Nombre == "CONSULTA GINECOLOGICA");
						// 	if (_ifConsultaGineco) {
						// 		vm.data.prestacionesFiltradasPorTipoTurno.find(x => x.Id === _ifConsultaGineco.Id).status = true;
						// 	}
						// 	else {
						// 		//vm.data.prestacionesFiltradasPorTipoTurno[0].status = true;
						// 	}
						// }
					}


					vm.data.prestacionesObtenidas = angular.copy(vm.data.prestacionesFiltradasPorTipoTurno);
					setearCriterioBusqueda();
				}
			}

			function inicializarMenuOptions() {
				vm.data.menuOptions = [
					{
						text: 'Agenda',
						displayed: function (modelValue) {

							$log.debug('modelValueAgenda', modelValue);
							return modelValue.turno.IdPlantillaTurno != 0;
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('itemsScopeClick', $itemScope);
							let _recurso = {
								Id: $itemScope.turno.IdRecurso,
								IdTipoRecurso: $itemScope.turno.IdTipoRecurso,
								Nombre: $itemScope.turno.Recurso

							}
							PlantillaLogicService.viewPlantilla(0, vm.data.servicioMedico, _recurso);
						}
					},
					{
						text: 'Recesos',
						displayed: function (modelValue) {
							$log.debug('modelValueRecesos', modelValue);
							return modelValue.turno.IdPlantillaTurno != 0;
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('itemsScopeClick', $itemScope);
							let _fechaDesde = null
							let _fechaHasta = null;

							_fechaDesde = angular.copy(moment().startOf('month'));
							_fechaHasta = angular.copy(moment().startOf('month').add(4, 'month'));
							let _recurso = {
								Id: $itemScope.turno.IdRecurso,
								IdTipoRecurso: $itemScope.turno.IdTipoRecurso,
								Nombre: $itemScope.turno.Recurso
							}
							MantenimientoAgendaLogicService.openConsultaRecesos(vm.data.servicioMedico, _recurso, _fechaDesde, _fechaHasta);
						}
					},
					{
						text: 'Lista Completa de Turnos',
						displayed: function (modelValue) {
							$log.debug('modelValueRecesos', modelValue);
							return modelValue.turno.IdPlantillaTurno != 0;
						},
						click: ($itemScope, $event, modelValue, text, $li) => {
							$log.debug('Lista Completa de TurnosMenu', $itemScope);

							let fechaLista = moment($itemScope.turno.Fecha).format("MM-DD-YYYY");

							let _criterioFecha = angular.copy(vm.data.criterioBusqueda);

							_criterioFecha.FechaDesde = fechaLista;
							_criterioFecha.FechaHasta = fechaLista;
							_criterioFecha.Servicio = $itemScope.turno.Servicio;
							_criterioFecha.Recurso = $itemScope.turno.Recurso;
							_criterioFecha.IdRecurso = $itemScope.turno.IdRecurso;
							_criterioFecha.IdTipoRecurso = $itemScope.turno.IdTipoRecurso;

							AsignacionTurnoModalService.openListaDeTurnosGenerados(_criterioFecha, vm.data.paciente, fechaLista, null);
						}
					},
					{
						text: 'Sin Acciones',
						displayed: function (modelValue) {
							$log.debug('modelValueRecesos', modelValue);
							return modelValue.turno.IdPlantillaTurno == 0;
						}
					}
				];
			}

			function turnoSeleccionadoValido() {
				let ret = false;
			}

			function verCalendarioRecurso() {
				TurnosCommonLogicService.openCalendarioTurnosPorRecurso(vm.data.recurso, vm.data.servicioMedico, vm.data.sucursal, false);
			}

			function getItemsNameSelected() {
				let _str = "Prestaciones seleccionadas: " + "&#013;";
				if (vm.data.prestacionesObtenidas.find(x => x.status)) {
					//tengo algun elemento seleccionado
					vm.data.prestacionesObtenidas.forEach((item) => {
						if (item.status) _str = _str + item.Nombre + " &#013;";
					})
				} else {
					//no tengo ningun elemento seleccionado muestro un solo mensaje
					_str = "No hay prestaciones seleccionadas";
				}
				return _str;
			}

			function consultarCuestionario() {

				//funcion para consultar cuestionarios
				//debemos tener si o si idPaciente y idServicio

				if (vm.data.paciente && vm.data.servicioMedico) {
					//tengo los dos items => pero necesito saber si busco con prestacion o sin prestacion
					//consulto prestaciones
					var idPrestacion = 0;
					if (vm.data.prestacionesObtenidas && vm.data.prestacionesObtenidas.find(x => status)) {
						//tengo una seleccionada
						idPrestacion = vm.data.prestacionesObtenidas.find(x => status).id;
					}

					CuestionarioDataService.obtenerCuestionarioParaTurno(vm.data.paciente.Id, vm.data.servicioMedico.Id, idPrestacion, 0)
						.then((pResultCuestionario) => {
							$log.debug('pResultCuestionario', pResultCuestionario);
							//si tengo cuestionario null => no muestro nada y dejo continuar
							if (pResultCuestionario) {

							}
						}, (pErrorCuestioario) => {
							$log.error('pErrorCuestioario', pErrorCuestioario);
						});

				}
			}

			function closePrestacionesMenu(status) {
				$log.debug('status', status);
				//dependendiendo el status voy a consultar cuestionarios o no
				//si cerre el dropdown consulto cuestionarios
				if (!status) {
					//consultarCuestionario();
				}
			}

			function buscarSolicitudesDeEstudio(){
				//no tenog que buscar solicitudes al rprogramar
				if(!vm.reprogramacion.idTurno){

					bateriaEstudiosDataService.obtenerItemsPendientesDeAsignarTurnos(vm.data.paciente.Id)
					.then(function (solicitudes) {
						//tengo solicitudes => tengo que mostrar modal para seleccionar
						if(solicitudes && solicitudes.length){
	
							AsignacionTurnoModalService.openSolicitudesEstudios(solicitudes, vm.data.paciente)
							.then((result) => {
	
								if(result === "canceleSolicitud"){
									AlertaService.NewSuccess("Solicitud Cancelada Correctamente");
									buscarSolicitudesDeEstudio();
								}else if(result){
									//tengo las solicitudes a buscar, armo la busqueda
									vm.data.solicitudEstudioSeleccionada = result;
									busquedaParaSolicitudDeEstudios(result);
								}
							
							}, (error) => {
								
							});
						}
					}, function (pError) {
						$log.error('obtenerPacientePorIdError', pError);
					});
				}
			}

			//endregion SUPPORT

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			//#region ACTIVATE
			activate();

			function activate() {

				vm.formControl.loading = true;
				// vm.data.limpiarRecurso = false;
				//Si tengo un paciente en params lo obtnemos y lo cargamos,  vengo de crear un paciente
				if ($stateParams.obj.idPaciente) {
					PacienteDataService.obtenerPacientePorIdSelector($stateParams.obj.idPaciente)
						.then(function (pPaciente) {
							vm.data.paciente = angular.copy(pPaciente);
							$stateParams.obj.idPaciente = null;
						}, function (pError) {
							$log.error('obtenerPacientePorIdError', pError);
						});
				}

				//var _tiposDeTurnos = PlantillaDataService.obtenerTiposDeTurnos();
				var _criterioBusqueda = TurnoDataService.obtenerNuevoCriterioBusqueda();
				var _criterioBusquedaCal = TurnoDataService.obtenerNuevoCriterioBusquedaCal();
				var _criterioBusquedaConFecha = TurnoDataService.obtenerNuevoCriterioBusquedaConFechas();
				var _situacionesGralDia = AsignacionTurnoDataService.obtenerTodosSituacionGralDia();
				var _sucursalesConColor = SucursalDataService.getAllSucursalesConFiltro();
				var _criterioBusquedaDuracion = AsignacionTurnoDataService.obtenerNuevoCriterioBusquedaParaDuracionDto();

				$q.all([_criterioBusqueda, _criterioBusquedaCal,
					_situacionesGralDia, _sucursalesConColor, _criterioBusquedaConFecha, _criterioBusquedaDuracion
				])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {

					$log.debug("Inicializar ACTIVATE OK.-", pResults);

					//vm.data.tiposDeTurno = AsignacionTurnoLogicService.obtenerTiposDeTurnoFiltrado(pResults[0]);
					vm.data.criterioBusqueda = pResults[0];
					vm.data.criterioBusquedaCal = pResults[1];
					vm.data.situacionesGralDia = pResults[2];
					vm.data.sucursalesConAbrev = pResults[3];
					vm.data.sucursalesParaObservaciones = pResults[3];
					vm.data.criterioBusquedaFecha = pResults[4];
					vm.data.criterioBusquedaDuracionDto = pResults[5];

					vm.coloresEstadoTurno = AsignacionTurnoLogicService.getcoloresEstadoTurno();

					$timeout(function () {
						uiCalendarConfig.calendars.calendarAsignacionTurno.fullCalendar("render");
					}, 400);

					getStoredData();
					inicializarMenuOptions();

					//consulto si vengo desde algun lado con un idturno por buscar para reprogramar
					if ($stateParams.idTurnoToSearch !== 0) {
						//tengo turno desde otro state entonces cargo busqueda
						var _idTurno = angular.copy($stateParams.idTurnoToSearch);
						vm.reprogramacion.volver = true;
						vm.reprogramacion.idTurno = angular.copy(_idTurno);
						cargarBusquedaParaTurnoObtenido(vm.reprogramacion.idTurno);
					} else {
						vm.formControl.loading = false;
					}
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					$log.error("Inicializar ERROR.-", pError);
					AlertaService.NewError("Error", pError.message);
				}
			}

			function clickForm() {
				vm.data.showBuscadorPrestacion = false;
				//aca cierro el dropdown de prestaciones
				//consultarCuestionario();
			}
			//#endregion ACTIVATE

			/* ----------------------------------- BUSQUEDA PARA TURNO OBTENIDO-------------------------------------- */
			
			function busquedaParaSolicitudDeEstudios(solicitudes){

				var _servicio = {
					Id: solicitudes.IdServicioEfector,
					Nombre: solicitudes.NombreServicioEfector
				};

				var _tipoTurno = {
					Id: 5,
					Nombre: "Prácticas"
				};

				var _sucursal = {
					Id: 0,
					Nombre: "Todas"
				};

				vm.data.servicioMedico = angular.copy(_servicio);

				vm.formControl.cargarDatosPrestacion(vm.data.servicioMedico)
				.then(function (pResponse) {


						//para la reprogramacion cargo todos los tipos de turno
						//vm.data.tiposDeTurno[0] = angular.copy(_tipoTurno);

						

						vm.formControl.cargarSucursalesXServicio(vm.data.servicioMedico)
						.then(function (pResults) {

								//tenog que seleccionar en base a las solicitudes las prestaciones y buscar
								vm.data.tipoTurno = angular.copy(_tipoTurno);
								vm.formControl.filtrarPrestacionesPorTipoDeTurno();
								angular.forEach(solicitudes.ItemsSinTurno, function (solicitud) {
													
									vm.data.prestacionesObtenidas.find(x => x.Id == solicitud.IdPrestacionMedica).status = true;
									
								});

								setTimeout(() => {
									vm.data.sucursal = vm.data.sucursalesXServicio.find(x => x.Id === _sucursal.Id);		
									setearCriterioBusqueda();
								});
							

						});
				});
				
			}

			
			//region BUSQUEDA PARA TURNOS OBTENIDO
			function cargarBusquedaParaTurnoObtenido(pIdTurno) {

				vm.formControl.loading = true;
				vm.data.idTurnoToSearch = angular.copy(pIdTurno);
				$log.debug("turno obtendo id", pIdTurno);
				//obtengo datos del turno obtenido para precargar consulta
				TurnoDataService.getTurnoById(pIdTurno).then(
					function (pResults) {
						$log.debug("results turno obtenido", pResults);

						var turno = angular.copy(pResults);
						if (turno.Id !== 0) {
							////cargo preconsulta
							//cargo servicio
							//
							var _servicio = {
								Id: turno.IdServicio,
								Nombre: turno.Servicio
							};

							var _tipoTurno = {
								Id: turno.IdTipoTurno,
								Nombre: turno.TipoDeTurno
							};

							var _sucursal = {
								Id: turno.IdSucursal,
								Nombre: turno.Sucursal
							};

							var _recurso = {
								Id: turno.IdRecurso,
								Nombre: turno.Recurso,
								IdRecurso: turno.IdRecurso,
								IdTipoRecurso: turno.IdTipoRecurso
							};

							var _mutual = {
								IdPlanMutual: pResults.IdPlanMutual,
								IdMutual: pResults.IdMutual
							}

							vm.data.servicioMedico = angular.copy(_servicio);

							vm.formControl.cargarDatosPrestacion(vm.data.servicioMedico)
								.then(function (pResponse) {

									var pacientePorId = PacienteDataService.obtenerPacientePorIdSelector(turno.IdPaciente)
										.then(function (pPaciente) {
											$log.debug("paciente obtenido", pPaciente);
											if (pPaciente.Afiliaciones) {
												var _existeMutual = false;
												var _mutualPorDefecto = pPaciente.Afiliaciones.find(x => x.PorDefecto == true);
												angular.forEach(pPaciente.Afiliaciones, function (mutual) {
													if (mutual.IdMutual == _mutual.IdMutual && mutual.IdPlanMutual == _mutual.IdPlanMutual) {
														mutual.PorDefecto = true;
														_existeMutual = true;
													} else
														mutual.PorDefecto = false;
												});
												if (_existeMutual == false) {
													pPaciente.Afiliaciones.find(x => x.Id == _mutualPorDefecto.Id).PorDefecto = true;
												}
											}
											vm.data.paciente = angular.copy(pPaciente);

											vm.formControl.cargarSucursalesXServicio(vm.data.servicioMedico)
												.then(function (pResults) {

													//para la reprogramacion cargo todos los tipos de turno
													vm.data.tiposDeTurno[0] = angular.copy(_tipoTurno);

													vm.data.tipoTurno = angular.copy(_tipoTurno);

													//voy a buscar las prestaciones seleccionadas
													if (turno.ListaPrestacionesIDs && turno.ListaPrestacionesIDs.length) {
														vm.data.prestacionesObtenidas.forEach(pres => {
															pres.status = false;
														});
														turno.ListaPrestacionesIDs.forEach(prestacionDelTurno => {
															vm.data.prestacionesObtenidas.find(x => x.Id == prestacionDelTurno).status = true;
														});
													}
													vm.data.sucursal = vm.data.sucursalesConAbrev.find(x => x.Id === _sucursal.Id);
													vm.data.recurso = angular.copy(_recurso);
													vm.data.recursoReprogramacion = angular.copy(_recurso);

													// si tengo tipoRecursoSeleccionado == 3 || tipoRecursoSeleccionado == 2
													// tengo que cargar el profesional que atiende
													if (turno.IdTipoRecurso == 2 || turno.IdTipoRecurso == 3) {
														vm.data.showBuscadorPrestacion = false;
														vm.data.recursoAtiende = {
															Id: turno.IdProfesionalSolicitado,
															Nombre: "DEVALLIS JUAN PABLO",
															Matricula: turno.IdProfesionalSolicitado
														}
														vm.data.profesionalAtiendeReprogramacion = {
															recursoAtiende: angular.copy(vm.data.recursoAtiende),
															turno: angular.copy(turno)
														}
													}

													setearCriterioBusqueda();

												}, function (pError) {
													$log.error("error reprogramacion obtener sucursales", pError);
												})


										},
											function (pError) {
												$log.error("error paciente obtenido", pError);
											}
										);

								}, function (pError) {
									$log.error("error reprogramacion obener datos prestacion", pError);
								});


						} else {
							vm.formControl.loading = false;
							return;
						}
					},
					function (pError) {
						$log.error("pError turno obtenido", pError);
						vm.formControl.loading = false;
					}
				);
			}

			function afterBuscarRecursos() {
				$log.debug('afterBuscarRecursos...');
				if (vm.reprogramacion.volver) {
					vm.data.recurso = angular.copy(vm.data.recursoReprogramacion);

					//seteo el profesional atiende para los casos donde el turno tenga un profesional solicitado
					if (vm.data.profesionalAtiendeReprogramacion && vm.data.profesionalAtiendeReprogramacion.IdTipoRecurso) {
						if (vm.data.profesionalAtiendeReprogramacion.turno.IdTipoRecurso == 2 || vm.data.profesionalAtiendeReprogramacion.turno.IdTipoRecurso == 3) {
							vm.data.recursoAtiende = {
								Id: vm.data.profesionalAtiendeReprogramacion.turno.IdProfesionalSolicitado,
								Nombre: "DEVALLIS JUAN PABLO",
								Matricula: vm.data.profesionalAtiendeReprogramacion.turno.IdProfesionalSolicitado
							}
						}
					}

					// terrmino todo y busco
					buscar();
				}
			}

			function turnoAReprogamar(idTurno) {
				// $stateParams.idTurnoToSearch = angular.copy(idTurno);
				vm.reprogramacion.volver = false;
				vm.reprogramacion.idTurno = angular.copy(idTurno);
				cargarBusquedaParaTurnoObtenido(vm.reprogramacion.idTurno);
			}
			//endregion

			/* ---------------------------------------------- WATCHS  ----------------------------------------------- */
			//#region WATCHS

			$scope.$watch(function () {
				return vm.formControl.controlEdad;
			}, function (pNewVal) {
				limpiarGrillayCalendar();
			});

			$scope.$watch(function () {
				return vm.data.showBuscadorPrestacion;
			}, function (pNewVal) {
				if (!pNewVal && vm.data.servicioMedico) {
					//consultarCuestionario();
				}
			});

			$scope.$watch(function () {
				if (vm.data.paciente && vm.data.paciente.Afiliaciones) return vm.data.paciente.Afiliaciones;
				return null;
			}, function (pNewVal) {
				limpiarGrillayCalendar();
				showAlertaIsMutualActiva();
			}, true);

			$scope.$watch(function () {
				return vm.data.observacionesPlantilla;
			}, function (pNewVal) {
				$log.debug('cambie las observaciones de plantilla', pNewVal);
			});
			//#endregion WATCHS

			/* ------------------------------------------------- STORAGE -------------------------------------------------- */
			//region STORAGE

			vm.storageKeys = {
				keyAsignacion: "asignacion-turnos-config-data"
			}

			function getStoredData() {

				if (StorageService.existStoredObjects(vm.storageKeys.keyAsignacion)) {

					getData(StorageService.getStorageObj(vm.storageKeys.keyAsignacion));
				}
				function getData(stored) {
					if (stored.hasOwnProperty("Id")) {

						vm.optionsConfig = angular.copy(stored.optionsConfig);
					}
				}
			}

			function cleanStorage() {
				StorageService.cleanStorage(vm.storageKeys.keyAsignacion);
			}

			function setStoredData() {
				var asignacionStorageData = {
					optionsConfig: angular.copy(vm.optionsConfig)
				}
				StorageService.setStorageObj(vm.storageKeys.keyAsignacion, asignacionStorageData);

			}
			//endregion

		}
	};

	return module;
})();