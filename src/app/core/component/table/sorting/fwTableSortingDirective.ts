/**
 * @author:			Ezequiel Mansilla
 * @description:	Ordenamiento de table
 * @type:			Directive
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableSorting', fwTableSorting);

		fwTableSorting.$inject = ['$log'];
		function fwTableSorting ($log) {
			return {
				restrict : 'E',
				require : ['^fwTableContainer', 'fwTableSorting'],
				scope : {
					sortingIf : '<?',
					data : '<?'
				},
				controller : fwTableSortingController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				// $log.debug('fwTableSorting linked');

				scope.sortingIf = (angular.isUndefined(attrs.sortingIf)) ? true : scope.sortingIf;

				var fwTableContainerController = controllers[0];
				var fwTableSortingController = controllers[1];

				fwTableSortingController.createSorting(scope.data);

				scope.$on('fw-table-column-set-ordenable', function (event, data) {
					if (scope.sortingIf) {
						
						if (fwTableContainerController.isYourTable(data.idTable)) {
							fwTableSortingController.addColumn(data.column);
							fwTableContainerController.setSorting(fwTableSortingController.getSorting());
						}
					}
				});
			}
		}

		fwTableSortingController.$inject = ['Logger', 'Sorting'];
		function fwTableSortingController($log, Sorting) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableSortingController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			var sorting;

			vm.createSorting = createSorting;
			vm.addColumn = addColumn;
			vm.getSorting = getSorting;

			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function createSorting(pData) {
				sorting = Sorting.build({
					type : 'interno'
				});

				if (pData && pData.length) {
					for (var i = pData.length - 1; i >= 0; i--) {
						addColumn(pData[i]);
					}
				}
			}
			function addColumn(pCol) {
				sorting.addCol(pCol);
			}

			function getSorting() {
				return sorting;
			}
		}
	};

	return module;
})();