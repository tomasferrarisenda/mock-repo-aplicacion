/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Directive
 **/
import fwMenuContainerTemplate = require("./fwMenuContainerTemplate.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwMenuContainer', fwMenuContainer);

		// fwMenuContainer.$inject = [''];
		function fwMenuContainer () : any {
			return {
				restrict : 'E',
				template : fwMenuContainerTemplate,
				controller : MenuController,
				link : link,
				// replace : true,
				transclude : true
			};

			function link (scope, element, attrs) {
			}
		}

		MenuController.$inject = ['$scope', 'Logger', '$rootScope'];
		function MenuController($scope, $log, $rootScope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwMenu');
			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var activeItem = '';
			var vm = this;
			
			// vm.setActiveItem = setActiveItem;
			vm.getActiveItem = getActiveItem;
			vm.setRoute = setRoute;

			/* ------------------------------------------ IMPLEMENTACION ------------------------------------------ */

			function setActiveItem(item) {
				activeItem = item;
			}

			function getActiveItem () {
				return activeItem;
			}

			function setRoute (route) {
				$log.debug('Route',route);
				// setActiveItem(route);
				$rootScope.$broadcast('fw-menu-item-selected-event', { route : route });
			}
		}
	};

	return module;

})();