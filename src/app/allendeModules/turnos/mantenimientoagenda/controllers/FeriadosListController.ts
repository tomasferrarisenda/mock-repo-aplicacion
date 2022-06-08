export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.controller('FeriadosListController', FeriadosListController);

		// Inyección de Dependencia
		FeriadosListController.$inject = ['$log', '$q', '$filter', '$state', '$scope', 'ModalService',
			'User', 'ReprogramacionTurnosAuthService',
			'MantenimientoAgendaDataService', 
			'MantenimientoAgendaAuthService', 'AlertaService'
		];


		function FeriadosListController($log, $q, $filter, $state, $scope, ModalService,
			User, ReprogramacionTurnosAuthService,
			MantenimientoAgendaDataService, 
			MantenimientoAgendaAuthService, AlertaService
		) {


			var vm = this;

			vm.user = User;
			vm.title = {
				module: 'FERIADOS',
				page: 'Lista Feriados'
			};

			vm.data = {
				feriados: [],
				estados: []
			};

			vm.filter = {
				feriados: [],
				fechadesde: '',
				fechahasta: '',
				estado: '',
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
				anular: anular,
				eliminar: eliminar,
				buscar: buscar,
				agregar: agregar,
				verExcepciones: verExcepciones,
				getHoraOk: getHoraOk,
				getCantExcepciones: getCantExcepciones,
				getSituacionExcepcion: getSituacionExcepcion,
				getSituacionDesdeHasta: getSituacionDesdeHasta,
				reprogramarTurnos: reprogramarTurnos,
				verAuditoria: verAuditoria
			};


			vm.validar = {
				puedeAgregar: validarPuedeAgregar,
				puedeEditar: validarPuedeEditar,
				puedeEliminar: validarPuedeEliminar,
				puedeAplicar: validarPuedeAplicar
			};

			var optionsObj = {
				ok: 'Si',
				cancel: 'No'
			};

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function reprogramarTurnos(feriadoId) {

				$log.debug('feriado ', feriadoId);

				if (ReprogramacionTurnosAuthService.puedeReprogramar(User)) {

					$state.go('turno.reprogramacion', {
						tipoConsulta: 'feriado',
						id: feriadoId
					});
				} else AlertaService.NewWarning("Atención", "No cuenta con permisos para reprogramar turnos");
			}

			function aplicar(idFeriado) {

				if (MantenimientoAgendaAuthService.puedeAplicarFeriado(User)) {

					MantenimientoAgendaDataService.obtenerImpactoAplicarFeriado(idFeriado)
						.then(obtenerImpactoOk, obtenerImpactoError);

				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");

				function obtenerImpactoOk(pResult) {
					$log.debug('impacto cantidad de turnos afectados', pResult);

					if (pResult > 0) {

						ModalService.confirm('Atencion, si se aplica el feriado, ' + pResult + ' turnos serán ' +
							'afectados. Desea continuar?',
							function(pOk) {
								
								if(pOk){
									$log.debug('Si acepto aplicar le turno', pOk)
									aplicarFeriado(idFeriado);

								}

							}, "", optionsObj);
					}else if(pResult === 0){

						$log.debug('no hay turnos afectados entonces aplico');
						ModalService.confirm('Atencion, desea aplicar el feriado?',
							function (_pOk) {
								
								if(_pOk){
									aplicarFeriado(idFeriado);
								}

							}, "", optionsObj);

						//aplicarFeriado(idFeriado);
					}

				}

				function obtenerImpactoError(pError) {
					$log.error('Error', pError);

				}


			}


			function aplicarFeriado(idFeriado) {

				$log.debug('Aplique el feriado con id',idFeriado);
				MantenimientoAgendaDataService.validarAplicarFeriado(idFeriado)
					.then(function(result) {
						if (result.IsOk === false) {
							AlertaService.NewError("Error", result.Message);
							return;
						} else {
							MantenimientoAgendaDataService.aplicarFeriado(idFeriado)
								.then(function(result) {
									$log.debug('result', result);
									buscar();
								}, function(pError) {
									AlertaService.NewError("Error", pError.message);
									return;
								});
						}
					}, function(pError) {
						AlertaService.NewError("Error", pError.message);
						return;
					});
			}

			function anular(idFeriado) {


				if (MantenimientoAgendaAuthService.puedeAplicarFeriado(User)) {

					ModalService.confirm('¿Desea anular el feriado?',
						function(pResult) {
							if (pResult) {
								MantenimientoAgendaDataService.validarAnularFeriado(idFeriado)
									.then(function(result) {
										if (result.IsOk === false) {
											AlertaService.NewError("Error", result.Message);
											return;
										} else {
											MantenimientoAgendaDataService.anularFeriado(idFeriado)
												.then(function(result) {
													$log.debug('result', result);
													buscar();
												}, function(pError) {
													AlertaService.NewError("Error", pError.message);
													return;
												});
										}
									}, function(pError) {
										AlertaService.NewError("Error", pError.message);
										return;
									});
							}
						});
				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");



			}


			function editar(IdFeriado) {


				if (MantenimientoAgendaAuthService.puedeEditarFeriado(User)) {


					$state.go('turno.mantenimientoagenda.editferiados', {
						idFeriado: IdFeriado
					});

				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");


			}

			function eliminar(idFeriado) {

				if (MantenimientoAgendaAuthService.puedeEliminarFeriado(User)) {

					ModalService.confirm('¿Desea eliminar el feriado?',
						function(pResult) {
							if (pResult) {
								MantenimientoAgendaDataService.validarEliminarFeriado(idFeriado)
									.then(function(result) {
										if (result.IsOk === false) {
											AlertaService.NewError("Error", result.Message);
											return;
										} else {
											MantenimientoAgendaDataService.eliminarFeriado(idFeriado)
												.then(function(result) {
													$log.debug('result', result);
													buscar();
												}, function(pError) {
													AlertaService.NewError("Error", pError.message);
													return;
												});
										}
									}, function(pError) {
										AlertaService.NewError("Error", pError.message);
										return;
									});
							}
						});

				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");


			}

			function agregar() {

				if (MantenimientoAgendaAuthService.puedeAgregarFeriado(User)) {
					$state.go('turno.mantenimientoagenda.editferiados');

				} else AlertaService.NewWarning("Sin permiso",
					"Atencion, usted no tiene permiso para realizar esta accion");
			}

			function verExcepciones(pIdFeriado) {
				for (var i = vm.filter.feriados.length - 1; i >= 0; i--) {
					if (vm.filter.feriados[i].Id == pIdFeriado) {
						vm.filter.feriados[i].VerItems = !vm.filter.feriados[i].VerItems;
					}
				}
			}

			function verAuditoria(feriado) {
				let _options: IAuditoriaPorIdModalOptions = {};
				_options.dataService = "MantenimientoAgendaDataService";
				_options.method = "obtenerAuditoriaFeriadoPorId";
				_options.idElemento = feriado.Id;
				_options.tituloModal = "Auditoría Feriado";
				
				ModalService.openAuditoriaElementoPorId(_options);
			}

			function getHoraOk(feriado) {


				if (feriado.HoraDesde != "00:00" || feriado.HoraHasta != "00:00" && feriado.DiaCompleto === false)
					return feriado.HoraDesde + " : " + feriado.HoraHasta;
				else if (feriado.DiaCompleto === true)
					return "Dia Completo";

				return;
			}

			function buscar() {
				vm.formControl.loading = true;

				var idEstado = 0;
				if (vm.filter.estado != null && vm.filter.estado !== '')
					idEstado = vm.filter.estado.Id;

				var fechaD = $filter('date')(vm.filter.fechaDesde, 'yyyy-MM-dd');
				var fechaH = $filter('date')(vm.filter.fechaHasta, 'yyyy-MM-dd');

				$log.error('buscar', fechaD, fechaH, idEstado);

				var _feriados = MantenimientoAgendaDataService.obtenerFeriadosPorFiltro(fechaD, fechaH, idEstado)
					.then(function(result) {

						$log.debug('buscar data OK.-', result);

						vm.data.feriados = result;
						vm.filter.feriados = vm.data.feriados;
						getPage();
						vm.formControl.loading = false;
					})
					.catch(function(pError) {
						vm.formControl.loading = false;
						AlertaService.NewError("Error", pError.message);
					});
			}

			vm.sort = function(keyname) {
				$scope.sortKey = keyname; //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			};

			function getCantExcepciones(feriado) {

				var ret = '';
				if (feriado.Excepciones.length === 0) ret = 'Ninguna';
				else if (feriado.Excepciones.length === 1) ret = feriado.Excepciones.length + " Excepción";
				else ret = feriado.Excepciones.length + " Excepciones";

				return ret;
			}


			function getSituacionExcepcion(item) {
				var ret = '';
				if (!item) return;
				if (item.TrabajaNormalmente === true) {

					ret = "Trabaja Normalmente";
				} else ret = "No trabaja";

				return ret;
			}


			function getSituacionDesdeHasta(item) {
				var ret = '';
				if (!item) return;
				if (item.TrabajaNormalmente === true) {

					ret = "Trabaja Normalmente";
				} else if (item.FeriadoDiaCompleto) ret = "Dia Completo";
				else if (item.FeriadoHoraDesde !== "00:00" && item.FeriadoHoraHasta !== "00:00")
					ret = item.FeriadoHoraDesde + ' - ' + item.FeriadoHoraHasta;

				return ret;
			}


			/* VALIDACION */



			function validarPuedeAgregar() {
				return MantenimientoAgendaAuthService.puedeAgregarFeriado(User);
			}

			function validarPuedeEditar() {
				return MantenimientoAgendaAuthService.puedeEditarFeriado(User);
			}

			function validarPuedeEliminar() {
				return MantenimientoAgendaAuthService.puedeEliminarFeriado(User);
			}

			function validarPuedeAplicar() {
				return MantenimientoAgendaAuthService.puedeAplicarFeriado(User);
			}


			/* ---------------------------------------- MENU OPTIONS ---------------------------------------- */

			vm.menuOptions = [
				// NEW IMPLEMENTATION
				{
					text: 'Agregar Feriado',					
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.agregar();
					}
				},
				{
					text: 'Editar Feriado',
					displayed: function (modelValue) {

						return (modelValue.feriado.IdEstadoFeriado == 1) ? true : false;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.editar($itemScope.feriado.Id);
					}
				},
				{
					text: 'Aplicar Feriado',
					displayed: function (modelValue) {
						return (modelValue.feriado.IdEstadoFeriado == 1) ? true: false;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.aplicar($itemScope.feriado.Id);
					}
				},

				{
					text: 'Reprogramar Turnos',
					displayed: function (modelValue) {
						return (modelValue.feriado.IdEstadoFeriado == 2) ? true : false;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.reprogramarTurnos($itemScope.feriado.Id);
					}
				},
				{
					text: 'Anular',
					displayed: function (modelValue) {
						return (modelValue.feriado.IdEstadoFeriado == 2) ? true : false;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.anular($itemScope.feriado.Id);
					}
				},
				{
					text: 'Eliminar',
					displayed: function (modelValue) {
						return (modelValue.feriado.IdEstadoFeriado == 1) ? true : false;
					},
					click: function ($itemScope, $event, modelValue, text, $li) {

						vm.formControl.eliminar($itemScope.feriado.Id);
					}
				},
				{
					text: 'Ver Auditoría Feriado',
					click: function ($itemScope, $event, modelValue, text, $li) {
						vm.formControl.verAuditoria($itemScope.feriado);
					}
				}

			];

			/* ---------------------------------------- FILTER ---------------------------------------- */

			// function inicializarVariables() {
			// 	vm.data.feriados = [];
			// 	vm.data.estados = [];
			// }

			/* PAGINACIÓN */

			function cleanFilters() {
				vm.filter.estado = null;

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageChanged();
			}

			function validarFilters() {

			}

			function getPage() {
				vm.filter.checkAll = false;
				for (var i = vm.filter.feriados.length - 1; i >= 0; i--) {
					vm.filter.feriados[i].VerItems = false;
					vm.filter.feriados[i].Seleccionado = false;
				}

				vm.filter.feriados = vm.data.feriados;

				var cantidadRegistros = vm.filter.feriados.length;
				var cantidadPaginas: any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;

				vm.filter.validar();

				vm.paginacion.totalItems = vm.filter.feriados.length;
				vm.filter.feriados = vm.filter.feriados.slice(begin, end);
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				vm.formControl.loading = true;

				var _estadosFeriado = MantenimientoAgendaDataService.getAllEstadoFeriado();
				$q.all([_estadosFeriado])
					.then(activateOk, activateError);
			}

			function activateOk(results) {
				vm.data.estados = results[0];

				vm.formControl.error = false;
				vm.formControl.loading = false;

				cleanFilters();

				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;

				vm.filter.fechaDesde = new Date(new Date().getFullYear(), 0, 1);				
				vm.filter.fechaHasta = new Date((new Date().getFullYear())+1, 11, 31);

				buscar();
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				AlertaService.NewError("Error", pError.message);
			}

		}

	};

	return module;
})();