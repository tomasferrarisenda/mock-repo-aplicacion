/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Filter
 */
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [FILTER] Convierte el texto en mayúsculas
		ngModule.filter('saCapitalize', capitalize);
		// ngModule.filter('capitalize', capitalize);

		function capitalize() {
			return function(input, all) {
				// valida si es string, sino no hace nada.
				if (!angular.isString(input)) return input;

				const reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
				
				return (!!input) ? input.replace(reg, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) : '';
			};
		}
		
	};
	return module;
})();