/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio de manejo de errores
 * @type:			Service
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('$exceptionHandler', ExceptionHandler);

		ExceptionHandler.$inject = ['Logger', '$injector', '$filter'];
		function ExceptionHandler($log, $injector, $filter) {

			$log = $log.getInstance('SanatorioAllende ERROR: ');

			return myExceptionHandler;

			function myExceptionHandler(exception, cause, logout) {
				var AlertaService = $injector.get('AlertaService');
				var ModalService = $injector.get('ModalService');
				var loggerDataService = $injector.get('LoggerDataService')

				var $state = $injector.get('$state');

				if (exception.status && exception.status === 403) {
					// la sesion caduco
					//debo mostrar cartel y salir
					ModalService.infoWithCallback("Atencion","La sesión expiró, por favor loguearse nuevamente")
					.then( (pResult) => {
						cerrarSesion();
					}, (pError) => {
						
					});
					
				} else if (exception.block) {

					exception.message = 'Se produjo un error en la aplicación: \n' + exception.message;
					var errorData = {
						message: exception.message,
						exception : exception,
						stack: exception.stack
					};
	
					if (angular.isUndefined(exception.block) || exception.block) {
						showError();
						// if (exception.type !== 'http') saveError();
					} else {
						showWarning();
					}
				}
				
			

				function showError () {
					$log.error(exception.message, errorData);
					if (exception && exception.data && exception.data.StatusCode === 400) { 
						// tengo invalid token refresh
						AlertaService.NewError("Error","La sesion expiró");

					}else 
					AlertaService.NewError("Error",exception.message);
				}

				function saveError() {
					loggerDataService.log(errorData);
				}

				function showWarning () {
					$log.warn(exception.message, errorData);
					AlertaService.NewWarning("Advertencia", exception.message);
				}

				function cerrarSesion() {
					$state.go('login');
				}
			}

		}
	};

	return module;
})();