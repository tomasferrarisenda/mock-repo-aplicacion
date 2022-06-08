/**
 * @author 			emansilla
 * @description 	description
 */
import fwTitleTemplate = require("../templates/fw-title.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTitle', fwTitle);
		
		// fwTitle.$inject = [];
		function fwTitle () : any {
			return {
				restrict : 'E',
				scope : {
					titleName : '=',

					today : "=?",
					small : "=?",
					titleIcon : '@'
				},
				transclude : true,
				replace : true,
				template : fwTitleTemplate
			};
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación 
	// y el del link después

	return module;

})();