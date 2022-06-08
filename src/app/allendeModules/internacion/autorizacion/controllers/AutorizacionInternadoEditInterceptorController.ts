/**
 * @author:			Ezequiel Mansilla
 * @description:	Selector de edición de autorizacion
 * @type:			Controller
 **/
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.controller('AutorizacionInternadoEditInterceptorController', AutorizacionInternadoEditInterceptorController);

		AutorizacionInternadoEditInterceptorController.$inject = [
			'Logger', '$state', '$stateParams',
			'IntervencionDataService'];

		function AutorizacionInternadoEditInterceptorController (
			$log, $state, $stateParams,
			IntervencionDataService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('AutorizacionInternadoEditInterceptorController');
			$log.debug('ON.-');
			
			/* ----------------------------------------- API Y VARIABLESES ----------------------------------------- */

			var vm = this;

			vm.formControl = {
				loading : false,
				error : false
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* FORMULARIO */

			function volver () {
				$state.go('internado.editSelector', {idInternacion : $stateParams.idInternacion});
			}

			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();

			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				if ($stateParams.idIntervencion) {
					IntervencionDataService.estaAutorizada($stateParams.idIntervencion)
					.then(successCallback, errorCallback);
				} else {
					volver();
				}

	 			function successCallback (pResult) {
	 				if (pResult)
	 					$state.go('autorizacion.edit.autorizado', {
	 						idInternacion : $stateParams.idInternacion,
	 						idIntervencion : $stateParams.idIntervencion
	 					});
	 				else 
	 					$state.go('autorizacion.edit.gestion', {
	 						idInternacion : $stateParams.idInternacion,
	 						idIntervencion : $stateParams.idIntervencion
	 					});

	 				$log.debug('Inicializar OK.-', pResult);
	 			}

	 			function errorCallback (pError) {
	 				$log.error('Inicializar ERROR.-', pError);
	 				volver();
	 			}
			}

		}
	};

	return module;

})();