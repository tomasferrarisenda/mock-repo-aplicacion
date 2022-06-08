import * as angular from 'angular';

export default (function () {
	'use strict';


	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('RecesosListController', RecesosListController);

		// Inyección de Dependencia
		RecesosListController.$inject = ['$log', '$q', '$filter', '$scope', '$timeout', 'ModalService',
			'User', 'TurnosStorageHelperService', 'ReprogramacionTurnosAuthService',
			'MantenimientoAgendaDataService',
			'MantenimientoAgendaAuthService', '$state',
			'AlertaService', 'moment'
		];

		// Constructor del Controller
		function RecesosListController($log, $q, $filter, $scope, $timeout, ModalService,
			User, TurnosStorageHelperService, ReprogramacionTurnosAuthService,
			MantenimientoAgendaDataService,
			MantenimientoAgendaAuthService, $state,
			AlertaService, moment

		) {

			//$log.debug('RecesosListController: ON.-');

			// En this va lo que se modifica de la vista (VM: ViewModel)				
			var vm = this;

			vm.user = User;
			vm.title = {
				module: 'RECESOS',
				page: 'Lista Recesos'
			};

			vm.data = {
				recesos: [],
				estados: []
			};

			vm.filter = {
				recesos: [],
				fechaDesde: '',
				fechaHasta: '',
				estado: '',
				recurso: null,
				clean: cleanFilters,
				validar: validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 10,
				totalItems: 0,
				pageChanged: getPage,
				getPage: getPage
			};

			vm.formControl = {
				error: true,
				loading: false,
				reloadPage: activate,
				aplicar: aplicar,
				editar: editar,
				cancelar: cancelar,
				eliminar: eliminar,
				buscar: buscar,
				agregar: agregar,
				verItems: verItems,
				desdeChange: desdeChange,

				reprogramarTurnos: reprogramarTurnos,
				changeRecurso: changeRecurso,
				changeServicioMedico: changeServicioMedico,

				verAuditoria: verAuditoria,
				nuevoRecesoIndividual: nuevoRecesoIndividual
			};

			vm.validar = {
				puedeAgregar: validarPuedeAgregar,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEliminar,
				puedeAplicar: validarPuedeAplicar,
				puedeEstadoReceso: puedeEstadoReceso
			};

			vm.storage = {
				keyToStorageRecesoList: "turnos-plantilla-recesolistcontroller-data"
			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};

			vm.tiposRecesos = [{
				Id: 1,
				Nombre: "Receso por bloques"
			}, {
				Id: 2,
				Nombre: "Receso individual"
			}]


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function desdeChange() {
				$log.debug('vm cambio', vm.data.fechaDesde);
			}

			function aplicar(idReceso) {

				if (MantenimientoAgendaAuthService.puedeAplicarReceso(User)) {
					MantenimientoAgendaDataService.obtenerImpactoAplicarReceso(idReceso)
						.then(obtenerImpactoOk, obtenerImpactoError);

				} else {
					AlertaService.NewWarning("Atención", "Usted no tiene PERMISO para realizar esta acción");
				}
				function obtenerImpactoOk(pResult) {
					$log.debug('impacto cantidad de turnos afectados', pResult);

					if (pResult > 0) {
						ModalService.confirm('Atencion, si se aplica el receso, ' + pResult + ' turnos serán ' +
							'afectados. Desea continuar?',
							function (pOk) {

								if (pOk) {
									$log.debug('Si acepto aplicar el receso', pOk);
									aplicarReceso(idReceso);
								}

							}, "", optionsObj);
					} else if (pResult === 0) {
						$log.debug('no hay turnos afectados entonces aplico');
						ModalService.confirm('Atencion, desea aplicar el receso?',
							function (_pOk) {
								if (_pOk) {
									aplicarReceso(idReceso);
								}

							}, "", optionsObj);
					}
				}

				function obtenerImpactoError(pError) {
					$log.error('Error', pError);
				}

			}

			function aplicarReceso(idReceso) {

				$log.debug('Aplique el receso con id', idReceso);
				MantenimientoAgendaDataService.validarAplicarReceso(idReceso)
					.then(function (result) {
						if (result.IsOk === false) {
							AlertaService.NewError("Error", result.Message);
							return;
						} else {
							MantenimientoAgendaDataService.aplicarReceso(idReceso)
								.then(function () {
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

			function cancelar(idReceso) {

				if (MantenimientoAgendaAuthService.puedeAplicarReceso(User)) {

					ModalService.confirm('¿Desea cancelar el receso?',
						function (pResult) {
							if (pResult) {
								MantenimientoAgendaDataService.validarCancelarReceso(idReceso)
									.then(function (result) {
										if (result.IsOk === false) {
											AlertaService.NewError("Error", result.Message);
											return;
										} else {
											MantenimientoAgendaDataService.cancelarReceso(idReceso)
												.then(function () {
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
						});
				} else AlertaService("Atención", "Usted no tiene PERMISO para realizar la acción");

			}

			function editar(receso) {

				if (MantenimientoAgendaAuthService.puedeEditarReceso(User)) {

					setStoredData();

					if (receso.IdTipoReceso == 2) {
						
						$state.go('turno.mantenimientoagenda.editrecesoindividual', {
							edit: 1,
							servicio: vm.data.servicioMedico,
							recurso: vm.filter.recurso,
							fechaDesde: receso.FechaDesde,
							fechaHasta: receso.FechaHasta
						});

					} else {
						$state.go('turno.mantenimientoagenda.editrecesos', {
							idReceso: receso.Id,

						});
					}

				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");

			}

			function eliminar(idReceso) {

				if (MantenimientoAgendaAuthService.puedeEliminarReceso(User)) {

					ModalService.confirm('¿Desea eliminar el receso?',
						function (pResult) {
							if (pResult) {
								MantenimientoAgendaDataService.validarEliminarReceso(idReceso)
									.then(function (result) {
										if (result.IsOk === false) {
											AlertaService.NewError("Error", result.Message);
											return;
										} else {
											MantenimientoAgendaDataService.eliminarReceso(idReceso)
												.then(function () {
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
						});
				} else AlertaService.NewWarning("Atención", "Usted no tiene PERMISO para realizar la acción");

			}

			function agregar() {

				if (MantenimientoAgendaAuthService.puedeAgregarReceso(User)) {

					setStoredData();
					if (vm.data.servicioMedico && vm.filter.recurso) {

						$state.go('turno.mantenimientoagenda.editrecesos', {
							servicio: vm.data.servicioMedico,
							recurso: vm.filter.recurso
						});

					} else {

						$state.go('turno.mantenimientoagenda.editrecesos');
					}
				} else AlertaService.NewWarning("Atención", "No cuenta con PERMISO para realizar esta acción");

			}

			function verItems(pIdReceso) {
				for (var i = vm.filter.recesos.length - 1; i >= 0; i--) {
					if (vm.filter.recesos[i].Id == pIdReceso) {
						vm.filter.recesos[i].VerItems = !vm.filter.recesos[i].VerItems;
					}
				}
			}

			function verAuditoria(receso) {
				let _options: IAuditoriaPorIdModalOptions = {};
				_options.dataService = "MantenimientoAgendaDataService";
				_options.method = "obtenerAuditoriaRecesoPorId";
				_options.idElemento = receso.Id;
				_options.tituloModal = "Auditoría Receso";

				ModalService.openAuditoriaElementoPorId(_options);
			}

			function buscar() {
				vm.formControl.loading = true;

				var idEstado = 0;
				if (vm.filter.estado != null && vm.filter.estado !== '')
					idEstado = vm.filter.estado.Id;

				var idTipoReceso = 0;
				if (vm.filter.tipoRecesos != null && vm.filter.tipoRecesos !== '')
					idTipoReceso = vm.filter.tipoRecesos.Id;

				var fechaD = $filter('date')(vm.data.fechaDesde, 'yyyy-MM-dd');
				var fechaH = $filter('date')(vm.data.fechaHasta, 'yyyy-MM-dd');

				var idRecurso = 0;
				var idTipoRecurso = 0;
				if (vm.filter.recurso != null) {
					idRecurso = vm.filter.recurso.Id;
					idTipoRecurso = vm.filter.recurso.IdTipo;
				}

				var _recesos;
				if (vm.data.servicioMedico.hasOwnProperty('Id')) {
					_recesos = MantenimientoAgendaDataService.obtenerRecesosPorFiltro(fechaD, fechaH,
						vm.filter.recurso.IdTipoRecurso, vm.filter.recurso.Id, vm.data.servicioMedico.Id, idEstado, idTipoReceso);

				} else {

					_recesos = MantenimientoAgendaDataService.obtenerRecesosPorFiltro(fechaD, fechaH,
						idTipoRecurso, idRecurso, vm.data.servicioMedico.Id, idEstado, idTipoReceso);

				}

				$q.all([_recesos])
					.then(function (result) {

						$log.debug('buscarOk: ON.-', result);

						if (result[0].length === 0) {
							AlertaService.NewWarning('Alerta', 'No hay resultados para la busqueda seleccionada');
						}

						vm.data.recesos = result[0];
						vm.filter.recesos = vm.data.recesos;
						getPage();
						vm.formControl.loading = false;
					})
					.catch(function (pError) {
						vm.formControl.loading = false;
						AlertaService.NewError("Error", pError.message);
					});
			}

			vm.sort = function (keyname) {
				$scope.sortKey = keyname; //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			};

			function reprogramarTurnos(recesoId) {

				$log.debug('receso ', recesoId);
				if (ReprogramacionTurnosAuthService.puedeReprogramar(User)) {

					$state.go('turno.reprogramacion', {
						tipoConsulta: 'receso',
						id: recesoId
					});
				} else AlertaService.NewWarning("Atención", "No cuenta con permisos para reprogramar turnos");
			}

			function changeServicioMedico() {
				delete vm.filter.recurso;
				delete vm.filter.recesos;
			}

			function changeRecurso() {
				delete vm.filter.recesos;
			}


			/* VALIDACION */



			function validarPuedeAgregar() {
				return MantenimientoAgendaAuthService.puedeAgregarReceso(User);
			}

			function validarPuedeEditar() {
				return MantenimientoAgendaAuthService.puedeEditarReceso(User);
			}

			function validarPuedeEliminar() {
				return MantenimientoAgendaAuthService.puedeEliminarReceso(User);
			}

			function validarPuedeAplicar() {
				return MantenimientoAgendaAuthService.puedeAplicarReceso(User);
			}

			function puedeEstadoReceso(receso, accion) {


				var estado = receso.EstadoReceso;

				switch (accion) {
					case 'editar':
						if (estado == "Aplicado")
							return true;
						else if (estado == "Nuevo")
							return false;
						break;

					case 'aplicar':
						if (estado == "Aplicado")
							return true;
						else if (estado == "Nuevo")
							return false;
						break;

					case 'anular':
						if (estado == "Aplicado")
							return false;
						else if (estado == "Nuevo")
							return true;
						break;

					case 'eliminar':
						if (estado == "Aplicado")
							return true;
						else if (estado == "Nuevo")
							return false;
						break;

				}

				return;
			}

			function nuevoRecesoIndividual() {
				$log.debug('nuevo receso individual');

				setStoredData();
				if (vm.data.servicioMedico && vm.filter.recurso) {

					$state.go('turno.mantenimientoagenda.editrecesoindividual', {
						servicio: vm.data.servicioMedico,
						recurso: vm.filter.recurso
					});

				} else {
					AlertaService.NewWarning("Debe Seleccionar un Servicio y Recurso");
				}

			}

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */


			/* PAGINACIÓN */

			function cleanFilters() {

				delete vm.data.servicioMedico;
				delete vm.filter.estado;
				delete vm.filter.recurso;
				delete vm.filter.recesos;
				cleanStorage();


			}

			function validarFilters() {

			}

			function getPage() {
				vm.filter.checkAll = false;
				for (var i = vm.filter.recesos.length - 1; i >= 0; i--) {
					vm.filter.recesos[i].VerItems = false;
					vm.filter.recesos[i].Seleccionado = false;
				}

				vm.filter.recesos = vm.data.recesos;

				var cantidadRegistros = vm.filter.recesos.length;
				var cantidadPaginas: any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				vm.filter.validar();

				vm.paginacion.totalItems = vm.filter.recesos.length;
				vm.filter.recesos = vm.filter.recesos.slice(begin, end);
			}

			/* ---------------------------------------- MENU OPTIONS ---------------------------------------- */

			vm.menuOptions = [
				// NEW IMPLEMENTATION
				{
					text: 'Agregar Receso',
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.agregar();
					}
				},
				{
					text: 'Editar Receso',
					displayed: function (modelValue) {

						if (modelValue.receso.IdTipoReceso == 2) return true;
						else
							return modelValue.receso.PuedeEditar;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.editar($itemScope.receso);
					}
				},
				{
					text: 'Aplicar Receso',
					displayed: function (modelValue) {
						return modelValue.receso.PuedeAplicar;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.aplicar($itemScope.receso.Id);
					}
				},

				{
					text: 'Reprogramar Turnos',
					displayed: function (modelValue) {
						return modelValue.receso.PuedeCancelar;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.reprogramarTurnos($itemScope.receso.Id);
					}
				},
				{
					text: 'Anular',
					displayed: function (modelValue) {
						return modelValue.receso.PuedeCancelar;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.cancelar($itemScope.receso.Id);
					}
				},
				{
					text: 'Eliminar',
					displayed: function (modelValue) {
						return modelValue.receso.PuedeEliminar;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.eliminar($itemScope.receso.Id);
					}
				},
				{
					text: 'Ver Auditoría Receso',
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.verAuditoria($itemScope.receso);
					}
				}

			];

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				vm.formControl.loading = true;

				var _estadosReceso = MantenimientoAgendaDataService.getAllEstadoReceso();


				$q.all([_estadosReceso])
					.then(activateOk, activateError);
			}

			function activateOk(results) {

				$log.debug('activateOk: ON.-', results);

				vm.data.estados = results[0];

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;

				vm.data.fechaDesde = moment().toDate();
				vm.data.fechaHasta = new Date((new Date().getFullYear()) + 1, 11, 31);
				//vm.data.fechaHasta = moment().add(12, 'month').toDate();

				$timeout(function () {

					getStoredData();

				}, 400);

			}

			function activateError(pError) {
				vm.formControl.loading = false;
				AlertaService.NewError("Error", pError.message);
			}



			/* ---------------------------------------------- STORAGE ---------------------------------------------- */

			function getStoredData() {

				if (TurnosStorageHelperService.existStoredObjects(vm.storage.keyToStorageRecesoList)) {

					getData(TurnosStorageHelperService.getStorageObj(vm.storage.keyToStorageRecesoList));
					buscar();

				}

				function getData(stored) {

					vm.data.servicioMedico = stored.servicioMedico ? angular.copy(stored.servicioMedico) : {};
					vm.filter.recurso = stored.recurso ? angular.copy(stored.recurso) : {};
				}

			}

			function cleanStorage() {

				$log.debug('cleanStorage');
				TurnosStorageHelperService.cleanStorage(vm.storage.keyToStorageRecesoList);

			}

			function setStoredData() {

				var recesoListStorage = {
					recurso: angular.copy(vm.filter.recurso),
					servicioMedico: angular.copy(vm.data.servicioMedico)

				};

				TurnosStorageHelperService.setStorageObj(vm.storage.keyToStorageRecesoList, recesoListStorage);

			}

		}

	};
	return module;
})();
