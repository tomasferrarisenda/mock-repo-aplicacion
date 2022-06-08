/**
 * @author:			Ezequiel Mansilla
 * @description:	Set de rows
 * @type:			Directive
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableRowset', fwTableRowset);

		fwTableRowset.$inject = ['$log'];
		function fwTableRowset ($log) {
			return {
				restrict : 'E',
				require : ['^fwTableContainer', 'fwTableRowset'],
				scope : {
					data : '<?',
					clickAction : '&?',
					filterExpression: '&?',
					idElements: '@?'
				},
				link: link,
				controller: fwTableRowsetController
			};

			function link (scope, element, attrs, controllers) {
				// $log.debug('fwTableRowset linked');

				var fwTableContainerController = controllers[0];
				var fwTableRowsetController = controllers[1];

				scope.$watch(function () {
					return scope.data;
				}, updateDataTable, true);

				function updateDataTable(pData) {
					fwTableRowsetController.cleanRows();
					if (angular.isUndefined(scope.filterExpression)) scope.filterExpression = true;
					// Si vienen definidas las filas las agrego de a una por validaciones que se puedan
					// llegar a hacer y para setear la funcion de click
					if (pData && pData.length) {
						var row : any = {};

						for (var i = 0; i < pData.length; i++) {
							row.data = pData[i];
							row.clickAction = scope.clickAction;
							row.filterExpression = scope.filterExpression;
							row.idElements = scope.idElements;
							fwTableRowsetController.addRow(row);
						}
					}

					fwTableContainerController.setData(fwTableRowsetController.getRows());
				}
			}
		}

		fwTableRowsetController.$inject = ['Logger', 'Row'];
		function fwTableRowsetController($log, Row) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableRowsetController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			var rows : Array<any> = [];

			vm.addRow = addRow;
			vm.cleanRows = cleanRows;
			// vm.updateRow = updateRow;
			vm.getRows = getRows;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function addRow(pRow) {
				var row = Row.build(pRow);
				if (row.isValid()) rows.push(row);
			}

			function cleanRows() {
				rows = [];
			}

			// function updateRow(pRow) {
			// 	// body...
			// }

			function getRows() {
				return rows;
			}
		}
	};

	return module;
})();