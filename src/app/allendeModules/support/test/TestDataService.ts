/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio de datos de prueba
 * @type:			Service
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TestDataService', TestDataService);

		TestDataService.$inject = ['DotService', 'Logger'];
		
		function TestDataService (DotService, $log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('TestDataService');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				getAll : getAll,
				getOne : getOne,
				add : add,
				update : update,
				new : getNew
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			function getAll () {
				var _url = 'Test/Get';
				return DotService.Get(_url);
			}

			function getOne (pId) {
				var _url = 'Test/Get/' + pId;
				return DotService.Get(_url);
			}

			function add (pData) {
				var _url = 'Test/Add';
				return DotService.Post(_url, pData);
			}

			function update (pData) {
				var _url = 'Test/Update';
				return DotService.Put(_url, pData);
			}
			
			function getNew () {
				var _url = 'Test/New';
				return DotService.Get(_url);
			}
		}
	};

	return module;

})();