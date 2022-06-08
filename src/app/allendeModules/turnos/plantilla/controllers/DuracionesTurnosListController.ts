/**
 * @author:			Pablo Pautasso
 * @description:	Controller para duraciones de turnos de recurso
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('DuracionesTurnosListController', DuracionesTurnosListController);

		DuracionesTurnosListController.$inject = [
			'Logger', '$q', '$filter', '$state', '$stateParams', 'orderByFilter', 'ModalService',
			'AlertaService', 'PlantillaDataService', 'PrestacionGestionDataService',
			'PlantillaLogicService', 'StateHelperService', 'TurnosStorageHelperService'
		];

		function DuracionesTurnosListController(
			$log, $q, $filter, $state, $stateParams, orderByFilter, ModalService,
			AlertaService, PlantillaDataService, PrestacionGestionDataService,
			PlantillaLogicService, StateHelperService, TurnosStorageHelperService
		) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DuracionesTurnosListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: "Lista de Duración de Turnos"
			};

			vm.data = {

				duracionTurnoNuevo: {},
				duraciones: {},
				idServicio: $stateParams.idServicio,
				idRecurso: $stateParams.idRecurso,
				idTipoRecurso: $stateParams.idTipoRecurso

			};

			vm.formData = {
				// edit: editDuracion,
				// delete: eliminarDuracion
			};


			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				save: methodSave,
				cancel: volver,
				new: nuevaDuracion,
				edit: editDuracion,
				delete: eliminarDuracion,
				getEdadDuracion: getEdadDuracion,
				verAuditoria: verAuditoria
			};

			vm.storage = {
				keyToStorage: "turnos-plantilla-editcontroller-data"
			};

			vm.order = {
				id: 1,
				value: 'TipoTurno',
				descripcion: 'TipoTurno (Asc)',
				reverse: false
			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};

			/* ---------------------------------------- MENU OPTIONS ---------------------------------------- */

			vm.menuOptions = [
				// NEW IMPLEMENTATION
				{
					text: 'Agregar', 					
					click: function ($itemScope, $event, modelValue, text, $li) {
						nuevaDuracion();
					}
				},
				{
					text: 'Editar',
					click: function ($itemScope, $event, modelValue, text, $li) {
						editDuracion($itemScope.duracion);
					}
				},
				{
					text: 'Borrar',
					click: function ($itemScope, $event, modelValue, text, $li) {
						eliminarDuracion($itemScope.duracion);
					}
				},
				{
					text: 'Ver Auditoría Regla Duración',
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.verAuditoria($itemScope.duracion);
					}
				}
			];

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function methodSave() {

			}


			function orderFilas() {

				vm.data.duraciones = orderByFilter(vm.data.duraciones, vm.order.value, vm.order.reverse);


			}

			function volver() {

				StateHelperService.goToPrevState();
			}

			function getEdadDuracion(duracion) {

				if (duracion.FiltrarEdad) return "De: " + duracion.FiltrarEdadMinima + " a " + duracion.FiltrarEdadMaxima;
				else return "-";

			}

			function nuevaDuracion() {

				$log.debug('nueva duracion', vm.data.idServicio, vm.data.idTipoRecurso, vm.data.idRecurso);


				PlantillaLogicService.viewListDuracionTurnos(vm.data.idServicio, vm.data.idRecurso,
						vm.data.idTipoRecurso, null)
					.then(function successListDuracion(pResult) {

						$log.debug('Message', pResult);
						activate();


					}, function errorListDuracion(pError) {

						$log.error('error viewListDuracionTurnos', pError);
						activate();

					});


			}

			function editDuracion(duracion) {

				$log.debug('edit duracion', duracion);

				PlantillaLogicService.viewListDuracionTurnos(vm.data.idServicio, vm.data.idRecurso,
						vm.data.idTipoRecurso, duracion.Id)
					.then(function successListDuracion(pResult) {

						$log.debug('Message', pResult);
						activate();


					}, function errorListDuracion(pError) {

						$log.error('error viewListDuracionTurnos', pError);

					});

			}

			function eliminarDuracion(duracion) {

				$log.debug('eliminar duracion', duracion);

				ModalService.confirm('Atencion! Desea eliminar la duracion seleccionada?',
					function(pResult) {
						
						if (pResult) {

								vm.formControl.loading = true;
								PlantillaDataService.validarEliminarDuracion(duracion.Id)
									.then(function(pResponse) {
										$log.debug("ValidacionEliminar", pResponse);
										if (pResponse.IsOk === true) {
											vm.formControl.loading = true;
											PlantillaDataService.eliminarDuracion(duracion.Id)
												.then(function(pResp) {
													$log.debug('resp',pResp);
													vm.formControl.loading = false;
													AlertaService.NewSuccess("Duración Borrada Correctamente");
													
													activate();
												}).catch(function(pErr) { 
													vm.formControl.loading = false;
													AlertaService.NewError("No se pudo borrar la duración");
													$log.error('ValidacionEliminar .-', pErr);
												});
										} else {
											if (pResponse.Message != null)
												AlertaService.NewError(pResponse.Message);
											else
												AlertaService.NewError("Error de servidor");
											vm.formControl.loading = false;
										}
									});

						} 
					}, "", optionsObj);

			}

			function verAuditoria(receso) {
				let _options: IAuditoriaPorIdModalOptions = {};
				_options.dataService = "PlantillaDataService";
				_options.method = "obtenerAuditoriaReglasDuracionesDeTurnos";
				_options.idElemento = receso.Id;
				_options.tituloModal = "Auditoría Receso";
				
				ModalService.openAuditoriaElementoPorId(_options);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				if (TurnosStorageHelperService.existStoredObjects(vm.storage.keyToStorage)) {

					$log.debug('data stored exist', TurnosStorageHelperService.getStorageObj(vm.storage.keyToStorage));
					getStoredData(TurnosStorageHelperService.getStorageObj(vm.storage.keyToStorage));

				}


				var _duracionTurnoNuevoDto = PlantillaDataService.obtenerNuevoDuracionTurno();
				var _duraciones = PlantillaDataService.obtenerDuracionesPorServicioEnRecurso(
					vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso);
				var _tiposDeTurnos = PlantillaDataService.obtenerTiposDeTurnos();
				var _prestaciones;

				if (vm.data.idServicio)
					_prestaciones = PrestacionGestionDataService.getTodasPrestacionesXServicio(vm.data.idServicio);
				else $log.debug('vuelve');


				$q.all([
						_duracionTurnoNuevoDto,
						_duraciones,
						_tiposDeTurnos,
						_prestaciones
					])
					.then(successCallback, errorCallback);

				function successCallback(pResults) {

					vm.data.duracionTurnoNuevo = pResults[0];
					vm.data.duraciones = pResults[1];
					vm.data.tiposDeTurno = pResults[2];
					vm.data.prestaciones = pResults[3];

					var objNingunTipoTurno = {
						Id: 0,
						Nombre: "Cualquiera"
					};

					vm.data.tiposDeTurno.push(objNingunTipoTurno);

					var objNingunaPrestacion = {
						Id: 0,
						Nombre: "Cualquiera"
					};

					vm.data.prestaciones.push(objNingunaPrestacion);

					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
					orderFilas();
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					AlertaService.NewError("Error", pError.message);
				}
			}


			/* ---------------------------------------------- STORAGE ---------------------------------------------- */

			function getStoredData(stored) {

				$log.debug('getStoredData', stored);

				vm.data.idRecurso = stored.recurso ? angular.copy(stored.recurso.IdRecurso || stored.recurso.Id) : 0;
				vm.data.idServicio = stored.servicioMedico ? angular.copy(stored.servicioMedico.Id) : 0;
				vm.data.idTipoRecurso = stored.recurso ? angular.copy(stored.recurso.IdTipoRecurso) : 0;


			}


			/* ---------------------------------------------- END ---------------------------------------------- */

		}
	};

	return module;
})();