/**
 * @author:			Ezequiel Mansilla
 * @description:	Directiva para ocultar menu
 * @type:			Directive
 **/
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saToggleMenuClick', fwToggleMenuClick);		
		ngModule.directive('fwToggleMenuClick', fwToggleMenuClick);

		fwToggleMenuClick.$inject = ['$log', 'MenuEventService'];
		function fwToggleMenuClick ($log, MenuEventService) {
			return {
				restrict : 'A',
				link: link
			};

			function link (scope, element) {

				var $sidebarAndGrapper = MenuEventService.getSideBarAndWrapperElements();

				element.on('click', function (event) {
					event.stopPropagation();
					event.preventDefault();
					$sidebarAndGrapper.toggleClass('complete fixed');
					MenuEventService.broadcastToggleMenu();
				});
			}
		}
	};

	return module;

})();