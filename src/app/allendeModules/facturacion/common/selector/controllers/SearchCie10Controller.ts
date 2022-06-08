export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchCie10Controller', SearchCie10Controller);

		// Inyección de Dependencia
		SearchCie10Controller.$inject = ['$log', '$q', '$scope', '$filter','$uibModalInstance', 'Cie10DataService'];

		// Constructor del Controller
		function SearchCie10Controller ($log, $q, $scope, $filter, $uibModalInstance, Cie10DataService) {

				$log.debug('SearchCie10Controller: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;

				vm.formData = {
					cie10Seleccionado : null
				};

				vm.formControl = {
					error : true,
					loading : false,
					cancel : cancel,
					cie10Elegido : false,
					cie10Seleccion : cie10Seleccion
				};

				vm.data = {
					cie10s : [],
					cie10Seleccionado : ''
				};

				vm.filter = {
					cie10s : [],
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
					vm.filter.cie10s = $filter('filter')
						(vm.data.cie10s, {
							Codigo: vm.filter.codigo,
							Nombre: vm.filter.nombre
						});
					vm.paginacion.totalItems = vm.filter.cie10s.length;
					vm.filter.cie10s = vm.filter.cie10s.slice(begin, end);
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function cie10Seleccion (cie10) {
 					$uibModalInstance.close(cie10);
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
					Cie10DataService.ObtenerTodos().then(function(cie10s) {
						vm.data.cie10s = cie10s;
						vm.filter.cie10s = vm.data.cie10s;
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