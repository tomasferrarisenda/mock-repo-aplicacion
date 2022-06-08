/**
 * @author 			emansilla
 * @description 	description
 */
import tabObservacionesTemplate = require('../../internado/views/tabs/internado-tab-observaciones.html');
export default (function () {
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saTabInternadoObservaciones', saTabInternadoObservaciones);

		saTabInternadoObservaciones.$inject = [];
		function saTabInternadoObservaciones () {
			
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',

					btnNewDisabled : '=?',
					btnNewIf : '=?'
				},
				template: tabObservacionesTemplate,
				link : link
			};

			function link (scope) {
				// $log.debug(scope.model);
				scope.loading = false;
				scope.sinDatos = 'Sin datos';
				// scope.btnNewClick = addObservaciones;

				// function activate () {
				// 	// body...
				// }
			}
		}
	};

	return module;

})();