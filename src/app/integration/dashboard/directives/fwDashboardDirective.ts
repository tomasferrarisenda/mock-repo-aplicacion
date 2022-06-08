/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para mostrar dashboards
 * @type:			Directive
 **/
import dashboardTemplate = require('../templates/fw-dashboard.tpl.html');

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwDashboard', fwDashboard);

		fwDashboard.$inject = ['$log'];
		function fwDashboard ($log) {
			return {
				restrict : 'E',
				template: dashboardTemplate,
				link: function (scope) {
					
				}
			};
		}
	};

	return module;
})();