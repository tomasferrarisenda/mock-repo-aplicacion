/**
 * @author:			Pedro Ferrer
 * @description:	Retenciones
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('RetencionController', RetencionController);

		RetencionController.$inject = ['Logger', '$state', 'ModalService', '$scope', 'ContratosInternosDataService', 'DateUtils'];

		function RetencionController ($log, $state, ModalService, $scope, ContratosInternosDataService, DateUtils) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('RetencionController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
			};
			
			vm.filter = {
				ingresos : false,
				importe : null,
				comercio : false,
				IdTipoRetencionComercioIndustriaElegido : null,
				retenciones : ''
			};

			vm.formControl = {
				loading : false,
				retencionChange : retencionChange,
				importeChange : importeChange
			};
			

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function retencionChange(){
				$scope.$parent.vm.data.contratoEdit.IdTipoRetencionComercioIndustria = vm.filter.IdTipoRetencionComercioIndustriaElegido || 0;
			}
			
			$scope.$watch(function() {
				return vm.filter.ingresos;
			}, function() {
				$scope.$parent.vm.data.contratoEdit.RetieneIibb = vm.filter.ingresos;
				if(!vm.filter.ingresos){
					$scope.$parent.vm.data.contratoEdit.AlicuotaIibb = 0.00;
					vm.filter.importe = $scope.$parent.vm.data.contratoEdit.AlicuotaIibb;
				}
			});

			function importeChange(){
				$scope.$parent.vm.data.contratoEdit.AlicuotaIibb = vm.filter.importe;
			}
			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.filter.ingresos = $scope.$parent.vm.data.contratoEdit.RetieneIibb;
				vm.filter.importe = $scope.$parent.vm.data.contratoEdit.AlicuotaIibb;

				ContratosInternosDataService.TipoRetencionComercioIndustriaObtenerTodos().then(function(retenciones){
					vm.filter.retenciones = retenciones;
					if($scope.$parent.vm.data.contratoEdit.IdTipoRetencionComercioIndustria !== 0) vm.filter.IdTipoRetencionComercioIndustriaElegido = $scope.$parent.vm.data.contratoEdit.IdTipoRetencionComercioIndustria;
				});
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();