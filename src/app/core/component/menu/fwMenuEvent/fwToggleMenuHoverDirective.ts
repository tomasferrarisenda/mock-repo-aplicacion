/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para ocultar menu
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saToggleMenuHover', fwToggleMenuHover);
		ngModule.directive('fwToggleMenuHover', fwToggleMenuHover);

		fwToggleMenuHover.$inject = ['$log', '$timeout', 'MenuEventService'];
		function fwToggleMenuHover ($log, $timeout, MenuEventService) {
			return {
				restrict : 'A',
				link: link
			};

			function link (scope, element) {

				var $sidebarAndGrapper = MenuEventService.getSideBarAndWrapperElements();

				element.on("mouseenter", function (event) {
					event.preventDefault();
					event.stopPropagation();
					if (!$sidebarAndGrapper.hasClass('fixed')) {
						$sidebarAndGrapper.addClass("complete hover");
						MenuEventService.broadcastShowMenu();
					}
				});

				element.on("mouseleave", function (event) {
					event.preventDefault();
					event.stopPropagation();
					if (!$sidebarAndGrapper.hasClass('fixed')) {
						$sidebarAndGrapper.removeClass("complete hover");
						MenuEventService.broadcastHideMenu();
					}
				});
			}
		}
	};

	return module;
})();