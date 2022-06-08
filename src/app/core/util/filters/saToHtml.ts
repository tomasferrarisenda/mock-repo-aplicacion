/**
 * @author 			emansilla
 * @description 	description
 */
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [FILTER] Convierte el texto en html.
		ngModule.filter('saToHtml', saToHtml);

		saToHtml.$inject = ['$sce'];
		function saToHtml ($sce) {
			return function(input) {
				return $sce.trustAsHtml(input);
			};
		}
	};

	return module;
})();