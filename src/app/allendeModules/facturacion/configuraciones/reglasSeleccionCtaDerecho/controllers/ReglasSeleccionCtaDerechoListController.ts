/**
 * @author:			jbasiluk
 * @description:	Reglas Selección Cta Derecho
 * @type:			Controller
 **/

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ReglasSeleccionCtaDerechoListController', ReglasSeleccionCtaDerechoListController);

		ReglasSeleccionCtaDerechoListController.$inject = ['$log','$state', 'ModalService', 
			'ReglasSeleccionCtaDerechoDataService', 'ReglasSeleccionCtaDerechoLogicService'];

		function ReglasSeleccionCtaDerechoListController($log, $state, ModalService, 
			ReglasSeleccionCtaDerechoDataService, ReglasSeleccionCtaDerechoLogicService) {
				
			var vm = this;

			vm.title = {
				page: 'Listado de reglas de selección de cuentas derecho' 
			};	

			vm.data = {
				reglas: [],
				filtroReglas : {}
			};

			vm.filter = { 
				IdTipoReglaElegido : '',
                tiposRegla: '',
				currentPage: 1
			};

			vm.formControl = {
				buscar : buscar,
				buscarPagina : buscarPagina,
				limpiarFiltros : limpiarFiltros,
				borrarRegla : borrarRegla,
				editarRegla : editarRegla,
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
				vm.filter.IdTipoReglaElegido = '';
			}

			function borrarRegla(fila){
				ModalService.confirm('¿Desea eliminar la configuración?',
				function (pResult) {
					if (pResult) {
						ReglasSeleccionCtaDerechoDataService.ReglaEliminar(fila.Id)
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

			function editarRegla(reglaId){
				ReglasSeleccionCtaDerechoLogicService.editRegla(reglaId).then(function(result){
					buscar();
				});
			}

			function buscarPagina(paginacion){
				vm.filter.currentPage = paginacion.currentPage;
				vm.data.filtroReglas.IdTipoRegla = vm.filter.IdTipoReglaElegido ? vm.filter.IdTipoReglaElegido : 0;
				vm.data.filtroReglas.CurrentPage = paginacion.currentPage;
				if(vm.data.filtroReglas.CurrentPage == 0) vm.data.filtroReglas.CurrentPage = 1;
	 			vm.data.filtroReglas.PageSize = paginacion.pageSize || vm.data.filtroReglas.PageSize || 10;
	 			vm.data.filtroReglas.UsePagination = true;

                 ReglasSeleccionCtaDerechoDataService.ObtenerListadoReglas(vm.data.filtroReglas)
				.then(function(listadoReglas){
					vm.data.reglas = listadoReglas;
				});
			}

			/* ---------------------------------------- ACTIVATE ---------------------------------------- */

			activate();

			function activate() {
				ReglasSeleccionCtaDerechoDataService.ObtenerFiltroReglas()
				.then(function(filtroDto){
					vm.data.filtroReglas = filtroDto;
					buscar();
				});

				ReglasSeleccionCtaDerechoDataService.TipoReglaSeleccionObtenerTodos().then(function(tipos){
					vm.filter.tiposRegla = tipos;
				});
			}
		}
	};
	return module;
})();