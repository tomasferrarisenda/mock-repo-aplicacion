/**
 * @author:			Ezequiel Mansilla
 * @description:	Renderización de tabla
 * @type:			Directive
 **/
import fwTableTemplate = require("./fwTableTemplate.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTable', fwTable);

		fwTable.$inject = ['$log'];
		function fwTable ($log) : any {
			return {
				restrict : 'E',
				require : '^fwTableContainer',
				template : fwTableTemplate,
				link : link
			};

			function link (scope, element, attrs, fwTableContainerController) {
				// $log.debug('fwTable linked');
				
				function initData(pTable) {
					scope.table = pTable;
					// // $log.debug('fwTable initData', scope.table);
				}

				scope.$on('fw-table-ready-to-render-event', function (event, table) {
					if (scope.table.equals(table)) {
						$log.debug('fwTable ready to render event', table);
						initData(table);
					}
				});

				activate();
				function activate() {
					var data = fwTableContainerController.getTable();
					initData(data);
				}
			}
		}
	};

	return module;
})();