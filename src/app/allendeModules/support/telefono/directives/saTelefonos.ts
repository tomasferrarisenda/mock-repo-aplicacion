/**
 * @author 			emansilla
 * @description 	description
 */
import telefonosTemplate = require('./saTelefonos.html');
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (module) {

		module.directive('saTelefonos', saTelefonos);

		saTelefonos.$inject = ['$log', 'ButtonService'];
		function saTelefonos ($log, ButtonService) {

			return {
				restrict : 'E',
				scope : {
					model : '=',
					title : '@?',

					btnNewClick : '&?',
					btnNewDisabled : '=?',
					btnNewIf : '=?',

					btnEditClick : '&?',
					btnEditDisabled : '=?',
					btnEditIf : '=?',

					btnDeleteClick : '&?',
					btnDeleteDisabled : '=?',
					btnDeleteIf : '=?',

					eventChange : '&?'
				},
				template: telefonosTemplate,
				link : function (scope, element, attrs) {
					$log.debug(scope.model);
					scope.sinDatos = 'Sin datos';
					ButtonService.validarButtons(scope);
				}
			};
		}
	}

	return module;

})();