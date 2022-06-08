/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('PermisosDataService', PermisosDataService);

		PermisosDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];

		function PermisosDataService(DotService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PermisosDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {


				//API PERMISO
				getAllPermiso: getAllPermiso,




			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

		/* ------------------------------------------- API /Permiso --------------------------------------------- */

			function getAllPermiso() {
				var _url = 'Permiso/ObtenerTodos';
				return DotService.Get(_url);
			}

				
		}
	};

	return module;
})();