/**
 * @author:			Ezequiel Mansilla
 * @description:	Manejo de modales
 * @type:			Directive
 **/
import fwModalBodyTemplate = require("../templates/fw-modal-body.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saModalBody', fwModalBody);
		ngModule.directive('fwModalBody', fwModalBody);

		fwModalBody.$inject = ['$log'];
		function fwModalBody ($log) : any {
			return {
				restrict : 'E',
				scope : {
					loading : '=?'
				},
				transclude : true,
				template : fwModalBodyTemplate
			};
		}
	};

	return module;

})();