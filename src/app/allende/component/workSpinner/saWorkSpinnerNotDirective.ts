/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva de work spinner de allende
 * @type:			Directive
 **/
import snpinnerNotTempalte = require("./sa-work-spinner-not.tpl.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saWorkSpinnerNot', saWorkSpinnerNot);

		saWorkSpinnerNot.$inject = ['$log'];
		function saWorkSpinnerNot ($log) {
			return {
				restrict : 'E',
				template : snpinnerNotTempalte
			};
		}
	};

	return module;
})();