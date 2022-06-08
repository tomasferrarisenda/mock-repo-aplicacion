/**
 * @author:			Ezequiel Mansilla
 * @description:	Manejo de error de formulario
 * @type:			Directive
 **/
import fwTextErrorTemplate = require('../templates/fw-text-error.html');
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saTextError', fwTextError);
		ngModule.directive('fwTextError', fwTextError);

		// fwTextError.$inject = [''];
		function fwTextError (): any {
			return {
				restrict : 'E',
				scope : {
					model : '='
				},
				replace : true,
				template : fwTextErrorTemplate
			};
		}
	};

	return module;
})();