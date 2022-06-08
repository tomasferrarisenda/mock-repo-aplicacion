/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva de agrupador botones para titulos
 * @type:			Directive
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTitleButtonGroup', fwTitleButtonGroup);
		fwTitleButtonGroup.$inject = ['$log'];
		function fwTitleButtonGroup ($log) {
			return {
				restrict : 'E',
				require : '^fwTitleNew',
				scope : {
					class : '@?',
					tooltip : "@?",
					disabled : "=?",
					if : "=?",
					click : "&",
					icon : "@"
				},
				link : link
			};

			function link (scope, element, attrs, titleController) {
				$log.debug(scope);

				var button = {
					class : scope.class,
					tooltip : scope.tooltip,
					disabled : scope.disabled,
					if : scope.if,
					click : scope.click,
					icon : scope.icon
				};
				$log.debug('scope.disabled', scope.disabled);
				button.disabled = (angular.isUndefined(scope.disabled)) ? false : scope.disabled;
				button.if = (angular.isUndefined(scope.if)) ? true : scope.if;

				titleController.addButton(button);
			}
		}
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación 
	// y el del link después

	return module;
})();