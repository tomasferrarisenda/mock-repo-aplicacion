/**
 * @author:			Ezequiel Mansilla
 * @description:	Sidebar
 * @type:			Directive
 **/
import * as angular from 'angular';
import sidebarTemplate = require("./sa-sidebar.tpl.html");
export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saSidebar', saSidebar);

		saSidebar.$inject = ['$log', '$timeout', '$state'];
		function saSidebar ($log, $timeout, $state) {
			return {
				restrict : 'E',
				template : sidebarTemplate,
				scope : {
					showMenu : '<?'
				},
				link : linkFunction
			};

			function linkFunction (scope, element, attrs) {
				scope.showName = false;
				scope.showMenu = (angular.isUndefined(scope.showMenu)) ? true : scope.showMenu;

				scope.goHome = goHome;

				function goHome() {
					if (scope.showMenu) {
						$state.go('homesistemas');
					}
				}

				scope.$on('fw-menu-event-show', function () {
					scope.$apply(function () {
						scope.showName = true;
					});

					// $timeout(function () {
					// 	scope.showName = true;
					// }, 100);
				});

				scope.$on('fw-menu-event-hide', function () {

					scope.$apply(function () {
						scope.showName = false;
					});
				});

				scope.$on('fw-menu-event-toggle', function () {
					toggleShowName();
				});

				function toggleShowName() {
					scope.$apply(function () {
						scope.showName = !scope.showName;
					});
				}
			}
		}
	};

	return module;
})();