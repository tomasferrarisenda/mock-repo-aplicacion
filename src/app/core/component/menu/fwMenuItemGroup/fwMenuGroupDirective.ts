/**
 * @author:			Ezequiel Mansilla
 * @description:	Items del menú
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwMenuGroupTemplate = require("./fwMenuGroupTemplate.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwMenuGroup', fwMenuGroup);

		fwMenuGroup.$inject = ['$log'];
		function fwMenuGroup ($log) : any {
			return {
				restrict : 'E',
				require : '^fwMenu',
				scope : {
					path : '=',
					iconName : '@',
					iconClass : '@',
					name : '=',
					showName : '=?'
				},
				transclude : true,
				template : fwMenuGroupTemplate,
				link: function (scope, element, attrs, controller) {
					scope.sinDatos = 'Sin datos';
					scope.showName = (angular.isUndefined(attrs.showName)) ? false : scope.showName;

					scope.selectItem = selectItem;
					scope.isActive = isActive;

					function selectItem () {
						controller.setRoute(scope.path);
						controller.setActiveItem(element);
					}

					function isActive () {
						return element == controller.getActiveItem();
					}
				}
			};
		}
	};

	return module;

})();