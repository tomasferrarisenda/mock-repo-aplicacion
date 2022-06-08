/**
 * @author:			Ezequiel Mansilla
 * @description:	
 * @type:			Directive
 **/
import * as angular from 'angular';
import menuTemplate = require("./sa-menu.tpl.html");

export default (function () {
	'use strict';
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('saMenu', saMenu);

		saMenu.$inject = ['$log', 'MenuService'];
		function saMenu ($log, MenuService) {
			return {
				restrict : 'E',
				scope : {
					showItems : '<?',
					showNames : '<?'
				},
				template :menuTemplate,
				link : link
			};

			function link (scope, element, attrs) {
				MenuService.GetAll()
				.then(function (pItems) {
					scope.items = pItems;
				});

				scope.showItems = (angular.isUndefined(scope.showItems))? true : scope.showItems;
				scope.showNames = (angular.isUndefined(scope.showNames))? true : scope.showNames;
			}
		}
	};

	return module;
})();