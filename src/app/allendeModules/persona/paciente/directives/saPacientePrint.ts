/**
 * @author 			emansilla
 * @description 	description
 */
import saPacientePrintView = require('../views/sa-paciente-print.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saPacientePrint', saPacientePrint);

		saPacientePrint.$inject = ['$log', 'ButtonService'];
		function saPacientePrint ($log, ButtonService) {
			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',
					mutual : '=?'
				},
				template: saPacientePrintView,
				link : function (scope, element, attrs) {
					$log.debug(scope.model);
					scope.sinDatos = 'Sin datos';
				}
			};
		}
	}

	return module;

})();