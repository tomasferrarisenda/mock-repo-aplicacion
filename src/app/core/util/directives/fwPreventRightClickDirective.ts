/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saPreventRightClick', fwPreventRightClick);
		ngModule.directive('fwPreventRightClick', fwPreventRightClick);

		fwPreventRightClick.$inject = ['DEBUG'];
		function fwPreventRightClick (DEBUG) {
			return {
				restrict : 'A',
				link : function (scope, element) {
					element.bind('contextmenu', function (e) {
						if (!DEBUG)
							e.preventDefault();
					});
				}
			};
		}

		// ngModule.directive('saTextAreaVisualizable', saTextAreaVisualizable);

		// saTextAreaVisualizable.$inject = [];
		// function saTextAreaVisualizable() {
		// 	return {
		// 		restrict: 'A',
		// 		link: function (scope, element) {
		// 			console.debug('saTextAreaVisualizable linked')
		// 		}
		// 	};
		// }	
	};

	// La diferencia entre la función de link es que el código del controlador se ejecuta antes de la compilación
	// y el del link después

	return module;
})();