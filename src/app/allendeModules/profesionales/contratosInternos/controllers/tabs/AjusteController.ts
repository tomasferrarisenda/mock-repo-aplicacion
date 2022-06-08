/**
 * @author:			Pedro Ferrer
 * @description:	Ajuste
 * @type:			Controller
 **/
export default (function(){
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AjusteController', AjusteController);

		AjusteController.$inject = ['Logger', '$state', 'ModalService', 'User', '$scope'];

		function AjusteController ($log, $state, ModalService, User, $scope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AjusteController');
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.data = {
				listaAjuste : ''
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			$scope.$watch(function() {
				return vm.data.listaAjuste;
			}, function() {
				$scope.$parent.vm.data.contratoEdit.ConceptosDeAjuste = vm.data.listaAjuste;
			});

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				vm.formControl.loading = true;
				vm.data.listaAjuste = $scope.$parent.vm.data.contratoEdit.ConceptosDeAjuste;
				vm.formControl.loading = false;
			}
		}
	};

	return module;
})();