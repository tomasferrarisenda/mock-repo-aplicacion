/**
 * @author:			Ezequiel Mansilla
 * @description:	Compilacion en linea de html que ya tiene $sce (saToHtml)
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Compilacion en linea de html que ya tiene $sce (saToHtml)
		ngModule.directive('fwInitBind', fwInitBind);

		fwInitBind.$inject = ['$compile'];
		function fwInitBind($compile) {
			return {
				restrict: 'A',
				link: function (scope, element, attr) {
					attr.$observe('ngBindHtml', function () {
						if (attr.ngBindHtml) {
							$compile(element[0].children)(scope);
						}
					});
				}
			};
		}
	};

	return module;
})();