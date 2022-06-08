import { ICredentialsDataService } from "../services/CredentialsDataService";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('AuthenticationMedicoController', AuthenticationMedicoController);

		AuthenticationMedicoController.$inject = ['$location', 'Logger', '$stateParams',
			'CredentialsDataService', 'ModalService', 'LegacyRegisterService', 'SecurityLogicService', 'SecurityDataService'];

		function AuthenticationMedicoController ($location, $log, $stateParams,
			CredentialsDataService: ICredentialsDataService, ModalService, LegacyRegisterService, SecurityLogicService, SecurityDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AuthenticationMedicoController');
			$log.debug('ON');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			var vm = this;
			vm.showLogin = true;
			vm.matricula = $stateParams.matricula || '';
			vm.year = new Date().getFullYear();
			vm.login = login;

			$log.debug('Matricula.-', vm.matricula);

			// reset login status
			CredentialsDataService.Clear();

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function login () {
				$log.debug('Login ON.-');
				vm.dataLoading = true;

				SecurityDataService.Login(vm.username, vm.password)
				.then(loginOk, loginError);

				function loginOk (pCredentials) {
					LegacyRegisterService.password = vm.password;
					
					SecurityLogicService.LoginOk(pCredentials, '/Medico/Params/'+ vm.matricula);
				}

				function loginError (pError) {
					$log.debug('ERROR', pError);
					vm.dataLoading = false;

					if(pError.changePassword) {
						SecurityLogicService.ChangePassword(vm.username)
							.then(function (pUsername) {
								vm.username = pUsername;
								vm.password = '';
								$('#password').focus();
							});
					} 
					// else {
					// 	$log.error('Login ERROR.-', pError);
					// 	ModalService.error(pError.message);
					// }
				}
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