import * as angular from 'angular';
import { ICredentialsDataService } from 'core/security';

export default (function () {
	'use strict';
	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.controller('GuardiaNewInterceptorController', GuardiaNewInterceptorController);

		GuardiaNewInterceptorController.$inject = ['$location', '$log', '$stateParams', 'SecurityLogicService',
			'CredentialsDataService', 'GuardiaAtencionDataService'];

		function GuardiaNewInterceptorController($location, $log, $stateParams, SecurityLogicService,
			CredentialsDataService: ICredentialsDataService, GuardiaAtencionDataService) {

			// Variable para GuardiaNewInterceptorController (ViewModel)

			$log.info('GuardiaNewInterceptorController: ON.-');

			/* IMPLEMENTACIÓN DE MÉTODOS */

			/* FORMULARIO */

			activate();

			function activate() {

				$log.info('GuardiaNewInterceptorController: Inicializar ON.-');
				CredentialsDataService.Clear();
				// Inicializacion si inicia externamente

				$log.debug('param ', $stateParams);

				$log.debug('PARAM: accessToken: ', $stateParams.accessToken);
				$log.debug('PARAM: matricula: ', $stateParams.matricula);
				$log.debug('PARAM: clavePaciente: ', $stateParams.clavePaciente);
				$log.debug('PARAM: sucursal: ', $stateParams.sucursal);

				if (!angular.isUndefined($stateParams.userName) &&
					!angular.isUndefined($stateParams.accessToken) &&
					!angular.isUndefined($stateParams.matricula) &&
					!angular.isUndefined($stateParams.clavePaciente) &&
					!angular.isUndefined($stateParams.matricula)) {

					GuardiaAtencionDataService.externo = true;
					GuardiaAtencionDataService.matriculaMedico = $stateParams.clavePaciente.matricula;
					GuardiaAtencionDataService.clavePaciente = $stateParams.clavePaciente;
					GuardiaAtencionDataService.sucursal = $stateParams.sucursal;

					var _credentials = CredentialsDataService.Create($stateParams.userName, $stateParams.accessToken);
					$log.debug('Entro');

					GuardiaAtencionDataService.getUbicacionBySucursal(GuardiaAtencionDataService.sucursal)
						.then(function (pUbicacion) {
							GuardiaAtencionDataService.ubicacion = pUbicacion;
							var path = '/Guardia/Atencion/New';
							SecurityLogicService.LoginOk(_credentials, path);
							// $location.url('/Guardia/Atencion/New');
						});


				} else {
					$location.url('/Login');
				}
			}

		}
	};

	return module;
})();