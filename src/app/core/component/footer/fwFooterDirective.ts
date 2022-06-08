/**
 * @author:			Ezequiel Mansilla
 * @description:	Footer
 * @type:			Directive
 **/
import fwFooterTemplate = require("./fw-footer.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saFooter', fwFooter);
		ngModule.directive('fwFooter', fwFooter);

		fwFooter.$inject = ['$log'];
		function fwFooter ($log) {
			return {
				restrict : 'E',
				replace : true,
				template : fwFooterTemplate,
				link: function (scope, element, attrs) {
					scope.sinDatos = 'Sin datos';
					scope.year = new Date().getFullYear();
				}
			};
		}
	};

	return module;

})();