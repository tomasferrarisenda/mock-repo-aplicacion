/**
 * @author:			Ezequiel Mansilla
 * @description:	Manejo de modales
 * @type:			Directive
 **/
import * as angular from 'angular';

import fwModalHeaderTemplate = require("../templates/fw-modal-header.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saModalHeader', fwModalHeader);
		ngModule.directive('fwModalHeader', fwModalHeader);

		fwModalHeader.$inject = ['$log'];
		function fwModalHeader ($log) : any {
			return {
				restrict : 'E',
				scope : {
					titleName : '@?',
					titleIcon : '@?',

					print : '=?',
					fecha : '=?',
					sucursal : '=?',
					loading : '=?'
				},
				transclude : true,
				template : fwModalHeaderTemplate,
				link : link
			};

			function link (scope, element, attrs) {
				scope.titleIf = (angular.isUndefined(attrs.titleName)) ? false : true;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;
			}
		}
	};

	return module;

})();