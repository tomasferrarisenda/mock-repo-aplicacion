/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('PrintSelectionController', PrintSelectionController);

		PrintSelectionController.$inject = ['Logger', '$uibModalInstance', 'Prints'];

		function PrintSelectionController ($log, $uibModalInstance, Prints) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrintSelectionController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.dataLoading = false;
			
			vm.data = {
				typesPrint : Prints
			};

			vm.formData = {
				typePrint: null,
				dblclickRadio: dblclick,
				clickRadio : clickRadio
			};

			vm.formControl = {
				ok: seleccionar,
				cancel: cancel
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function seleccionar () {
				$uibModalInstance.close(vm.formData.typePrint);
			}

			function cancel () {
				$uibModalInstance.dismiss('cancel');
			}

			function clickRadio(radioSelected) {
				vm.formData.typePrint = radioSelected;
			}

			function dblclick() {

				//$log.debug('click en radiobutton',radioSelected);
				$uibModalInstance.close(vm.formData.typePrint);
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate();

			function activate () {
				
			}
		}
	};

	return module;

})();