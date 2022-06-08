/**
 * @author:			Pablo Pautasso
 * @description:	Logic service para cancelacion de turnos
 * @type:			Service
 **/
export default (function () {
   'use strict';
   
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ReprogramacionTurnosLogicService', ReprogramacionTurnosLogicService);

		ReprogramacionTurnosLogicService.$inject = ['Logger', '$q', '$uibModal', 'ModalService', 'TurnoDataService'];
		
		function ReprogramacionTurnosLogicService($log, $q, $uibModal, ModalService, TurnoDataService) {

			$log = $log.getInstance('ReprogramacionTurnosLogicService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				desistirDeReprogramarTurno: desistirDeReprogramarTurno
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function desistirDeReprogramarTurno (idTurno) {
				$log.debug('desistirDeReprogramar - idTurno:', idTurno);
				var def = $q.defer();

				TurnoDataService.validarDesistirDeReprogramar(idTurno)
					.then(function (pResponseValidar) {

						if (pResponseValidar.IsOk) {

							TurnoDataService.desistirDeReprogramar(idTurno)
								.then(function (pResult) {
									def.resolve(pResult);
								}, function (pError) {
									def.reject(pError);
								});
						} else {
							$log.error('Message', );
							def.reject(pResponseValidar);
						}

					}, function (pErrorValidar) {
						$log.error('pErrorValidar', pErrorValidar);
						def.reject(pErrorValidar);
					});

				return def.promise;
			}
			
		}
	};

	return module;
})();