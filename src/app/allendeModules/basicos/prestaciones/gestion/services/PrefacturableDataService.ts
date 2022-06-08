/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PrefacturableDataService', PrefacturableDataService);

		PrefacturableDataService.$inject = ['DotService', 'Logger'];
		
		function PrefacturableDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('PrefacturableDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
			
				getAll : getAll,
				getAllTipoPrefacturable : getAllTipoPrefacturable,
				obtenerPrefacturablesConNomenclador : obtenerPrefacturablesConNomenclador,
				getPrefacturableById : getPrefacturableById,
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

			function getAllTipoPrefacturable () {
				var _url = 'TipoPrefacturable/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerPrefacturablesConNomenclador () {
				var _url = 'TipoPrefacturable/ObtenerTodosConTipoNomenclador';
				return DotService.Get(_url, { isCachable: true });
			}

			function getPrefacturableById (pIdPrefacturable) {
				var _url = 'Prefacturable/ObtenerTodosPorTipo/' + pIdPrefacturable;
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
		}
	};

	return module;

})();