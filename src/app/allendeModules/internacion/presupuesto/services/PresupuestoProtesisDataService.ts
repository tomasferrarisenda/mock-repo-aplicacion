/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio de datos de presupuesto de protesis
 * @type:			Service
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('PresupuestoProtesisDataService', PresupuestoProtesisDataService);

		PresupuestoProtesisDataService.$inject = ['DotService', 'Logger'];
		
		function PresupuestoProtesisDataService (DotService, $log) {

			$log = $log.getInstance('PresupuestoProtesisDataService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				GetAll : GetAll,
				GetOne : GetOne,
				Add : Add,
				Update : Update,
				New : New
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			function GetAll (pId) {
				var _url = 'legacy/PresupuestoProtesis/Intervencion/' + pId;
				return DotService.Get(_url);
			}

			function GetOne (pId) {
				var _url = 'legacy/PresupuestoProtesis/' + pId;
				return DotService.Get(_url);
			}

			function Add (pData) {
				var _url = 'legacy/PresupuestoProtesis/';
				return DotService.Post(_url, pData);
			}

			function Update (pData) {
				var _url = 'legacy/PresupuestoProtesis/Update';
				return DotService.Post(_url, pData);
			}
			
			function New (pId) {
				var _url = 'legacy/PresupuestoProtesis/New/' + pId;
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();