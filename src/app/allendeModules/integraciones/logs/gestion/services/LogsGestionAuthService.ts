/**
 * @author 			jbasiluk
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('LogsGestionAuthService', LogsGestionAuthService);

		LogsGestionAuthService.$inject = ['AuthorizationService', 'Logger', 'PERMISSION_LOGS'
		];

		function LogsGestionAuthService(AuthorizationService, $log,
			PERMISSION
			) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('LogsGestionAuthService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {

			};
			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

		}
	};

	return module;

})();