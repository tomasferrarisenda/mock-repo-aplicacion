import { IDtoService } from "core/http";

/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('MovimientoCamaService', MovimientoCamaService);

		MovimientoCamaService.$inject = ['DotService', 'Logger'];
		
		function MovimientoCamaService (DotService: IDtoService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('MovimientoCamaService');
			$log.debug('ON.-');

			// Variables del Service
			// var idInternacion = 0;
			// var numeroInternado = 0;

			// Interface o API
			const service = {
				addOneMovimientoCama : addOneMovimientoCama,
				newMovimientoCama : newMovimientoCama,
				rollbackLasMovimiento : rollbackLasMovimiento
			};

			return service;

			function addOneMovimientoCama (pMovimiento) {
				var _url = 'legacy/MovimientoCama/Add';
				return DotService.Post(_url, pMovimiento);
			}

			function newMovimientoCama (pCama, pMotivo, pUser, pIdInternacion) {
				return {
					Cama: pCama,
					motivo_ingreso: pMotivo,
					usuario_ingreso: pUser.userName,
					id_internacion: pIdInternacion
				};
			}

			function rollbackLasMovimiento (pIdInternacion, pObservaciones, pUser) {
				var _url, _object;

				_object = newRollBackMovimiento(pIdInternacion, pObservaciones, pUser);

				_url = 'legacy/MovimientoCama/Rollback/';
				return DotService.Post(_url, _object, { isDictionary: true });
			}


			function newRollBackMovimiento (pIdInternacion, pObservaciones, pUser) {
				var _object = {};
				_object['id_internacion'] = pIdInternacion;
				_object['observaciones'] = pObservaciones;
				_object['usuario'] = pUser.userName;

				return _object;
			}

		}
	};

	return module;

})();