/**
 * @author 			mastore
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CuestionarioDataService', CuestionarioDataService);

		CuestionarioDataService.$inject = ['DotService', 'Logger'];
		
		function CuestionarioDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CuestionarioDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				GetByTipoYEntidad: GetByTipoYEntidad,
				Guardar: Guardar,
				obtenerCuestionarioParaTurno: obtenerCuestionarioParaTurno
				// addOneOrganizacion: addOneOrganizacion
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function GetByTipoYEntidad (pTipoEncuesta, pTipoEntidad, pIdEntidad) {
				var _url = 'Cuestionario/ObtenerCuestionarioParaEntidadYTipoProposito/' +
				pTipoEncuesta + '/'  + pTipoEntidad + '/'  + pIdEntidad;
				return DotService.Get(_url);
			}

			function Guardar(pCuestionario) {
				var _url = 'Cuestionario/Guardar';
				return DotService.Post(_url, pCuestionario);
			}

			function obtenerCuestionarioParaTurno(idPaciente: number, idServicio: number, idPrestacion: number, idGrupoPrestaciones: number) {
				var _url = 'Cuestionario/ObtenerCuestionarioParaTurno/' +
				idPaciente + '/'  + idServicio + '/'  + idPrestacion + '/'  + idGrupoPrestaciones;
				return DotService.Get(_url);
			}


			// function addOneOrganizacion (pEmpresa) {
			// 	var _url = 'Organizacion/Add';
			// 	return DotService.Post(_url, pEmpresa);
			// }
		}
	};

	return module;

})();