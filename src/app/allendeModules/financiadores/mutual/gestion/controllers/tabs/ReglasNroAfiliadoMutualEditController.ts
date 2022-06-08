/**
 * @author:			Jorge Basiluk
 * @description:	General
 * @type:			Controller
 **/
import { ISupportDataService } from '../../../../../support/basic/services';

export default (function () {
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('ReglasNroAfiliadoMutualEditController', ReglasNroAfiliadoMutualEditController);

		ReglasNroAfiliadoMutualEditController.$inject = ['Logger', '$scope', 'SupportDataService',
			'MutualDataService'];

		function ReglasNroAfiliadoMutualEditController($log, $scope, SupportDataService: ISupportDataService,
			MutualDataService) {

			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.filter = {
				ReglaFormatoNumeroAfiliado: '',
				MascaraNumeroAfiliado: '',
				EjemploFormatoNumeroAfiliado: '',
				InformacionNumeroAfiliado: ''				
			}

			vm.formControl = {				
				reglaFormatoNumeroAfiliadoBlur: reglaFormatoNumeroAfiliadoBlur,
				mascaraNumeroAfiliadoBlur: mascaraNumeroAfiliadoBlur,
				ejemploFormatoNumeroAfiliadoBlur: ejemploFormatoNumeroAfiliadoBlur,
				informacionNumeroAfiliadoBlur: informacionNumeroAfiliadoBlur
			}

			/* ---------------------------------------------- FORMULARIO ---------------------------------------------- */

			function reglaFormatoNumeroAfiliadoBlur() {
				$scope.$parent.vm.data.mutual.ReglaFormatoNumeroAfiliado = vm.filter.ReglaFormatoNumeroAfiliado;
			}

			function mascaraNumeroAfiliadoBlur() {
				$scope.$parent.vm.data.mutual.MascaraNumeroAfiliado = vm.filter.MascaraNumeroAfiliado;
			}

			function ejemploFormatoNumeroAfiliadoBlur() {
				$scope.$parent.vm.data.mutual.EjemploFormatoNumeroAfiliado = vm.filter.EjemploFormatoNumeroAfiliado;
			}

			function informacionNumeroAfiliadoBlur() {
				$scope.$parent.vm.data.mutual.InformacionNumeroAfiliado = vm.filter.InformacionNumeroAfiliado;
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */
			activate();

			function activate() {
				vm.filter.ReglaFormatoNumeroAfiliado = $scope.$parent.vm.data.mutual.ReglaFormatoNumeroAfiliado;
				vm.filter.MascaraNumeroAfiliado = $scope.$parent.vm.data.mutual.MascaraNumeroAfiliado;
				vm.filter.EjemploFormatoNumeroAfiliado = $scope.$parent.vm.data.mutual.EjemploFormatoNumeroAfiliado;
				vm.filter.InformacionNumeroAfiliado = $scope.$parent.vm.data.mutual.InformacionNumeroAfiliado;   
			}
		}
	};

	return module;
})();