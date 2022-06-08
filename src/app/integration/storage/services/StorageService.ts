/**
 * @author:			Ezequiel Mansilla
 * @description:	Servicio para almacenamiento en
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('StorageService', StorageService);

		StorageService.$inject = ['localStorageService'];
		
		function StorageService (localStorageService) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			// $log = $log.getInstance('StorageService');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				get : get,
				getAll : getAll,
				set : set,
				removeItem : removeItem,
				removeItems : removeItems,
				clearAll : clearAll
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function get (key) {
				if (!key) return;
				return localStorageService.get(key);
			}

			function getAll () {
				return localStorageService.keys();
			}

			function set (key, value, type) {
				if (!key || !value) return;

				if (type && (type === 'sessionStorage' || type === 'localStorage'))
					localStorageService.set(key, value, type);
				
				localStorageService.set(key, value);
			}

			function removeItem (key) {
				if (!key) return;
				return localStorageService.remove(key);
			}

			function removeItems (key) {
				if (!key || !key.length) return ;
				return localStorageService.remove(key);
			}

			function clearAll () {
				return localStorageService.clearAll();
			}
		}
	};

	return module;

})();