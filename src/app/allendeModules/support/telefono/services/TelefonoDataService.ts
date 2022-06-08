/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TelefonoDataService', TelefonoDataService);

		// Inyección de dependencia
		TelefonoDataService.$inject = ['DotService', 'Logger']

		// Definición del servicio
		function TelefonoDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TelefonoDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllCodigoArea : getAllCodigoArea,
				getAllCodigoAreaByPais : getAllCodigoAreaByPais,
				getAllTipoUsoTelefono : getAllTipoUsoTelefono,
				getAllTipoEquipoTelefono : getAllTipoEquipoTelefono
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function getAllCodigoArea () {
				var _url = 'legacy/CodigoAreaTelefono/';
				return DotService.Get(_url);
			}

			function getAllCodigoAreaByPais (idPais) {
				var _url = 'legacy/CodigoAreaTelefono/ByPais/' + idPais;
				return DotService.Get(_url);
			}

			function getAllTipoUsoTelefono () {
				var _url = 'legacy/TipoUsoTelefono/';
				return DotService.Get(_url);
			}

			function getAllTipoEquipoTelefono () {
				var _url = 'legacy/TipoEquipoTelefono/';
				return DotService.Get(_url);
			}
		};
	};

	return module;

})();