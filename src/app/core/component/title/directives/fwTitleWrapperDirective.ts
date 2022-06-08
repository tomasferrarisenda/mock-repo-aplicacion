/**
 * @author 			emansilla
 * @description 	description
 */
import fwTitleWrapperTemplate = require("../templates/fw-title-wrapper.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTitleWrapper', fwTitleWrapper);
		
		// fwTitleWrapper.$inject = [];
		function fwTitleWrapper () {
			return {
				restrict : 'E',
				transclude : true,
				replace : true,
				template : fwTitleWrapperTemplate
			};
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación 
	// y el del link después

	return module;

})();