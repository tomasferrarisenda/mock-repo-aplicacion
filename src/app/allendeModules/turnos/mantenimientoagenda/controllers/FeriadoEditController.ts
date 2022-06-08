
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('FeriadoEditController', FeriadoEditController);

		// Inyección de Dependencia
		FeriadoEditController.$inject = ['$scope', '$log', '$q', '$filter', '$state', '$stateParams', 'ModalService',
			'AlertaService',
			'MantenimientoAgendaDataService',
			'ServiciosGestionDataService', 'moment'
		];

		// Constructor del Controller
		function FeriadoEditController($scope, $log, $q, $filter, $state, $stateParams, ModalService: IModalService,
			AlertaService,
			MantenimientoAgendaDataService,
			ServiciosGestionDataService, moment
		) {

			//$log.debug('FeriadoEditController: ON.-');

			/* ------------------------------ API Y VARIABLES ------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.today.setDate(vm.today.getDate() -1);

			vm.title = {
				module: "EDITAR FERIADO",
				page: 'Nuevo Feriado'
			};

			vm.data = {

				recurso: {},
				recursoBuscar: {},
				esTodoElDia: false,
				isSucursal: true
			};

			vm.filter = {};


			vm.formControl = {
				error: true,
				loading: false,
				validarError: validarError,
				reloadPage: activate,
				cancel: cancel,
				ok: guardar,
				getServiciosXSucursal: getServiciosXSucursal,
				agregarExcepcion: agregarExcepcion,
				eliminarExcepcion: eliminarExcepcion,
				validarAgregarExcepcion: validarAgregarExcepcion,
				agregarItemExcepcion: agregarItemExcepcion,

				validarForm: validarForm,

				getHoraOk: getHoraOk,

				cargarDatosRecurso: cargarDatosRecurso,
				chboxExcepciones: false,
				controlSave: controlSave,

				setearHoraParcial: setearHoraParcial,
				setearHoraParcialExcepcion:setearHoraParcialExcepcion,

				limpiarListaExcepcion: limpiarListaExcepcion,
				isSucursalActiva: isSucursalActiva
			};

			$scope.validar = {
				error: validarError
			};

			/* IMPLEMENTACIÓN DE MÉTODOS*/

			function getServiciosXSucursal(pSucursal) {

				$log.debug('getServiciosXSucursal OK.-', pSucursal);
				if (pSucursal) {

					var _servicioXSucursal;

					if (pSucursal != null) {
						_servicioXSucursal = ServiciosGestionDataService.getServiciosBySucursal(pSucursal.Id)
							.then(getServiciosOk, getServiciosError);
					}

				}

				function getServiciosOk(pServicios) {

					$log.debug('getServiciosOk OK.-', pServicios);
					vm.data.servicioSucursal = pServicios;

				}

				function getServiciosError(pError) {

					$log.error('getServiciosError OK.-', pError);

				}

			}


			function controlSave() {

				if (vm.data.fecha !== null) {

					if (vm.data.esTodoElDia) {
						return false;
					} else if (!angular.isUndefined(vm.data.horaDesde) && !angular.isUndefined(vm.data.horaHasta)) {

						return false;

					} else return true;

				}

				return true;
			}

			/* FORMULARIO */

			function cargarDatosRecurso() {


				if (vm.data.sucursal)
					vm.data.recursoBuscar.id_sucursal = angular.copy(vm.data.sucursal.Id);
				// else vm.data.recursoBuscar.Id = null;

				if (!angular.isUndefined(vm.data.servicio)) {

					if (vm.data.servicio !== null) {

						vm.data.recursoBuscar.id_servicio = angular.copy(vm.data.servicio.IdServicio);
					}
				}
			}



			function getHoraOk(feriado) {

				if (feriado.TrabajaNormalmente === true) {
					return "Trabaja Normalmente";
				} else if (feriado.FeriadoDiaCompleto === true) {
					return "Dia Completo";
				} else if (feriado.FeriadoHoraDesde != "00:00" || feriado.FeriadoHoraHasta != "00:00") {
					return feriado.FeriadoHoraDesde + " : " + feriado.FeriadoHoraHasta;
				}
				return;
			}

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

			function guardar() {

				//Declar el warnings
				let _warnings = {
					IsOk: true,
					HasWarnings: false,
					WarningMessage: ""
				};

				//controlo si no se tiene ninguna excepcion sin agregar
				if (vm.formControl.chboxExcepciones && vm.data.sucursal) {
					_warnings.WarningMessage = "El feriado tiene una excepcion y no ha sido agregada a la lista";
					_warnings.HasWarnings = true;
				}

				if (_warnings.HasWarnings) {

					ModalService.validarWarning(_warnings)
						.then(function (pResult) {

							$log.debug('presultvalidar', pResult);

							if (pResult) {
								guardarFeriado();
							}
						});

				} else guardarFeriado();


				function guardarFeriado() {
					//setear objecto feriado
					//
					//
					setearFeriado();

					//validaciones
					MantenimientoAgendaDataService.validarGuardarFeriado(vm.data.feriado)
						.then(function (result) {
							$log.debug('feriado guardado validar: ', result);
							if (result.IsOk === false) {
								AlertaService.NewError("Error", result.Message);
								return;
							} else {
								MantenimientoAgendaDataService.guardarFeriado(vm.data.feriado)
									.then(function (result) {
										$log.debug('result', result);
										$state.go('turno.mantenimientoagenda.listferiados');
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

			function eliminarExcepcion(excepcion) {
				vm.data.feriado.Excepciones.splice(vm.data.feriado.Excepciones.indexOf(excepcion), 1);
			}

			function setearFeriado() {


				vm.data.feriado.Fecha = $filter('date')(vm.data.fecha, 'MM/dd/yyyy');
				if (vm.data.esTodoElDia === false) {
					vm.data.feriado.DiaCompleto = false;
					vm.data.feriado.HoraDesde = moment(vm.data.horaDesde).format("HH:mm");
					vm.data.feriado.HoraHasta = moment(vm.data.horaHasta).format("HH:mm");
				} else {
					vm.data.feriado.DiaCompleto = true;


					var d_horaDesde = new Date();
					d_horaDesde.setHours(0);
					d_horaDesde.setMinutes(0);
					vm.data.feriado.HoraDesde = "00:00";

					var d_horaHasta = new Date();
					d_horaHasta.setHours(0);
					d_horaHasta.setMinutes(0);
					vm.data.feriado.HoraHasta = "00:00";


				}


			}

			function agregarItemExcepcion() {


				if (vm.data.sucursal != null) {

					vm.data.excepcionNueva.IdSucursal = vm.data.sucursal.Id;
					vm.data.excepcionNueva.Sucursal = vm.data.sucursal.Nombre;

					if (vm.data.servicio != null) {

						vm.data.excepcionNueva.IdServicio = vm.data.servicio.Id;
						vm.data.excepcionNueva.Servicio = vm.data.servicio.Nombre;

						if (vm.data.recurso != null) {
							vm.data.excepcionNueva.IdTipoRecurso = angular.copy(vm.data.recurso.IdTipoRecurso);
							vm.data.excepcionNueva.IdRecurso = vm.data.recurso.Id;
							vm.data.excepcionNueva.Recurso = vm.data.recurso.Nombre;
						}
					}

					vm.data.excepcionNueva.TrabajaNormalmente = angular.copy(vm.data.trabajanormal);

					if (!vm.data.excepcionNueva.TrabajaNormalmente) {

						vm.data.excepcionNueva.FeriadoDiaCompleto = angular.copy(vm.data.trabajanormalExcepcion);
						if (!vm.data.trabajanormalExcepcion) {
							$log.debug('horadesde',vm.data.horaDesdeExcepcion);
							if(vm.data.horaDesdeExcepcion && vm.data.horaHastaExcepcion){
								vm.data.excepcionNueva.FeriadoHoraDesde = moment(vm.data.horaDesdeExcepcion).format("HH:mm");
								vm.data.excepcionNueva.FeriadoHoraHasta = moment(vm.data.horaHastaExcepcion).format("HH:mm");
							}else {
								AlertaService.NewWarning("Debe seleccionar un lapso de tiempo para la excepción");
								return;
							}
						}
					}

					var sucursalExcepcion = angular.copy(vm.data.excepcionNueva);

					vm.data.feriado.Excepciones.push(sucursalExcepcion);


					$log.debug('Feriado a guardar OK.-', vm.data.feriado);
					limpiarFiltrosExcepciones();

				}

			}

			function agregarExcepcion() {

				if (validarAgregarExcepcion() === false) {
					MantenimientoAgendaDataService.obtenerNuevaExcepcionFeriado()
						.then(function (result) {
							if (vm.data.sucursal !== null && !angular.isUndefined(vm.data.sucursal) && vm.data.sucursal !== '') {
								result.IdSucursal = vm.data.sucursal.Id;
								result.Sucursal = vm.data.sucursal.Nombre;
							}
							if (vm.data.servicio !== null && !angular.isUndefined(vm.data.servicio) && vm.data.servicio !== '') {
								result.IdServicio = vm.data.servicio.Id;
								result.Servicio = vm.data.servicio.Nombre;
							}
							if (vm.data.recurso !== null && !angular.isUndefined(vm.data.recurso) && vm.data.recurso !== '') {
								result.IdTipoRecurso = vm.data.recurso.IdTipoRecurso;
								result.IdRecurso = vm.data.recurso.Id;
								result.Recurso = '(' + vm.data.recurso.TipoRecurso + ') ' + vm.data.recurso.Nombre;
							}

							vm.data.feriado.Excepciones.push(result);
							limpiarFiltrosExcepciones();
						}, function (pError) {
							AlertaService.NewError("Error", pError.message);
							return;
						});
				}
			}

			function validarAgregarExcepcion() {
				var _flag = false;

				if ((vm.data.sucursal === null || vm.data.sucursal === '') &&
					(vm.data.servicio === null || vm.data.servicio === '') &&
					(vm.data.recurso === null || vm.data.recurso === '')) {
					_flag = true;
				}

				return _flag;
			}

			function limpiarListaExcepcion() {
				vm.data.feriado.Excepciones.length = 0;
			}

			function limpiarFiltrosExcepciones() {
				vm.data.sucursal = null;
				vm.data.servicio = null;
				vm.data.recurso = null;
				vm.data.horaDesdeExcepcion = null;
				vm.data.horaHastaExcepcion = null;
				vm.data.trabajanormalExcepcion = false;
				vm.data.trabajanormal = false;
				//vm.data.excepcionNueva = null;
			}

			function isSucursalActiva() {
				if(vm.data.sucursal && vm.data.sucursal.Id) vm.data.isSucursal = false;
				else vm.data.isSucursal = false;
			}

			/* ------------------------------ IMPLEMENTACIÓN ------------------------------ */

			function setearHoraParcial() {

				var d_horaDesde;
				var d_horaHasta;

				if (!vm.data.esTodoElDia) {

					d_horaDesde = new Date();
					d_horaDesde.setHours(13);
					d_horaDesde.setMinutes(0);
					vm.data.horaDesde = angular.copy(d_horaDesde);

					d_horaHasta = new Date();
					d_horaHasta.setHours(23);
					d_horaHasta.setMinutes(59);
					vm.data.horaHasta = angular.copy(d_horaHasta);
					
				} else if (vm.data.esTodoElDia) {
					d_horaDesde = new Date();
					d_horaDesde.setHours(0);
					d_horaDesde.setMinutes(0);
					vm.data.horaDesde = angular.copy(d_horaDesde);

					d_horaHasta = new Date();
					d_horaHasta.setHours(0);
					d_horaHasta.setMinutes(0);
					vm.data.horaHasta = angular.copy(d_horaHasta);

				}

			}
			
			function setearHoraParcialExcepcion(){
				var d_horaDesde;
				var d_horaHasta;
				
				if(!vm.data.trabajanormalExcepcion){
					d_horaDesde = new Date();
					d_horaDesde.setHours(13);
					d_horaDesde.setMinutes(0);
					vm.data.horaDesdeExcepcion = angular.copy(d_horaDesde);

					d_horaHasta = new Date();
					d_horaHasta.setHours(23);
					d_horaHasta.setMinutes(59);
					vm.data.horaHastaExcepcion = angular.copy(d_horaHasta);

				}else if (vm.data.trabajanormalExcepcion) {
					d_horaDesde = new Date();
					d_horaDesde.setHours(0);
					d_horaDesde.setMinutes(0);
					vm.data.horaDesdeExcepcion = angular.copy(d_horaDesde);

					d_horaHasta = new Date();
					d_horaHasta.setHours(0);
					d_horaHasta.setMinutes(0);
					vm.data.horaHastaExcepcion = angular.copy(d_horaHasta);

				}
			}

			function cancel() {
				$state.go('turno.mantenimientoagenda.listferiados');
			}

			/* ------------------------------ ACTIVATE ------------------------------ */

			activate();

			/* Método inicializador */
			function activate() {

				$log.debug('state params parametror OK.-', $stateParams.idFeriado);
				vm.data.idFeriadoEdit = $stateParams.idFeriado;

				var _feriado;
				if (vm.data.idFeriadoEdit !== 0) {

					_feriado = MantenimientoAgendaDataService.obtenerFeriadoPorId(vm.data.idFeriadoEdit);
				} else _feriado = MantenimientoAgendaDataService.obtenerNuevoFeriado();

				var _excepcion = MantenimientoAgendaDataService.obtenerNuevaExcepcionFeriado();

				$q.all([_feriado,
					_excepcion

				])
					.then(activateOk, activateError);
			}

			function activateOk(results) {

				vm.data.feriado = results[0];
				vm.data.excepcionNueva = results[1];

				if (vm.data.feriado.Id > 0) {

					vm.data.horaDesde = moment(vm.data.feriado.HoraDesde, 'HH:mm').toDate();
					vm.data.horaHasta = moment(vm.data.feriado.HoraHasta, 'HH:mm').toDate();
					vm.data.fecha = angular.copy(new Date(vm.data.feriado.Fecha));

					vm.title.page = "Editar Feriado";

					if (vm.data.feriado.Excepciones) {
						vm.formControl.chboxExcepciones = true;
					}

					if (vm.data.feriado.DiaCompleto === true) {
						vm.data.esTodoElDia = true;
					}

				} else {
					vm.data.fecha = new Date();
					vm.data.esTodoElDia = true;
				}

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
