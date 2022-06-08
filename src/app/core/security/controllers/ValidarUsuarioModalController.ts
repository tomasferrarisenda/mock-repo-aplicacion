/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('ValidarUsuarioModalController', ValidarUsuarioModalController);

		ValidarUsuarioModalController.$inject = ['Logger','SecurityDataService', '$uibModalInstance'];
		
		function ValidarUsuarioModalController ($log, SecurityDataService, $uibModalInstance) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ValidarUsuarioModalController');
			$log.debug('ON');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.title = {
				page: 'Iniciar sesión'
			};
			vm.formControl = {
				ok: login,
				cancel: cancel
			};
			vm.login = login;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function login () {
				$log.debug('Login ON.-');
				vm.dataLoading = true;

				SecurityDataService.Login(vm.username, vm.password)
				.then(function (pCredentials){
					vm.dataLoading = false;
					$uibModalInstance.close(pCredentials);
					$log.debug('ValidarUsuario OK.-', pCredentials);
				}, function (pError){
					vm.dataLoading = false;
					$log.error('ValidarUsuario ERROR.-', pError);
					$uibModalInstance.dismiss(pError);

				});
			}

			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate(); 

			function activate () {
				$('#username').focus();
			}
		}
	}

	return module;
})();