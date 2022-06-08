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

		module.controller('PacienteInterceptorController', PacienteInterceptorController);

		PacienteInterceptorController.$inject = ['$state', 'Logger', '$stateParams', 'CredentialsDataService', 
			'SecurityLogicService', 'ENV'];
		
		function PacienteInterceptorController($state, $log, $stateParams, CredentialsDataService: ICredentialsDataService, 
			SecurityLogicService, ENV) {
				
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PacienteInterceptorController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			// var vm = this;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */
			
			activate();

			function activate () {
				
				$log.info('Inicializar ON.-');
				
				var _credentials;
				
				CredentialsDataService.Clear();
				
				// Inicializacion si inicia externamente

				$log.debug('URL: ', $state.current.url);

 				$log.debug('PARAM: accessToken: ',$stateParams.accessToken);
 				$log.debug('PARAM: matricula: ',$stateParams.matricula);
 				$log.debug('PARAM: clavePaciente: ',$stateParams.clavePaciente);

 				if (!angular.isUndefined($stateParams.userName) &&
 					!angular.isUndefined($stateParams.accessToken) &&
 					!angular.isUndefined($stateParams.idTipoDocumento) &&
 					!angular.isUndefined($stateParams.numeroDocumento) &&
 					!angular.isUndefined($stateParams.clavePaciente)) {

					// TODO: [PACIENTE] Antes de setear credenciales, 
					// 						validar accesToken, usuario y matricula contra el Backend.
	 				_credentials = CredentialsDataService.Create($stateParams.userName, $stateParams.accessToken);

	 				SecurityLogicService.LoginOk(_credentials)
	 				.then(stateOk,stateError);
	 				

 				} else {
 					$state.go('login');
 				}
 				function stateOk() {
 					
 					//si viene clave 0 o vacio  es nuevo
 					var esNuevo = false;
					//check si es un numero primero
 					if(isNaN($stateParams.clavePaciente) || $stateParams.clavePaciente ==='0') {
 						esNuevo = true;
 					}
 					
						if (esNuevo) {
							//DEPRECADO => se dirige a nuevo appv2
 						// $state.go('paciente.new',{
 						// 	externo : true,
						// 	idTipoDocumento : $stateParams.idTipoDocumento,
						// 	numeroDocumento : $stateParams.numeroDocumento
						 // });
						 window.location.href = `${ENV.APP2}/paciente/edit`;
 					}
 					else{
 						// $state.go('paciente.edit',{
 						// 	externo : true,
						// 	idPacienteOld :$stateParams.clavePaciente							
						// 	});
							window.location.href = `${ENV.APP2}/paciente/edit/` + $stateParams.clavePaciente;
 					}
 				}
				function stateError() {
					$state.go('login');
				}
 			}
		}
	};

	return module;

})();