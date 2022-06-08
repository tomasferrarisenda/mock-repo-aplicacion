/**
 * @author:			Pablo Pautasso
 * @description:	controller para la edicion de items de plantilla
 * @type:			Controller
 **/
import * as angular from 'angular';
import { ISucursalDataService } from '../../../support/basic/services';


export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PlantillaEditController', PlantillaEditController);

		PlantillaEditController.$inject = [
			'Logger', '$q', '$timeout', '$state', '$scope', '$stateParams', 'moment',
			'SucursalDataService', 'TurnosStorageHelperService', 'AlertaService', 'StateHelperService',
			'User', 'AlertaService', 'ModalService', 'TurnosCommonLogicService',
			'PlantillaLogicService', 'PlantillaDataService', 'uiCalendarConfig', 'PlantillaAuthService'
		];

		function PlantillaEditController(
			$log, $q, $timeout, $state, $scope, $stateParams, moment,
			SucursalDataService: ISucursalDataService, TurnosStorageHelperService, AlertaviewService, StateHelperService,
			User, AlertaService, ModalService, TurnosCommonLogicService,

			PlantillaLogicService, PlantillaDataService, uiCalendarConfig, PlantillaAuthService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PlantillaEditController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();


			vm.data = {
				vistaModoCalendario: true,
				plantillaItem: {},
				plantilla: {},
				recurso: $stateParams.recurso,
				servicioMedico: $stateParams.servicio,
				plantillaEdit: $stateParams.plantillaEdit,
				reglasDeTurnos: {},
				reglasDeSobreTurnos: {},
				Observaciones: {
					observacionToShow: '',
					observacionConTags: '',
				},
				ObservacionesPortal: {
					observacionToShow: '',
					observacionConTags: '',
				},
				zoomState: 0
			};

			vm.title = {
				page: "Items de plantilla: " + vm.data.recurso.Nombre
			};
			vm.formData = {};

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				cancel: volver,
				ok: guardar,

				listaDuracionesDeTurno: listaDuracionesDeTurno,
				listaReglasDeTurno: listaReglasDeTurno,

				nuevoSobreturno: nuevoSobreturno,
				modalEditarObservacion: modalEditarObservacion
			};

			vm.accionesSobreItems = {
				editarItem: editarItem,
				eliminarItem: eliminarItem
			};

			vm.validar = {
				error: validarError
			};

			vm.storage = {
				keyToStorage: "turnos-plantilla-editcontroller-data"
			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};


			vm.coloresCalendarEvents = [{
				nombre: 'Sucursal Nueva Cordoba',
				color: 'color-celeste-sucursales'
			}, {
				nombre: 'Sucursal Cerro',
				color: 'color-verde-sucursales'
			}, {
				nombre: 'Sobreturno',
				color: 'color-rojo-turno'
			}];


			/**
			 * menu options: opciones para click derecho sobre el calendar de items
			 * en este caso tenemos una sola opcion: copiar dia
			 * levanta modal con dos columnas con dias con eventos y dias que no
			 */
			vm.menuContextualCalendar = [
				// NEW IMPLEMENTATION
				{
					text: 'Copiar dia',
					click: function ($itemScope, $event, modelValue, text, $li) {

						$log.debug('click copiar dia', $itemScope);
						if (vm.uiConfig.calendar.events.length !== 0) {

							//levanto modal de seleccionar dia para copir
							PlantillaLogicService.openItemCopiarPlantilla(vm.uiConfig.calendar.events)
								.then(function (pResult) {

									//recibo items copiados
									$log.debug('items copiados OK-', pResult);
									vm.uiConfig.calendar.events = angular.copy(pResult);

									angular.forEach(vm.uiConfig.calendar.events, function (evt, key) {

										if (evt.IdDia === 6 || evt.IdDia === 0) {
											vm.uiConfig.calendar.weekends = true;
										}
									});

									generarItemsDePlantillaConEventosDelCalendario();

									calendarRender();

								}, function (pError) {

									$log.error('items copiados Error-', pError);
								});
						} else AlertaService.NewWarning("Alerta", "La plantilla no tiene items para copiar");

					}
				}
			];

			/**
			 * menu options: opciones para click derecho sobre la tabla de Items			 
			 */
			vm.menuContextualTabla = [
				// Nuevo
				{
					text: 'Nuevo item',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('Nuevo item (menu contextual)', $itemScope);
						nuevoItemSobreGrilla();
					}
				},

				// Nuevo item (Sobreturno)
				{
					text: 'Nuevo item (Sobreturno)',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('Nuevo item (Sobreturno)', $itemScope);
						nuevoSobreturno();
					}
				},

				// Editar
				{
					text: 'Editar',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('Editar item (menu contextual)', $itemScope);
						editarItem($itemScope.item);
					}
				},

				// Eliminar
				{
					text: 'Eliminar',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('Eliminar', $itemScope);
						eliminarItem($itemScope.item);
					}
				},

				// Copiar día
				{
					text: 'Copiar dia',
					click: function ($itemScope, $event, modelValue, text, $li) {

						$log.debug('click copiar dia', $itemScope);
						if (vm.uiConfig.calendar.events.length !== 0) {
							//levanto modal de seleccionar dia para copir
							PlantillaLogicService.openItemCopiarPlantilla(vm.uiConfig.calendar.events)
								.then(function (pResult) {

									//recibo items copiados
									$log.debug('items copiados OK-', pResult);
									vm.uiConfig.calendar.events = angular.copy(pResult);

									angular.forEach(vm.uiConfig.calendar.events, function (evt, key) {

										if (evt.IdDia === 6 || evt.IdDia === 0) {
											vm.uiConfig.calendar.weekends = true;
										}
									});
									generarItemsDePlantillaConEventosDelCalendario();
									calendarRender();

								}, function (pError) {

									$log.error('items copiados Error-', pError);
								});
						} else AlertaService.NewWarning("Alerta", "La plantilla no tiene items para copiar");
					}
				}
			];

			vm.menuContextualCalendar = [
				// NEW IMPLEMENTATION
				{
					text: 'Copiar dia',
					click: function ($itemScope, $event, modelValue, text, $li) {

						$log.debug('click copiar dia', $itemScope);
						if (vm.uiConfig.calendar.events.length !== 0) {

							//levanto modal de seleccionar dia para copir
							PlantillaLogicService.openItemCopiarPlantilla(vm.uiConfig.calendar.events)
								.then(function (pResult) {

									//recibo items copiados
									$log.debug('items copiados OK-', pResult);
									vm.uiConfig.calendar.events = angular.copy(pResult);

									angular.forEach(vm.uiConfig.calendar.events, function (evt, key) {

										if (evt.IdDia === 6 || evt.IdDia === 0) {
											vm.uiConfig.calendar.weekends = true;
										}
									});

									generarItemsDePlantillaConEventosDelCalendario();

									calendarRender();

								}, function (pError) {

									$log.error('items copiados Error-', pError);
								});
						} else AlertaService.NewWarning("Alerta", "La plantilla no tiene items para copiar");

					}
				}
			];


			vm.menuContextualObservacionInterna = [
				{
					text: 'Editar Observacion Para Turnos',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('Editar Observacion Para Turnos');
						modalEditarObservacion(1);
					}
				}
			];

			vm.menuContextualObservacionPortal = [
				{
					text: 'Editar Observaciones para Portal Pac.',
					click: function ($itemScope, $event, modelValue, text, $li) {
						$log.debug('Editar Observaciones para Portal Pac.');
						modalEditarObservacion(2);
					}
				}
			];

			function modalEditarObservacion(observacionTipo) {

				var _data = 0;
				if (observacionTipo == 1) {
					_data = angular.copy(vm.data.Observaciones);
				} else if (observacionTipo == 2) _data = angular.copy(vm.data.ObservacionesPortal);

				//levantamos el componente por sucursales
				TurnosCommonLogicService.openObservacionesPorSucursal(_data, vm.data.sucursalesHabilitadas, false, true)
				.then(function (pResult) {
					$log.debug('result obsercaciones',pResult);
					if (observacionTipo == 1) {

						vm.data.Observaciones = {
							observacionToShow : angular.copy(pResult.observacionToShow),
							observacionConTags: angular.copy(pResult.observacionConTags)
						}
						
					} else if (observacionTipo == 2) {

						vm.data.ObservacionesPortal = {
							observacionToShow: angular.copy(pResult.observacionToShow),
							observacionConTags: angular.copy(pResult.observacionConTags)
						}
						
					}
				}, function (pError) {
					$log.error('error observaciones',pError);
				});

		
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			function validarError(pBool) {
				if (!pBool) {
					return 'error';
				}
				return;
			}

			function volver() {

				//voy a consultar si quiero guardar la plantilla
				//solamente si es que tengo items sin guardar
				if (vm.uiConfig.calendar.events.length > 0){

					ModalService.confirmSave("Desea guardar los cambios?")
					.then(function (result) {
						if(result){
							$log.debug('voy a guardar');
							guardar();
						} else {
							$log.debug('NOOOOOM voy a guardar');
							cleanStorage();
							StateHelperService.goToPrevState();
						}
					});

				}else {
					salir();
				}

				function salir() {
					
					cleanStorage();
					StateHelperService.goToPrevState();
				}
			}

			$scope.$watch(function () {
				return vm.data.vistaModoCalendario;
			}, function (newValue, oldValue) {
				if (newValue) {
					calendarRender();
				}
			});

			function generarItemsDePlantillaConEventosDelCalendario() {
				// Resumen: Tomas los eventos del control calendario y regenera la lista de items de la Plantilla que se usa para grabar y en
				// la vista opcional modo tabla (lista de items de la plantilla)

				vm.data.plantillaNuevo.Items.length = 0;

				angular.forEach(vm.uiConfig.calendar.events, function (value, key) {
					$log.debug('events', value, key);

					var item: any = {};

					item.Id = angular.copy(value.Id);
					item.IdEvent = angular.copy(value.IdEvent);

					item.Cupo = angular.copy(value.Cupo);
					item.DuracionMinima = angular.copy(value.DuracionMinima);
					item.EdadMaxima = angular.copy(value.EdadMaxima);
					item.EdadMinima = angular.copy(value.EdadMinima);

					item.HoraDesde = value.start.format('HH:mm');
					item.HoraHasta = value.end.format('HH:mm');

					item.IdTipoPrestacionesAsignables = angular.copy(value.IdTipoPrestacionesAsignables);
					item.TipoPrestacionesAsignables = angular.copy(value.TipoPrestacionesAsignables);

					if (item.IdTipoPrestacionesAsignables === 4) {

						var strPrestacionesAsignables = '';

						angular.forEach(value.PrestacionesAsignables, function (prestacion, key) {
							if (key + 1 === value.PrestacionesAsignables.length) {
								strPrestacionesAsignables = strPrestacionesAsignables + prestacion.Prestacion;
							} else {
								strPrestacionesAsignables = strPrestacionesAsignables + prestacion.Prestacion + ' / ';
							}
						});

						item.TipoPrestacionesAsignablesCompleto = item.TipoPrestacionesAsignables + ': ' + strPrestacionesAsignables;

					}else if(item.IdTipoPrestacionesAsignables === 5){
						//tengo grupos de prestaciones asignables
						var strPrestacionesAsignables = '';

						angular.forEach(value.GrupoDePrestacionesAsignables, function (prestacion, key) {
							if (key + 1 === value.GrupoDePrestacionesAsignables.length) {
								strPrestacionesAsignables = strPrestacionesAsignables + prestacion.GrupoDePrestaciones;
							} else {
								strPrestacionesAsignables = strPrestacionesAsignables + prestacion.GrupoDePrestaciones + ' / ';
							}
						});

						item.TipoPrestacionesAsignablesCompleto = item.TipoPrestacionesAsignables + ': ' + strPrestacionesAsignables;

					} else {
						item.TipoPrestacionesAsignablesCompleto = item.TipoPrestacionesAsignables;
					}

					item.IdTipoTurno = angular.copy(value.IdTipoTurno);
					item.TipoTurno = angular.copy(value.nombreTipoTurno);

					if (value.EsSobreTurno) {
						item.ST = "S";
					}

					item.IdSexo = angular.copy(value.IdSexo);

					item.Dia = value.start.format('dddd');
					item.IdDia = value.start.day();
					if (item.IdDia === 0) item.IdDia = 7;

					//seteamos el sexo con "M" o "F" o "" para ambos					
					item.Sexo = value.Sexo.substr(0, 1);
					if (item.Sexo === "A") item.Sexo = "";

					if (value.EsSobreTurno)
						item.EsSobreTurno = true;
					else item.EsSobreTurno = false;

					item.PrestacionesAsignables = angular.copy(value.PrestacionesAsignables);
					item.GrupoDePrestacionesAsignables = angular.copy(value.GrupoDePrestacionesAsignables);

					item.IdSucursal = angular.copy(value.IdSucursal);
					item.Sucursal = angular.copy(value.title);
					item.SucursalColor = vm.data.sucursales.find(x => x.Id === item.IdSucursal).Color || "";

					item.IdSalaEspera = angular.copy(value.IdSalaEspera);
					item.SalaEspera = angular.copy(value.SalaEspera);
					item.IdConsultorio = angular.copy(value.IdConsultorio);
					item.Consultorio = angular.copy(value.Consultorio);
					item.VisibleAutogestionWeb = angular.copy(value.VisibleAutogestionWeb);
					item.IdProfesionalAtiende = angular.copy(value.IdProfesionalAtiende);
					item.ProfesionalAtiende  = angular.copy(value.ProfesionalAtiende);

					var filtroSexoEdad = "";
					if (item.Sexo !== "") {
						filtroSexoEdad = "Sexo: " + item.Sexo + " ";
					}

					if (item.EdadMaxima !== 0 || item.EdadMinima !== 0) {
						filtroSexoEdad = filtroSexoEdad + "Edad: " + item.EdadMinima + " - " + item.EdadMaxima + " años";
					}
					item.FiltroSexoEdad = filtroSexoEdad;

					if (item.VisibleAutogestionWeb) item.VisibleAutogestionWebTexto = "SI"; else item.VisibleAutogestionWebTexto = "NO";

					vm.data.plantillaNuevo.Items.push(item);

				});

				$log.debug("ITEMS de Plantilla: ", vm.data.plantillaNuevo.Items);
			}

			//Guardar button
			//
			function guardar() {


				//seteo para guardar nuevos items
				// vm.data.plantillaNuevo.Items.length = 0;

				vm.data.plantillaNuevo.Observaciones = angular.copy(vm.data.Observaciones.observacionConTags);
				vm.data.plantillaNuevo.ObservacionesPortal = angular.copy(vm.data.ObservacionesPortal.observacionConTags);

				vm.data.plantillaNuevo.FechaDesde = moment(vm.data.fechaDesde).format("MM-DD-YYYY");
				vm.data.plantillaNuevo.FechaHasta = moment(vm.data.fechaHasta).format("MM-DD-YYYY");

				vm.data.plantillaNuevo.IdRecurso = angular.copy(vm.data.recurso.Id);
				vm.data.plantillaNuevo.IdTipoRecurso = angular.copy(vm.data.recurso.IdTipoRecurso);

				vm.data.plantillaNuevo.IdServicio = angular.copy(vm.data.servicioMedico.Id);

				$log.debug('vm.data.plantillaNuevo', vm.data.plantillaNuevo);
				$log.debug('vm.data.diaPlantilla', vm.data.diaPlantilla);


				//consulto si tengo eventos en el calendar
				if (vm.uiConfig.calendar.events.length !== 0) {

					generarItemsDePlantillaConEventosDelCalendario();

					//valido para guardar
					PlantillaDataService.validarGuardar(vm.data.plantillaNuevo)
						.then(function (pResultValidar) {

							ModalService.validarWarning(pResultValidar)
								.then(function (pResult) {

									$log.debug('presultvalidar', pResult);

									if (pResult) {

										PlantillaDataService.guardar(vm.data.plantillaNuevo)
											.then(function (pResultGuardar) {

												$log.debug('pResultGuardar', pResultGuardar);
												AlertaService.NewSuccess("Atencion", "Plantilla grabada con éxito");
												vm.formControl.loading = false;
												cleanStorage();
												$state.go('turno.plantilla.listplantilla');

											}, function (pError) {

												$log.debug('Error guardar', pError);
												vm.formControl.loading = false;

											});

									} else {
										vm.formControl.loading = false;
										$log.error('error', pResult.Message);
										// AlertaService.NewError("Error", pResult.Message);
									}

								}, function (pError) {
									$log.debug('pError validar warning', pError)
									// AlertaService.NewError("Error", pError.msjError);
									$log.error('error', pError);
								});

						}, function (pError) {

							vm.formControl.loading = false;

							AlertaService.NewError("Error", pError.message);
							return;

						});

					$log.debug('guardar', vm.data.plantillaNuevo);
				} 
				//si no tengo items disparo alerta
				else AlertaService.NewWarning('Alerta', 'Debe tener un item de plantilla para guardar');

			}

			function nuevoItemSobreGrilla() {
				var horaDesde = null;
				var horaHasta = null;
				var itemExistente = null;
				var esSobreTurno = false;


				PlantillaLogicService.nuevoItemDePlantilla(horaDesde, horaHasta, vm.data.servicioMedico, vm.data.recurso, itemExistente, esSobreTurno)
					.then(nuevoEvento, nuevoItemSobreGrillaError);

				function nuevoItemSobreGrillaError(pError) {
					$log.error('nuevoItemSobreGrillaError', pError);
				}
			}

			function editarItem(itemDePlantilla) {
				// Encontrar el evento en el calendario y editarlo por ahí
				var eventoDelCalendario = vm.uiConfig.calendar.events.find(x => x.IdEvent === itemDePlantilla.IdEvent);

				editarEvento(eventoDelCalendario);
			}

			function eliminarItem(itemDePlantilla) {
				ModalService.confirm('¿Está seguro que desea eliminar el item? ',
					function (_pOk) {
						if (_pOk) {
							borrarEvento(itemDePlantilla.IdEvent);
						}
					}, "", optionsObj);
			}

			//Sobreturnos button							
			function nuevoSobreturno() {

				PlantillaLogicService.nuevoItemDePlantilla(null, null, vm.data.servicioMedico, vm.data.recurso, null, true)
					.then(nuevoEvento, nuevoSobreturnoError);

				function nuevoSobreturnoError(pError) {
					$log.error('nuevoSobreturnoError', pError);
				}
			}

			//Duraciones button 			
			function listaDuracionesDeTurno() {

				if (PlantillaAuthService.puedeListaReglasDuracion(User)){

					$log.debug('btnclick listaDuracionesDeTurno');
	
					var objectToStorage = setDataToStored();
	
					TurnosStorageHelperService.setStorageObj(vm.storage.keyToStorage, objectToStorage);
	
					$state.go('turno.plantilla.duracionturno', {
						idServicio: vm.data.servicioMedico.Id,
						idRecurso: vm.data.recurso.Id,
						idTipoRecurso: vm.data.recurso.IdTipoRecurso,
	
					});
				}else AlertaService.NewWarning("Atención", "No posee PERMISO para ingresar");

			}

			//Reglas button			
			function listaReglasDeTurno(idTipoDemanda) {
				if (PlantillaAuthService.puedeListaReglasCantidad(User)){

					$log.debug('btnclikc listaReglasDeTurno');

					var objectToStorage = setDataToStored();
	
					TurnosStorageHelperService.setStorageObj(vm.storage.keyToStorage, objectToStorage);
	
					$state.go('turno.plantilla.reglasdecantidades', {
						idServicio: vm.data.servicioMedico.Id,
						idRecurso: vm.data.recurso.Id,
						idTipoRecurso: vm.data.recurso.IdTipoRecurso,
						idTipoDemanda: idTipoDemanda // 1: Turno // 2:SobreTurnos
					});
				} else AlertaService.NewWarning("Atención", "No posee PERMISO para ingresar");

			}

			/* ---------------------------------------------- CALENDAR ---------------------------------------------- */

			function calendarRender() {
				$timeout(function () {
					uiCalendarConfig.calendars.calendarPlantilla.fullCalendar('render');
				}, 200);

			}

			function scrollScheduler() {
				if (vm.uiConfig.calendar.events && vm.uiConfig.calendar.events.length > 0){
					var _timeEnd = angular.copy(vm.uiConfig.calendar.events[vm.uiConfig.calendar.events.length - 1].start);
					vm.uiConfig.calendar.scrollTime = moment.duration(_timeEnd.subtract(20, 'm').format('HH:mm:ss'));
				}else {
					vm.uiConfig.calendar.scrollTime = moment.duration(moment().subtract(20, 'm').format('HH:mm:ss'));
				}
				calendarRender();
			}

			function initializateCalendar() {

				vm.uiConfig = {
					calendar: {
						schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
						//height: 'auto',
						height: 500,
						defaultView: 'agendaWeek',
						ignoreTimezone: false,
						timezone: 'local',
						firstDay: 1,
						editable: true,
						allDaySlot: false,
						slotDuration: '00:30:00',
						slotLabelInterval: 15,
						slotMinutes: 15,
						columnFormat: 'dddd',
						timeFormat: 'HH:mm',
						//axisformat deprecated => new slotLabelFormat 
						//axisFormat: 'h:mm',
						slotLabelFormat: 'HH:mm',
						weekends: false,

						eventBackgroundColor: '#4CAF50',

						//event overlap
						//eventOverlap: true,

						selectable: true,
						currentDay: false,
						///custom buttons
						customButtons: {
							myCustomButton: {
								text: 'Sab/Dom',
								click: function () {

									vm.uiConfig.calendar.weekends = !vm.uiConfig.calendar.weekends;
									scrollScheduler();
								}
							},

							zoom0: {
								text: 'Slot cada 30 min',
								click: function () {
									vm.uiConfig.calendar.slotDuration = '00:30:00';
									scrollScheduler();
								}
							},

							zoom20: {
								text: 'Slot cada 20 min',
								click: function () {
									vm.uiConfig.calendar.slotDuration = '00:20:00';
									scrollScheduler();
								}
							},
							zoom30: {
								text: 'Slot cada 15 min',
								click: function () {
									vm.uiConfig.calendar.slotDuration = '00:15:00';
									scrollScheduler();
								}
							},
							zoom50: {
								text: 'Slot cada 10 min',
								click: function () {
									vm.uiConfig.calendar.slotDuration = '00:10:00';
									scrollScheduler();
								}
							},
							zoom80: {
								text: 'Slot cada 5 min',
								click: function () {
									vm.uiConfig.calendar.slotDuration = '00:05:00';
									scrollScheduler();
								}
							},
							zoom100: {
								text: 'Slot cada 2 min',
								click: function () {
									vm.uiConfig.calendar.slotDuration = '00:02:00';
									scrollScheduler();
								}
							}
						},

						header: {
							left: '',
							center: 'zoom0, zoom20, zoom50, zoom30, zoom80, zoom100',
							right: 'myCustomButton'
						},

						eventMouseover: function (data, event, view) {
							if (data.EsSobreTurno) {
								var tooltip = '<div class="tooltiptopicevent"' +
									'style="width:auto;height:auto;background:rgba(214, 117, 117, 0.74);color:black;;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' +
									'SOBRETURNO: SI</br>' + 'SUCURSAL' + ': ' + data.title + '</br>' + 'TIPO: ' + data.nombreTipoTurno + '</br>' + 'DURACION: ' + data.DuracionMinima + ' minutos' + '</br>' + 'PRESTACIONES: '
									+ data.TipoPrestacionesAsignables
									// + '</br>' + 'TIPO: '  + data.nombreTipoTurno
									+ '</br>' + 'PROFESIONAL: '	+ (data.ProfesionalAtiende ? data.ProfesionalAtiende : "SIN PROFESIONAL")
									+ '</div>'
									;

								$("body").append(tooltip);
								$(this).mouseover(function (e) {
									$(this).css('z-index', 10000);
									$('.tooltiptopicevent').fadeIn('500');
									$('.tooltiptopicevent').fadeTo(10, 1.9);
								}).mousemove(function (e) {
									$('.tooltiptopicevent').css('top', e.pageY + 10);
									$('.tooltiptopicevent').css('left', e.pageX + 20);
								});
							}
						},

						eventMouseout: function (data, event, view) {
							if (data.EsSobreTurno) {
								$(this).css('z-index', 8);
								$('.tooltiptopicevent').remove();
							}
						},

						eventOverlap: function (stillEvent, movingEvent) {
							if (movingEvent.EsSobreTurno) {
								return true;
							} else return false;

						},

						eventClick: function (calEvent, jsEvent, view) {
							if (jsEvent.target.id === 'Delete') {

								ModalService.confirm('¿Está seguro que desea eliminar el item? ',
									function (_pOk) {
										if (_pOk) {
											borrarEvento(calEvent.IdEvent);
										}
									}, "", optionsObj);

							}
							if (jsEvent.target.id === 'Edit') {
								$log.debug('editEvent', calEvent);
								editarEvento(calEvent);
							}
						},

						events: [],
						select: function (start, end, jsEvent, view, resource) {

							if (moment(end).diff(start) > 1800000 && moment(end).day() == moment(start).day()) {

								PlantillaLogicService.nuevoItemDePlantilla(start, end, vm.data.servicioMedico,
									vm.data.recurso, null, false)
									.then(newPlantillaOk, newPlantillaError);

							}

							function newPlantillaOk(pResult) {
								nuevoEvento(pResult);
							}

							function newPlantillaError(pError) {

								$log.error('newPlantillaError OK.-', pError);

							}
						},

						eventRender: function (event, element) {
							element.find('.fc-time').attr('style', 'font-size: 1.55em !important');
							element.find('.fc-time').append('<span class="removeEvent glyphicon ' +
								'glyphicon-remove" id="Delete" style="margin-left: 3px; margin-top:6px; font-size:13px;"></span>');

							if (!event.EsSobreTurno)
								element.find('.fc-time').append('<span class="editEvent glyphicon glyphicon-edit" ' +
									'id="Edit" style="margin-left: 3px; margin-top:6px; font-size:13px"></span>');

							if (event.EsSobreTurno) {
								element.find('.fc-title').append("<br/> SOBRETURNO : SI");
							} else {

								element.find('.fc-title').append("<br/> TIPO: " + event.nombreTipoTurno);
								element.find('.fc-title').append("<br/> DURACION: " + event.DuracionMinima + " minutos");

								//consulto si las prestaciones son definidas y las arreglo								
								if (event.IdTipoPrestacionesAsignables === 4) {
									var strPrestacionesAsignables = '';
									angular.forEach(event.PrestacionesAsignables, function (prestacion, key) {
										if (key + 1 === event.PrestacionesAsignables.length)
											strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.Prestacion;
										else strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.Prestacion + ' <br/> ';

									});
									element.find('.fc-title').append("<br/> PRESTACIONES: " + '<br/>' + strPrestacionesAsignables);

								} else if (event.IdTipoPrestacionesAsignables === 5){
									var strPrestacionesAsignables = '';
									angular.forEach(event.GrupoDePrestacionesAsignables, function (prestacion, key) {
										if (key + 1 === event.GrupoDePrestacionesAsignables.length)
											strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.GrupoDePrestaciones;
										else strPrestacionesAsignables = strPrestacionesAsignables + '• ' + prestacion.GrupoDePrestaciones + ' <br/> ';

									});

									element.find('.fc-title').append("<br/> GRUPO PRESTACION: " + '<br/>' + strPrestacionesAsignables);
								}else {
									element.find('.fc-title').append("<br/> PRESTACIONES: " + event.TipoPrestacionesAsignables);
								}

								if (!angular.isUndefined(event.SalaEspera)) element.find('.fc-title').append("<br/> SALA: " + event.SalaEspera);
								if (!angular.isUndefined(event.Consultorio)) element.find('.fc-title').append("<br/> CONSULTORIO: " + event.Consultorio);
								if (event.VisibleAutogestionWeb) element.find('.fc-title').append("<br/> VISIBLE AUTOGESTION: SI");
								else element.find('.fc-title').append("<br/> VISIBLE AUTOGESTION: NO");

								element.find('.fc-title').append("<br/> PROFESIONAL: " +(event.ProfesionalAtiende ? event.ProfesionalAtiende : "SIN PROFESIONAL")) ;

								if (event.Sexo !== "AMBOS") {

									element.find('.fc-title').append("<br/> SEXO: " + event.Sexo);
								}
								if (event.EdadMaxima !== 0 || event.EdadMinima !== 0)
									element.find('.fc-title').append("<br/> EDAD: " + event.EdadMinima + " - " + event.EdadMaxima + " años");
								if (event.Cupo !== 1)
									element.find('.fc-title').append("<br/> CUPO: " + event.Cupo);
							}

							//Event double click: Editar el item	
							element.bind('dblclick', function () {
								editarEvento(event);
							});
						},

						eventDrop: function (event, delta, revertFunc, jsEvent) {
							$log.debug("eventDrop", event);

							// COPIAR ARRASTRANDO
							// Si está pulsada SHIFT -> Está sacando una COPIA del evento/item mediante drag and drop
							if (jsEvent.shiftKey === true) {

								var eventClone: any = {
									title: event.title,
									start: event.start,
									end: event.end,
									Cupo: event.Cupo,
									nombreTipoTurno: event.nombreTipoTurno,
									DuracionMinima: event.DuracionMinima,
									EdadMaxima: event.EdadMaxima,
									EdadMinima: event.EdadMinima,
									Dia: event.start.format('dddd'),
									IdDia: event.start.day(),
									IdSexo: event.IdSexo,
									Sexo: event.Sexo,
									IdSucursal: event.IdSucursal,
									TipoPrestacionesAsignables: event.TipoPrestacionesAsignables,
									IdTipoPrestacionesAsignables: event.IdTipoPrestacionesAsignables,
									IdTipoTurno: event.IdTipoTurno,
									PrestacionesAsignables: event.PrestacionesAsignables,
									GrupoDePrestacionesAsignables: event.GrupoDePrestacionesAsignables,
									Consultorio: event.Consultorio,
									IdConsultorio: event.IdConsultorio,
									SalaEspera: event.SalaEspera,
									IdSalaEspera: event.IdSalaEspera,
									VisibleAutogestionWeb: event.VisibleAutogestionWeb,
									IdProfesionalAtiende: event.IdProfesionalAtiende,
									ProfesionalAtiende: event.ProfesionalAtiende
								};

								eventClone.IdEvent = vm.uiConfig.calendar.events[vm.uiConfig.calendar.events.length - 1].IdEvent + 1;

								//veo las sucursales y pongo los colores
								if (event.IdSucursal === 1) {
									eventClone.backgroundColor = 'rgba(67, 123, 146, 0.94)';
								} else if (event.IdSucursal === 2) {
									eventClone.backgroundColor = '#5cb85c';
								}

								eventClone.EsSobreTurno = angular.copy(event.EsSobreTurno);
								if (eventClone.EsSobreTurno) {
									eventClone.backgroundColor = 'rgba(221, 29, 29, 0.74)';
								}

								// Limpio el Id de la prestacion asignable dentro del Item ( Id = 0 para que apunten al nuevo item)
								angular.forEach(eventClone.PrestacionesAsignables, function (prestacion) {
									prestacion.Id = 0;
								});

								angular.forEach(eventClone.GrupoDePrestacionesAsignables, function (grupo) {
									grupo.Id = 0;
								});

								$log.debug('lo copie',eventClone);
								vm.uiConfig.calendar.events.push(eventClone);
								generarItemsDePlantillaConEventosDelCalendario();

								revertFunc();

							} else {
								// MOVIENDO un Item de Plantilla								
								// No está pulsada SHIFT -> Solo se movio el item y se hizo en Drop en la nueva ubicación
								vm.uiConfig.calendar.events.find(x => x.IdEvent === event.IdEvent).start = angular.copy(event.start);
								vm.uiConfig.calendar.events.find(x => x.IdEvent === event.IdEvent).end = angular.copy(event.end);

								vm.uiConfig.calendar.events.find(x => x.IdEvent === event.IdEvent).Dia = angular.copy(event.start.format('dddd'));
								vm.uiConfig.calendar.events.find(x => x.IdEvent === event.IdEvent).IdDia = angular.copy(+event.end.format('e') + 1);

								generarItemsDePlantillaConEventosDelCalendario();
							}
						},

						eventResize: function (event, delta, revertFunc) {
							// MODIFICANDO un Item de Plantilla en cuanto a su duración
							// Cuando cambiamos sobre el calendario la duración de un item
							$log.debug("eventResize", event);

							if (event.start.day() !== event.end.day()) {
								revertFunc();
							} else {
								vm.uiConfig.calendar.events.find(x => x.IdEvent === event.IdEvent).start = event.start;
								vm.uiConfig.calendar.events.find(x => x.IdEvent === event.IdEvent).end = event.end;
							}

							generarItemsDePlantillaConEventosDelCalendario();
						}
					}
				};
			}

			function nuevoEvento(dataEvent) {
				$log.error('nuevoEvento OK.-', dataEvent);

				vm.data.diaPlantilla = angular.copy(dataEvent);

				var newEvent: any = {};

				var getHoraDesde = moment(dataEvent.HoraDesde, 'HH:mm');
				var getHoraHasta = moment(dataEvent.HoraHasta, 'HH:mm');

				newEvent.start = moment();
				newEvent.end = moment();

				if (vm.uiConfig.calendar.events.length === 0) {
					newEvent.IdEvent = 0;
				} else {
					newEvent.IdEvent = vm.uiConfig.calendar.events[vm.uiConfig.calendar.events.length - 1].IdEvent + 1;
				}

				newEvent.title = dataEvent.Sucursal;

				newEvent.IdSexo = dataEvent.Sexo.Id;
				newEvent.Sexo = dataEvent.Sexo.Nombre.substr(0, 1);
				if (newEvent.Sexo === "A") newEvent.Sexo = "";

				newEvent.nombreTipoTurno = dataEvent.TipoTurno.Nombre;

				newEvent.start.hour(getHoraDesde.hour());
				newEvent.start.minute(getHoraDesde.minute());
				newEvent.start.day(dataEvent.IdDia);

				newEvent.end.hour(getHoraHasta.hour());
				newEvent.end.minute(getHoraHasta.minute());
				newEvent.end.day(dataEvent.IdDia);

				newEvent.IdDia = angular.copy(dataEvent.IdDia);

				newEvent.allDay = false;
				newEvent.Cupo = angular.copy(dataEvent.Cupo);
				newEvent.DuracionMinima = angular.copy(dataEvent.DuracionMinima);
				newEvent.EdadMaxima = angular.copy(dataEvent.EdadMaxima);
				newEvent.EdadMinima = angular.copy(dataEvent.EdadMinima);
				newEvent.Sexo = angular.copy(dataEvent.Sexo.Nombre);
				newEvent.IdTipoPrestacionesAsignables = angular.copy(dataEvent.IdTipoPrestacionesAsignables);
				newEvent.TipoPrestacionesAsignables = angular.copy(dataEvent.TipoPrestacionesAsignables);

				newEvent.IdSalaEspera = angular.copy(dataEvent.IdSalaEspera);
				newEvent.SalaEspera = angular.copy(dataEvent.SalaEspera);

				newEvent.IdConsultorio = angular.copy(dataEvent.IdConsultorio);
				newEvent.Consultorio = angular.copy(dataEvent.Consultorio);
				newEvent.VisibleAutogestionWeb = angular.copy(dataEvent.VisibleAutogestionWeb);

				newEvent.IdSucursal = angular.copy(dataEvent.IdSucursal);
				newEvent.IdTipoTurno = angular.copy(dataEvent.IdTipoTurno);
				newEvent.PrestacionesAsignables = angular.copy(dataEvent.PrestacionesAsignables);
				newEvent.GrupoDePrestacionesAsignables = angular.copy(dataEvent.GrupoDePrestacionesAsignables);
				newEvent.IdProfesionalAtiende = angular.copy(dataEvent.IdProfesionalAtiende);
				newEvent.ProfesionalAtiende = angular.copy(dataEvent.ProfesionalAtiende);

				// Pongo el color de fondo de acuerdo a la sucursal
				if (dataEvent.IdSucursal === 1) {
					newEvent.backgroundColor = 'rgba(67, 123, 146, 0.94)';
				} else if (dataEvent.IdSucursal === 2) {
					newEvent.backgroundColor = 'rgb(29, 138, 29)';
				}

				// Altero el color de fondo en caso de que sea sobreturno
				newEvent.EsSobreTurno = angular.copy(dataEvent.EsSobreTurno);
				if (newEvent.EsSobreTurno) {
					newEvent.backgroundColor = 'rgba(221, 29, 29, 0.74)';
				}

				vm.uiConfig.calendar.events.push(newEvent);

				generarItemsDePlantillaConEventosDelCalendario();
				calendarRender();
			}

			function borrarEvento(IdEvent) {

				vm.uiConfig.calendar.events = $.grep(vm.uiConfig.calendar.events, function (e: any) {
					return e.IdEvent != IdEvent;
				});

				// Regenero el vm.data.plantillaNuevo.Items
				generarItemsDePlantillaConEventosDelCalendario();
			}


			function editarEvento(eventoToEdit) {

				//levanto el new plantilla y lo voy a editar

				PlantillaLogicService.nuevoItemDePlantilla(eventoToEdit.start, eventoToEdit.end,
					vm.data.servicioMedico, vm.data.recurso, eventoToEdit, false)
					.then(function (pResult) {

						$log.debug('resultado del editEvent', pResult);
						var getHoraDesde = moment(pResult.HoraDesde, 'HH:mm');
						var getHoraHasta = moment(pResult.HoraHasta, 'HH:mm');
						//me traje el item editado
						//pueden suceder dos cosas: 
						// -que el usuario lo editó
						// -que el usuario hizo una copia
						if (pResult.GuardarCopia) {

							//tengo que guardar copia
							//=> tengo que crear uno nuevo con el copia
							//Primero tengo que consultar si no existe un evento con el mismo dia y misma hora
							// if (vm.uiConfig.calendar.events.find(x => x.IdDia === pResult.IdDia && x.start.hour() == moment(pResult.HoraDesde, 'HH').hour() && x.end.hour() == moment(pResult.HoraHasta, 'HH').hour())){
							//tengo un evento ya creado con el mismo dia y misma hora
							$log.debug('Tengo evento mismo dia misma hora');
							//muestro modal y no hago nada

							//}else {
							//tengo un nuevo evento por lo que creo uno
							nuevoEvento(pResult);
							// }

						} else {
							//
							//no tengo que guardar una copia por lo que lo edito comun
							$log.debug('levanto el item editado', pResult);
							//voy a editar con el IdEvent
							//	vm.uiConfig.calendar.events.find(x => x.IdEvent === eventoToEdit.IdEvent);
							//					
							var sucursal = vm.data.sucursales.find(x => x.Id === pResult.IdSucursal);

							var evento = vm.uiConfig.calendar.events.find(x => x.IdEvent === eventoToEdit.IdEvent);

							evento.title = sucursal.Nombre;
							evento.IdSexo = pResult.Sexo.Id;
							evento.Sexo = pResult.Sexo.Nombre.substr(0, 1);
							if (evento.Sexo === "A") {
								evento.Sexo = "";
							}

							evento.nombreTipoTurno = pResult.TipoTurno.Nombre;

							evento.start.hour(getHoraDesde.hour());
							evento.start.minute(getHoraDesde.minute());
							evento.start.day(pResult.IdDia);

							evento.end.hour(getHoraHasta.hour());
							evento.end.minute(getHoraHasta.minute());
							evento.end.day(pResult.IdDia);

							evento.allDay = false;
							evento.Cupo = angular.copy(pResult.Cupo);
							evento.DuracionMinima = angular.copy(pResult.DuracionMinima);
							evento.EdadMaxima = angular.copy(pResult.EdadMaxima);
							evento.EdadMinima = angular.copy(pResult.EdadMinima);
							evento.Sexo = angular.copy(pResult.Sexo.Nombre);
							evento.IdTipoPrestacionesAsignables = angular.copy(pResult.IdTipoPrestacionesAsignables);
							evento.TipoPrestacionesAsignables = angular.copy(pResult.TipoPrestacionesAsignables);

							evento.IdSucursal = angular.copy(pResult.IdSucursal);
							evento.IdTipoTurno = angular.copy(pResult.IdTipoTurno);
							evento.PrestacionesAsignables = angular.copy(pResult.PrestacionesAsignables);

							evento.SalaEspera = angular.copy(pResult.SalaEspera);
							evento.IdSalaEspera = angular.copy(pResult.IdSalaEspera);
							evento.Consultorio = angular.copy(pResult.Consultorio);
							evento.IdConsultorio = angular.copy(pResult.IdConsultorio);
							evento.VisibleAutogestionWeb = angular.copy(pResult.VisibleAutogestionWeb);
							evento.GrupoDePrestacionesAsignables = angular.copy(pResult.GrupoDePrestacionesAsignables);
							evento.IdProfesionalAtiende =angular.copy(pResult.IdProfesionalAtiende);
							evento.ProfesionalAtiende =angular.copy(pResult.ProfesionalAtiende);

							$log.debug('creo evento en PlantillaEditController', evento);
							//veo las sucursales y pongo los colores
							if (pResult.IdSucursal === 1) {
								evento.backgroundColor = 'rgba(67, 123, 146, 0.94)';
							} else if (pResult.IdSucursal === 2) {
								evento.backgroundColor = 'rgb(29, 138, 29)';
							}

							if (pResult.EsSobreTurno) {
								evento.backgroundColor = 'rgba(221, 29, 29, 0.74)';
							}


						}

						// Regenero el vm.data.plantillaNuevo.Items
						generarItemsDePlantillaConEventosDelCalendario();

						calendarRender();

					}, function (pError) {

						if (pError.IdEvent) {
							borrarEvento(pError.IdEvent);
						} else
							$log.error('error levantado el item levantado', pError);

					});

				calendarRender();

			}


			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */


			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				initializateCalendar();
				var _plantilla;

				if (TurnosStorageHelperService.existStoredObjects(vm.storage.keyToStorage)) {

					$log.debug('data stored exist', TurnosStorageHelperService.getStorageObj(vm.storage.keyToStorage));
					getStoredData(TurnosStorageHelperService.getStorageObj(vm.storage.keyToStorage));

				}

				if (angular.isUndefined(vm.data.recurso.Nombre)) {
					cleanStorage();
					$state.go('turno.plantilla.listplantilla');
				}


				if (vm.data.plantillaEdit !== null) {
					$log.debug('plantilla edit', vm.data.plantillaEdit);
					_plantilla = PlantillaDataService.GetOne(vm.data.plantillaEdit);

					$log.debug('plantilla edit> Dto de plantilla ', _plantilla);

				} else {

					_plantilla = PlantillaDataService.obtenerNuevaPlantilla();
				}


				var _sucursales = SucursalDataService.getAllSucursalesConFiltro();
				var _sucursalesHabilitadas = SucursalDataService.obtenerSucursalXRecursoXServicio(vm.data.recurso.Id,
					vm.data.recurso.IdTipoRecurso, vm.data.servicioMedico.Id);

				var _reglasTurnos = PlantillaDataService.obtenerReglasPorServicioEnRecurso(vm.data.servicioMedico.Id,
					vm.data.recurso.Id,
					vm.data.recurso.IdTipoRecurso, 1);

				var _duraciones = PlantillaDataService.obtenerDuracionesPorServicioEnRecurso(
					vm.data.servicioMedico.Id, vm.data.recurso.Id, vm.data.recurso.IdTipoRecurso);


				$q.all([

					_plantilla,
					_duraciones,
					_sucursales,
					_reglasTurnos,
					_sucursalesHabilitadas
				])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {
					// variable = pResult[0];
					// 
					//obtengo reglas de sobreturnos
					var _reglasSobreTurnos = PlantillaDataService.obtenerReglasPorServicioEnRecurso(vm.data.servicioMedico.Id,
						vm.data.recurso.Id,
						vm.data.recurso.IdTipoRecurso, 2)
						.then(function (_result) {
							vm.data.reglasDeSobreTurnos = _result;
						}, function (_error) {
							$log.error('error reglasobreturno', _error);
						});

					vm.formControl.loading = false;
					vm.data.plantillaNuevo = pResults[0];
					vm.data.cantDuraciones = pResults[1];
					vm.data.sucursales = pResults[2];
					vm.data.reglasDeTurnos = pResults[3];
					vm.data.sucursalesHabilitadas = pResults[4];

					$log.debug('Inicializar OK.-', vm.data.plantillaNuevo);

					//voy a editar una plantilla ya creada
					if (vm.data.plantillaNuevo.Id !== 0) {

						if (vm.uiConfig.calendar.events.length === 0) {

							var eventsLoad = angular.copy(vm.data.plantillaNuevo.Items);

							angular.forEach(eventsLoad, function (value, key) {

								$log.debug('event load', value);
								if (value.IdDia === 7) value.IdDia = 0;
								value.start = moment(value.HoraDesde, 'HH:mm').day(value.IdDia).week(moment().week());
								value.end = moment(value.HoraHasta, 'HH:mm').day(value.IdDia).week(moment().week());
								value.title = vm.data.recurso.Nombre;
								value.IdEvent = key;
								value.allDay = false;
								value.nombreTipoTurno = angular.copy(value.TipoTurno);
								value.title = angular.copy(value.Sucursal);


								value.TipoPrestacionesAsignables = angular.copy(value.TipoPrestacionesAsignables);
								if (value.Sexo === "") value.Sexo = "AMBOS";
								vm.uiConfig.calendar.events.push(value);

								//veo las sucursales y pongo los colores
								if (value.IdSucursal === 1) {
									value.backgroundColor = 'rgba(67, 123, 146, 0.94)';
								} else if (value.IdSucursal === 2) {
									value.backgroundColor = 'rgb(29, 138, 29)';
								}

								//obtengo si es sobreturno o no
								if (value.EsSobreTurno) {
									$log.debug('es sobreturno');
									value.backgroundColor = 'rgba(221, 29, 29, 0.74)';
								}

								if (value.IdDia === 6 || value.IdDia === 0) {
									vm.uiConfig.calendar.weekends = true;
								}
							});

							generarItemsDePlantillaConEventosDelCalendario();
						}

						vm.data.Observaciones.observacionConTags = angular.copy(vm.data.plantillaNuevo.Observaciones);
						vm.data.Observaciones.observacionToShow = PlantillaLogicService.getObservacionToShow(angular.copy(vm.data.plantillaNuevo.Observaciones), vm.data.sucursalesHabilitadas);
						vm.data.ObservacionesPortal.observacionConTags = angular.copy(vm.data.plantillaNuevo.ObservacionesPortal);
						vm.data.ObservacionesPortal.observacionToShow = PlantillaLogicService.getObservacionToShow(angular.copy(vm.data.plantillaNuevo.ObservacionesPortal), vm.data.sucursalesHabilitadas);
						vm.data.fechaDesde = new Date(vm.data.plantillaNuevo.FechaDesde);
						vm.data.fechaHasta = new Date(vm.data.plantillaNuevo.FechaHasta);

					}
					//no tengo plantilla editada entonces creo una nueva
					else {

						$log.debug('no tengo plantilla editada', vm.data.plantillaNuevo.Id);
						if (!TurnosStorageHelperService.existStoredObjects(vm.storage.keyToStorage)) {
							vm.data.fechaDesde = new Date();
							vm.data.fechaHasta = new Date();
						}

						// setearCuatrimestreActual();

						// // vm.data.fechaDesde = moment().format("MM-DD-YYYY");
						// // vm.data.fechaHasta = moment().format("MM-DD-YYYY");				
						// setearCuatrimestreActual();
					}


					calendarRender();

				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}
			}

			function setearCuatrimestreActual() {

				var actualDay = moment();

				var primerCuatrimestreStart = moment().set({
					'date': 1,
					'month': 0
				});
				var primerCuatrimestreFinish = moment().set({
					'date': 30,
					'month': 3
				});

				var segundoCuatrimestreStart = moment().set({
					'date': 1,
					'month': 4
				});
				var segundoCuatrimestreFinish = moment().set({
					'date': 31,
					'month': 7
				});

				var tercerCuatrimestreStart = moment().set({
					'date': 1,
					'month': 8
				});
				var tercerCuatrimestreFinish = moment().set({
					'date': 31,
					'month': 11
				});

				if (actualDay.isBetween(primerCuatrimestreStart, primerCuatrimestreFinish)) {

					vm.data.fechaDesde = new Date(new Date().getFullYear(), 4, 1);
					vm.data.fechaHasta = new Date(new Date().getFullYear(), 7, 31);

				} else if (actualDay.isBetween(segundoCuatrimestreStart, segundoCuatrimestreFinish)) {


					vm.data.fechaDesde = new Date(new Date().getFullYear(), 8, 1);
					vm.data.fechaHasta = new Date(new Date().getFullYear(), 11, 31);

				} else if (actualDay.isBetween(tercerCuatrimestreStart, tercerCuatrimestreFinish)) {

					vm.data.fechaDesde = new Date(new Date().getFullYear() + 1, 0, 1);
					vm.data.fechaHasta = new Date(new Date().getFullYear() + 1, 3, 30);


				} else {
					vm.data.fechaDesde = new Date(new Date().getFullYear(), 0, 1);
					vm.data.fechaHasta = new Date(new Date().getFullYear(), 11, 31);
				}

				$log.debug('actual day is', actualDay.isBetween(primerCuatrimestreStart, primerCuatrimestreFinish));

			}

			/* ---------------------------------------------- STORAGE ---------------------------------------------- */

			function getStoredData(stored) {

				$log.debug('getStoredData', stored);

				vm.data.recurso = stored.recurso ? angular.copy(stored.recurso) : {};

				vm.title.page = "Items de plantilla: " + vm.data.recurso.Nombre;

				vm.data.servicioMedico = stored.servicioMedico ? angular.copy(stored.servicioMedico) : {};
				vm.data.plantillaEdit = stored.plantillaEdit ? angular.copy(stored.plantillaEdit) : null;
				vm.uiConfig.calendar.events = stored.calendarEvents ? angular.copy(stored.calendarEvents) : null;
				vm.data.fechaDesde = stored.fechaDesde ? angular.copy(stored.fechaDesde) : '';
				vm.data.fechaHasta = stored.fechaHasta ? angular.copy(stored.fechaHasta) : '';

				//var eventsLoad = angular.copy(vm.uiConfig.calendar.events);

				if (vm.uiConfig.calendar.events.length > 0) {

					angular.forEach(vm.uiConfig.calendar.events, function (value, key) {

						value.start = moment(value.HoraDesde, 'HH:mm').day(value.IdDia).week(moment().week());
						value.end = moment(value.HoraHasta, 'HH:mm').day(value.IdDia).week(moment().week());

					});
					calendarRender();
				}

				vm.data.Observaciones = stored.observacionesPlantilla ? angular.copy(stored.observacionesPlantilla) : '';
				vm.data.ObservacionesPortal = stored.observacionesPlantillaPortal ? angular.copy(stored.observacionesPlantillaPortal) : '';

			}

			function cleanStorage() {

				$log.debug('cleanStorage');
				TurnosStorageHelperService.cleanStorage(vm.storage.keyToStorage);

			}

			function setDataToStored() {


				if (vm.uiConfig.calendar.events.length > 0) {

					angular.forEach(vm.uiConfig.calendar.events, function (value, key) {

						value.HoraDesde = value.start.format("HH:mm");
						value.HoraHasta = value.end.format("HH:mm");

					});

				}

				var objectToStorage = {
					recurso: angular.copy(vm.data.recurso),
					servicioMedico: angular.copy(vm.data.servicioMedico),
					plantillaEdit: angular.copy(vm.data.plantillaEdit),
					calendarEvents: angular.copy(vm.uiConfig.calendar.events),
					observacionesPlantilla: angular.copy(vm.data.Observaciones),
					observacionesPlantillaPortal: angular.copy(vm.data.ObservacionesPortal),
					fechaDesde: angular.copy(vm.data.fechaDesde),
					fechaHasta: angular.copy(vm.data.fechaHasta),
				};

				return objectToStorage
			}


			/* ---------------------------------------------- END ---------------------------------------------- */

		}
	};

	return module;
})();