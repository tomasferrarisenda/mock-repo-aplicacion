/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva de work spinner de allende
 * @type:			Directive
 **/
'use strict';
import spinnerTemplate = require("./sa-work-spinner.tpl.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saWorkSpinner', fwWorkSpinner);
		// ngModule.directive('fwWorkSpinner', fwWorkSpinner);

		fwWorkSpinner.$inject = ['$log'];
		function fwWorkSpinner ($log) {
			return {
				restrict : 'E',
				template : spinnerTemplate
			};
		}
	};

	return module;
})();