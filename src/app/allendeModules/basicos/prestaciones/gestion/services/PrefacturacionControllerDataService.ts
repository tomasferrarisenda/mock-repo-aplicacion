/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturacionControllerDataService', PrefacturacionControllerDataService);

		PrefacturacionControllerDataService.$inject = ['DotService', 'Logger'];
		
		function PrefacturacionControllerDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrefacturacionControllerDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
			
				getAll : getAll,
				getPrestacionById : getPrestacionById,
				validarNewPrestacion: validarNewPrestacion,
				newPrestacion: newPrestacion,
				validarDeletePrestacion : validarDeletePrestacion,
				deletePrestacion : deletePrestacion
				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			

			function getAll () {
				var _url = 'PrestacionMedica/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getPrestacionById (pIdPrestacion) {
				var _url = 'PrestacionMedica/ObtenerPorId/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function validarNewPrestacion(pPrestacion){
				var _url = 'PrestacionMedica/ValidarGuardar';
				return DotService.Post(_url, pPrestacion);
			}

			function newPrestacion(pPrestacion){
				var _url = 'PrestacionMedica/Guardar';
				return DotService.Post(_url, pPrestacion);
			}

			function validarDeletePrestacion(pIdPrestacion){
				var _url = 'PrestacionMedica/ValidarEliminar/' + pIdPrestacion;
				return DotService.Get(_url);
			}

			function deletePrestacion(pIdPrestacion){
				var _url = 'PrestacionMedica/Eliminar/' + pIdPrestacion;
				return DotService.Get(_url);
			}


		};
	};

	return module;

})();