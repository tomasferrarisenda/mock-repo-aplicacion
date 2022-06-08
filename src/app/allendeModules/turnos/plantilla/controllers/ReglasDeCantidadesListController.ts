/**
 * @author:			Javi Delmastro
 * @description:	Controller para la lista de Reglas de Cantidades de Turnos	
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ReglasDeCantidadesListController', ReglasDeCantidadesListController);

		ReglasDeCantidadesListController.$inject = [
			'$location', 'Logger', '$q', '$filter',
			'ModalService', 'AlertaService',
			'StateHelperService', 'PlantillaDataService', '$stateParams', 'PlantillaLogicService'

		];

		function ReglasDeCantidadesListController(
			$location, $log, $q, $filter,
			ModalService: IModalService, AlertaService,
			StateHelperService, PlantillaDataService, $stateParams, PlantillaLogicService) {


			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ReglasDeCantidadesListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.today = new Date();

			var entidad = "";

			if ($stateParams.idTipoDemanda === 1) {
				vm.title = {
					page: "Lista de reglas de cantidades de Turnos"
				};
			}
			else
				if ($stateParams.idTipoDemanda === 2) {
					vm.title = {
						page: "Lista de reglas de cantidades de Sobreturnos"
					};
				}

			vm.data = {
				idServicio: $stateParams.idServicio,
				idRecurso: $stateParams.idRecurso,
				idTipoRecurso: $stateParams.idTipoRecurso,
				idTipoDemanda: $stateParams.idTipoDemanda,
				mostrarReglasEliminadas: false
			};

			vm.formData = {
				// editarRegla: editarRegla,
				// eliminarRegla: eliminarRegla
			}

			vm.formControl = {
				loading: false,
				error: true,
				reloadPage: activate,
				editarRegla: editarRegla,
				eliminarRegla: eliminarRegla,
				nuevaRegla: nuevaRegla,
				volver: volver,
				changeMostrarReglasEliminadas: changeMostrarReglasEliminadas,
				sincronizarReglas: sincronizarReglas

			}

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};


			/* ---------------------------------------- MENU OPTIONS ---------------------------------------- */

			vm.menuOptions = [
				// NEW IMPLEMENTATION
				{
					text: 'Agregar',
					displayed: function (modelValue) {
						return modelValue.regla.EstadoActivo;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.nuevaRegla();
					}
				},
				{
					text: 'Editar',
					displayed: function (modelValue) {
						return modelValue.regla.EstadoActivo;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.editarRegla($itemScope.regla);
					}
				},
				{
					text: 'Borrar',
					displayed: function (modelValue) {
						return modelValue.regla.EstadoActivo;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.eliminarRegla($itemScope.regla);
					}
				},
				{
					text: 'Ver Auditoria Regla',
					displayed: function (modelValue) {
						return true;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {
						verAuditoriaRegla($itemScope.regla.Id);
					}
				}
			];


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */


			function volver() {
				StateHelperService.goToPrevState();
			}


			function nuevaRegla() {
				$log.debug('nueva regla', vm.data.idServicio, vm.data.idTipoRecurso, vm.data.idRecurso, vm.data.idTipoDemanda);

				PlantillaLogicService.viewReglaCantidadTurnosDetalle(vm.data.idServicio, vm.data.idRecurso,
					vm.data.idTipoRecurso, vm.data.idTipoDemanda, null)
					.then(function successListDuracion(pResult) {
						$log.debug('Message', pResult);
						changeMostrarReglasEliminadas();
					},
						function errorListDuracion(pError) {
							$log.error('error viewReglaCantidadTurnosDetalle', pError);
							changeMostrarReglasEliminadas();
						});
			}

			function editarRegla(regla) {
				$log.debug('editar regla', regla, vm.data.idServicio, vm.data.idTipoRecurso, vm.data.idRecurso, vm.data.idTipoDemanda);

				PlantillaLogicService.viewReglaCantidadTurnosDetalle(vm.data.idServicio, vm.data.idRecurso,
					vm.data.idTipoRecurso, vm.data.idTipoDemanda, regla.Id)
					.then(function successListDuracion(pResult) {
						$log.debug('Message', pResult);
						changeMostrarReglasEliminadas();
					},
						function errorListDuracion(pError) {
							$log.error('error viewReglaCantidadTurnosDetalle', pError);
							changeMostrarReglasEliminadas();
						});
			}

			function eliminarRegla(regla) {
				$log.debug('eliminar regla', regla);

				ModalService.confirm('Atencion! Desea eliminar la regla seleccionada?',
					function (pResult) {

						if (pResult) {

							vm.formControl.loading = true;
							PlantillaDataService.validarEliminarRegla(regla.Id)
								.then(function (pResponse) {
									$log.debug("ValidacionEliminar", pResponse);
									if (pResponse.IsOk === true) {
										vm.formControl.loading = true;
										PlantillaDataService.eliminarRegla(regla.Id)
											.then(function (pResp) {
												$log.debug('resp', pResp);
												vm.formControl.loading = false;
												AlertaService.NewSuccess("Regla Borrada Correctamente");

												changeMostrarReglasEliminadas();
											}).catch(function (pErr) {
												vm.formControl.loading = false;
												AlertaService.NewError("No se pudo borrar la Regla");
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

			function changeMostrarReglasEliminadas() {
				if (vm.data.mostrarReglasEliminadas) {
					// busco con reglas eliminadas
					vm.formControl.loading = true;
					PlantillaDataService.obtenerReglasPorServicioRecursoConEliminadas(vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso, vm.data.idTipoDemanda)
						.then((pResult) => {

							$log.debug('pResult', pResult);
							vm.data.reglas = pResult;
							vm.formControl.loading = false;
						}, (pError) => {
							$log.error('pError', pError);
							vm.formControl.loading = false;
						});
				} else {
					// busco con reglas comunes
					vm.formControl.loading = true;
					PlantillaDataService.obtenerReglasPorServicioEnRecurso(vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso, vm.data.idTipoDemanda)
						.then((pResult) => {

							$log.debug('pResult', pResult);
							vm.data.reglas = pResult;
							angular.forEach(vm.data.reglas, function (regla) {
								regla.EstadoActivo = true;
							})
							vm.formControl.loading = false;
						}, (pError) => {
							$log.error('pError', pError);
							vm.formControl.loading = false;
						});
				}
			}

			function verAuditoriaRegla(idRegla) {

				let _options: IAuditoriaPorIdModalOptions = {};
				_options.dataService = "PlantillaDataService";
				_options.method = "obtenerAuditoriaPorReglaId";
				_options.idElemento = idRegla;
				_options.tituloModal = "Auditoría regla";

				ModalService.openAuditoriaElementoPorId(_options);
			}

			function sincronizarReglas() {
				// voy a sincronizar las reglas actuales con las de sobreturnos
				// primero consultamos cuantas reglas se van a modificar en sobreturnos
				vm.formControl.loading = true;
				var _reglas = PlantillaDataService.obtenerReglasPorServicioEnRecurso(
					vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso, 2)
					.then((pResultReglasSobreturnos) => {
						$log.debug('pResultReglasSobreturnos', pResultReglasSobreturnos);

						if (pResultReglasSobreturnos.length == 0) {
							sincroReglas();
						}else {
							var optionsObj = {
								ok: 'Si',
								cancel: 'No'
							};
	
							ModalService.confirm("Atención, existen " + pResultReglasSobreturnos.length + " reglas en sobreturnos que se van a sobrescribir. Desea continuar?",
								(_pOk) => {
									if (_pOk) {
										sincroReglas();
									};
								}, "", optionsObj);
						}


					}, (pError) => {
						$log.error('pError', pError);
					});
			}

			function sincroReglas() {
				PlantillaDataService.sincronizarReglas(vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso, 1, 2)
					.then((pResult) => {
						$log.debug('pResult', pResult);
						vm.formControl.loading = false;
						AlertaService.NewSuccess("Sincronización de reglas correctamente");
					}, (pError) => {
						$log.error('pError', pError);
						vm.formControl.loading = false;
					});
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate() {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				var _reglas = PlantillaDataService.obtenerReglasPorServicioEnRecurso(
					vm.data.idServicio, vm.data.idRecurso, vm.data.idTipoRecurso, vm.data.idTipoDemanda);

				$q.all([_reglas]).then(successCallback, errorCallback);

				function successCallback(pResults) {
					vm.data.reglas = pResults[0];
					angular.forEach(vm.data.reglas, function (regla) {
						regla.EstadoActivo = true;
					})

					vm.formControl.loading = false;
					vm.formControl.error = false;
					$log.debug('Inicializar OK.-', pResults);
				}

				function errorCallback(pError) {
					vm.formControl.loading = false;
					vm.formControl.error = true;
					$log.error('Inicializar ERROR.-', pError);
					ModalService.error(pError.message);
				}
			}

		}
	};

	return module;
})();