import { ICredentialsDataService } from "../services/CredentialsDataService";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('AuthenticationModalController', AuthenticationModalController);

		AuthenticationModalController.$inject = ['Logger', 'CredentialsDataService', 'SecurityDataService',
			'$uibModalInstance', 'SecurityLogicService'];
		
		function AuthenticationModalController($log, CredentialsDataService: ICredentialsDataService, SecurityDataService,
			$uibModalInstance, SecurityLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AuthenticationModalController');
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
			
			// reset login status
			CredentialsDataService.Clear();

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function login () {
				$log.debug('Login ON.-');
				vm.dataLoading = true;

				SecurityDataService.Login(vm.username, vm.password)
				.then(function (pCredentials){
					SecurityLogicService.LoginOk(pCredentials)
					.then(function () {
						$uibModalInstance.close('ok');
					});
					// $log.debug('Login OK.-', pCredentials);
				}, function (pError){
					vm.dataLoading = false;
					$log.error('Login ERROR.-', pError);
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
	};

	return module;
})();