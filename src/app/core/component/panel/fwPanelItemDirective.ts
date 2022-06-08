/**
 * @author:			Ezequiel Mansilla
 * @description:	Menú block para sistema y subsistemas
 * @type:			Directive
 **/
import fwPanelItemTemplate = require("./fw-panel-item.tpl.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saPanelItem', fwPanelItem);
		ngModule.directive('fwPanelItem', fwPanelItem);

		fwPanelItem.$inject = ['$log'];
		function fwPanelItem ($log) {
			return {
				restrict : 'E',
				replace : true,
				scope : {
					name : '=',
					icon : '=',
					iconName : '@',
					btnClass : '@',
					path : '='
				},
				template : fwPanelItemTemplate,
				link : link
			};

			function link (scope, element, attrs) {
				if (!scope.btnClass) scope.btnClass = 'btn-default';
			}
		}
	};

	return module;

})();