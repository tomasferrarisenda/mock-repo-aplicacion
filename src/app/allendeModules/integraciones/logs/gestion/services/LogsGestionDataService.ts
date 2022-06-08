/**
 * @author 			jbasiluk
 * @description 	description
 */
export default (function () {
	
	const module = { init : (ngModule: any) => {} };

	module.init = function(module) {

		module.factory('LogsGestionDataService', LogsGestionDataService);

		LogsGestionDataService.$inject = ['DotService', 'AuthorizationService', 'Logger'];

		function LogsGestionDataService(DotService, AuthorizationService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			//$log = $log.getInstance('LogsGestionDataService');
			//$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var itemView = null;

			const service = {
				//API ROL
				getAllTiposBandeja: getAllTiposBandeja,
				getAllTiposOrigen: getAllTiposOrigen,
				getAllEstadosBandeja: getAllEstadosBandeja,
				obtenerPorFiltro: obtenerPorFiltro,
				reenviar: reenviar,
				reenviarItems: reenviarItems,
				getItemPorIdParaView : getItemPorIdParaView
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/* ------------------------------------------- API /Rol ------------------------------------------------- */

			function getAllTiposBandeja() {
				var _url = 'TipoBandeja/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllTiposOrigen() {
				var _url = 'TipoOrigenBandeja/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function getAllEstadosBandeja() {
				var _url = 'EstadoBandeja/ObtenerTodos';
				return DotService.Get(_url, { isCachable: true });
			}

			function obtenerPorFiltro(idtipoBandeja, fechaD, fechaH, idtipoOrigen, idsubtipoOrigen, idOrigen, 
							idestadoBandeja, origen, currentPage, pageSize) {
				var _url = 'BandejaIntegracion/ObtenerPorFiltro/' + idtipoBandeja + '/' + fechaD + '/' + fechaH + '/' + idtipoOrigen + '/' + idsubtipoOrigen + 
					'/' + idOrigen + '/' + idestadoBandeja + '/' + origen + '/' + currentPage + '/' + pageSize;
				return DotService.Get(_url);
			}

			function reenviar (idtipoBandeja, id) {
				var _url = 'BandejaIntegracion/Reprocesar/' + idtipoBandeja + '/' + id;
				return DotService.Get(_url);
			}

			function reenviarItems (idtipoBandeja, ids) {
				var _url = 'BandejaIntegracion/ReprocesarMasivo/' + idtipoBandeja + '/' + ids;
				return DotService.Get(_url);
			}

			function getItemPorIdParaView (idtipoBandeja, ids) {
				var _url = 'BandejaIntegracion/ObtenerPorId/' + idtipoBandeja + '/' + ids;
				return DotService.Get(_url);
			}
			
		}
	};

	return module;

})();