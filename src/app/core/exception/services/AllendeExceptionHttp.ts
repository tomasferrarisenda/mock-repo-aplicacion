/**
 * @author:			Ezequiel Mansilla
 * @description:	Creación de exceptions http
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('AllendeExceptionHttp', AllendeExceptionHttp);

		AllendeExceptionHttp.$inject = ['Logger', 'AllendeException'];
		
		function AllendeExceptionHttp ($log, AllendeException) {

			$log = $log.getInstance('AllendeExceptionHttp');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			function AllendeExceptionHttp () {
				AllendeException.apply(this, arguments);
			}

			AllendeExceptionHttp.prototype = new AllendeException();

			// const service = {
				 
			// };

			return AllendeExceptionHttp;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

		}
	};

	return module;
})();