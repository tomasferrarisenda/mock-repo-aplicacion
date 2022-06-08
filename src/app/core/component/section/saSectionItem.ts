/**
 * @author:			Pablo Pautasso
 * @description:	Contenido para section Item
 * @type:			Directive
 **/
import saSectionItemTemplate = require("./sa-section-item.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saSectionItem', saSectionItem);
		

		saSectionItem.$inject = ['$log'];
		function saSectionItem ($log) : any {
			return {
				requiere: '^saSection',
				restrict : 'E',
				replace : true,
				transclude : true,
				scope : {
					classItem : '@',
					typeItem: '@'
					
				},
				template : saSectionItemTemplate,
				link : link
			};

			function link (scope, element, attrs, saSection) {

				

			}
		}
	};

	return module;

})();