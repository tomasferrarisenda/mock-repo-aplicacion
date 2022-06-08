/**
 * @author:			Ezequiel Mansilla
 * @description:	Set de columnas de table
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init: (ngModule: any) => { } };

	module.init = function (ngModule) {

		ngModule.directive('fwTableColumnset', fwTableColumnset);

		fwTableColumnset.$inject = ['$log'];
		function fwTableColumnset($log) {
			return {
				restrict: 'E',
				require: ['^fwTableContainer', 'fwTableColumnset'],
				scope: {
					data: '<?'
				},
				link: link,
				controller: fwTableColumnsetController
			};

			function link(scope, element, attrs, controllers) {
				// $log.debug('fwTableColumnset linked');
				var fwTableContainer = controllers[0];
				var fwTableColumnset = controllers[1];

				// Si vienen definidas las columnas las agrego de a una por validaciones que se puedan
				// llegar a hacer
				if (scope.data && scope.data.length) {
					for (var i = scope.data.length - 1; i >= 0; i--) {
						fwTableColumnset.addColumn(scope.data[i]);
					}
				}

				fwTableContainer.setColumns(fwTableColumnset.getColumns());
			}
		}

		fwTableColumnsetController.$inject = ['Logger', 'Column'];
		function fwTableColumnsetController($log, Column) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableColumnsetController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			var columns: Array<any> = [];

			vm.addColumn = addColumn;
			vm.updateColumn = updateColumn;
			vm.getColumns = getColumns;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			/**
			 * Agrega columna al set de columnas
			 * @param {Column} pCol
			 */
			function addColumn(pCol) {
				var col = Column.build(pCol, columns.length + 1);
				if (col.isValid()) columns.push(col);
			}

			function updateColumn(pCol) {
				for (var i = columns.length - 1; i >= 0; i--) {
					if (columns[i].equals(pCol))
						columns[i] = pCol;
				}
			}

			function getColumns() {
				return columns;
			}
		}
	};

	return module;
})();