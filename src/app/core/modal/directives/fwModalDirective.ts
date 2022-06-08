/**
 * @author:			Ezequiel Mansilla
 * @description:	Manejo de modales
 * @type:			Directive
 **/
import fwModalTemplate = require("../templates/fw-modal.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saModal', fwModal);
		ngModule.directive('fwModal', fwModal);

		fwModal.$inject = ['$log'];
		function fwModal ($log) : any {
			return {
				restrict : 'E',
				scope : {
					titleName : '@',
					titleIcon : '@',

					loading : '=?',

					btnCancelClick : '&?',

					btnOkClick : '&?',
					btnOkTitle : '@?',
					btnOkDisabled : '=?'
				},
				transclude : true,
				template : fwModalTemplate
			};
		}
	};

	return module;

})();