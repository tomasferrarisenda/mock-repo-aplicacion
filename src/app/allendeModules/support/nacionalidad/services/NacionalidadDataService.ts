/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('NacionalidadDataService', NacionalidadDataService);

		// Inyección de dependencia
		NacionalidadDataService.$inject = ['DotService', 'Logger', 'HTTP_METHOD'];

		// Definición del servicio
		function NacionalidadDataService (DotService, $log, HTTP_METHOD) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('NacionalidadDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllPaises : getAllPaises,
				getAllTiposNacionalidad : getAllTiposNacionalidad,
				obtenerTodosTiposNacionalizados : obtenerTodosTiposNacionalizados,
				obtenerNuevoNacionalidad : obtenerNuevoNacionalidad
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */


			function getAllPaises () {
				var _url = 'legacy/Pais/';
				return DotService.Get(_url);
			}

			function getAllTiposNacionalidad () {
				var _url = 'TipoNacionalidad/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerTodosTiposNacionalizados () {
				var _url = 'TipoNacionalizado/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerNuevoNacionalidad () {
				var _url = 'Nacionalidad/ObtenerNuevo';
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();