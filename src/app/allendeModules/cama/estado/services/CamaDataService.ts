import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('CamaDataService', CamaDataService);

		CamaDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];
		
		function CamaDataService (DotService: IDtoService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('CamaDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllCategoriasHabitacion : getAllCategoriasHabitacion,
				getAllCategoriasHabitacionForDias : getAllCategoriasHabitacionForDias,
				getAllTiposHabitacionFisica : getAllTiposHabitacionFisica,
				getAllTiposHabitacionFisicaByCategoria : getAllTiposHabitacionFisicaByCategoria,
				getAllTiposHabitacionContabiliza : getAllTiposHabitacionContabiliza,

				getAllCamasDisponibles : getAllCamasDisponibles,
				getAllCamasDisponiblesBySucursal : getAllCamasDisponiblesBySucursal,
				getAllCamasDisponiblesBySucursalLazy : getAllCamasDisponiblesBySucursalLazy,

				getAll : getAll,
				getOne : getOne,
				getAllLazy : getAllLazy,
				
				getAllMantenimiento : getAllMantenimiento,
				getAllMantenimientoBySucursal : getAllMantenimientoBySucursal,
				getAllMantenimientoBySucursalLazy : getAllMantenimientoBySucursalLazy,

				getAllLimpieza : getAllLimpieza,
				getAllLimpiezaBySucursal : getAllLimpiezaBySucursal,
				getAllLimpiezaBySucursalLazy : getAllLimpiezaBySucursalLazy,

				getAllEstadosCamaSiguientes : getAllEstadosCamaSiguientes,
				getAllEstadosCama : getAllEstadosCama,
				addHistorialEstadoCama : addHistorialEstadoCama
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function getAllCategoriasHabitacion () {
				var _url = 'legacy/CategoriaHabitacion/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllCategoriasHabitacionForDias () {
				var _url = 'legacy/CategoriaHabitacion/DiasInternacion';
				return DotService.Get(_url);
			}

			function getAllTiposHabitacionFisica () {
				var _url = 'legacy/TipoHabitacionFisica/';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTiposHabitacionFisicaByCategoria (pCategoria) {
				var _url = 'legacy/TipoHabitacionFisica/Categoria/' + pCategoria.id_categoria_habitacion;
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTiposHabitacionContabiliza() {
				var _url = 'TipoContabilizaHabitacion';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllCamasDisponiblesBySucursal (pSucursal) {
				var _url = 'legacy/Cama/Disponible/Sucursal';
				return DotService.Post(_url, pSucursal);
			}

			function getAllCamasDisponiblesBySucursalLazy (pSucursal) {
				var _url = 'legacy/Cama/Lazy/Disponible/Sucursal';
				return DotService.Post(_url, pSucursal);
			}

			function getAllCamasDisponibles () {
				var _url = 'legacy/Cama/Disponible';
				return DotService.Get(_url);
			}

			function getAll () {
				var _url = 'legacy/Cama';
				return DotService.Get(_url);
			}

			function getOne (pIdCama) {
				var _url = 'legacy/Cama/' + pIdCama;
				return DotService.Get(_url);
			}

			function getAllLazy () {
				var _url = 'legacy/Cama/Lazy';
				return DotService.Get(_url);
			}

			function getAllLimpieza () {
				var _url = 'legacy/Cama/Limpieza';
				return DotService.Get(_url);
			}

			function getAllMantenimiento () {
				var _url = 'legacy/Cama/Mantenimiento';
				return DotService.Get(_url);
			}

			function getAllMantenimientoBySucursal (pSucursal) {
				var _url = 'legacy/Cama/Mantenimiento/Sucursal/' + pSucursal.Id;
				return DotService.Get(_url);
			}

			function getAllMantenimientoBySucursalLazy (pSucursal) {
				var _url = 'legacy/Cama/Lazy/Mantenimiento/Sucursal/' + pSucursal.Id;
				return DotService.Get(_url);
			}

			function getAllLimpiezaBySucursal (pSucursal) {
				var _url = 'legacy/Cama/Limpieza/Sucursal/' + pSucursal.Id;
				return DotService.Get(_url);
			}

			function getAllLimpiezaBySucursalLazy (pSucursal) {
				var _url = 'legacy/Cama/Lazy/Limpieza/Sucursal/' + pSucursal.Id;
				return DotService.Get(_url);
			}

			function getAllEstadosCamaSiguientes (pEstadoCama) {
				var _url = 'legacy/EstadoCama/Transicion';
				return DotService.Post(_url, pEstadoCama);
			}

			function getAllEstadosCama () {
				var _url = 'legacy/EstadoCama';
				return DotService.Get(_url, { isCachable: true });
			}

			function addHistorialEstadoCama (pHistorial) {
				var _url = 'legacy/Cama/AddHistorial';
				return DotService.Post(_url, pHistorial);
			}
		}
	};

	return module;

})();