/**
 * @author:			Pablo Pautasso
 * @description:	Plantilla Controller Modal View
 * @type:			Controller
 **/

import * as angular from 'angular';

export default (function () {
	'use strict';



	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PlantillaModalViewController', PlantillaModalViewController);

		PlantillaModalViewController.$inject = [
			'$location', 'Logger', '$timeout', '$q', '$filter', '$uibModalInstance', 'moment',
			'AlertaService', 'PlantillaDataService', 'TurnosCommonLogicService',
			'IdPlantilla', 'ServicioMedico', 'Recurso', 'uiCalendarConfig', 'SucursalDataService', 'PlantillaLogicService',
			'PrestacionGestionDataService'
		];

		function PlantillaModalViewController(
			$location, $log, $timeout, $q, $filter, $uibModalInstance, moment,
			AlertaService, PlantillaDataService, TurnosCommonLogicService,
			IdPlantilla, ServicioMedico, Recurso, uiCalendarConfig, SucursalDataService, PlantillaLogicService,
			PrestacionGestionDataService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PlantillaModalViewController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {

			};

			vm.data = {

				idPlantilla: IdPlantilla,
				plantillaServicio: ServicioMedico,
				plantillaRecurso: Recurso,
				plantilla: {},
				plantillaSelected: '',
				showLista: true,
				calendarView: true,
				sobreturnosFilter: true,
				tituloProfesional: '',
				prestacionesOpcionTodasDelRecurso: ''
			};

			vm.itemsPlantilla = {
				itemsCompleto: '',
				itemsSinSobreturnos: ''
			}

			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				ok: ok,
				changeItem: changeItem,
				getPrestacionesDefinidas: getPrestacionesDefinidas,
				getGrupoPrestacionesDefinidas: getGrupoPrestacionesDefinidas,
				abrirReglasDeTurnos: abrirReglasDeTurnos,
				exportarExcel: exportarExcel,
				exportarPdf: exportarPdf,
				mostrarSobreturnosChange: mostrarSobreturnosChange,
				verObservacion: verObservacion,
				cambiarVista: cambiarVista,
				clickVerItemPlantilla: clickVerItemPlantilla
			};

			vm.calendarSlot = {
				minTime: [],
				maxTime: []
			};

			vm.itemPlantilla = {
				itemSeleccionado: ''

			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			var
				sortByTimeAsc = function (lhs, rhs) {
					var results;

					results = lhs.hours() > rhs.hours() ? 1 : lhs.hours() < rhs.hours() ? -1 : 0;

					if (results === 0)
						results = lhs.minutes() > rhs.minutes() ? 1 : lhs.minutes() < rhs.minutes() ? -1 : 0;

					if (results === 0)
						results = lhs.seconds() > rhs.seconds() ? 1 : lhs.seconds() < rhs.seconds() ? -1 : 0;

					return results;
				},
				sortByTimeDesc = function (lhs, rhs) {
					var results;

					results = lhs.hours() < rhs.hours() ? 1 : lhs.hours() > rhs.hours() ? -1 : 0;

					if (results === 0)
						results = lhs.minutes() < rhs.minutes() ? 1 : lhs.minutes() > rhs.minutes() ? -1 : 0;

					if (results === 0)
						results = lhs.seconds() < rhs.seconds() ? 1 : lhs.seconds() > rhs.seconds() ? -1 : 0;

					return results;
				};


			function ok() {

				$uibModalInstance.close('cancel');

			}

			function setearRangoCalendar() {

				//seteando rango de calendario
				//Primero ordenamos los horarios disponibles
				$log.debug('rango de horarios mintime', vm.calendarSlot.minTime);
				$log.debug('rango de horarios maxtime', vm.calendarSlot.maxTime);

				vm.calendarSlot.minTime.sort(sortByTimeAsc);
				vm.calendarSlot.maxTime.sort(sortByTimeDesc);

				$log.debug('rango de horarios mintime', vm.calendarSlot.minTime);
				$log.debug('rango de horarios maxtime', vm.calendarSlot.maxTime);

				var tiempoMinimo = angular.copy(vm.calendarSlot.minTime[0]);
				var tiempoMaximo = angular.copy(vm.calendarSlot.maxTime[0]);

				tiempoMaximo.add(20, 'minutes').format('HH:mm');
				tiempoMinimo.subtract(20, 'minutes').format('HH:mm');

				vm.uiConfig.calendarView.minTime = tiempoMinimo.format('HH:mm');
				vm.uiConfig.calendarView.maxTime = tiempoMaximo.format('HH:mm');


				if (vm.calendarSlot.maxTime[0].diff(vm.calendarSlot.minTime[0], 'hours') <= 3) {
					vm.uiConfig.calendarView.slotDuration = '00:15:00';
				} else if (vm.calendarSlot.maxTime[0].diff(vm.calendarSlot.minTime[0], 'hours') < 5) {
					vm.uiConfig.calendarView.slotDuration = '00:20:00';
				} else if (vm.calendarSlot.maxTime[0].diff(vm.calendarSlot.minTime[0], 'hours') > 8) {
					vm.uiConfig.calendarView.slotDuration = '00:30:00';
				}


			}

			function setearFinDeSemanaCalendar(estadoFinde) {
				vm.uiConfig.calendarView.weekends = estadoFinde;
			}


			function setearCalendario() {

				var findeSemana = false;

				vm.data.plantilla.FechaDesde =
					angular.copy(moment(new Date(vm.data.plantilla.FechaDesde), "mm/dd/yyyy").format('DD/MM/YYYY'));
				vm.data.plantilla.FechaHasta =
					angular.copy(moment(new Date(vm.data.plantilla.FechaHasta), "mm/dd/yyyy").format('DD/MM/YYYY'));

				if (vm.data.plantilla.Id !== 0) {

					vm.uiConfig.calendarView.events.length = 0;
					
					var eventsLoad = angular.copy(vm.data.plantilla.Items);

					angular.forEach(eventsLoad, function (value, key) {

						$log.debug('event load', value);
						value.start = moment(value.HoraDesde, 'HH:mm').day(value.IdDia).week(moment().week());
						value.end = moment(value.HoraHasta, 'HH:mm').day(value.IdDia).week(moment().week());
						value.title = vm.data.plantilla.Recurso;
						value.IdEvent = key;
						value.allDay = false;
						value.nombreTipoTurno = angular.copy(value.TipoTurno);
						value.title = angular.copy(value.Sucursal);

						value.nombreTipoPrestacionesAsignables = angular.copy(value.TipoPrestacionesAsignables);
						if(value.GrupoDePrestacionesAsignables && value.GrupoDePrestacionesAsignables.length){
							value.nombreTipoPrestacionesAsignables = value.nombreTipoPrestacionesAsignables + ": " + vm.formControl.getGrupoPrestacionesDefinidas(value);
							
						}
						if(value.PrestacionesAsignables && value.PrestacionesAsignables.length){
							value.nombreTipoPrestacionesAsignables = value.nombreTipoPrestacionesAsignables + ": " + vm.formControl.getPrestacionesDefinidas(value);
						}
						if (value.Sexo === "") value.Sexo = "AMBOS";

						value.SucursalColor = vm.data.sucursales.find(x => x.Id === value.IdSucursal).Color || "";

						vm.uiConfig.calendarView.events.push(value);

						//agrego horarios de start y end para manejo de slot de calendario
						vm.calendarSlot.minTime.push(value.start);
						vm.calendarSlot.maxTime.push(value.end);

						if (value.IdDia === 6 || value.IdDia === 7) findeSemana = true;

						if (value.IdSucursal === 1) {
							value.backgroundColor = 'rgba(67, 123, 146, 0.94)';
						} else if (value.IdSucursal === 2) {
							value.backgroundColor = 'rgb(29, 138, 29)';
						}

						if (value.EsSobreTurno) {
							value.backgroundColor = 'rgba(221, 29, 29, 0.74)';
						}

						var filtroSexoEdad = "";
						if (value.Sexo !== "") {
							filtroSexoEdad = "Sexo: " + value.Sexo + " ";
						}
						if (value.EdadMaxima !== 0 || value.EdadMinima !== 0) {
							filtroSexoEdad = filtroSexoEdad + "Edad: " + value.EdadMinima + " - " + value.EdadMaxima + " años";
						}
						value.FiltroSexoEdad = angular.copy(filtroSexoEdad);
						
						if (value.VisibleAutogestionWeb) value.VisibleAutogestionWebTexto = "SI"; else value.VisibleAutogestionWebTexto = "NO";


					});
					vm.itemsPlantilla.itemsCompleto = angular.copy(vm.uiConfig.calendarView.events);

					setearRangoCalendar();
					setearFinDeSemanaCalendar(findeSemana);


				}

				$timeout(function () {
					uiCalendarConfig.calendars.calendarPlantillaView.fullCalendar('render');
				});
			}

			function obtenerPlantillaDetalle(idPlantilla) {

				vm.formControl.loading = true;

				var _sucursales = SucursalDataService.obtenerTodasSinExcepciones();
				var plantillaToGet = PlantillaDataService.getOneConDetallePrestaciones(idPlantilla, true);

				$q.all([plantillaToGet, _sucursales])

					.then(function (pResult) {

						$log.debug('obtenerPlantilla Ok', pResult);
						vm.data.sucursales = pResult[1];
						vm.data.plantilla = pResult[0];
						angular.forEach(vm.data.plantilla.Items, function (item) {
							item.SucursalColor = vm.data.sucursales.find(x => x.Id === item.IdSucursal).Color || "";
							if (item.VisibleAutogestionWeb) item.VisibleAutogestionWebTexto = "SI"; else item.VisibleAutogestionWebTexto = "NO";
							if (item.EsSobreTurno) item.ST = "S";

						})
						
						
						var _sucursalesHabilitadas = SucursalDataService.obtenerSucursalXRecursoXServicio(vm.data.plantilla.IdRecurso,
							vm.data.plantilla.IdTipoRecurso, vm.data.plantilla.IdServicio)
							.then(function (pResult) {
								vm.data.sucursalesHabilitadas = pResult;
								setearCalendario();
								vm.formControl.loading = false;
						}, function () {
							vm.formControl.loading = false;
						})


					}, function (pError) {
						vm.formControl.loading = false;
						$log.error('obtenerPlantilla Error', pError);
					});

			}

			function changeItem(itemLista) {


				$log.debug('itemClick', itemLista);
				obtenerPlantillaDetalle(itemLista.Id);
				vm.itemPlantilla.itemSeleccionado = angular.copy(itemLista);

			}

			function getPrestacionesDefinidas(itemSeleccionado) {
				var ret = '';

				angular.forEach(itemSeleccionado.PrestacionesAsignables, function (prestacion, key) {
					if (key + 1 === itemSeleccionado.PrestacionesAsignables.length)
						ret = ret + prestacion.Prestacion;
					else ret = ret + prestacion.Prestacion + ' - ';

				});
				return ret;
			}

			function getGrupoPrestacionesDefinidas(itemSeleccionado) {
				var ret = '';
				angular.forEach(itemSeleccionado.GrupoDePrestacionesAsignables, function (prestacion, key) {
					if (key + 1 === itemSeleccionado.GrupoDePrestacionesAsignables.length) { 
						ret = ret + prestacion.GrupoDePrestaciones;
						if (prestacion.Prestaciones && prestacion.Prestaciones.length) { 
							ret = ret + '(';
;							angular.forEach(prestacion.Prestaciones, function (_prestacionGrupo, key) {
								ret = ret + _prestacionGrupo + ','
							});
							ret = ret + ')';
						}
					}
					else ret = ret + prestacion.GrupoDePrestaciones + ' - ';

				});
				return ret;
			}

			function abrirReglasDeTurnos() {
				$log.debug('abrirReglasDeTurnos');
				if (vm.data.plantillaLista) {

					PlantillaLogicService.abrirReglasDeTurnos(vm.data.plantillaLista[0].IdServicio,
						vm.data.plantillaLista[0].IdRecurso, vm.data.plantillaLista[0].IdTipoRecurso)
				} else if (vm.data.plantilla) {

					PlantillaLogicService.abrirReglasDeTurnos(vm.data.plantilla.IdServicio,
						vm.data.plantilla.IdRecurso, vm.data.plantilla.IdTipoRecurso)
				}

			}

			function exportarExcel() {
				$log.debug('exportar excel');

				var idPlantilla = vm.data.plantilla.Id;

				PlantillaDataService.exportarExcel(idPlantilla);
			}

			function exportarPdf() {
				$log.debug('exportar pdf');

				var idPlantilla = vm.data.plantilla.Id;

				PlantillaDataService.exportarPdf(idPlantilla);
			}

			function mostrarSobreturnosChange() {

				if (vm.data.sobreturnosFilter) {
					//muestro sobreturnos
					vm.uiConfig.calendarView.events = angular.copy(vm.itemsPlantilla.itemsCompleto);
				} else {
					// oculto sobreturnos
					vm.itemsPlantilla.itemsSinSobreturnos = vm.itemsPlantilla.itemsCompleto.filter(x => x.EsSobreTurno === false);
					vm.uiConfig.calendarView.events = angular.copy(vm.itemsPlantilla.itemsSinSobreturnos);
				}

			}


			function verObservacion(observacion) {

				vm.data.Observaciones = {
					observacionToShow: '',
					observacionConTags: angular.copy(observacion)
				}

				TurnosCommonLogicService.openObservacionesPorSucursal(vm.data.Observaciones, vm.data.sucursalesHabilitadas, true, false);
			}


			function cambiarVista() {
				$log.debug('cambie de vista');
				delete vm.data.plantillaSelected;
			}

			function clickVerItemPlantilla(item) {
				vm.data.plantillaSelected = angular.copy(item);
				obtenerPrestacionesRecursoItemPlantilla();
			}

			function obtenerPrestacionesRecursoItemPlantilla() { 
				if (vm.data.plantillaSelected && vm.data.plantillaSelected.IdTipoPrestacionesAsignables == 3) { 
					//tengo todas las del recurso
					vm.data.prestacionesOpcionTodasDelRecurso = '';
					let _obtenerPorSucursalRecurso = PrestacionGestionDataService.obtenerPorRecursoServicioSucursal(vm.data.plantilla.IdTipoRecurso,
						vm.data.plantilla.IdRecurso, vm.data.plantilla.IdServicio, vm.data.plantillaSelected.IdSucursal)
						.then(function (pResult) {
							angular.forEach(pResult, function (prestacion, key) {
								if (key + 1 === pResult.length)
									vm.data.prestacionesOpcionTodasDelRecurso = vm.data.prestacionesOpcionTodasDelRecurso + '• ' + prestacion.Nombre;
								else vm.data.prestacionesOpcionTodasDelRecurso = vm.data.prestacionesOpcionTodasDelRecurso + '• ' + prestacion.Nombre + '\r\n';

							});
							
						$log.debug('pResult',pResult);
					}, function (pError) {
						$log.error('pError',pError);
					});

				}
			}
			/* ---------------------------------------------- CALENDAR ---------------------------------------------- */


			vm.uiConfig = {

				calendarView: {
					schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
					//height: 'auto',
					height: 'auto',
					defaultView: 'agendaWeek',
					ignoreTimezone: false,
					timezone: 'local',
					firstDay: 1,
					editable: false,
					allDaySlot: false,
					slotDuration: '00:30:00',
					slotLabelInterval: 30,
					slotMinutes: 30,
					columnFormat: 'dddd',
					timeFormat: 'HH:mm',
					axisFormat: 'HH:mm',
					weekends: false,
					minTime: '06:00',
					maxTime: '12:00',
					//event overlap
					eventOverlap: true,

					selectable: false,
					currentDay: false,
					///custom buttons
					customButtons: {
						myCustomButton: {
							text: 'Sab/Dom',
							click: function () {
								vm.uiConfig.calendarView.weekends = !vm.uiConfig.calendarView.weekends;
								$timeout(function () {
									uiCalendarConfig.calendars.calendarPlantillaView.fullCalendar('render');
								});
							}
						},

						zoom0: {
							text: 'Slot cada 30 min',
							click: function () {
								vm.uiConfig.calendarView.slotDuration = '00:30:00';
								scrollScheduler();
							}
						},

						zoom20: {
							text: 'Slot cada 20 min',
							click: function () {
								vm.uiConfig.calendarView.slotDuration = '00:20:00';
								scrollScheduler();
							}
						},
						zoom50: {
							text: 'Slot cada 10 min',
							click: function () {
								vm.uiConfig.calendarView.slotDuration = '00:10:00';
								scrollScheduler();
							}
						},
						zoom80: {
							text: 'Slot cada 5 min',
							click: function () {
								vm.uiConfig.calendarView.slotDuration = '00:05:00';
								scrollScheduler();
							}
						},
						zoom100: {
							text: 'Slot cada 2 min',
							click: function () {
								vm.uiConfig.calendarView.slotDuration = '00:02:00';
								scrollScheduler();
							}
						}
					},

					header:  {
						left: '',
						center: 'zoom0, zoom20, zoom50, zoom80, zoom100',
						right: 'myCustomButton'
					},
					eventClick: function (calEvent, jsEvent, view) {

						$log.error('event click', calEvent);
						vm.data.plantillaSelected = angular.copy(calEvent);
						obtenerPrestacionesRecursoItemPlantilla();
					},
					events: [],
					select: function (start, end, jsEvent, view, resource) {


					},
					eventRender: function (event, element) {

						if (event.IdTipoTurno === 4 ){

							element.find('.fc-time').attr('style', 'font-size: 1.55em !important; background: #ba2d65');

						}else {
							element.find('.fc-time').attr('style', 'font-size: 1.55em !important');

						}

						if (event.EsSobreTurno) {
							element.find('.fc-title').append("<br/> SOBRETURNO");

						} else {

							element.find('.fc-title').append("<br/> TIPO: " + event.nombreTipoTurno);

							element.find('.fc-title').append("<br/> DURACION: " + event.DuracionMinima + " minutos");
							//consulto si las prestaciones son definidas y las arreglo
							//
							if (event.IdTipoPrestacionesAsignables === 4) {

								var strPrestacionesAsignables = '';
								angular.forEach(event.PrestacionesAsignables, function (prestacion, key) {
									if (key + 1 === event.PrestacionesAsignables.length)
										strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.Prestacion;
									else strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.Prestacion + ' <br/> ';

								});

								element.find('.fc-title').append("<br/> PRESTACIONES: " + '<br/>' + strPrestacionesAsignables);
							} else if (event.IdTipoPrestacionesAsignables === 5) {
								var strPrestacionesAsignables = '';
								angular.forEach(event.GrupoDePrestacionesAsignables, function (prestacion, key) {
									if (key + 1 === event.GrupoDePrestacionesAsignables.length) { 
										strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.GrupoDePrestaciones;
										if (prestacion.Prestaciones && prestacion.Prestaciones.length) { 
											strPrestacionesAsignables = strPrestacionesAsignables + '(';
;											angular.forEach(prestacion.Prestaciones, function (_prestacionGrupo, key) {
												strPrestacionesAsignables = strPrestacionesAsignables + _prestacionGrupo + ','
											});
											strPrestacionesAsignables = strPrestacionesAsignables + ')';
										}
									}
									else strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.GrupoDePrestaciones + ' <br/> ';

								});

								element.find('.fc-title').append("<br/> GRUPO PRESTACION: " + '<br/>' + strPrestacionesAsignables);
							} else
								element.find('.fc-title').append("<br/> PRESTACIONES: " + event.nombreTipoPrestacionesAsignables);

							if (!angular.isUndefined(event.SalaEspera))
								element.find('.fc-title').append("<br/> SALA: " + event.SalaEspera);
							if (!angular.isUndefined(event.Consultorio))
								element.find('.fc-title').append("<br/> CONSULTORIO: " + event.Consultorio);
							if (event.VisibleAutogestionWeb)
								element.find('.fc-title').append("<br/> VISIBLE AUTOGESTION: SI");
							else element.find('.fc-title').append("<br/> VISIBLE AUTOGESTION: NO");


							if (event.Sexo !== "AMBOS") {

								element.find('.fc-title').append("<br/> SEXO: " + event.Sexo);
							}
							if (event.EdadMaxima !== 0 || event.EdadMinima !== 0)
								element.find('.fc-title').append("<br/> EDAD: " + event.EdadMinima + " - " + event.EdadMaxima + " años");
							if (event.Cupo !== 1)
								element.find('.fc-title').append("<br/> CUPO: " + event.Cupo);
								
								$log.debug('VER EL EVENT: '+ event.IdTipoRecurso);
							// si es aparato o recurso muestro el profesional Atiende 	
							//if (event.IdTipoRecurso === 2 || event.IdTipoRecurso === 3) {
								element.find('.fc-title').append("<br/> PROFESIONAL: " +(event.ProfesionalAtiende ? event.ProfesionalAtiende : "SIN PROFESIONAL")) ;
								vm.data.tituloProfesional = event.ProfesionalAtiende  ? "PROFESIONAL" : "";
							//}
								

						}


					}
				}
			};

			function scrollScheduler() {
				if (vm.uiConfig.calendarView.events && vm.uiConfig.calendarView.events.length > 0){
					var _timeEnd = angular.copy(vm.uiConfig.calendarView.events[vm.uiConfig.calendarView.events.length - 1].start);
					vm.uiConfig.calendarView.scrollTime = moment.duration(_timeEnd.subtract(20, 'm').format('HH:mm:ss'));
				}else {
					vm.uiConfig.calendarView.scrollTime = moment.duration(moment().subtract(20, 'm').format('HH:mm:ss'));
				}
				calendarRender();
			}

			function calendarRender() {
				$timeout(function () {
					uiCalendarConfig.calendars.calendarPlantillaView.fullCalendar('render');
				}, 200);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				$log.debug('vm.data.plantillaID', vm.data.idPlantilla);
				var _plantilla;

				if (vm.data.idPlantilla !== 0) {
					vm.data.showLista = false;
					obtenerPlantillaDetalle(vm.data.idPlantilla);

				} else if (vm.data.plantillaRecurso !== null && vm.data.plantillaServicio !== null) {
					//tengo que buscar para muchas plantillas entonces busco con recurso y servico y fecha
					var fechaDesde = moment().format("MM-DD-YYYY");
					var fechaHasta = moment().add(6, 'M').format("MM-DD-YYYY");

					_plantilla = PlantillaDataService.obtenerEnRangoDeFecha(vm.data.plantillaServicio.Id,
						vm.data.plantillaRecurso.IdTipoRecurso, vm.data.plantillaRecurso.IdRecurso || vm.data.plantillaRecurso.Id, fechaDesde,
						fechaHasta, "2");

					var _sucursales = SucursalDataService.obtenerTodasSinExcepciones();
					var _sucursalesHabilitadas = SucursalDataService.obtenerSucursalXRecursoXServicio(vm.data.plantillaRecurso.Id,
						vm.data.plantillaRecurso.IdTipoRecurso, vm.data.plantillaServicio.Id);


					$q.all([_plantilla, _sucursales, _sucursalesHabilitadas])
						.then(successCallback, errorCallback);
				}


				function successCallback(pResults) {
					// variable = pResult[0];

					vm.data.plantillaLista = pResults[0];
					vm.data.sucursales = pResults[1];
					
					vm.data.sucursalesHabilitadas = pResults[2];


					if (vm.data.plantillaLista && vm.data.plantillaLista.length > 0) {
						obtenerPlantillaDetalle(vm.data.plantillaLista[0].Id);
						vm.itemPlantilla.itemSeleccionado = angular.copy(vm.data.plantillaLista[0]);
					}else {
						AlertaService.NewWarning("Atención", "No hay plantillas disponibles.")
						ok();
					}

					vm.formControl.loading = false;
					$log.debug('Inicializar OK.-', pResults);

				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					
				}
			}

		}
	};

	return module;
})();