/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('InternacionAboutController', InternacionAboutController);

		// Inyección de Dependencia
		InternacionAboutController.$inject = ['Logger', 'ModalService', 'INTERNACION_INFO'];

		// Constructor del Controller
		function InternacionAboutController ($log, ModalService, INFO) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('InternacionAboutController');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			vm.title = {
				module: INFO.title,
				page: 'Acerca de'
			};

			vm.info = INFO;

			vm.formControl = {
				error : true,
				loading : false,
				reloadPage : activate
			};

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


 			/* ---------------------------------------------- ACTIVATE ---------------------------------------------- */

			activate();
			
			function activate () {
				$log.debug('Inicializar ON.-');
				vm.formControl.loading = true;

				activateOk(true);
			}

			function activateOk (pResults) {
				vm.formControl.loading = false;
				vm.formControl.error = false;
				$log.debug('Inicializar OK.-', pResults);
			}
		}
	};

	return module;

})();