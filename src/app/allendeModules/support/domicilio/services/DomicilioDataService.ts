/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('DomicilioDataService', DomicilioDataService);

		// Inyección de dependencia
		DomicilioDataService.$inject = ['DotService', 'Logger', 'HTTP_METHOD']

		// Definición del servicio
		function DomicilioDataService (DotService, $log, HTTP_METHOD) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('DomicilioDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllPaises : getAllPaises,
				getAllProvincias : getAllProvincias,
				getAllProvinciasByPais : getAllProvinciasByPais,
				getAllLocalidades : getAllLocalidades,
				//getAllLocalidadesByProvincia : getAllLocalidadesByProvincia,
				getAllLocalidadesByProvincia :ObtenerLocalidadesPorIdProvincia,
				getCalles : getCalles,
				getBarrios : getBarrios,
				getAddress : getAddress,
				getAllTiposDomicilios : getAllTiposDomicilios,
				ObtenerNuevoDomicilio : ObtenerNuevoDomicilio,
				ObterneProvinciasPorPais : ObterneProvinciasPorPais				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getAddress (val) {
				var _params, _url;
				_url = '//maps.googleapis.com/maps/api/geocode/json';
				_params = {
					address: val + ' cordoba argentina ',
					sensor: false
				};

				return DotService.getCommon(HTTP_METHOD.GET, _url, null, _params);
			}

			function getAllPaises () {
				var _url = 'legacy/Pais/';
				return DotService.Get(_url);
			}

			function getAllProvincias () {
				var _url = 'legacy/Provincia/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllProvinciasByPais (idPais) {
				var _url = 'legacy/Provincia/ByPais/' + idPais;
				return DotService.Get(_url);
			}
			
			function ObterneProvinciasPorPais  (idPais) {
				var _url = 'Provincia/ObtenerPorIdPais/' + idPais;
				return DotService.Get(_url);
			}

			function getAllLocalidades () {
				var _url = 'legacy/Localidad/';
				return DotService.Get(_url);
			}

			// function getAllLocalidadesByProvincia (idProvincia) {
			// 	var _url = 'legacy/Localidad/ByProvincia/' + idProvincia;
			// 	return DotService.Get(_url);
			// }
			function ObtenerLocalidadesPorIdProvincia (idProvincia) {
				var _url = 'Localidad/ObtenerPorIdProvincia/' + idProvincia;
				return DotService.Get(_url);
			}

			function getAllTiposDomicilios () {
				var _url = 'TipoDomicilio/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getCalles (pNombreCalle) {
				var _url = 'legacy/Domicilio/Calle/' + pNombreCalle;
				return DotService.Get(_url);
			}

			function getBarrios (pNombreBarrio) {
				var _url = 'legacy/Domicilio/Barrio/' + pNombreBarrio;
				return DotService.Get(_url);
			}
			
			function ObtenerNuevoDomicilio () {
				var _url = 'Domicilio/ObtenerNuevo';
				return DotService.Get(_url, { isCachable: true });
			}			
			
		}
	};

	return module;

})();