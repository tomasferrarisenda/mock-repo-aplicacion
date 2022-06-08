/**
 * @author 			ppautasso
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('HabitacionGestionDataService', HabitacionGestionDataService);

		HabitacionGestionDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];
		
		function HabitacionGestionDataService (DotService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('HabitacionGestionDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAll : getAll,
				getOne : getOne,
				getAllCamasById: getAllCamasById,
				newHabitacion: newHabitacion,
				editHabitacion : edithabitacion,
				deleteHabitacion : deleteHabitacion,
				getAllEdificioBySucursalId : getAllEdificioBySucursalId,
				getAllPisosByEdificioId: getAllPisosByEdificioId,
				newCama: newCama,
				getOnePiso : getOnePiso
				
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			

			function getAll () {
				var _url = 'legacy/Habitacion';
				return DotService.Get(_url);
			}

			function getOne (pIdHabitacion) {
				var _url = 'legacy/Habitacion/' + pIdHabitacion;
				return DotService.Get(_url);
			}

			function getAllCamasById (pIdHabitacion) {
				var _url = 'legacy/Cama/Habitacion/' + pIdHabitacion;
				return DotService.Get(_url);
			}

			function newHabitacion(pHabitacion){
				var _url = 'legacy/Habitacion/';
				return DotService.Put(_url, pHabitacion);
			}

			function edithabitacion(pHabitacion){
				var _url = 'legacy/Habitacion/';
				return DotService.Post(_url, pHabitacion);
			}

			function deleteHabitacion(pHabitacion){
				var _url = 'legacy/Habitacion/';
				return DotService.Delete(_url, pHabitacion);
			}

			function getAllEdificioBySucursalId(pIdSucursal){
				var _url = 'legacy/Edificio/Sucursal/' + pIdSucursal;
				return DotService.Get(_url);
			}
			
			function getAllPisosByEdificioId (pIdEdificio) {
				var _url = 'legacy/Piso/Edificio/' + pIdEdificio;
				return DotService.Get(_url);
			}

			function newCama(pCama){
				var _url = 'legacy/Cama/';
				return DotService.Put(_url, pCama);
			}

			function getOnePiso (pIdPiso) {
				var _url = 'legacy/Piso/' + pIdPiso;
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();