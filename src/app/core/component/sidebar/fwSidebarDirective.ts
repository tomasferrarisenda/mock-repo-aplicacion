/**
 * @author:			Ezequiel Mansilla
 * @description:	SideBar
 * @type:			Directive
 **/
import fwSidebarTemplate = require("./fw-sidebar.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwSidebar', fwSidebar);

		fwSidebar.$inject = ['$log'];
		function fwSidebar ($log) : any {
			return {
				restrict : 'E',
				template : fwSidebarTemplate
			};
		}
	};

	return module;

})();