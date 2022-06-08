/**
 * @author:			Pedro Ferrer
 * @description:	Controlador Listado Prefacturacion
 * @type:			Controller
 **/
import * as angular from 'angular';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('PrefacturaAmbulatorioListController', PrefacturaAmbulatorioListController);

		PrefacturaAmbulatorioListController.$inject = [
			'$filter', 'Logger', '$q', '$state', 'ModalService', 'PrefacturaAmbulatorioDataService', 'DateUtils', 'ORIGEN_PREFACTURA', 'User', 'moment', 'SucursalDataService'
		];

		function PrefacturaAmbulatorioListController(
			$filter, $log, $q, $state, ModalService, PrefacturaAmbulatorioDataService, DateUtils, ORIGEN_PREFACTURA, User, moment, SucursalDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrefacturaAmbulatorioListController');
			$log.debug('ON.-');

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.title = {
				page: 'Listado Prefacturas'
			};

			vm.data = {
				prefacturas: null
			};

			vm.formControl = {
				volver: volver,
				buscar: buscar,
				editarPrefactura: editarPrefactura,
				eliminarPrefactura: eliminarPrefactura,
				buscarPagina: buscarPagina,
				guardarFiltrosDeBusqueda: guardarFiltrosDeBusqueda,
				limpiarFiltros: limpiarFiltros
				// colorTipoPrefactura : colorTipoPrefactura
			};

			vm.filter = {
				fechaHoy: '',
				fechaDesde: '',
				fechaHasta: '',
				paciente: {},
				servicioElegido: {},
				sucursalElegida: {},
				mutualElegida: {},
				codigoMutual: '',
				filtros: {},
				filtroNuevo: {}
			};

			vm.table = {
				export: exportarTable
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver() {
				$state.go('homesistemas');
			}

			function editarPrefactura(IdOrigenPrefactura) {
				guardarFiltrosDeBusqueda();
				$state.go('prefacturacion.ambulatorio.new', {
					esNuevo: false,
					id: IdOrigenPrefactura,
					idAmbito: ORIGEN_PREFACTURA.LISTADO_PREFACTURACION
				});
			}

			function eliminarPrefactura(index, id, nombrePaciente) {
				// ModalService.confirm('¿Desea eliminar la prefactura de ' + nombrePaciente +'?',
				// 	function(pResult){
				// 		if(pResult){
				// 			vm.data.prefacturas.splice(index,1);
				ModalService.success('Método no implementado.');
				// 		}
				// 	}
				// );
			}

			function guardarFiltrosDeBusqueda() {
				PrefacturaAmbulatorioDataService.IdPaciente = vm.filter.idPaciente;
				PrefacturaAmbulatorioDataService.FechaDesde = vm.filter.fechaDesde;
				PrefacturaAmbulatorioDataService.FechaHasta = vm.filter.fechaHasta;
				PrefacturaAmbulatorioDataService.Servicio = vm.filter.servicioElegido;
				PrefacturaAmbulatorioDataService.Sucursal = vm.filter.sucursalElegida;
				PrefacturaAmbulatorioDataService.Mutual = vm.filter.mutualElegida;
			}

			function buscar() {
				if (!vm.filter.currentPage) vm.filter.currentPage = 1;
				vm.formControl.buscarPagina({ currentPage: vm.filter.currentPage });
			}

			function limpiarFiltros() {
				vm.filter.idPaciente = 0;
				vm.filter.fechaDesde = vm.today;
				vm.filter.fechaHasta = vm.today;
				vm.filter.servicioElegido = '';
				vm.filter.sucursalElegida = '';
				vm.filter.mutualElegida = '';
			}

			function buscarPagina(pPagination) {
				vm.filter.currentPage = pPagination.currentPage;
				var currentPage = pPagination.currentPage;
				var pageSize = pPagination.pageSize || 10;

				vm.filter.filtros.IdPaciente = vm.filter.idPaciente || 0;
				vm.filter.filtros.FechaDesde = DateUtils.parseToBe(vm.filter.fechaDesde);
				vm.filter.filtros.FechaHasta = DateUtils.parseToBe(vm.filter.fechaHasta);
				vm.filter.filtros.IdServicio = vm.filter.servicioElegido ? vm.filter.servicioElegido.Id : 0;
				vm.filter.filtros.IdSucursal = vm.filter.sucursalElegida ? vm.filter.sucursalElegida.Id : 0;
				vm.filter.filtros.IdFinanciador = vm.filter.mutualElegida ? vm.filter.mutualElegida.Id : 0;

				vm.filter.filtros.CurrentPage = currentPage;
				vm.filter.filtros.PageSize = pageSize;

				PrefacturaAmbulatorioDataService.obtenerPrefacturasFiltradas(vm.filter.filtros).then(function (prefacturas) {
					vm.data.prefacturas = prefacturas;
				});
			}

			// function colorTipoPrefactura($scope){
			//        var className = '';

			//        switch($scope.NombreEstadoPrefactura){
			//        	case ESTADO_PREFACTURA.PENDIENTE_FACTURAR:
			//             className += ' color-pendiente-facturar-prefactura';
			//             break;
			//         case ESTADO_PREFACTURA.PARCIALMENTE_FACTURADO:
			//             className += ' color-parcialmente-facturado-prefactura';
			//             break;
			//         case ESTADO_PREFACTURA.FACTURADO:
			//             className += ' color-facturado-prefactura';
			//             break;
			//         case ESTADO_PREFACTURA.ANULADO:
			//             className += ' color-anulado-prefactura';
			//             break;
			//        }
			//        $scope.className = className;
			//  		}

			function exportarTable(pExportation) {

				if (pExportation.isCsv()) {

					if (!vm.filter.filtros.IdPaciente) vm.filter.filtros.IdPaciente = 0;
					var fechaD = DateUtils.parseToBeParams(vm.filter.fechaDesde);
					var fechaH = DateUtils.parseToBeParams(vm.filter.fechaHasta);
					if (!vm.filter.filtros.IdServicio) vm.filter.filtros.IdServicio = 0;
					if (!vm.filter.filtros.IdSucursal) vm.filter.filtros.IdSucursal = 0;

					PrefacturaAmbulatorioDataService.exportarListaToXls(vm.filter.filtros.IdPaciente, fechaD, fechaH,
						vm.filter.filtros.IdServicio, vm.filter.filtros.IdSucursal, vm.filter.filtros.CurrentPage, vm.filter.filtros.PageSize)
						.then(exportarOk, exportarError);
				}

				function exportarOk() {
					//vm.formControl.loading = false;
				}

				function exportarError(pError) {
					vm.formControl.loading = false;
					ModalService.error("Error: " + pError.message);
				}
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				
				vm.formControl.loading = true;
				var sucursales = SucursalDataService.obtenerTodasSinExcepciones();

				$q.all([sucursales])
				.then(activateOk, activateError);
			}

			function activateOk (results) {
				
				vm.formControl.error = false;
				vm.formControl.loading = false;

				vm.filter.fechaHoy = new Date();
				vm.filter.fechaDesde = vm.filter.fechaHoy;
				vm.filter.fechaHasta = vm.filter.fechaHoy;

				PrefacturaAmbulatorioDataService.generarFiltroListaPrefactura().then(function (pFiltros) {
					vm.filter.filtroNuevo = pFiltros;
					if (PrefacturaAmbulatorioDataService.IdPaciente) vm.filter.idPaciente = PrefacturaAmbulatorioDataService.IdPaciente;
					if (PrefacturaAmbulatorioDataService.FechaDesde) vm.filter.fechaDesde = PrefacturaAmbulatorioDataService.FechaDesde;
					if (PrefacturaAmbulatorioDataService.FechaHasta) vm.filter.fechaHasta = PrefacturaAmbulatorioDataService.FechaHasta;
					if (PrefacturaAmbulatorioDataService.Servicio) vm.filter.servicioElegido = PrefacturaAmbulatorioDataService.Servicio;
					if (PrefacturaAmbulatorioDataService.Mutual) vm.filter.mutualElegida = PrefacturaAmbulatorioDataService.Mutual;

					if(User.sucursales.length === results[0].length)
					{
						vm.filter.sucursales = results[0];
					} else {						
						vm.filter.sucursales = User.sucursales;
						if(PrefacturaAmbulatorioDataService.Sucursal == null)
						{
							vm.filter.sucursalElegida = vm.filter.sucursales[0];
						}
					}
					
					if (PrefacturaAmbulatorioDataService.Sucursal) {
						for (let i = 0; i < vm.filter.sucursales.length; i++) {
							if (vm.filter.sucursales[i].Id === PrefacturaAmbulatorioDataService.Sucursal.Id) {
								vm.filter.sucursalElegida = vm.filter.sucursales[i];
								break;
							}
						}
						PrefacturaAmbulatorioDataService.Sucursal = null;
					}
					// PrefacturaAmbulatorioDataService.sucursalObtenerTodos().then(function (sucursales) {
						
					// });

					PrefacturaAmbulatorioDataService.IdPaciente = null;
					PrefacturaAmbulatorioDataService.FechaDesde = null;
					PrefacturaAmbulatorioDataService.FechaHasta = null;
					PrefacturaAmbulatorioDataService.Servicio = null;
					PrefacturaAmbulatorioDataService.Mutual = null;

					buscar();
				});
				
			}

			function activateError (pError) {
				vm.formControl.loading = false;
			}

			// function activate() {

			// 	vm.filter.fechaHoy = new Date();
			// 	vm.filter.fechaDesde = vm.filter.fechaHoy;
			// 	vm.filter.fechaHasta = vm.filter.fechaHoy;

			// 	PrefacturaAmbulatorioDataService.generarFiltroListaPrefactura().then(function (pFiltros) {
			// 		vm.filter.filtroNuevo = pFiltros;
			// 		if (PrefacturaAmbulatorioDataService.IdPaciente) vm.filter.idPaciente = PrefacturaAmbulatorioDataService.IdPaciente;
			// 		if (PrefacturaAmbulatorioDataService.FechaDesde) vm.filter.fechaDesde = PrefacturaAmbulatorioDataService.FechaDesde;
			// 		if (PrefacturaAmbulatorioDataService.FechaHasta) vm.filter.fechaHasta = PrefacturaAmbulatorioDataService.FechaHasta;
			// 		if (PrefacturaAmbulatorioDataService.Servicio) vm.filter.servicioElegido = PrefacturaAmbulatorioDataService.Servicio;
			// 		if (PrefacturaAmbulatorioDataService.Mutual) vm.filter.mutualElegida = PrefacturaAmbulatorioDataService.Mutual;

			// 		vm.filter.sucursales = User.sucursales;
			// 		if (PrefacturaAmbulatorioDataService.Sucursal) {
			// 			for (let i = 0; i < vm.filter.sucursales.length; i++) {
			// 				if (vm.filter.sucursales[i].Id === PrefacturaAmbulatorioDataService.Sucursal.Id) {
			// 					vm.filter.sucursalElegida = vm.filter.sucursales[i];
			// 					break;
			// 				}
			// 			}
			// 			PrefacturaAmbulatorioDataService.Sucursal = null;
			// 		}
			// 		// PrefacturaAmbulatorioDataService.sucursalObtenerTodos().then(function (sucursales) {
						
			// 		// });

			// 		PrefacturaAmbulatorioDataService.IdPaciente = null;
			// 		PrefacturaAmbulatorioDataService.FechaDesde = null;
			// 		PrefacturaAmbulatorioDataService.FechaHasta = null;
			// 		PrefacturaAmbulatorioDataService.Servicio = null;
			// 		PrefacturaAmbulatorioDataService.Mutual = null;

			// 		buscar();
			// 	});
			// }
		}
	};

	return module;
})();