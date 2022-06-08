/**
 * @author:			Pablo Pautasso
 * @description:	directive por saSection
 * @type:			Directive
 **/
import saSelectionTemplate = require("./sa-section.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saSection', saSection);

		saSection.$inject = ['$log'];
		function saSection ($log) : any {
			return {
				transclude: true,
				restrict : 'E',
				scope : {
				
				},
				template : saSelectionTemplate,
				controller: SectionController,
				link: function (scope) {
					scope.sinDatos = 'Sin datos';
				}
			};
		}


		function SectionController() {
		
		}
	};

	return module;

})();