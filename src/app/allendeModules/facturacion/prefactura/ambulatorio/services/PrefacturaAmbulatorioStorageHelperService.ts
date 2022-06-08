/**
 * @author:			Pablo Pautasso
 * @description:	Service storage para modulo prefactura	
 * @type:			Service
 **/
export default (function () {
   'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {
		module.factory('PrefacturaAmbulatorioStorageHelperService', PrefacturaAmbulatorioStorageHelperService);

		PrefacturaAmbulatorioStorageHelperService.$inject = ['Logger', 'StorageService'];
		
		function PrefacturaAmbulatorioStorageHelperService ($log, StorageService) {

			$log = $log.getInstance('PrefacturaAmbulatorioStorageHelperService');

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
				StorageService.set(key, value);
			}

			function getStorageObj (key) {
				if(StorageService.get(key))
				return StorageService.get(key);
				else return;
			}

			function cleanStorage(key) {
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