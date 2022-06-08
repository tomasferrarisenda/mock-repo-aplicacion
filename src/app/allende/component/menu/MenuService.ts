import { ICredentialsDataService } from "core/security";

/**
 * @author:			Ezequiel Mansilla
 * @description:	Datos de menu
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };
	
	module.init = function (ngModule) {
		
		ngModule.factory('MenuService', MenuService);

		MenuService.$inject = ['CredentialsDataService', 'Logger'];
		
		function MenuService (CredentialsDataService: ICredentialsDataService, $log) {

			$log = $log.getInstance('MenuService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				GetAll : GetAll,
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			
			function GetAll () {
				return CredentialsDataService.Get()
				.then(function (pUser) {
					return pUser.modules;
				});
			}
		}
	};

	return module;
})();