/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (module) {

		module.factory('MutualDataService', MutualDataService);

		// Inyección de dependencia
		MutualDataService.$inject = ['DotService', 'Logger'];

		// Definición del servicio
		function MutualDataService(DotService, $log) {

			/* ------------------------------------------------- LOG ------------------------------------------------- */

			$log = $log.getInstance('MutualDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				getAllMutual: getAllMutual,
				obtenerTodos: obtenerTodos,
				getMutualPorNombre: getMutualPorNombre,
				getMutualPorCodigo: getMutualPorCodigo,
				getAllOldMutual: getAllOldMutual,
				getAllPlanMutual: getAllPlanMutual,				
				ObtenerTodosPorMutual: ObtenerTodosPorMutual,
				CrearFiltroMutual: CrearFiltroMutual,
				ObtenerPorFiltro: ObtenerPorFiltro,
				getAllMutualParaBusqueda: getAllMutualParaBusqueda,
				getAllMutualParaBusquedaActivas: getAllMutualParaBusquedaActivas,
				getNuevaCobertura: getNuevaCobertura,
				ObtenerPlanMutualPorId: ObtenerPlanMutualPorId,
				ObtenerNuevoPlanMutual: ObtenerNuevoPlanMutual,
				obtenerNuevo: obtenerNuevo,
				ObtenerInfoFinanciador : ObtenerInfoFinanciador
			};

			return service;

			/* ------------------------------------------ IMPLEMENTACIÓN ------------------------------------------ */

			function getAllMutual() {
				var _url = 'Mutual/';
				return DotService.Get(_url);
			}

			//LEER: Este metodo si utiliza DTO
			function obtenerTodos() {
				var _url = 'Mutual/ObtenerTodos';
				return DotService.Get(_url);
			}

			function getMutualPorCodigo(pCodigoMutual,pSoloActivas:boolean =false) {
				var _url = 'Mutual/GetByCodigo/' + pCodigoMutual + '/' + pSoloActivas;
				return DotService.Get(_url);
			}
			// function getMutualPorNombre (pNombreMutual) {
			// 	var _url = 'Mutual/GetByNombre/'+ pNombreMutual;
			// 	return DotService.Get(_url);
			// }
			function getMutualPorNombre(pNombreMutual,pSoloActivas:boolean =false) {
				var _url = 'Mutual/ObtenerPorNombreDescripcion/' + pNombreMutual + '/' + pSoloActivas;
				return DotService.Get(_url);
			}
			function getAllOldMutual() {
				$log.warn('OLD');
				var _url = 'legacy/Mutual/Old';
				return DotService.Get(_url);
			}

			function getAllPlanMutual() {
				var _url = 'PlanMutual/';
				return DotService.Get(_url);
			}

			function ObtenerTodosPorMutual(pIdMutual) {
				var _url = 'PlanMutual/ObtenerTodosPorMutual/' + pIdMutual;
				return DotService.Get(_url);
			}

			function CrearFiltroMutual() {
				var _url = 'Mutual/CrearFiltroMutual';
				return DotService.Get(_url);
			}

			function ObtenerPorFiltro(filtroDto) {
				var _url = 'Mutual/ObtenerPorFiltro';
				return DotService.Post(_url, filtroDto);
			}

			function getAllMutualParaBusqueda() {
				var _url = 'Mutual/GetParaBusqueda';
				return DotService.Get(_url);
			}

			function getAllMutualParaBusquedaActivas() {
				var _url = 'Mutual/GetParaBusquedaSoloActivas';
				return DotService.Get(_url);
			}

			function getNuevaCobertura() {
				var _url = 'Cobertura/ObtenerNuevoDto';
				return DotService.Get(_url);
			}
			function ObtenerPlanMutualPorId(pIdPlan) {
				var _url = 'PlanMutual/ObtenerPorId/' + pIdPlan;
				return DotService.Get(_url);
			}

			function ObtenerNuevoPlanMutual(pIdMutual) {
				//var _url = 'PlanMutual/ObtenerNuevo/' + pIdMutual;
				var _url = 'PlanMutual/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function obtenerNuevo() {
				var _url = 'Mutual/ObtenerNuevo';
				return DotService.Get(_url);
			}

			function ObtenerInfoFinanciador(idMutual) {
				var _url = 'Mutual/ObtenerInfoFinanciador/'+idMutual;
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();