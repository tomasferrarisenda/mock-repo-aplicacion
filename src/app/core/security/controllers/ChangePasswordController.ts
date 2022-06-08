/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('ChangePasswordController', ChangePasswordController);

		ChangePasswordController.$inject = ['Logger','SecurityDataService', '$uibModalInstance', 'AlertaService', 'ERROR_MESSAGE', 'User'];
		
		function ChangePasswordController ($log, SecurityDataService, $uibModalInstance, AlertaService, ERROR_MESSAGE, User) {

			$log = $log.getInstance('ChangePasswordController');
			$log.debug('ON');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.title = {
				page: 'Iniciar sesión'
			};
			vm.formControl = {
				ok: login,
				cancel: cancel,
				validate: validate,
				noSonIguales: false
			};
			vm.login = login;

			vm.regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=!_*-]{8,14}$/;

			function validate () {
				//$log.debug('entro validate');
				if(vm.new_password)
				{
					if(vm.new_password == vm.new_password2)
					{
						vm.formControl.noSonIguales = false;
					}
					else
					{
						vm.formControl.noSonIguales = true;
					}
				}
			}

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function login () {
				$log.debug('Login ON.-');
				vm.dataLoading = true;
				if(vm.new_password == vm.new_password2)
				{
					vm.formControl.noSonIguales = false;
					SecurityDataService.ChangePassword(vm.username, vm.old_password, vm.new_password)
					.then(function (pCredentials){
						vm.dataLoading = false;
						AlertaService.NewSuccess("Contraseña modificada correctamente");
						$uibModalInstance.close(vm.username);
						$log.debug('Change OK.-');
					}, function (pError){
						vm.dataLoading = false;
						// ModalService.error(pError.message);
						$log.error('Login ERROR.-', pError);
					});
				}
				else
				{
					AlertaService.NewWarning(ERROR_MESSAGE.REPEAT);
					vm.formControl.noSonIguales = true;
					vm.dataLoading = false;
				}
			}

			function cancel () {
				$uibModalInstance.dismiss('close');
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate(); 

			function activate () {
				vm.username = User;
				$('#password').focus();
			}
		}
	};

	return module;
})();