import * as angular from 'angular';
import { ISucursalDataService } from '../../../support/basic/services';
import { IRecursoDataService } from './../../../support/basic/services/RecursoDataService';
export default (function () {
	'use strict';



	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('RecesoEditController', RecesoEditController);

		// Inyección de Dependencia
		RecesoEditController.$inject = ['$scope', '$log', '$q', '$filter', '$state', '$stateParams', 'ModalService',
			'MantenimientoAgendaDataService', 'SucursalDataService', 'ProfesionalesDataService',
			'ServiciosGestionDataService', 'moment', 'AlertaService', 'RecursoDataService'
		];

		// Constructor del Controller
		function RecesoEditController($scope, $log, $q, $filter, $state, $stateParams, ModalService: IModalService,
			MantenimientoAgendaDataService, SucursalDataService: ISucursalDataService, ProfesionalesDataService,
			ServiciosGestionDataService, moment, AlertaService, RecursoDataService: IRecursoDataService


		) {

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var vm = this;

			vm.title = {
				module: "EDITAR RECESO",
				page: 'Nuevo Receso'
			};

			vm.today = new Date();
			vm.fechadesdeMin = new Date();

			vm.data = {
				receso: '',
				items: [],

				diasSemana: [],
				motivos: [],
				recurso: null,
				servicio: null,
				profesional: {},
				profesionales: []
			};

			vm.filter = {
				recurso: null,
				diaSemana: '',
				motivo: '',
				observacion: '',
				observacionRequerida: false,
				fechaDesde: '',
				fechaHasta: '',
				diaCompleto: true
			};

			vm.recurso = {

				buscar: buscarRecurso,
				recursoSeleccionado: recursoSeleccionado
			};

			vm.servicio = {
				buscar: buscarServicio,
				servicioSeleccionado: servicioSeleccionado
			};

			vm.formControl = {
				error: true,
				loading: false,
				validarError: validarError,
				reloadPage: activate,
				cancel: cancel,
				ok: guardar,
				agregarItem: agregarItem,
				eliminarItem: eliminarItem,
				validarAgregarItem: validarAgregarItem,
				cambioMotivoReceso: cambioMotivoReceso,
				validarForm: validarForm,
				getServiciosXSucursal: getServiciosXSucursal,

				changeTodosLosDias: changeTodosLosDias,
				changeFechaDesde: changeFechaDesde,
				cambioSucursal: cambioSucursal

			};

			$scope.validar = {
				error: validarError
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function buscarRecurso() {

			}

			function buscarServicio() {

			}

			function cambioSucursal() {
				vm.data.profesional = {};
				vm.data.receso.IdProfesionalAtiende = 0;
				cargarProfesionales();
			}

			function recursoSeleccionado() {

				vm.formControl.loading = true;
				var _recursoObj = {
					Id: angular.copy(vm.data.recurso.Id),
					IdTipo: angular.copy(vm.data.recurso.IdTipoRecurso)
				};

				$log.error('recurso seleccionado', vm.data.recurso);
				vm.data.recursoSeleccionado = angular.copy(vm.data.recurso);
				ServiciosGestionDataService.obtenerPorRecurso(_recursoObj)
					.then(function (pResults) {
						vm.formControl.loading = false;
						$log.error('obteniendo servicios', pResults);
						vm.data.serviciosObtenidos = angular.copy(pResults);

					}, function (pError) {

						vm.formControl.loading = false;

						$log.error('Error Servicios', pError);

					});
			}

			function servicioSeleccionado() {

				$log.error('servicio seleccionado', vm.data.servicio);
				vm.data.servicioSeleccionado = angular.copy(vm.data.servicio);
				vm.formControl.loading = true;

				if (angular.isUndefined(vm.data.recurso.Id))
					vm.data.recurso.Id = angular.copy(vm.data.recurso.Id);

				SucursalDataService.obtenerSucursalXRecursoXServicio(vm.data.recurso.Id, vm.data.recurso.IdTipoRecurso,
					vm.data.servicio.Id)
					.then(function (pResults) {

						vm.formControl.loading = false;
						$log.error('obteniendo sucursales', pResults);
						vm.data.sucursales = angular.copy(pResults);

						var sucTodas: any = {};
						sucTodas.Id = 0;
						sucTodas.Nombre = "TODAS";
						vm.data.sucursales.unshift(sucTodas);
						vm.data.sucursal = vm.data.sucursales[0];

						if (vm.data.receso && vm.data.receso.IdSucursal)
							for (let i = 0; i < vm.data.sucursales.length; i++) {
								if (vm.data.receso.IdSucursal === vm.data.sucursales[i].Id) {
									vm.data.sucursal = vm.data.sucursales[i];
									break;
								}
							}

						cargarProfesionales();

					}, function (pError) {
						vm.formControl.loading = false;

						$log.error('Error Servicios', pError);
					});

			}

			function changeTodosLosDias() {


				$log.debug('changeTodosLosDias OK.-');
				vm.data.receso.Items = [];

			}



			function getServiciosXSucursal(pSucursal) {

				$log.debug('getServiciosXSucursal OK.-', pSucursal);
				var _servicioXSucursal;

				if (pSucursal != null) {
					_servicioXSucursal = ServiciosGestionDataService.getServiciosBySucursal(pSucursal.id_sucursal)
						.then(getServiciosOk, getServiciosError);
				}

				function getServiciosOk(pServicios) {

					$log.debug('getServiciosOk OK.-', pServicios);
					vm.data.servicioSucursal = pServicios;

				}

				function getServiciosError(pError) {

					$log.error('getServiciosError OK.-', pError);

				}

			}

			/* FORMULARIO */

			function validarError(pBool) {
				if (!pBool) {
					return 'error';
				}
				return;
			}

			function validarForm() {
				var _flag = false;

				return _flag;
			}

			function changeFechaDesde() {

				vm.fechadesdeMin.setDate(vm.data.fechaDesde.getDate() - 1);
			}

			function cambioMotivoReceso() {
				vm.data.observacionRequerida = false;
				if (vm.data.motivo != null && !angular.isUndefined(vm.data.motivo)) {
					vm.data.observacionRequerida = vm.data.motivo.RequiereObservacion;
				}
			}

			function guardar() {

				//1° control: controlar si "FechaDesde" = "FechaHasta": si es igual lanzar warning
				let _warnings = {
					IsOk: true,
					HasWarnings: false,
					WarningMessage: ""
				};
				if (moment(vm.data.fechaDesde).format("dd-MM-YYYY") == moment(vm.data.fechaHasta).format("dd-MM-YYYY")) {
					_warnings.WarningMessage = "El receso tiene Fecha Desde igual a Fecha Hasta";
					_warnings.HasWarnings = true;
				}

				if (!vm.data.todosLosDias && vm.data.diaSemana) {
					_warnings.WarningMessage = _warnings.WarningMessage + "\r\n" + "Existe un día especifico sin agregar a la lista";
					_warnings.HasWarnings = true;
				}

				if (_warnings.HasWarnings) {

					ModalService.validarWarning(_warnings)
						.then(function (pResult) {

							$log.debug('presultvalidar', pResult);

							if (pResult) {

								guardarReceso();
							}
						}, function (pError) {

						});

				} else guardarReceso();


				function guardarReceso() {
					//setear objecto receso
					setearReceso();

					$log.debug('receso to save', vm.data.receso);

					if (!moment(vm.data.receso.FechaDesde).isSameOrBefore(vm.data.receso.FechaHasta)) {
						AlertaService.NewWarning("Fecha Incorrecta",
							"Atencion, la fecha final no es valida");
					} else {

						$log.debug('receso seteado: ', vm.data.receso);

						MantenimientoAgendaDataService.validarGuardarReceso(vm.data.receso)
							.then(function (result) {
								if (result.IsOk === false) {
									$log.error('guardar result OK.-', result);
									AlertaService.NewError("Error", result.Message);
									return;
								} else {
									$log.debug('is ok ');
									MantenimientoAgendaDataService.guardarReceso(vm.data.receso)
										.then(function (result) {
											$log.debug('result...', result);
											AlertaService.NewSuccess("Receso Confirmado",
												"Receso correctamente agregado o editado");
											$state.go('turno.mantenimientoagenda.listrecesos');


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
				}

			}

			function eliminarItem(item) {
				vm.data.receso.Items.splice(vm.data.receso.Items.indexOf(item), 1);
			}

			function setearReceso() {

				vm.data.receso.FechaDesde = $filter('date')(vm.data.fechaDesde, 'MM/dd/yyyy');
				vm.data.receso.FechaHasta = $filter('date')(vm.data.fechaHasta, 'MM/dd/yyyy');

				$log.debug('set sucursal OK.-', vm.data.sucursal);
				$log.debug('set recurso OK.-', vm.data.recurso);
				$log.debug('set servicioMedico OK.-', vm.data.servicio);


				if (vm.data.recurso !== null && !angular.isUndefined(vm.data.recurso) && vm.data.recurso !== '') {

					vm.data.receso.IdRecurso = angular.copy(vm.data.recurso.Id);
					vm.data.receso.IdTipoRecurso = angular.copy(vm.data.recurso.IdTipoRecurso);
					vm.data.receso.Recurso = angular.copy(vm.data.recurso.Nombre);
					vm.data.receso.TipoRecurso = angular.copy(vm.data.recurso.TipoRecurso);


				} else {
					vm.data.receso.IdRecurso = 0;
					vm.data.receso.IdTipoRecurso = 0;
				}

				vm.data.receso.IdMotivoReceso = 0;
				if (vm.data.motivo !== null && !angular.isUndefined(vm.data.motivo) && vm.data.motivo !== '') {
					vm.data.receso.IdMotivoReceso = vm.data.motivo.Id;
				}

				if (vm.data.sucursal !== null && !angular.isUndefined(vm.data.sucursal) && vm.data.sucursal !== '') {
					vm.data.receso.IdSucursal = vm.data.sucursal.Id;
					vm.data.receso.Sucursal = vm.data.sucursal.Nombre;
				}

				if (vm.data.servicio !== null && !angular.isUndefined(vm.data.servicio) && vm.data.servicio !== '') {
					vm.data.receso.IdServicio = vm.data.servicio.Id;
					vm.data.receso.Servicio = vm.data.servicio.Nombre;
				}

				vm.data.receso.IdProfesionalAtiende = vm.data.profesional && vm.data.profesional.Id ? vm.data.profesional.Id : 0;
				vm.data.receso.ProfesionalAtiende = vm.data.profesional && vm.data.profesional.Nombre ? vm.data.profesional.Nombre : '';

				vm.data.receso.Observacion = $.trim(vm.data.Observacion);
				vm.data.receso.RecursoActual = null;

				vm.data.receso.TodosLosDiasCompletos = angular.copy(vm.data.todosLosDias);
			}

			function agregarItem() {

				if (validarAgregarItem() === false) {

					var itemToPush = angular.copy(vm.data.itemRecesoNuevo);
					var _horaHastaOk = false;

					if (vm.data.diaSemana !== null && !angular.isUndefined(vm.data.diaSemana) && vm.data.diaSemana !== '') {
						itemToPush.IdDiaSemana = vm.data.diaSemana.Id;
						itemToPush.DiaSemana = vm.data.diaSemana.Nombre;
					}

					itemToPush.DiaCompleto = angular.copy(vm.data.diaCompleto);

					if (vm.data.diaCompleto === true) {
						itemToPush.HoraDesde = '00:00';
						itemToPush.HoraHasta = '23:59';
						_horaHastaOk = true;

					} else {
						if (vm.data.horaDesde !== null && !angular.isUndefined(vm.data.horaDesde) && vm.data.horaDesde !== '') {
							itemToPush.HoraDesde = ConvertirHora(vm.data.horaDesde.getHours(), vm.data.horaDesde.getMinutes());
						} else {
							itemToPush.HoraDesde = '00:00';
						}


						if (vm.data.horaHasta !== null && !angular.isUndefined(vm.data.horaHasta) && vm.data.horaHasta !== '') {
							itemToPush.HoraHasta = ConvertirHora(vm.data.horaHasta.getHours(), vm.data.horaHasta.getMinutes());
							//controlo que la hora hasta sea mas grande que la hora desde
							if (itemToPush.HoraDesde < itemToPush.HoraHasta) _horaHastaOk = true;

						} else {
							itemToPush.HoraHasta = '23:59';
							_horaHastaOk = true;
						}
					}


					if (_horaHastaOk) {

						vm.data.receso.Items.push(itemToPush);
						limpiarFiltrosItems();
					} else {
						//alerta de hora desde menor
						AlertaService.NewWarning("Atención", "La Hora Hasta debe ser mayor que la Hora Desde");
					}


				}
			}

			function ConvertirHora(hora, minuto) {
				var horaTexto;
				if (hora < 10) {
					horaTexto = '0' + hora.toString();
				} else {
					horaTexto = hora.toString();
				}
				var minutoTexto;
				if (minuto < 10) {
					minutoTexto = '0' + minuto.toString();
				} else {
					minutoTexto = minuto.toString();
				}
				var horaFormato = horaTexto + ':' + minutoTexto;



				return horaFormato;
			}

			function validarAgregarItem() {

				var _flag = false;

				if (!vm.data.diaSemana)
					_flag = true;


				if (vm.data.diaCompleto === false &&
					(vm.data.horaDesde == null || angular.isUndefined(vm.data.horaDesde) || vm.data.horaDesde === ''))
					_flag = true;


				if (vm.data.diaCompleto === false &&
					(vm.data.horaHasta === null || angular.isUndefined(vm.data.horaHasta) || vm.data.horaHasta === ''))
					_flag = true;


				return _flag;
			}

			function limpiarFiltrosItems() {

				delete vm.data.diaSemana;
				delete vm.data.horaDesde;
				delete vm.data.horaHasta;
				vm.data.diaCompleto = true;
			}

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function inicializarVariables() {
				// vm.data.items = [];
				// delete vm.data.recurso;
				// vm.data.motivos = [];

				// vm.data.diaSemana = null;
				// vm.data.horaDesde = null;
				// vm.data.horaHasta = null;
			}

			function cancel() {
				$state.go('turno.mantenimientoagenda.listrecesos');
			}

			function cargarProfesionales() {
				// deprecado-> buscamos profesionales que atienden el recurso
				// if (vm.data.sucursal && vm.data.sucursal.Id) {
				// 	RecursoDataService.obtenerTodosDeUnServicioEnSucursal(vm.data.servicio.Id, vm.data.sucursal && vm.data.sucursal.Id ? vm.data.sucursal.Id : 0).then(function (profesionales) {
				// 		filtroProfesionales(profesionales);
				// 	});
				// }
				// else {
				// 	RecursoDataService.obtenerTodosDeUnServicio(vm.data.servicio.Id).then(function (profesionales) {
				// 		filtroProfesionales(profesionales);
				// 	});
				// }
				if (vm.data.recurso.IdTipoRecurso !== 1) { // Solo si NO es un profesional
					ProfesionalesDataService.obtenerQueAtiendenAlRecurso(vm.data.recurso.Id, vm.data.recurso.IdTipoRecurso)
					.then(function (profesionales) {
						filtroProfesionales(profesionales);
					});
				}
			}

			function filtroProfesionales(profesionales) {
				vm.data.profesionales = profesionales

				if (vm.data.receso.IdProfesionalAtiende > 0) {
					for (let i = 0; i < vm.data.profesionales.length; i++) {
						if (vm.data.receso.IdProfesionalAtiende === vm.data.profesionales[i].Id) {
							vm.data.profesional = vm.data.profesionales[i];
							break;
						}
					}
				}
			}
			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {

				inicializarVariables();

				$log.debug('state params idReceso OK.-', $stateParams.idReceso);

				vm.data.idRecesoEdit = $stateParams.idReceso;


				var _recursos = MantenimientoAgendaDataService.obtenerRecursos();

				var _diasSemana = MantenimientoAgendaDataService.obtenerDiasSemana();
				var _motivos = MantenimientoAgendaDataService.obtenerMotivosRecesos();
				var _itemReceso = MantenimientoAgendaDataService.obtenerNuevoItemReceso();

				var _receso;
				if (vm.data.idRecesoEdit !== 0) {
					_receso = MantenimientoAgendaDataService.obtenerRecesoPorId(vm.data.idRecesoEdit);

				} else {

					_receso = MantenimientoAgendaDataService.obtenerNuevoReceso();
					vm.data.todosLosDias = true;
					vm.data.diaCompleto = true;
				}


				$q.all([_diasSemana,
					_motivos,
					_receso,
					_itemReceso,
					_recursos
				])
					.then(activateOk, activateError);
			}

			function activateOk(results) {

				vm.data.diasSemana = results[0];
				vm.data.motivos = results[1];
				vm.data.receso = results[2];
				vm.data.itemRecesoNuevo = results[3];
				vm.data.recursosObtenidos = results[4];


				$log.debug('activateOk  OK.-', results);

				//edito receso si el id es mayor que 0
				if (vm.data.receso.Id > 0) {

					vm.data.fechaDesde =
						new Date(vm.data.receso.FechaDesde);
					vm.data.fechaHasta =
						new Date(vm.data.receso.FechaHasta);

					vm.data.observacionRequerida = true;
					for (var i = 0; i < vm.data.motivos.length; i++) {
						if (vm.data.motivos[i].Id == vm.data.receso.IdMotivoReceso) {
							vm.data.motivo = vm.data.motivos[i];

							if (vm.data.motivo.RequiereObservacion === true) {
								vm.data.observacionRequerida = true;
							}
						}
					}

					vm.data.todosLosDias = angular.copy(vm.data.receso.TodosLosDiasCompletos);
					vm.data.recurso = vm.data.receso.RecursoActual;
					vm.recurso.recursoSeleccionado();
					if (vm.data.receso.IdServicio) {
						vm.data.servicio = {};
						vm.data.servicio.Id = vm.data.receso.IdServicio;
						vm.data.servicio.Nombre = vm.data.receso.Servicio;

						vm.servicio.servicioSeleccionado();
					}

					if (vm.data.receso.Sucursal) {
						vm.data.sucursal = {};
						vm.data.sucursal.Id = angular.copy(vm.data.receso.IdSucursal);
						vm.data.sucursal.Nombre = angular.copy(vm.data.receso.Sucursal);
					}

					vm.data.diaCompleto = false;
					//$log.debug('data.recurso: ', vm.data.recurso);

					vm.data.Observacion = angular.copy(vm.data.receso.Observacion);

				} else {
					vm.data.fechaDesde = new Date();
					vm.data.fechaHasta = new Date();
					vm.data.fechaHasta.setDate(vm.data.fechaDesde.getDate() + 2);

					if ($stateParams.recurso !== 0 && $stateParams.servicio !== 0) {
						vm.data.recurso = angular.copy($stateParams.recurso);
						vm.data.recurso.IdTipoRecurso = angular.copy($stateParams.recurso.IdTipoRecurso);

						vm.recurso.recursoSeleccionado();
						vm.data.servicio = angular.copy($stateParams.servicio);
						if (vm.data.servicio) {
							vm.servicio.servicioSeleccionado();
						}

						cargarProfesionales();

					}
				}
				vm.fechadesdeMin.setDate(vm.data.fechaDesde.getDate() - 1);


				vm.formControl.loading = false;
			}

			function activateError(pError) {
				vm.formControl.loading = false;
				AlertaService.NewError("Error", pError.message);
			}
		}
	};

	return module;
})();