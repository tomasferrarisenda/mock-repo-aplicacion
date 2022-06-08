/**
 * @author 			emansilla
 * @description 	description
 */
import fwSystemInfoTemplate = require("./fw-system-info.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saSystemInfo', fwSystemInfo);
		ngModule.directive('fwSystemInfo', fwSystemInfo);
		
		// fwSystemInfo.$inject = [''];
		function fwSystemInfo () : any {
			return {
				restrict : 'E',
				template : fwSystemInfoTemplate,
				scope : {
					info : '='
				}
			};
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación 
	// y el del link después

	return module;

})();