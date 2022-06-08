/**
 * @author:			Ezequiel Mansilla
 * @description:	Iconos
 * @type:			Directive
 **/
import fwIconTemplate = require("./fw-icon.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Icono por nombre declarado en la constante [ICON_LIST]
		ngModule.directive('saIcon', fwIcon);
		ngModule.directive('fwIcon', fwIcon);

		fwIcon.$inject = ['$log', 'ICON_LIST'];
		function fwIcon ($log, ICON_LIST) : any {
			return {
				restrict : 'E',
				replace : true,
				scope: {
					name : '@?',
					model: '<?'
				},
				template : fwIconTemplate,
				link: function (scope, element, attrs) {

					scope.$watch(function () {
						return scope.name || scope.model;
					}, updateIcon);

					function updateIcon(pIconName) {
						if (pIconName) {
							for (var i = 0; i < ICON_LIST.length; i++) {
								if (ICON_LIST[i].name == pIconName) {
									scope.icono = ICON_LIST[i].value;
									break;
								}
							}
						}
					}
				}
			};
		}
	};

	return module;

})();