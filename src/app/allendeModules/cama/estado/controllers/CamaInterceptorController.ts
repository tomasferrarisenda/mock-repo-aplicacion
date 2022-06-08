/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) { 

		module.controller('CamaInterceptorController', CamaInterceptorController);

		// Inyección de Dependencia
		CamaInterceptorController.$inject = ['Logger', '$location', 'User', 'CamaLogicService'];

		// Constructor del Controller
		function CamaInterceptorController ($log, $location, User, CamaLogicService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaInterceptorController');
			$log.debug('ON.-');

			activate();
			/* Método inicializador */
			function activate () {
				$log.debug('CamaInterceptorController: Inicializar ON.-');

				$location.url(CamaLogicService.selectList(User));
			}
		}
	};

	return module;

})();