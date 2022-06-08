/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('FormEncode', FormEncode);

		FormEncode.$inject = [];
		
		function FormEncode () {

			// $log = $log.getInstance('FormEncode');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			return encode;

			function encode (data) {
				var pairs : Array<any> = [];
				for (var name in data) {
					pairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
				}
				return pairs.join('&').replace(/%20/g, '+');
			}
		}
	};

	return module;
})();