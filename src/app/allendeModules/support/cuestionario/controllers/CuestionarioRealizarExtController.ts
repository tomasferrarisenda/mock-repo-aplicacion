import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('CuestionarioRealizarExtController', CuestionarioRealizarExtController);

		CuestionarioRealizarExtController.$inject = ['$state', '$log', '$stateParams', 'SecurityLogicService', 'CredentialsDataService'];
		
		function CuestionarioRealizarExtController($state, $log, $stateParams, SecurityLogicService, CredentialsDataService: ICredentialsDataService) {
				
			// Variable para CuestionarioRealizarExtController (ViewModel)
			var vm = this;
			$log.info('CuestionarioRealizarExtController: ON.-');


			activate();

			function activate () {
				$log.info('CuestionarioRealizarExtController: Inicializar ON.-');
				CredentialsDataService.Clear();
				// Inicializacion si inicia externamente

				$log.debug('param ', $stateParams);

 				$log.debug('PARAM: accessToken: ',$stateParams.accessToken);
 				$log.debug('PARAM: matricula: ',$stateParams.matricula);
 				$log.debug('PARAM: clavePaciente: ',$stateParams.clavePaciente);
 				$log.debug('PARAM: tipoCuestionario: ',$stateParams.tipoCuestionario);

 				if (!angular.isUndefined($stateParams.userName) &&
 					!angular.isUndefined($stateParams.accessToken) &&
 					!angular.isUndefined($stateParams.matricula) &&
 					!angular.isUndefined($stateParams.clavePaciente) &&
 					!angular.isUndefined($stateParams.tipoCuestionario)) {

					// var clavePaciente= $stateParams.clavePaciente;
					// var	tipoCuestionario= $stateParams.tipoCuestionario;
					var params = {
						clavePaciente: parseInt($stateParams.clavePaciente),
						tipoCuestionario: parseInt($stateParams.tipoCuestionario)
					};

					var _credentials = CredentialsDataService.Create($stateParams.userName, $stateParams.accessToken);
	 				$log.debug('Entro');


	 				SecurityLogicService.LoginOk(_credentials);
	 				$state.go('cuestionario.realizar', params);

	 				

 				} else {
 					// $location.url('/Login');
 				}
 			}
			
		}
	};

	return module;

})();