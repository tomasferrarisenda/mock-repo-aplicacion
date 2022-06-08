import { ICredentialsDataService } from "../services/CredentialsDataService";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.controller('AuthenticationController', AuthenticationController);

		AuthenticationController.$inject = ['$location', 'Logger','CredentialsDataService', 'ModalService','ENV',
			'SecurityLogicService', 'SecurityDataService', 'AlertaService'];
		
		function AuthenticationController($location, $log, CredentialsDataService: ICredentialsDataService, ModalService, ENV,
			SecurityLogicService, SecurityDataService, AlertaService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AuthenticationController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.showLogin = false;
			vm.year = new Date().getFullYear();
			vm.login = login;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function login () {
				$log.debug('Login ON.-');
				vm.dataLoading = true;

				SecurityDataService.Login(vm.username, vm.password)
				.then(loginOk, loginError);

				function loginOk (pCredentials) {
					SecurityLogicService.LoginOk(pCredentials, '/');
					AlertaService.OnLogin();
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
				}
			}

			/* -------------------------------------------- ACTIVATE -------------------------------------------- */

			activate(); 

			function activate () {
				vm.showLogin = ENV.AUTH ? false : true;
				if (ENV.AUTH) {
					let url = ENV.AUTH;
					let user = CredentialsDataService.GetForce();
					if (user && user.userName) url += '/' + user.userName;
					window.location.href = url;
				} else {
					// reset login status
					CredentialsDataService.Clear();
					AlertaService.CloseAll();
					$('#username').focus();
				}
			}
		}
	};

	return module;
})();