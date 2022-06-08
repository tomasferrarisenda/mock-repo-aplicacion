/**
 * @author:			Pablo Pautasso
 * @description:	Service storage para modulo turnos	
 * @type:			Service
 **/
export default (function () {
   'use strict';
   


	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.factory('TurnosStorageHelperService', TurnosStorageHelperService);

		TurnosStorageHelperService.$inject = ['DotService', 'Logger', 'StorageService'];
		
		function TurnosStorageHelperService (DotService, $log, StorageService) {

			$log = $log.getInstance('TurnosStorageHelperService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */
			
			const service = {
				setStorageObj : setStorageObj,
				getStorageObj : getStorageObj,
				cleanStorage : cleanStorage,
				existStoredObjects : existStoredObjects
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function setStorageObj(key, value) {

				$log.debug('setStorage', key,value);
				StorageService.set(key, value);
			}

			function getStorageObj (key) {

				$log.debug('getStorageObj', key);
				if(StorageService.get(key))
				return StorageService.get(key);
				else return;
			}

			function cleanStorage(key) {
				
				$log.debug('cleanStorage', key);
				StorageService.removeItems(key);
			
			}

			function existStoredObjects(key) {
				if(StorageService.get(key))
				return true;
				else return false;
			}
		}
	};

	return module;
})();