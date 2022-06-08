/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('PreadmisionInterceptorController', PreadmisionInterceptorController);

		PreadmisionInterceptorController.$inject = ['$state', 'Logger', '$stateParams', 'CredentialsDataService', 
			'SecurityLogicService',
			'PreadmisionDataService'];
		
		function PreadmisionInterceptorController($state, $log, $stateParams, CredentialsDataService: ICredentialsDataService, 
			SecurityLogicService,
			PreadmisionDataService) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PreadmisionInterceptorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			// var vm = this;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			activate();

			function activate () {
				
				$log.info('Inicializar ON.-');
				
				var _credentials;

				PreadmisionDataService.idSolicitud = 0;
				CredentialsDataService.Clear();
				
				// Inicializacion si inicia externamente

				$log.debug('URL: ', $state.current.url);

 				$log.debug('PARAM: accessToken: ',$stateParams.accessToken);
 				$log.debug('PARAM: matricula: ',$stateParams.matricula);
 				$log.debug('PARAM: clavePaciente: ',$stateParams.clavePaciente);

 				if (!angular.isUndefined($stateParams.userName) &&
 					!angular.isUndefined($stateParams.accessToken) &&
 					!angular.isUndefined($stateParams.matricula) &&
 					!angular.isUndefined($stateParams.clavePaciente)) {

					// TODO: [PREADMISION] Antes de setear credenciales, 
					// 						validar accesToken, usuario y matricula contra el Backend.
	 				_credentials = CredentialsDataService.Create($stateParams.userName, $stateParams.accessToken);
	 				// CredentialsDataService.Set(_credentials);
	 				
	 				var path = '/Internacion/Preadmision/List/Externo/' + $stateParams.matricula + '/' + $stateParams.clavePaciente;
	 				SecurityLogicService.LoginOk(_credentials, path);

	 				// $state.go('preadmision.list.externo',
	 				// 	{matricula:$stateParams.matricula, clavePaciente: $stateParams.clavePaciente});

 				} else {
 					$state.go('login');
 				}
 			}
			
		}
	};

	return module;

})();