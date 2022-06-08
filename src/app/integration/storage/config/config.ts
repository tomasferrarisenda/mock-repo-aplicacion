/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Constant
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.config(configLocalStorage);

		configLocalStorage.$inject = ['localStorageServiceProvider'];
		function configLocalStorage(localStorageServiceProvider) {
			localStorageServiceProvider
			.setPrefix('appAllende');
		}
		
	};
	return module;

})();