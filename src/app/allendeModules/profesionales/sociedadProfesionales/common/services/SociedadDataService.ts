/**
 * @author 			Jorge Basiluk
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('SociedadDataService', SociedadDataService);

		// Inyección de dependencia
		SociedadDataService.$inject = ['DotService', 'Logger'];

		// Definición del servicio
		function SociedadDataService (DotService, $log) {

			/* ------------------------------------------------- LOG ------------------------------------------------- */

			$log = $log.getInstance('SociedadDataService');
			$log.debug('ON.-');
			
			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
                CrearFiltroSociedad : CrearFiltroSociedad,
                getAllSociedadParaBusqueda : getAllSociedadParaBusqueda,
                ObtenerPorFiltro : ObtenerPorFiltro,
                getAllSociedad : getAllSociedad                
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

            function CrearFiltroSociedad() {
                var _url = 'SociedadDeProfesionales/ObtenerFiltroBusqueda';
                return DotService.Get(_url);
            }

            function ObtenerPorFiltro(filtroDto) {
                var _url = 'SociedadDeProfesionales/ObtenerPorFiltro';
                return DotService.Post(_url, filtroDto);
            }

            function getAllSociedadParaBusqueda() {
                var _url = 'SociedadDeProfesionales/GetParaBusqueda';
                return DotService.Get(_url);
            }

            function getAllSociedad () {
				var _url = 'SociedadDeProfesionales/ObtenerTodos';
				return DotService.Get(_url);
			}    
		}
	};

	return module;

})();