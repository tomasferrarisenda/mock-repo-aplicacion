/**
 * @author 			emansilla
 * @description 	description
 */
import fwTabsTemplate = require("./fw-tabs.tpl.html");

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saTabs', fwTabs);
		ngModule.directive('fwTabs', fwTabs);

		fwTabs.$inject = ['$log'];
		function fwTabs ($log) : any{
			return {
				restrict : 'E',
				template : fwTabsTemplate
			};
		}		
	};
	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación y el del link después
	return module;

})();