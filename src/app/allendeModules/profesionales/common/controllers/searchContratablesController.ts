
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchContratablesController', SearchContratablesController);

		// Inyección de Dependencia
		SearchContratablesController.$inject = ['$log', '$scope', '$uibModalInstance', 'ContratableDataService'];

		// Constructor del Controller
		function SearchContratablesController ($log, $scope, $uibModalInstance, ContratableDataService) {

				$log.debug('SearchContratablesController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;

				vm.title = {
					name: 'Seleccionar profesional'
				};

				vm.formControl = {
					loading : false,
					cancel : cancel,
					contratableSeleccion : contratableSeleccion,
					filtrarContratables : filtrarContratables
				};

				vm.data = {
					contratables : '',
					hoy : ''
				};
				
				vm.filter = {
					contratables : '',
					matricula : '',
					nombre : '',
					tipoContratableElegido : '',
					tiposContratable : ''
				};

				vm.paginacion = {
					currentPage: 0,
					pageSize: 10,
					totalItems: 0,
					pageChanged : getPage,
					getPage: getPage
				};

				/* ---------------------------------------- Paginacion --------------------------------------------- */

				function getPage () {
					vm.filter.contratables = vm.data.contratables;
 					var cantidadRegistros = vm.filter.contratables.length;
 					var cantidadPaginas : any = cantidadRegistros / vm.paginacion.pageSize;
 					if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
 						cantidadPaginas = cantidadPaginas + 1;
 					if (cantidadPaginas < vm.paginacion.currentPage) {
 						vm.paginacion.currentPage = 1;
 					}
					var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					vm.paginacion.totalItems = vm.filter.contratables.length;
					vm.filter.contratables = vm.filter.contratables.slice(begin, end);
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function filtrarContratables() {
					vm.filter.filtroContratables.IdTipo = vm.filter.tipoContratableElegido ? vm.filter.tipoContratableElegido : 1;
					vm.filter.filtroContratables.Matricula = vm.filter.matricula ? vm.filter.matricula : 0;
					vm.filter.filtroContratables.Nombre = vm.filter.nombre ? vm.filter.nombre : '';

					ContratableDataService.ObtenerPorFiltro(vm.filter.filtroContratables)
						.then(function (pResult) {
							$log.debug('pResult',pResult);
							vm.data.contratables = pResult;
							vm.filter.contratables = pResult;
							vm.paginacion.getPage();
						});
				}

				function contratableSeleccion(contratable){
					$uibModalInstance.close(contratable);
				}

				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function cargarComboTipos (){
					ContratableDataService.ObtenerTodos()
					.then(function (tiposContratables) {
						vm.data.tiposContratable = tiposContratables;
						vm.filter.tipoContratableElegido = 1;
					});
				}

				function obtenerFiltro(){
					ContratableDataService.CrearFiltroBusqueda().then(function(filtroContratables){
						vm.filter.filtroContratables = filtroContratables;
					})
				}

 				/* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					vm.formControl.loading = true;

					cargarComboTipos();
					obtenerFiltro();
					vm.paginacion.currentPage = 1;
					vm.paginacion.pageSize = 10;
					vm.paginacion.getPage();

					vm.formControl.loading = false;
				}
			}
	};
	return module;

})();