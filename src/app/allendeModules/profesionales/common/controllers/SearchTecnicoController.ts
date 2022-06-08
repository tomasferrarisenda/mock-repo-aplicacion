export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchTecnicoController', SearchTecnicoController);

		// Inyección de Dependencia
		SearchTecnicoController.$inject = ['$log', '$q', '$scope', '$filter','$uibModalInstance', 'ContratableDataService', 'idServicio'];

		// Constructor del Controller
		function SearchTecnicoController ($log, $q, $scope, $filter, $uibModalInstance, ContratableDataService, idServicio) {

				$log.debug('SearchTecnicoController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;

				vm.formData = {
					tecnicoSeleccionado : null
				};

				vm.formControl = {
					error : true,
					loading : false,
					cancel : cancel,
					tecnicoElegido : false,
					tecnicoSeleccion : tecnicoSeleccion
				};

				vm.data = {
					tecnicos : [],
					tecnicoSeleccionado : ''
				};

				vm.filter = {
					tecnicos : [],
					codigo : '',
					nombre : '',
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
				 	var begin = ((vm.paginacion.currentPage - 1) * vm.paginacion.pageSize);
					var end = begin + vm.paginacion.pageSize;
					vm.filter.validar();
					vm.filter.tecnicos = $filter('filter')
						(vm.data.tecnicos, {
							Codigo: vm.filter.codigo,
							Nombre: vm.filter.nombre
						});
					vm.paginacion.totalItems = vm.filter.tecnicos.length;
					vm.filter.tecnicos = vm.filter.tecnicos.slice(begin, end);
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function tecnicoSeleccion (tecnico) {
 					$uibModalInstance.close(tecnico);
 				}

				function validarFilters () {
 					if (vm.filter.codigo == null)
						vm.filter.codigo = '';
					if (vm.filter.nombre == null)
						vm.filter.nombre = '';
				}

				 /* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					vm.formControl.loading = true;
					ContratableDataService.TecnicoObtenerTodos(idServicio).then(function(tecnicos) {
						vm.data.tecnicos = tecnicos;
						vm.filter.tecnicos = vm.data.tecnicos;
						vm.paginacion.currentPage = 1;
						vm.paginacion.pageSize = 10;
						vm.paginacion.getPage();
						vm.formControl.loading = false;
					});
				}
			}
	};
	return module;

})();