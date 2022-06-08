/**
 * @author:			Pablo Pautasso
 * @description:	Service data para lista turnos 
 * @type:			Service
 **/
export default (function () {
   'use strict';
   

	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('ListaTurnosDataService', ListaTurnosDataService);

		ListaTurnosDataService.$inject = ['DotService', 'Logger'];
		
		function ListaTurnosDataService (DotService, $log) {

			$log = $log.getInstance('ListaTurnosDataService');

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

			
			function GetAll () {
				var _url = 'Estado/';
				return DotService.Get(_url);
			}

			function GetOne (pId) {
				var _url = 'Estado/' + pId;
				return DotService.Get(_url);
			}

			function Add (pData) {
				var _url = 'Estado/';
				return DotService.Post(_url, pData);
			}

			function Update (pData) {
				var _url = 'Estado/';
				return DotService.Put(_url, pData);
			}
			
			function New () {
				var _url = 'Estado/New';
				return DotService.Get(_url);
			}

		}
	};

	return module;
})();
