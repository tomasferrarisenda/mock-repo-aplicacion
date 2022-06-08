import { IRecursoTecnologicoRisLegacyDataService } from "../../services";

/**
 * @author:			Pedro Ferrer
 * @description:	Aparatos General
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AparatoGeneralController', AparatoGeneralController);

		AparatoGeneralController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'ContratosInternosDataService', 'AparatosDataService', 'DateUtils',
		'RecursoTecnologicoRisLegacyDataService', '$q'];

		function AparatoGeneralController ($log, $state, ModalService, $scope, ContratosInternosDataService, AparatosDataService, DateUtils,
			RecursoTecnologicoRisLegacyDataService: IRecursoTecnologicoRisLegacyDataService, $q) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AparatoGeneralController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				servicios : [],
				recursosTecnologicoRisLegacy : []
			};
			
			vm.filter = {
				descripcion : '',
                activo : false,
				visiblePortalWeb : false,
				visibilizaProfesionalesQueLoAtienden : false,
				idServicioPorDefecto: 0,
				IdRecursoTecnologicoRisLegacy: 0
			};

			vm.formControl = {
				loading : false,
				descripcionChange : descripcionChange,
				servicioPorDefectoChange : servicioPorDefectoChange,
				recursoRisChange: recursoRisChange
            };
            
			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function descripcionChange(){
				$scope.$parent.vm.data.aparato.Descripcion = vm.filter.descripcion;
			}
			
			function servicioPorDefectoChange() {
				$scope.$parent.vm.data.aparato.IdServicioPorDefecto = vm.filter.idServicioPorDefecto;
			}

			function recursoRisChange() {
				$scope.$parent.vm.data.aparato.IdRecursoTecnologicoRisLegacy = vm.filter.IdRecursoTecnologicoRisLegacy;
			}

			$scope.$watch(function() {
				return vm.filter.activo;
			}, function() {
				$scope.$parent.vm.data.aparato.Activo = vm.filter.activo;
            });
            
            $scope.$watch(function() {
				return vm.filter.visiblePortalWeb;
			}, function() {
				$scope.$parent.vm.data.aparato.VisiblePortalWeb = vm.filter.visiblePortalWeb;
            });
			
			$scope.$watch(function() {
				return vm.filter.visibilizaProfesionalesQueLoAtienden;
			}, function() {
				$scope.$parent.vm.data.aparato.VisibilizaProfesionalesQueLoAtienden = vm.filter.visibilizaProfesionalesQueLoAtienden;
            });

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				if(!$scope.$parent.vm.data.aparato){
					$state.go('profesionales.aparatos.edit');
					return;
				}
				vm.formControl.loading = true;
				vm.filter.descripcion = $scope.$parent.vm.data.aparato.Descripcion;
                vm.filter.activo = $scope.$parent.vm.data.aparato.Activo;
				vm.filter.visiblePortalWeb = $scope.$parent.vm.data.aparato.VisiblePortalWeb;
				vm.filter.visibilizaProfesionalesQueLoAtienden = $scope.$parent.vm.data.aparato.VisibilizaProfesionalesQueLoAtienden;
				vm.filter.IdRecursoTecnologicoRisLegacy = $scope.$parent.vm.data.aparato.IdRecursoTecnologicoRisLegacy;
				vm.formControl.loading = false;

				let _obtenerTodosServicios = AparatosDataService.ObtenerTodosServicios();
				let _obtenerTodosRecursoTecnologicoRisLegacy = RecursoTecnologicoRisLegacyDataService.getAll();

				$q.all([_obtenerTodosServicios, _obtenerTodosRecursoTecnologicoRisLegacy])
				.then(function (pResult) {
					
					$log.debug('pResult',pResult);

					vm.data.servicios = pResult[0];
					if ($scope.$parent.vm.data.aparato.IdServicioPorDefecto > 0) vm.filter.idServicioPorDefecto = $scope.$parent.vm.data.aparato.IdServicioPorDefecto;

					vm.data.recursosTecnologicoRisLegacy = pResult[1];

				});
			}
		}
	};

	return module;
})();