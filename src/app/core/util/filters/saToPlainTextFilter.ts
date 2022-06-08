/**
 * @author 			emansilla
 * @description 	description
 */
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		// UTILIDADES: [FILTER] Convierte el input a texto plano
		ngModule.filter('saToPlainText', saToPlainText);
		
		function saToPlainText () {
			return function(input) {
				return angular.element(input).text();
			};
		}
	};

	return module;
})();