/**
 * @author:			Ezequiel Mansilla
 * @description:	Interceptor de edición de internado para distinguir Alta y Admitido
 * @type:			Controller
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('InternadoEditInterceptorController', InternadoEditInterceptorController);

		InternadoEditInterceptorController.$inject = ['Logger', '$state', '$stateParams', 'AdmisionDataService'];

		function InternadoEditInterceptorController ($log, $state, $stateParams, AdmisionDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternadoEditInterceptorController');
			$log.debug('ON.-');

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');

				if ($stateParams.idInternacion) {
					AdmisionDataService.tieneAltaAdministrativa($stateParams.idInternacion)
					.then(successCallback, errorCallback);
				} else {
					errorCallback({message:'Sin id de internación'});
				}
				
	 			function successCallback (pResult) {
	 				if (pResult)
	 					$state.go('internado.edit.alta', {idInternacion:$stateParams.idInternacion});
	 				else 
	 					$state.go('internado.edit.admitido', {idInternacion:$stateParams.idInternacion});
	 			}

	 			function errorCallback (pError) {
	 				$state.go('internado.list.all');
	 			}
			}

		}
	};

	return module;

})();