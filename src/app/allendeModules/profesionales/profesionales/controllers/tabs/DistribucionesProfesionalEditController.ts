/**
 * @author:			Jorge Basiluk
 * @description:	Distribuciones
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('DistribucionesProfesionalEditController', DistribucionesProfesionalEditController);

		DistribucionesProfesionalEditController.$inject = ['Logger', '$scope'];

		function DistribucionesProfesionalEditController ($log, $scope) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */
			var vm = this;

			vm.data = {
				distribuciones : [],
				idProfesional : null
            };
            
            vm.formControl = {
				buscarPagina : buscarPagina,
				verItemsDetalle: verItemsDetalle,
            }

            function buscarPagina(pPagination) {
                vm.filter.currentPage = pPagination.currentPage;
                var currentPage = pPagination.currentPage;
                var pageSize = pPagination.pageSize || 10;               
            }

			vm.sort = function(keyname){
				$scope.sortKey = keyname;   //set the sortKey to the param passed
				$scope.reverse = !$scope.reverse; //if true make it false and vice versa
			}
			
			function verItemsDetalle(pId) {			
				for (var i = vm.data.distribuciones.length - 1; i >= 0; i--) {
					if (vm.data.distribuciones[i].Id == pId) {
						vm.data.distribuciones[i].VerItems = !vm.data.distribuciones[i].VerItems
						return;
					}
				}					
			}	

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.data.distribuciones = $scope.$parent.vm.data.profesionalEdit.Distribuciones;
				vm.data.idProfesional = $scope.$parent.vm.data.profesionalEdit.Id;
			}
		}
	};

	return module;
})();