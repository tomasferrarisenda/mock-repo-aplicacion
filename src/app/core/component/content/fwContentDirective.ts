/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para contenido de views
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwContentTemplate = require("./fw-content.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saContent', fwContent);
		ngModule.directive('fwContent', fwContent);

		fwContent.$inject = ['$log'];
		function fwContent ($log) {
			return {
				restrict : 'E',
				scope : {
					moduleName : '=',
					modulePath : '@',
					headerIf : '=?',
					menuIf : '=?',
					snapIf : '=?'
				},
				transclude : true,
				template : fwContentTemplate,
				link : link
			};

			function link (scope, element, attrs) {
				scope.menuIf = (angular.isUndefined(attrs.menuIf)) ? true : scope.menuIf;
				scope.headerIf = (angular.isUndefined(attrs.headerIf)) ? true : scope.headerIf;
			}
		}
	};

	return module;

})();