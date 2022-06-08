/**
 * @author:			Pedro Ferrer
 * @description:	ADAC
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('ADACEditController', ADACEditController);

		ADACEditController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope'];

		function ADACEditController ($log, $state, ModalService, User, $scope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ADACEditController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();

			vm.data = {
				tieneConvenioADAC : null,
				listaADAC : ''
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			$scope.$watch(function() {
				return vm.data.tieneConvenioADAC;
			}, function() {
				$scope.$parent.vm.data.convenioEdit.TieneConvenioADAC = vm.data.tieneConvenioADAC;
				if(vm.data.tieneConvenioADAC === true)
					for (var i = vm.data.listaADAC.length - 1; i >= 0; i--) {
						vm.data.listaADAC[i].Valor = 0;
					}
			});

			$scope.$watch(function() {
				return vm.data.listaADAC;
			}, function() {
				$scope.$parent.vm.data.convenioEdit.ValoresADAC = vm.data.listaADAC;
			});

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.data.tieneConvenioADAC = $scope.$parent.vm.data.convenioEdit.TieneConvenioADAC;
				vm.data.listaADAC = $scope.$parent.vm.data.convenioEdit.ValoresADAC;
				vm.formControl.loading = false;
			}

		}
	};

	return module;
})();