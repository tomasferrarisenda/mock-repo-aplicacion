/**
 * @author:			Pablo Pautasso
 * @description:	controller para la muestra de warnings en la validacion de guardar
 * @type:			Controller
 **/

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('ModalValidarWarningController', ModalValidarWarningController);

		ModalValidarWarningController.$inject = ['Logger', '$uibModalInstance', 'ValidarResponse'];

		function ModalValidarWarningController ($log, $uibModalInstance, ValidarResponse) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ModalValidarWarningController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;
			vm.today = new Date();
			
			vm.title = {
				page: 'Atencion!',
				icon: 'ALERT'
			};

			vm.data = {
				response : ValidarResponse,
				warningsMsj : []
			};

			vm.formData = {
			};

			vm.formControl = {
				loading : false,
				error : true,
				cancel: cancel,
				ok: ok				
				
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			/* FORMULARIO */
			function cancel() {
				$uibModalInstance.dismiss(false);
			}

			function ok() {
				$uibModalInstance.close(true);
			}

			function parsearWarningMsj() {
				
				vm.data.warningsMsj = vm.data.response.WarningMessage.split('\r\n');
				vm.formControl.loading = false;
			}


			/* -------------------------------------------- ACTIVATE ------------------------------------------------ */


			activate();

			function activate() {

				vm.formControl.loading = true;
				parsearWarningMsj();
			};

		
		}
	};

	return module;

})();