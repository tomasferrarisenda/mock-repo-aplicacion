/**
 * @author:			Ezequiel Mansilla
 * @description:	Manejo de modales
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwModalFooterTemplate = require("../templates/fw-modal-footer.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saModalFooter', fwModalFooter);
		ngModule.directive('fwModalFooter', fwModalFooter);

		fwModalFooter.$inject = ['$log'];
		function fwModalFooter ($log) : any {
			return {
				restrict : 'E',
				scope : {
					btnCancelClick : '&?',

					btnOkClick : '&?',
					btnOkTitle : '@?',
					btnOkDisabled : '=?',

					loading : '=?'
				},
				transclude : true,
				template : fwModalFooterTemplate,
				link : link
			};

			function link (scope, element, attrs) {

				scope.btnCancelIf = (angular.isUndefined(attrs.btnCancelClick)) ? false : true;
				scope.btnOkIf = (angular.isUndefined(attrs.btnOkClick)) ? false : true;
				scope.loading = (angular.isUndefined(attrs.loading)) ? false : scope.loading;

				scope.empty = (!scope.btnCancelIf && !scope.btnOkIf);

			}
		}
	};

	return module;

})();