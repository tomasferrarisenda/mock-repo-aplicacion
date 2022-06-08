/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternacionHistoricoController', InternacionHistoricoController);

		// Inyección de Dependencia
		InternacionHistoricoController.$inject = ['Logger', '$state',
			'ModalService', 'InternacionReportesDataService', 'InternacionReportesLogicService',
			'InternacionCommonLogicService', 'MutualLogicService', 'CieLogicService', 'SupportLogicService',
			'InternacionHistoricoHelperService',
			'User'];

		// Constructor del Controller
		function InternacionHistoricoController ($log, $state,
			ModalService, InternacionReportesDataService, InternacionReportesLogicService,
			InternacionCommonLogicService, MutualLogicService, CieLogicService, SupportLogicService, 
			InternacionHistoricoHelperService,
			User) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionHistoricoController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.today = new Date();
			vm.title = {
				module: $state.current.data.icon,
				page: $state.current.data.title
			};

			vm.data = {
				// Información traida desde la BD
				internaciones: []
			};

			vm.formControl = {
				// Manejo del formulario
				error : true,
				loading : false,
				searchOk : false,
				showFilters : true,
				reloadPage : activate,
				volver : volver
			};

			vm.filter = {
				sucursales : [],
				mutuales : [],
				diagnosticos : [],
				tiposAlta : [],

				fechaIngresoDesde : '',
				fechaIngresoHasta : '',
				fechaEgresoDesde : '',
				fechaEgresoHasta : '',
				incluirAltas : false,
				incluirIngreso: true,
				autorizacionesAgregadas: false
				
			};

			vm.cleanFilters = cleanFilters;
			vm.quitarAltas = quitarAltas;
			vm.quitarIngreso = quitarIngreso;

			vm.internacion = {
				search : getAllInternacionesHistoricas,
				print : printAll
			};

			vm.sucursal = {
				open : openSucursalSelector,
				delete : deleteSucursal
			};

			vm.mutual = {
				open : openMutualSelector,
				delete : deleteMutual
			};

			vm.cie = {
				open : openCieSelector,
				delete : deleteEnfermedad
			};
			
			vm.tipoAlta = {
				open : openTipoAlta
			};

			vm.fechasCtrl = {
				updateFechaIngresoDesde : updateFechaIngresoDesde,
				updateFechaEgresoDesde : updateFechaEgresoDesde
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				$state.go('homesistemas');
			}
			
			function errorCallbackModal (pError) {
				if (pError.message)
					ModalService.error(pError.message);
				$log.error('ERROR', pError);
			}

			function quitarAltas () {
				if (!vm.filter.incluirAltas) {
					vm.filter.fechaEgresoDesde = '';
					vm.filter.fechaEgresoHasta = '';
					vm.filter.soloAutorizacionesAgregadas = false;
					vm.filter.tiposAlta = [];
				}
			}

			function quitarIngreso() {
				if (!vm.filter.incluirIngreso) {
					vm.filter.fechaIngresoDesde = '';
					vm.filter.fechaIngresoHasta = '';
				}
			}

			/* FECHAS CONTROLLER */

			function updateFechaIngresoDesde() {
				$log.debug('ToggleMin ON.-');

				// $scope.minDateHasta = vm.filter.fechaIngresoDesde;
				if(vm.filter.fechaIngresoHasta != null) {
					if(vm.filter.fechaIngresoHasta <= vm.filter.fechaIngresoDesde) {
						vm.filter.fechaIngresoHasta = "";
					}
				}
			}

			function updateFechaEgresoDesde() {
				$log.debug('ToggleMin ON.-');

				// $scope.minDateHasta = vm.filter.fechaIngresoDesde;
				if(vm.filter.fechaEgresoHasta != null) {
					if(vm.filter.fechaEgresoHasta <= vm.filter.fechaEgresoDesde) {
						vm.filter.fechaEgresoHasta = "";
					}
				}
			}

			/* MUTUAL */
			function openMutualSelector () {
				$log.debug('OpenMutualSelector ON.-');
				MutualLogicService.openMutualSelector(User)
				.then(successCallback, errorCallbackModal);

				function successCallback (pMutual) {
					$log.debug('OpenMutualSelector OK.-', pMutual);
					var _add = true;
					for (var i = 0; i < vm.filter.mutuales.length; i++) {
						if (vm.filter.mutuales[i].id_mutual == pMutual.id_mutual) {
							_add = false;
							break;
						}
					}

					if (_add)
						vm.filter.mutuales.push(pMutual);
					else 
						ModalService.info('Ya está cargada dicha mutual');
				}
			}

			function deleteMutual (pIndex) {
				vm.filter.mutuales.splice(pIndex, 1);
			}

			/* CIE */

			function openCieSelector () {
				$log.debug('OpenCieSelector ON.-');
				CieLogicService.openSelector(User)
				.then(successCallback, errorCallbackModal);

				function successCallback (pEnfermedadCie) {
					$log.debug('OpenCieSelector OK.-', pEnfermedadCie);
					var _add = true;

					for (var i = 0; i < vm.filter.diagnosticos.length; i++) {
						if (vm.filter.diagnosticos[i].id_cie_enfermedad == pEnfermedadCie.id_cie_enfermedad) {
							_add = false;
							break;
						}
					}

					if (_add)
						vm.filter.diagnosticos.push(pEnfermedadCie);
					else 
						ModalService.info('Ya está cargada dicha enfermedad');
				}
			}

			function deleteEnfermedad (pIndex) {
				vm.filter.diagnosticos.splice(pIndex, 1);
			}

			/* SUCURSAL */

			function openSucursalSelector () {
				$log.debug('OpenSucursalSelector ON.-');
				SupportLogicService.openSucursalSelector(User)
				.then(successCallback, errorCallbackModal);

				function successCallback (pSucursal) {
					$log.debug('OpenSucursalSelector OK.-',pSucursal);

					var _add = true;

					for (var i = 0; i < vm.filter.sucursales.length; i++) {
						if (vm.filter.sucursales[i].id_sucursal == pSucursal.id_sucursal) {
							_add = false;
							break;
						}
					}

					if (_add)
						vm.filter.sucursales.push(pSucursal);
					else 
						ModalService.info('Ya está cargada dicha sucursal');

				}
			}

			function deleteSucursal (pIndex) {
				vm.filter.sucursales.splice(pIndex, 1);
			}

			/* TIPO ALTA */

			function openTipoAlta () {
				$log.debug('OpenTipoAlta ON.-');
				InternacionCommonLogicService.openTipoAltaSelector(User)
				.then(successCallback, errorCallbackModal);

				function successCallback (pTipoAlta) {
					$log.debug('OpenTipoAlta OK.-',pTipoAlta);

					var _add = true;

					for (var i = 0; i < vm.filter.tiposAlta.length; i++) {
						if (vm.filter.tiposAlta[i].id_tipo_alta_internacion == pTipoAlta.id_tipo_alta_internacion) {
							_add = false;
							break;
						}
					}

					if (_add)
						vm.filter.tiposAlta.push(pTipoAlta);
					else 
						ModalService.info('Ya está cargada dicho tipo');

				}
			}

			/* PAGINACIÓN */

			function cleanFilters (initialize) {
				if (!initialize)
					InternacionHistoricoHelperService.cleanFilters();
				
				vm.data.internaciones = [];
				vm.filter.fechaIngresoDesde = '';
				vm.filter.fechaIngresoHasta = '';
				vm.filter.fechaEgresoDesde = '';
				vm.filter.fechaEgresoHasta = '';
				vm.filter.internaciones = [];
				vm.filter.sucursales = [];
				vm.filter.mutuales = [];
				vm.filter.diagnosticos = [];
				vm.filter.tiposAlta = [];
				vm.filter.incluirAltas = false;
				vm.filter.incluirIngreso = true;
				vm.filter.autorizacionesAgregadas = false;
				vm.formControl.searchOk = false;

			}

			/* INTERNACIÓN */

			function printAll () {
				
			}

			function getAllInternacionesHistoricas () {
				
				if (vm.filter.incluirAltas || vm.filter.incluirIngreso) {
					vm.formControl.loading = true;
					var _object = InternacionReportesLogicService.crearDictionary(
						vm.filter.sucursales,
						vm.filter.mutuales,
						vm.filter.diagnosticos,
						vm.filter.tiposAlta,
						vm.filter.fechaIngresoDesde,
						vm.filter.fechaIngresoHasta,
						vm.filter.fechaEgresoDesde,
						vm.filter.fechaEgresoHasta,
						vm.filter.soloAutorizacionesAgregadas || false
					);

					InternacionReportesDataService.getHistoricoLazy(User, _object)
					.then(successCallback, errorCallback);
				} else {
					ModalService.info('Debe ingresar fechas de ingreso y/o fechas de alta.');
				}

				function successCallback (pInternaciones) {
					vm.data.internaciones = pInternaciones;
					vm.formControl.searchOk = true;
					vm.formControl.loading = false;
					$log.debug('GetAllInternacionesHistoricas OK.-', pInternaciones);
				}

				function errorCallback (pError) {
					ModalService.error(pError.message, pError.detail);
					vm.formControl.searchOk = false;
					vm.formControl.loading = false;
					$log.error('GetAllInternacionesHistoricas ERROR.-', pError);
				}

				InternacionHistoricoHelperService.setFilters(vm.filter);
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			
			function activate () {
				$log.debug('Inicializar ON.-');
				cleanFilters(true);
				vm.formControl.loading = true;

				successCallback();

				function successCallback (pResults?) {
					vm.formControl.loading = false;
					vm.formControl.error = false;

					if (InternacionHistoricoHelperService.hayFiltros()) {
						vm.filter = InternacionHistoricoHelperService.getFilters();
						getAllInternacionesHistoricas();
						// InternacionHistoricoHelperService.cleanFilters();
					}

					$log.debug('Inicializar OK.-', pResults);
				}
			}
		}
	};

	return module;

})();