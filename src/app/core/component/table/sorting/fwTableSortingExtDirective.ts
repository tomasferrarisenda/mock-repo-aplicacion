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

		ngModule.directive('fwTableSortingExt', fwTableSortingExt);

		fwTableSortingExt.$inject = ['$log'];
		function fwTableSortingExt ($log) {
			return {
				restrict : 'E',
				require : ['^fwTableContainer', 'fwTableSortingExt'],
				scope : {
					sortingIf : '<?',
					data : '<?',
					sortChange : '&?'
				},
				controller : fwTableSortingExtController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				// $log.debug('fwTableSortingExt linked');

				scope.sortingIf = (angular.isUndefined(attrs.sortingIf)) ? true : scope.sortingIf;

				var fwTableContainerController = controllers[0];
				var fwTableSortingExtController = controllers[1];

				fwTableSortingExtController.createSorting(scope.data);

				scope.$on('fw-table-column-set-ordenable', function (event, data) {
					if (scope.sortingIf) {
						
						if (fwTableContainerController.isYourTable(data.idTable)) {
							fwTableSortingExtController.addColumn(data.column);
							scope.sortChange({sorting : fwTableSortingExtController.getSorting()});
							// fwTableContainerController.setSorting(fwTableSortingExtController.getSorting());
						}
					}
				});
			}
		}

		fwTableSortingExtController.$inject = ['Logger', 'Sorting'];
		function fwTableSortingExtController($log, Sorting) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableSortingExtController');
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
					type : 'externo'
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