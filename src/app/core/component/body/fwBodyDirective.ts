/**
 * @author:			Ezequiel Mansilla
 * @description:	Contenido de view
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwBodyTemplate = require("./fw-body.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saBody', fwBody);
		ngModule.directive('fwBody', fwBody);

		fwBody.$inject = ['$log'];
		function fwBody ($log) {
			return {
				restrict : 'E',
				transclude : true,
				scope : {
					loading : '=?',
					error : '=?',
					form : '=?'
				},
				template : fwBodyTemplate,
				link : link
			};

			function link (scope, element, attrs) {
				if (angular.isUndefined(scope.error)) scope.error = false;

				if (scope.form) {
					var form = element.find('form');
					scope.form = form.controller('form');
				}
			}
		}
	};

	return module;

})();