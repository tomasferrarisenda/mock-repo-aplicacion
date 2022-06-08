/**
 * @author:			Pablo Pautasso
 * @description:	Contenido para section left
 * @type:			Directive
 **/
import saSectionLeftTemplate = require("./sa-section-left.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saSectionLeft', saSectionLeft);

		saSectionLeft.$inject = ['$log'];
		function saSectionLeft ($log) : any {
			return {
				restrict : 'E',
				transclude : true,
				scope : {
					
					

				},
				template : saSectionLeftTemplate,
				link : link
			};
			function link (scope, element, attrs) {
			}
		}
	};

	return module;

})();