/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
   'use strict';


	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('ModulosPermisoDataService', ModulosPermisoDataService);

		ModulosPermisoDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];

		function ModulosPermisoDataService(DotService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('ModulosPermisoDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {


				//API MODULO
				getAll: getAll,
				getModuloById: getModuloById,
				getModuloYPermisosPorSistema : getModuloYPermisosPorSistema,
				getModuloYPermisosTodosLosSistemas : getModuloYPermisosTodosLosSistemas
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* ------------------------------------------- API /MODULO ------------------------------------------------- */


			function getAll() {
				var _url = 'Modulo/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getModuloById(pIdModulo) {
				var _url = 'Modulo/ObtenerPorId/' + pIdModulo;
				return DotService.Get(_url);
			}

			function getModuloYPermisosPorSistema() {
				var _url = 'Modulo/ObtenerModuloYPermisosPorSistema';
				return DotService.Get(_url);
			}

			function getModuloYPermisosTodosLosSistemas() {
				var _url = 'Modulo/ObtenerModuloYPermisosDeTodosLosSistemas';
				return DotService.Get(_url);
			}


				
		}
	};

	return module;

})();
