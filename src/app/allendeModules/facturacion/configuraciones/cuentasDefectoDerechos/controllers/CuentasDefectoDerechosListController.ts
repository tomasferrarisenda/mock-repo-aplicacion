/**
 * @author:			drobledo
 * @description:	Cuentas Por Defecto para Derechos
 * @type:			Controller
 **/

 export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CuentasDefectoDerechosListController', CuentasDefectoDerechosListController);

		CuentasDefectoDerechosListController.$inject = ['$log','$state', 'ModalService', 
			'CuentasDefectoDerechosDataService', 'CuentasDefectoDerechosLogicService'];

		function CuentasDefectoDerechosListController($log, $state, ModalService, 
			CuentasDefectoDerechosDataService, CuentasDefectoDerechosLogicService) {
				
			var vm = this;

			vm.title = {
				page: 'Listado de Cuentas por Defecto para Derechos'
			};	

			vm.data = {
				cuentasDefectoDerechos: [],
				filtroCuentas : {}
			};

			vm.filter = { 
				cuentaFiltro : '',
				nombre : '',
				currentPage: 1
			};

			vm.formControl = {
				buscar : buscar,
				buscarPagina : buscarPagina,
				limpiarFiltros : limpiarFiltros,
				borrarCuenta : borrarCuenta,
				editarCuenta : editarCuenta,
				volver : volver
			};

			/* ---------------------------------------- IMPLEMENTACIÓN ---------------------------------------- */

			function volver(){
				$state.go('homesistemas');
			}

			function buscar() {
				if(vm.filter.currentPage === 0) vm.filter.currentPage = 1;
				vm.formControl.buscarPagina({currentPage: vm.filter.currentPage});
			}

			function limpiarFiltros () {
				vm.filter.nombre = '';
				vm.filter.cuentaFiltro = '';
			}

			function borrarCuenta(fila){
				ModalService.confirm('¿Desea eliminar la configuración para '+ fila.Cuenta + '?',
				function (pResult) {
					if (pResult) {
						CuentasDefectoDerechosDataService.eliminarCuenta(fila.Id)
						.then(function (result) {
							if (result.IsOk == false) {
								ModalService.warning("Por favor verifique: " + result.Message);
							}
							else {
								ModalService.success("La configuración ha sido eliminada.");
								buscar();
							}
						})
						.catch(function (pError) {
							ModalService.error("Error en el servidor.", pError.message);
							return;
						});	
					}		
				});	
			}

			function editarCuenta(cuentaId){
				CuentasDefectoDerechosLogicService.editCuenta(cuentaId).then(function(result){
					buscar();
				});
			}

			function buscarPagina(paginacion){
				vm.filter.currentPage = paginacion.currentPage;
	 			
				vm.data.filtroCuentas.NombreCuenta = vm.filter.nombre;
				vm.data.filtroCuentas.IdCuenta = vm.filter.cuentaFiltro ? vm.filter.cuentaFiltro : 0;

				vm.data.filtroCuentas.CurrentPage = paginacion.currentPage;
				if(vm.data.filtroCuentas.CurrentPage == 0) vm.data.filtroCuentas.CurrentPage = 1;
	 			vm.data.filtroCuentas.PageSize = paginacion.pageSize || vm.data.filtroCuentas.PageSize || 10;
	 			vm.data.filtroCuentas.UsePagination = true;

				CuentasDefectoDerechosDataService.obtenerListadoCuentas(vm.data.filtroCuentas)
				.then(function(listadoCuentas){
					vm.data.cuentasDefectoDerechos = listadoCuentas;
				});
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				CuentasDefectoDerechosDataService.obtenerFiltroCuentas()
				.then(function(filtroDto){
					vm.data.filtroCuentas = filtroDto;
					buscar();
				});
			}
		}
	};
	return module;
})();