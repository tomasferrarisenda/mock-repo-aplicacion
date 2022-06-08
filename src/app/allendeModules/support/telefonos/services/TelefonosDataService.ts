/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TelefonosDataService', TelefonosDataService);

		// Inyección de dependencia
		TelefonosDataService.$inject = ['DotService', 'Logger'];

		// Definición del servicio
		function TelefonosDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('TelefonosDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllCodigoArea : getAllCodigoArea,
				getAllCodigoAreaByPais : getAllCodigoAreaByPais,
				getAllTipoUsoTelefono : getAllTipoUsoTelefono,
				getAllTipoEquipoTelefono : getAllTipoEquipoTelefono,				
				ObtenerNuevoTelefono :ObtenerNuevoTelefono
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
				var _url = 'TipoUsoTelefono/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTipoEquipoTelefono () {
				var _url = 'TipoEquipoTelefono/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}		

			function ObtenerNuevoTelefono(){
				var _url = 'Telefono/ObtenerNuevo';
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();