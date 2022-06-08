export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('SearchCuentaProfesionalController', SearchCuentaProfesionalController);

		// Inyección de Dependencia
		SearchCuentaProfesionalController.$inject = ['$log', '$q', '$scope', '$filter','$uibModalInstance', 'ContratableDataService'];

		// Constructor del Controller
		function SearchCuentaProfesionalController ($log, $q, $scope, $filter, $uibModalInstance, ContratableDataService) {

				$log.debug('SearchCuentaProfesionalController: ON.-');

				/* ---------------------------------------- API Y VARIABLES ---------------------------------------- */

				var vm = this;

				vm.formData = {
					profesionalSeleccionado : null
				};

				vm.formControl = {
					error : true,
					loading : false,
					cancel : cancel,
					profesionalElegido : false,
					profesionalSeleccion : profesionalSeleccion
				};

				vm.data = {
					profesionales : [],
					profesionalSeleccionado : ''
				};

				vm.filter = {
					profesionales : [],
					cuenta : '',
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
					vm.filter.profesionales = $filter('filter')
						(vm.data.profesionales, {
							Numero: vm.filter.cuenta,
							Nombre: vm.filter.nombre
						});
					vm.paginacion.totalItems = vm.filter.profesionales.length;
					vm.filter.profesionales = vm.filter.profesionales.slice(begin, end);
				}

				/* ----------------------------------------- IMPLEMENTACIÓN ----------------------------------------- */
				function cancel () {
					$uibModalInstance.dismiss('cancel');
				}

				function profesionalSeleccion (profesional) {
 					$uibModalInstance.close(profesional);
 				}

				function validarFilters () {
 					if (vm.filter.cuenta == null)
						vm.filter.cuenta = '';
					if (vm.filter.nombre == null)
						vm.filter.nombre = '';
				}

				 /* -------------------------------------------- ACTIVATE -------------------------------------------- */

 				activate();

				function activate () {
					vm.formControl.loading = true;
					ContratableDataService.CuentaObtenerTodos()
					.then(function (profesionales) {
						vm.data.profesionales = profesionales;
						vm.filter.profesionales = vm.data.profesionales;
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