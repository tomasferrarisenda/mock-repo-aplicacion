import { ISupportDataService } from '../../../support/basic/services';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchPracticasController', SearchPracticasController);

		// Inyección de Dependencia
		SearchPracticasController.$inject = ['$log', '$scope','$uibModalInstance', 'User',
			'FACTURACION_INFO', 'SupportDataService'];

		// Constructor del Controller
		function SearchPracticasController ($log, $scope, $uibModalInstance, User,
			FACTURACION_INFO, SupportDataService: ISupportDataService) {

			$log.debug('SearchPracticasController: ON.-');

			/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

			var vm = this;
			vm.user = User;
			vm.title = {
				module: FACTURACION_INFO.title,
				page: 'Search Practicas'
			};

			vm.formData = {
				practicaSeleccionada : null,
				returnPractica : returnPractica
			};

			vm.formControl = {
				error : true,
				loading : false,
				replicarCodigo : replicarCodigo,
				cancel : cancel,
				practicaElegida : false,
				practicaSeleccion : practicaSeleccion
			
			};

			vm.data = {
				practicas : [],
				practicaSeleccionada : '',
				filtrarPractica : {
					codigoDesde : '',
					codigoHasta : '',
					nombre : '',
					descripcion : ''
				},
				hoy : ''
			};

			vm.filter = {
				practicas : [],
				codigoDesde : '',
				codigoHasta : '',
				nombre : '',
				descripcion : '',
				filtrarPracticas : filtrarPracticas,
				validar : validarFilters
			};

			vm.paginacion = {
				currentPage: 0,
				pageSize: 10,
				totalItems: 0,
				pageChanged : getPage,
				getPage: getPage
			};
			/* ---------------------------------------- Paginacion --------------------------------------------- */
			vm.sort = function(keyname){
				$scope.sortKey = keyname;
				$scope.reverse = !$scope.reverse;
			};

			function getPage () { 	
				vm.filter.validar();
				vm.filter.practicas = vm.data.practicas;

				var cantidadRegistros = vm.filter.practicas.length;
				var cantidadPaginas : any = cantidadRegistros / vm.paginacion.pageSize;

				if ((cantidadPaginas - parseInt(cantidadPaginas)) > 0)
					cantidadPaginas = cantidadPaginas + 1;

				if (cantidadPaginas < vm.paginacion.currentPage) {
					vm.paginacion.currentPage = 1;	
				}

				var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
				var end = begin + vm.paginacion.pageSize;					
		
				vm.paginacion.totalItems = vm.filter.practicas.length;					
				vm.filter.practicas = vm.filter.practicas.slice(begin, end);		                        
			}

			/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function replicarCodigo() {
				vm.filter.codigoHasta = vm.filter.codigoDesde;
			}

			function filtrarPracticas() {
				validarFilters();
				vm.data.filtrarPractica.codigoDesde = vm.filter.codigoDesde;
				vm.data.filtrarPractica.codigoHasta = vm.filter.codigoHasta;
				vm.data.filtrarPractica.nombre = vm.filter.nombre;
				vm.data.filtrarPractica.descripcion = vm.filter.descripcion;
	
				SupportDataService.getPracticas(vm.data.filtrarPractica)
					.then(function (pResult) {
						vm.data.practicas = pResult;
						vm.filter.practicas = pResult;
						vm.paginacion.getPage();
					});
			}

			function returnPractica () {
				$uibModalInstance.close(vm.formData.practicaSeleccionada);
			}

			function validarFilters () {
				if (vm.filter.codigoDesde == null)
					vm.filter.codigoDesde = '';
				if (vm.filter.codigoHasta == null)
					vm.filter.codigoHasta = '';
				if (vm.filter.nombre == null)
					vm.filter.nombre = '';
				if (vm.filter.descripcion == null)
					vm.filter.descripcion = '';
			}

			function inicializarModal(){ // Solo trae practicas para inicializar
				vm.data.filtrarPractica.codigoDesde = 1;
				vm.data.filtrarPractica.codigoHasta = 200;
			}

			function practicaSeleccion(){
				vm.formControl.practicaElegida = true;
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				$log.debug('SearchPractciasController: Inicializar ON.-');
				vm.formControl.loading = true;

				inicializarModal();
				
				SupportDataService.getPracticas(vm.data.filtrarPractica)
				.then(activateOk, activateError);
			}

			function activateOk (pResults) {
				vm.data.practicas = pResults;
				vm.filter.practicas = vm.data.practicas;

				vm.formControl.error = false;
				vm.formControl.loading = false;
				vm.paginacion.currentPage = 1;
				vm.paginacion.pageSize = 10;
				vm.paginacion.getPage();
			}

			function activateError (pError) {
				vm.formControl.loading = false;
			}
		};
	};
	return module;

})();