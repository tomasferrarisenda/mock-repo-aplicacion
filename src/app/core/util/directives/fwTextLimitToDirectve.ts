/**
 * @author:			Pablo "topGun" Pautasso
 * @description:	Directiva para aplicar a textos, si son mas grande que el limite, los corta y muestro tooltip
 * @type:			Directive
 **/

import saTextLimitToTemplate = require('../templates/sa-text-limit-to.tpl.html');

export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		// UTILIDADES: [DIRECTIVE] Directiva para aplicar a textos, si son mas grande que el limite, los corta y muestro tooltip
		ngModule.directive('fwTextLimitTo', fwTextLimitTo);
		ngModule.directive('saTextLimitTo', fwTextLimitTo);

		fwTextLimitTo.$inject = ['$compile'];
		function fwTextLimitTo($compile) {
			return {
				restrict: 'E',
				scope: {
					text: '@',
					limit: '='
				},
				template : saTextLimitToTemplate,
				link: function (scope, element, attr, controller) {

					if (!controller) return;
					
					scope.$watch(function () {
						return scope.text;
					}, updateDirective, true);

					function updateDirective(value) {
						scope.model = value;
					}
				}
			};
		}
	};

	return module;
})();