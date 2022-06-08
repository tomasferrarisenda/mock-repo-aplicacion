/**
 * @author:			Pedro Ferrer
 * @description:	General
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../../support/basic/services';

export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('GeneralOrganizacionEditController', GeneralOrganizacionEditController);

		GeneralOrganizacionEditController.$inject = ['Logger', '$scope', 'SupportDataService'];

		function GeneralOrganizacionEditController ($log, $scope, SupportDataService: ISupportDataService) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			
            vm.filter = {
				idAlicuotaElegida : '',
				idCondicionImpositivaElegida : '',
				estadoOrganizacion : false,

				tipoAfiliado : [],
				condicionImpositiva : [],
			}
			
			vm.formControl = {
				alicuotaChange : alicuotaChange,
				condicionChange : condicionChange,
				activoChange : activoChange,
			}

			/* ---------------------------------------------- FORMULARIO ---------------------------------------------- */
			function alicuotaChange(){
				$scope.$parent.vm.data.organizacion.IdAlicuotaIva = vm.filter.idAlicuotaElegida;
			}

			function condicionChange(){
				$scope.$parent.vm.data.organizacion.IdCondicionImpositiva = vm.filter.idCondicionImpositivaElegida;
			}

			function activoChange(){
				$scope.$parent.vm.data.organizacion.Activo = vm.filter.estadoOrganizacion;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate () {
				vm.filter.estadoOrganizacion = $scope.$parent.vm.data.organizacion.Activo;
				SupportDataService.getAllAlicuotasIva().then(function(alicuota){
					vm.filter.alicuota = alicuota;
					if($scope.$parent.vm.data.organizacion.IdAlicuotaIva !== 0) vm.filter.idAlicuotaElegida = $scope.$parent.vm.data.organizacion.IdAlicuotaIva;
				});

				SupportDataService.getAllCondicionImpositiva().then(function(condicionImpositiva){
					vm.filter.condicionImpositiva = condicionImpositiva;
					if($scope.$parent.vm.data.organizacion.IdCondicionImpositiva !== 0) vm.filter.idCondicionImpositivaElegida = $scope.$parent.vm.data.organizacion.IdCondicionImpositiva;
				});
			}
		}
	};

	return module;
})();