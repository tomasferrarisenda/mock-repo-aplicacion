/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Service
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('MenuEventService', MenuEventService);

		MenuEventService.$inject = ['Logger', '$uibModal', '$rootScope'];
		
		function MenuEventService ($log, $uibModal, $rootScope) {

			$log = $log.getInstance('MenuEventService');

			$log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			const service = {
				broadcastToggleMenu : broadcastToggleMenu,
				broadcastShowMenu : broadcastShowMenu,
				broadcastHideMenu : broadcastHideMenu,
				getSidebarElement : getSidebarElement,
				getWrapperElement : getWrapperElement,
				getSideBarAndWrapperElements : getSideBarAndWrapperElements
			};

			return service;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function broadcastToggleMenu() {
				$rootScope.$broadcast('fw-menu-event-toggle');
			}

			function broadcastShowMenu() {
				$rootScope.$broadcast('fw-menu-event-show');
			}

			function broadcastHideMenu() {
				$rootScope.$broadcast('fw-menu-event-hide');
			}

			function getSidebarElement () {
				return $('#sidebar');
			}

			function getWrapperElement () {
				return $('#wrapper');
			}

			function getSideBarAndWrapperElements() {
				return $('#sidebar, #wrapper');
			}
		}
	};

	return module;
})();