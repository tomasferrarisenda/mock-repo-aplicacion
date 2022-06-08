/**
 * @author 			ppautasso
 * @description 	description
 */

import * as angular from 'angular';
import { ISucursalDataService, ITipoSexoDataService, ISupportDataService } from '../../../support/basic/services';

import { FiltroGrupoDePrestacionMedica } from '../../../basicos/prestaciones/common/models'
import { IGrupoPrestacionMedicaDataService } from '../../configuraciones/grupoPrestacionMedica/services';

export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PlantillaModalNewController', PlantillaModalNewController);

		// Inyección de Dependencia
		PlantillaModalNewController.$inject = ['$scope', 'Logger', '$q', '$timeout', '$uibModalInstance',
			'ModalService', 'moment', 'AlertaService', 'ProfesionalesDataService',

			'StartTime', 'EndTime', 'ServiciosGestionDataService', 'PlantillaDataService', 'SupportDataService',
			'SucursalDataService', 'TipoSexoDataService',
			'PrestacionGestionDataService', 'MantenimientoAgendaDataService', 'Servicio', 'Recurso',
			'ItemPlantillaAEditar', 'EsSobreturno', 'GrupoPrestacionMedicaDataService',


		];

		// Constructor del Controller
		function PlantillaModalNewController($scope, $log, $q, $timeout, $uibModalInstance,
			ModalService, moment, AlertaService: IAlertaService, ProfesionalesDataService,

			StartTime, EndTime, ServiciosGestionDataService, PlantillaDataService, SupportDataService: ISupportDataService,
			SucursalDataService: ISucursalDataService, TipoSexoDataService: ITipoSexoDataService,
			PrestacionGestionDataService, MantenimientoAgendaDataService, Servicio, Recurso,
			ItemPlantillaAEditar, EsSobreturno, GrupoPrestacionMedicaDataService: IGrupoPrestacionMedicaDataService

		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PlantillaModalNewController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;


			vm.data = {
				startTime: StartTime,
				endTime: EndTime,
				plantilla: {},
				horaDesde: {},
				horaHasta: {},
				diaSemana: '',
				servicio: Servicio,
				recurso: Recurso,
				prestacionesXsucursal: [],
				grupoPrestacionesXsucursal: [],
				itemPlantillaToEdit: ItemPlantillaAEditar,
				esSobreTurnoBack: EsSobreturno,
				isSobreturno: false,
				profesionalesDeUnServicioEnSucursal: [],
				ocultarProfesionalSelect: true

			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};


			vm.minutosTurno = [{
				minutos: 5,
				minutosText: '5 Minutos'
			}, {
				minutos: 10,
				minutosText: '10 Minutos'
			}, {
				minutos: 15,
				minutosText: '15 Minutos'
			}, {
				minutos: 20,
				minutosText: '20 Minutos'
			},{
				minutos: 25,
				minutosText: '25 Minutos'
			}, {
				minutos: 30,
				minutosText: '30 Minutos'
			}, {
				minutos: 40,
				minutosText: '40 Minutos'
			},{
				minutos: 45,
				minutosText: '45 Minutos'
			}, {
				minutos: 50,
				minutosText: '50 Minutos'
			}, {
				minutos: 60,
				minutosText: '1 Hora'
			}, {
				minutos: 80,
				minutosText: '1:20 Hora'
			}, {
				minutos: 90,
				minutosText: '1:30 Horas'
			},{
				minutos: 120,
				minutosText: '2 Horas'
			},{
				minutos: 150,
				minutosText: '2:30 Horas'
			},{
				minutos: 180,
				minutosText: '3 Horas'
			}];

			vm.formControl = {
				ok: newPlantillaData,
				cancel: cancel,
				error: true,
				loading: false,
				getPrestacionXSucursal: getPrestacionXSucursal,
				getGruposPrestacionesXSucursal: getGruposPrestacionesXSucursal,
				getSalasXSucursal: getSalasXSucursal,
				getConsultoriosXSala: getConsultoriosXSala,
				borrarItem: borrarItem,
				guardarCopia: guardarCopia,
				getProfesionalesXSucursal: getProfesionalesXSucursal


			};

			// vm.menuOptions = [
			// 	// NEW IMPLEMENTATION
			// 	{
			// 		text: 'Object-Select',
			// 		click: function($itemScope, $event, modelValue, text, $li) {
			// 			$log.error('click1');

			// 		}
			// 	}, {
			// 		text: 'Object-Remove',
			// 		click: function($itemScope, $event, modelValue, text, $li) {

			// 			$log.error('click2');

			// 		}
			// 	},
			// 	// LEGACY IMPLEMENTATION
			// 	['Select', function($itemScope, $event, modelValue, text, $li) {
			// 		$log.error('click3');

			// 	}],
			// 	null, // Dividier
			// 	['Remove', function($itemScope, $event, modelValue, text, $li) {
			// 		$log.error('click4');


			// 	}]
			// ];

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			/* FORMULARIO */

			function cancel() {
				$uibModalInstance.dismiss('cancel');
			}


			// OBTENEMOS LAS PRESTACIONES POR SUCURSAL
			function getPrestacionXSucursal(pSucursal) {
				var def = $q.defer();
				$log.debug('getServiciosXSucursal OK.-', pSucursal);
				if (pSucursal != null) {

					var pIdTipoRecurso = vm.data.recurso.IdTipoRecurso;
					var pIdRecurso = vm.data.recurso.Id;
					var pIdServicio = vm.data.servicio.Id;
					$log.debug('Prestacion:obtenerPorRecursoServicioSucursal -', pIdTipoRecurso, pIdRecurso, pIdServicio, pSucursal.Id);
					//PrestacionGestionDataService.obtenerPorServicioEnSucursal(pSucursal.Id, vm.data.servicio.Id)
					PrestacionGestionDataService.obtenerPorRecursoServicioSucursal(pIdTipoRecurso, pIdRecurso, pIdServicio, pSucursal.Id)
						.then(getPrestacionesOk, getPrestacionesError);
				}

				function getPrestacionesOk(pPrestaciones) {
					vm.data.prestacionesXsucursal = pPrestaciones;
					$log.debug('Prestacion:obtenerPorRecursoServicioSucursal: ', vm.data.prestacionesXsucursal);
					if (vm.data.prestacionesXsucursal.length > 0)
						def.resolve(true);
					else def.resolve(false);
				}

				function getPrestacionesError(pError) {
					$log.error('getPrestacionesError.-', pError);
					def.reject(false);

				}
				return def.promise;
			}

			// OBTENEMOS LOS GRUPOS DE PRESTACIONES POR SUCURSAL
			function getGruposPrestacionesXSucursal(pSucursal) {

				var def = $q.defer();
				$log.debug('getGruposPrestacionesXSucursal OK.-', pSucursal);
				if (pSucursal != null) {

					var filtroGrupoDePrestacion: FiltroGrupoDePrestacionMedica = {};
					filtroGrupoDePrestacion.IdRecurso = vm.data.recurso.Id;
					filtroGrupoDePrestacion.IdTipoRecurso = vm.data.recurso.IdTipoRecurso;
					filtroGrupoDePrestacion.IdServicio = vm.data.servicio.Id;
					filtroGrupoDePrestacion.IdSucursal = pSucursal.Id;



					GrupoPrestacionMedicaDataService.obtenerPorServicioSucursalYRecurso(filtroGrupoDePrestacion)
						.then(getGrupoDePrestacionesOk, getGrupoDePrestacionesError);
				}

				function getGrupoDePrestacionesOk(pPrestaciones) {

					vm.data.grupoPrestacionesXsucursal = angular.copy(pPrestaciones);
					$log.debug('Prestacion:getGrupoDePrestacionesOk: ', vm.data.grupoPrestacionesXsucursal);
					if (vm.data.grupoPrestacionesXsucursal.length > 0)
						def.resolve(true);
					else def.resolve(false);
				}

				function getGrupoDePrestacionesError(pError) {
					$log.error('getGrupoDePrestacionesError.-', pError);
					def.reject(false);
				}

				return def.promise;
			}

			// OBTENEMOS LAS SALAS DE LA SUCURSAL
			function getSalasXSucursal(pSucursal) {

				var def = $q.defer();

				$log.debug('getSalasXSucursal OK.-', pSucursal);

				if (pSucursal != null) {

					SupportDataService.obtenerSalasXSucursal(pSucursal.Id)
						.then(getSalasOk, getSalasError);
				}

				function getSalasOk(pSalas) {

					vm.data.salasXSucursal = pSalas;
					$log.debug('getSalasOk', vm.data.salasXSucursal);
					if (vm.data.salasXSucursal.length > 0)
						def.resolve(true);
					else def.resolve(false);

				}

				function getSalasError(pError) {

					$log.error('getSalasError.-', pError);
					def.reject(false);
				}
				return def.promise;
			}


			// GET CONSULTORIOS POR SALA
			function getConsultoriosXSala(pSala) {

				var def = $q.defer();
				$log.debug('getConsultoriosXSala OK.-', pSala);

				if (pSala != null) {

					SupportDataService.obtenerConsultoriosXSala(pSala.Id)
						.then(getConsultoriosOk, getConsultoriosError);
				}

				function getConsultoriosOk(pConsultorios) {

					vm.data.consultoriosXSala = pConsultorios;
					$log.debug('getSalasOk', vm.data.consultoriosXSala);
					if (vm.data.consultoriosXSala.length > 0) def.resolve(true);
					else def.resolve(false);

				}

				function getConsultoriosError(pError) {

					$log.error('getSalasError.-', pError);
					def.reject(false);
				}
				return def.promise;
			}

			function getProfesionalesXSucursal() {
				var def = $q.defer();
				if(vm.data.recurso.IdTipoRecurso !== 1 && vm.data.sucursal){ // Que no sea del tipo profesional 
				// deprecado, se utiliza el get profesionales que atiende el recurso
				// PlantillaDataService.ObtenerTodosDeUnServicioEnSucursal(vm.data.servicio.Id, vm.data.sucursal.Id)
					ProfesionalesDataService.obtenerQueAtiendenAlRecurso(vm.data.recurso.Id, vm.data.recurso.IdTipoRecurso).then(function (pResults) {
						vm.data.profesionalesDeUnServicioEnSucursal = angular.copy(pResults);
						def.resolve(pResults);
					}, function (pError) {
						def.reject(false);
					});
					return def.promise;
				}
				else{
					def.resolve(null);
					return def.promise;
				}
			}


			// NUEVA PLANTILLA PARA LLAMAR AL GUARDAR
			function newPlantillaData(isValid) {
				// Validación especial: Si el item es para "PRESTACIONES SELECCIONADA": Reviso que se haya elegido alguna		
				if(vm.data.prestacionesAsignables)
				vm.data.nuevaPlantillaTurno.IdTipoPrestacionesAsignables = angular.copy(vm.data.prestacionesAsignables.Id);

				if (vm.data.nuevaPlantillaTurno.IdTipoPrestacionesAsignables === 4) {
					let algunaPrestacionSeleccionada: boolean = false;

					angular.forEach(vm.data.prestacionesXsucursal, function (value) {
						if (value.status === true) {
							algunaPrestacionSeleccionada = true;
						}
					});

					if (!algunaPrestacionSeleccionada) {
						AlertaService.NewWarning("Atención", "Falta seleccionar alguna prestación asignable");
						return;
					}
				}

				if (isValid || isDiagnosticoPorImagenes()) {

					vm.data.nuevaPlantillaTurno.DuracionMinima = angular.copy(vm.data.minutosTurno.minutos);

					vm.data.nuevaPlantillaTurno.TipoTurno = angular.copy(vm.data.tipoTurno);
					vm.data.nuevaPlantillaTurno.IdTipoTurno = angular.copy(vm.data.tipoTurno.Id);

					vm.data.nuevaPlantillaTurno.IdTipoPrestacionesAsignables =
						angular.copy(vm.data.prestacionesAsignables.Id);

					vm.data.nuevaPlantillaTurno.TipoPrestacionesAsignables =
						angular.copy(vm.data.prestacionesAsignables.Nombre);

					vm.data.nuevaPlantillaTurno.HoraDesde = moment(vm.data.horaDesde).format("HH:mm");
					vm.data.nuevaPlantillaTurno.HoraHasta = moment(vm.data.horaHasta).format("HH:mm");

					vm.data.nuevaPlantillaTurno.EdadMinima = angular.copy(vm.data.EdadMinima);
					vm.data.nuevaPlantillaTurno.EdadMaxima = angular.copy(vm.data.EdadMaxima);
					if (vm.data.nuevaPlantillaTurno.EdadMinima !== 0 && vm.data.nuevaPlantillaTurno.EdadMaxima == 0) {
						AlertaService.NewWarning("Si se especifica una edad minima, debe especificarse una edad maxima");
						return;
					}

					if (vm.data.nuevaPlantillaTurno.EdadMinima > vm.data.nuevaPlantillaTurno.EdadMaxima) {
						AlertaService.NewWarning("La edad maxima debe ser mayor a la edad minima");
						return;
					}


					vm.data.nuevaPlantillaTurno.Sucursal = angular.copy(vm.data.sucursal.Nombre);
					vm.data.nuevaPlantillaTurno.IdSucursal = angular.copy(vm.data.sucursal.Id);

					vm.data.nuevaPlantillaTurno.IdSalaEspera = (vm.data.salaSucursal) ? angular.copy(vm.data.salaSucursal.Id) : 0;
					vm.data.nuevaPlantillaTurno.SalaEspera = (vm.data.salaSucursal) ? angular.copy(vm.data.salaSucursal.Nombre) : '-';

					vm.data.nuevaPlantillaTurno.IdConsultorio = (vm.data.consultorio) ? angular.copy(vm.data.consultorio.Id): 0;
					vm.data.nuevaPlantillaTurno.Consultorio = (vm.data.consultorio) ? angular.copy(vm.data.consultorio.Nombre): '-';

					vm.data.nuevaPlantillaTurno.VisibleAutogestionWeb = angular.copy(vm.data.visiblePortal || false);

					if(vm.data.ProfesionalAtiende && vm.data.ProfesionalAtiende.Id){
						vm.data.nuevaPlantillaTurno.IdProfesionalAtiende = angular.copy(vm.data.ProfesionalAtiende.Id);
						vm.data.nuevaPlantillaTurno.ProfesionalAtiende = angular.copy(vm.data.ProfesionalAtiende.Nombre);
					}else {
						vm.data.nuevaPlantillaTurno.IdProfesionalAtiende = 0;
						vm.data.nuevaPlantillaTurno.ProfesionalAtiende = "";
					}


					//consulto si es sobreturno
					vm.data.nuevaPlantillaTurno.Sobreturno = angular.copy(vm.data.esSobreTurnoBack);

					if (vm.data.itemPlantillaToEdit !== null)
						vm.data.nuevaPlantillaTurno.IdEvent = angular.copy(vm.data.itemPlantillaToEdit.IdEvent);

					$log.debug('"vm.data.nuevaPlantillaTurno.-', vm.data.nuevaPlantillaTurno);
					$log.debug('prestaciones x sucursal cambiados', vm.data.prestacionesXsucursal);

					if (vm.data.DiaSemana) {
						vm.data.nuevaPlantillaTurno.Dia = angular.copy(vm.data.DiaSemana.Nombre);
						vm.data.nuevaPlantillaTurno.IdDia = angular.copy(vm.data.DiaSemana.Id);
						$uibModalInstance.close(vm.data.nuevaPlantillaTurno);
					}

					if (vm.data.nuevaPlantillaTurno.IdTipoPrestacionesAsignables === 4) {

						angular.forEach(vm.data.prestacionesXsucursal, function (value) {

							if (value.status === true) {

								var item_prestacion: any = {};
								item_prestacion.IdPrestacion = value.Id;
								item_prestacion.Prestacion = value.Nombre;
								vm.data.nuevaPlantillaTurno.PrestacionesAsignables.push(item_prestacion);
							}

						});

					}
					// tengo grupo de prestaciones 
					else if (vm.data.nuevaPlantillaTurno.IdTipoPrestacionesAsignables === 5) {
						angular.forEach(vm.data.grupoPrestacionesXsucursal, function (grupoPrestacion) {
							if (grupoPrestacion.status === true) {
								var item_grupo_prestacion: any = {};
								item_grupo_prestacion.IdGrupoDePrestaciones = grupoPrestacion.Id;
								item_grupo_prestacion.GrupoDePrestaciones = grupoPrestacion.Nombre;
								vm.data.nuevaPlantillaTurno.GrupoDePrestacionesAsignables.push(item_grupo_prestacion);
							}
						})
					}

					if (vm.data.esSobreTurnoBack) {
						$log.error('Es sobreturno', vm.data.esSobreTurnoBack);
						vm.data.nuevaPlantillaTurno.EsSobreTurno = true;

					} else {

						$uibModalInstance.close(vm.data.nuevaPlantillaTurno);
					}

				}

			}

			function guardarCopia(isValid) {

				//consulto si el dia y la hora es distinta al que tenemos
				vm.data.nuevaPlantillaTurno.GuardarCopia = true;
				newPlantillaData(isValid)

			}

			function borrarItem() {

				ModalService.confirm('Esta seguro que desea eliminar el item? ',
					function (_pOk) {
						if (_pOk) {
							//obtengo el id del item para borrar
							var _idPlantillaToDelete = {
								Error: "Borrar",
								IdEvent: angular.copy(vm.data.itemPlantillaToEdit.IdEvent)
							}

							$uibModalInstance.dismiss(_idPlantillaToDelete);
						}

					}, "", optionsObj);

			}


			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			function activate() {

				$log.debug('Inicializar plantillaModalNewController ON.-');

				vm.formControl.loading = true;

				// Si es TURNO COMUN
				if (!vm.data.esSobreTurnoBack) {

					// Si viene definido del calendario el rango horario
					if (vm.data.startTime && vm.data.endTime) {
						vm.data.diaSemana = angular.copy(vm.data.startTime.format("dddd"));
						vm.data.numeroDiaSemana = angular.copy(vm.data.startTime.format("e"));
						vm.data.horaDesde = vm.data.startTime.toDate();
						vm.data.horaHasta = vm.data.endTime.toDate();
					}
					else {
						// Setear hora por defecto
						vm.data.horaDesde = new Date();
						vm.data.horaHasta = moment().add(30, 'm').toDate();
						vm.data.isSobreturno = angular.copy(vm.data.esSobreTurnoBack);
					}

				} else {
					// Si es SOBRETURNO
					// Setear hora por defecto
					vm.data.horaDesde = new Date();
					vm.data.horaHasta = moment().add(30, 'm').toDate();
					vm.data.isSobreturno = angular.copy(vm.data.esSobreTurnoBack);
				}

				var _nuevaPlantillaTurno = PlantillaDataService.obtenerNuevoItemDePlantillaTurno();
				var _tiposSexo = TipoSexoDataService.getAllTipoSexo();
				var _tiposDeTurnos = PlantillaDataService.obtenerTiposDeTurnos();
				var _tiposDePrestacionesAsignables = PlantillaDataService.obtenerTiposDePrestacionesAsignables();
				var _diasSemana = MantenimientoAgendaDataService.obtenerDiasSemana();
				if (angular.isUndefined(vm.data.recurso.IdTipoRecurso)) vm.data.recurso.IdTipoRecurso = angular.copy(vm.data.recurso.IdTipoRecurso);
				var _sucursales = SucursalDataService.obtenerSucursalXRecursoXServicio(vm.data.recurso.Id,
					vm.data.recurso.IdTipoRecurso, vm.data.servicio.Id);

				$q.all([
					_nuevaPlantillaTurno,
					_tiposSexo,
					_tiposDeTurnos,
					_tiposDePrestacionesAsignables,
					_diasSemana,
					_sucursales

				])
					.then(activateOk, activateError);

				function activateOk(pResults) {

					vm.formControl.loading = false;
					$log.error('obtengoResult', pResults);

					vm.data.nuevaPlantillaTurno = pResults[0];
					vm.data.tiposSexo = pResults[1];
					var sexoAmbos = {
						fecha_baja: null,
						Id: 0,
						Nombre: "AMBOS"
					};
					vm.data.tiposSexo.unshift(sexoAmbos);
					vm.data.tiposSexo.pop();
					vm.data.tiposDeTurno = pResults[2];
					vm.data.tiposDePrestacionesAsignables = pResults[3];
					vm.data.diasDeSemana = pResults[4];
					vm.data.sucursales = pResults[5];
					
					//

					// si es Aparato o Equipo muestro el combo select de Profesionales por Sucursal
					if (vm.data.recurso.IdTipoRecurso === 2) vm.data.ocultarProfesionalSelect = false;
					if (vm.data.recurso.IdTipoRecurso === 3) vm.data.ocultarProfesionalSelect = false;

					//voy a editar la plantilla levantada
					if (vm.data.itemPlantillaToEdit !== null) {

						$log.debug('item de PlantillaToEdit', vm.data.itemPlantillaToEdit);

						// buscar el profesional x Id 
						//vm.data.nuevaPlantillaTurno.IdProfesionalAtiende = angular.copy(vm.data.itemPlantillaToEdit.ProfesionalAtiende.Id);
						//vm.data.nuevaPlantillaTurno.ProfesionalAtiende = angular.copy(vm.data.itemPlantillaToEdit.ProfesionalAtiende.Nombre);
						vm.data.EdadMinima = angular.copy(vm.data.itemPlantillaToEdit.EdadMinima);
						vm.data.EdadMaxima = angular.copy(vm.data.itemPlantillaToEdit.EdadMaxima);

						vm.data.nuevaPlantillaTurno.Cupo = angular.copy(vm.data.itemPlantillaToEdit.Cupo);
						//seteo el guardar copia como false, si voy a editar simplemente
						//despues en el copiar, lo seteo en true si es necesario
						vm.data.nuevaPlantillaTurno.GuardarCopia = false;

						//seteo dia para el edit
						vm.data.DiaSemana = vm.data.diasDeSemana.find(x => x.Id == vm.data.itemPlantillaToEdit.IdDia);

						var sucursalToLoad: any = {};
						sucursalToLoad.Id = angular.copy(vm.data.itemPlantillaToEdit.IdSucursal);
						vm.data.sucursal = vm.data.sucursales.find(x => x.Id === sucursalToLoad.Id);


						vm.data.esSobreTurnoBack = angular.copy(vm.data.itemPlantillaToEdit.EsSobreTurno);


						vm.data.minutosTurno =
							vm.minutosTurno.find(x => x.minutos === vm.data.itemPlantillaToEdit.DuracionMinima);

						vm.data.prestacionesAsignables =
							angular.copy(vm.data.itemPlantillaToEdit.IdTipoPrestacionesAsignables);

						if (vm.data.itemPlantillaToEdit.Sexo === "M") vm.data.itemPlantillaToEdit.IdSexo = 4;
						else if (vm.data.itemPlantillaToEdit.Sexo === "F") vm.data.itemPlantillaToEdit.IdSexo = 5;
						else if (vm.data.itemPlantillaToEdit.Sexo === "AMBOS") vm.data.itemPlantillaToEdit.IdSexo = 0;

						vm.data.nuevaPlantillaTurno.Sexo =
							vm.data.tiposSexo.find(x => x.Id == vm.data.itemPlantillaToEdit.IdSexo);

						vm.data.tipoTurno =
							vm.data.tiposDeTurno.find(x => x.Id == vm.data.itemPlantillaToEdit.IdTipoTurno);


						vm.formControl.getPrestacionXSucursal(vm.data.sucursal)
							.then(function (pResult) {

								if (pResult)
									$timeout(function () {

										vm.data.prestacionesAsignables = vm.data.tiposDePrestacionesAsignables.find(x => x.Id ==
											vm.data.itemPlantillaToEdit.IdTipoPrestacionesAsignables);

										angular.forEach(vm.data.prestacionesXsucursal, function (value) {

											if (vm.data.itemPlantillaToEdit.PrestacionesAsignables.length > 0)
												angular.forEach(vm.data.itemPlantillaToEdit.PrestacionesAsignables, function (prestaciones) {

													if (value.Id === prestaciones.IdPrestacion) {
														$log.debug('entre a true es igual', value.IdPrestacion, prestaciones.IdPrestacion);
														value.status = true;
													}
												});
										});

									}, 200);

							}, function (pError) {
								cancel();
							});

						vm.formControl.getGruposPrestacionesXSucursal(vm.data.sucursal)
							.then(function (pResult) {

								if (pResult) {
									$timeout(function () {

										vm.data.prestacionesAsignables = vm.data.tiposDePrestacionesAsignables.find(x => x.Id ==
											vm.data.itemPlantillaToEdit.IdTipoPrestacionesAsignables);

										angular.forEach(vm.data.grupoPrestacionesXsucursal, function (value) {

											angular.forEach(vm.data.itemPlantillaToEdit.GrupoDePrestacionesAsignables, function (grupoPrestacion) {

												if (value.Id === grupoPrestacion.IdGrupoDePrestaciones) {
													value.status = true;
												}
											});
										});

									}, 200);
								}

							}, function (pError) {
								cancel();
							})

						vm.formControl.getSalasXSucursal(vm.data.sucursal)
							.then(function (pResult) {

								if (pResult) {

									vm.data.salaSucursal = vm.data.salasXSucursal.find(x => x.Id == vm.data.itemPlantillaToEdit.IdSalaEspera);

									vm.formControl.getConsultoriosXSala(vm.data.salaSucursal)
										.then(function (pConsultorios) {

											if (pConsultorios) {
												vm.data.consultorio = vm.data.consultoriosXSala.find(x => x.Id == vm.data.itemPlantillaToEdit.IdConsultorio);
											}

										}, function (pConsultoriosError) {
											cancel();
										});
								}

							}, function (pError) {
								cancel();
							});

						vm.formControl.getProfesionalesXSucursal(vm.data.sucursal)
						.then(function (pResult) {
							if (pResult) {
								// busco en vm.data.profesionalesDeUnServicioEnSucursal el Id que viene en la plantillaEdit.IdProfesionalAtiende y y asigo el objeto a vm.data.ProfesionalAtiende 
								// para mnostrarlo en el HTML
								vm.data.ProfesionalAtiende = 
								angular.copy(vm.data.profesionalesDeUnServicioEnSucursal.find(x => x.Id === vm.data.itemPlantillaToEdit.IdProfesionalAtiende));
							}

						}, function (pError) {
							cancel();
						});

							vm.data.visiblePortal = angular.copy(vm.data.itemPlantillaToEdit.VisibleAutogestionWeb);


					} else {

						vm.data.minutosTurno =
							vm.minutosTurno.find(x => x.minutos === 15);
						vm.data.nuevaPlantillaTurno.Sexo =
							vm.data.tiposSexo.find(x => x.Nombre == 'AMBOS');
						vm.data.EdadMinima = 0;
						vm.data.EdadMaxima = 0;

						var diaSemanaBack = angular.copy(+vm.data.numeroDiaSemana);
						diaSemanaBack = diaSemanaBack + 1;
						vm.data.DiaSemana = vm.data.diasDeSemana.find(x => x.Id === diaSemanaBack);

						$log.debug('dia semana obtenido', vm.data.DiaSemana);
						$log.debug('no hay plantilla para editar');

						// Si tengo servicio DIAG X IMAGENES (Id == 30) => seteo el tipo de turno practica
						// Y ademas la sala de espera y consultorio NO DEBEN SER CAMPOS OBLIGATORIOS
						if(vm.data.servicio && vm.data.servicio.Id == 30){
							vm.data.tipoTurno = vm.data.tiposDeTurno.find(x => x.Id == 5);
						}

					}

					$log.debug('Inicializar OK.-', pResults);

				}

				function activateError(pError) {

					$uibModalInstance.dismiss(pError);
					$log.error('Inicializar ERROR.-', pError);
				}

				//inicializarVariables();
			}

			function isDiagnosticoPorImagenes(){ 
				let ret = false;
				//consultamos si es servicio medico
				if(vm.data.servicio && vm.data.servicio.Id == 30){
					//es servicio medico => consultamos si los campos con error son
					//sala de espera y consultorio, que no deben ser obligatorios en este caso
					if (!vm.data.salaSucursal || !vm.data.consultorio) { 
						ret = true;
					}
				}
				return ret;
			}
		}
	};

	return module;
})();