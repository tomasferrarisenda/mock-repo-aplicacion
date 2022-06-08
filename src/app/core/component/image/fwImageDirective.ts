/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para manejo de imagnes
 * @type:			Directive
 **/
import fwImageTemplate = require("./fwImageTemplate.html");
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwImage', fwImage);

		fwImage.$inject = ['$log'];
		function fwImage ($log) : any {
			return {
				restrict : 'E',
				scope : {
					src : '<',
					base : '<',
					class : '<?',
					alt : '<?'
				},
				template : fwImageTemplate,
				link: function (scope, element) {
					scope.base = scope.base || '';
					scope.alt = scope.alt || 'Sin texto alternativo';
					scope.image = scope.base + '' + scope.src;
				}
			};
		}
	};

	return module;
})();