/**
 * @author:			Pedro Ferrer
 * @description:	Equipos General
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('EquipoGeneralController', EquipoGeneralController);

		EquipoGeneralController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'ContratosInternosDataService','EquiposDataService', 'DateUtils'];

		function EquipoGeneralController ($log, $state, ModalService, $scope, ContratosInternosDataService,EquiposDataService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('EquipoGeneralController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				servicios : []
			};
			
			vm.filter = {
				descripcion : '',
                activo : false,
				visiblePortalWeb : false,
				visibilizaProfesionalesQueLoAtienden : false,
				idServicioPorDefecto: 0
			};

			vm.formControl = {
				loading : false,
				descripcionChange : descripcionChange,
				servicioPorDefectoChange : servicioPorDefectoChange
            };
            
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function descripcionChange(){
				$scope.$parent.vm.data.equipo.Descripcion = vm.filter.descripcion;
			}

			function servicioPorDefectoChange() {
				$scope.$parent.vm.data.equipo.IdServicioPorDefecto = vm.filter.idServicioPorDefecto;
			}
			
			$scope.$watch(function() {
				return vm.filter.activo;
			}, function() {
				$scope.$parent.vm.data.equipo.Activo = vm.filter.activo;
            });
            
            $scope.$watch(function() {
				return vm.filter.visiblePortalWeb;
			}, function() {
				$scope.$parent.vm.data.equipo.VisiblePortalWeb = vm.filter.visiblePortalWeb;
            });
			
			$scope.$watch(function() {
				return vm.filter.visibilizaProfesionalesQueLoAtienden;
			}, function() {
				$scope.$parent.vm.data.equipo.VisibilizaProfesionalesQueLoAtienden = vm.filter.visibilizaProfesionalesQueLoAtienden;
            });

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				if(!$scope.$parent.vm.data.equipo){
					$state.go('profesionales.equipos.edit');
					return;
				}
				vm.formControl.loading = true;
				vm.filter.descripcion = $scope.$parent.vm.data.equipo.Descripcion;
                vm.filter.activo = $scope.$parent.vm.data.equipo.Activo;
				vm.filter.visiblePortalWeb = $scope.$parent.vm.data.equipo.VisiblePortalWeb;
				vm.filter.visibilizaProfesionalesQueLoAtienden = $scope.$parent.vm.data.equipo.VisibilizaProfesionalesQueLoAtienden;
				vm.formControl.loading = false;

				EquiposDataService.ObtenerTodosServicios().then(function (servicios) {
					vm.data.servicios = servicios;
					if ($scope.$parent.vm.data.equipo.IdServicioPorDefecto > 0) vm.filter.idServicioPorDefecto = $scope.$parent.vm.data.equipo.IdServicioPorDefecto;
				});
			}
		}
	};

	return module;
})();