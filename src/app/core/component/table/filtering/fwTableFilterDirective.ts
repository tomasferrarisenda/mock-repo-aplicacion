/**
 * @author:			Ezequiel Mansilla
 * @description:	Filtrado de tabla
 * @type:			Directive
 **/
import * as angular from 'angular';
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTableFilter', fwTableFilter);

		fwTableFilter.$inject = ['$log'];
		function fwTableFilter ($log) {
			return {
				restrict : 'E',
				require : ['^fwTableContainer', 'fwTableFilter'],
				scope: {
					init: '<?'
				},
				controller : fwTableFilterController,
				link: link
			};

			function link (scope, element, attrs, controllers) {
				// $log.debug('fwTableFilter linked');

				var fwTableContainerController = controllers[0];
				var fwTableFilterController = controllers[1];

				fwTableFilterController.createFiltering(scope.init);
				fwTableContainerController.setFiltering(fwTableFilterController.getFiltering());
				
				scope.$on('fw-table-filtering-changed', function (event, data) {
					// // $log.debug('fw-table-filtering-changed', data);
					if (fwTableContainerController.isYourTable(data.tableId)) {
						fwTableFilterController.addFilter({
							column : data.column,
							value : data.model
						});

						fwTableContainerController.setFiltering(fwTableFilterController.getFiltering());
					}
				});
			}
		}

		fwTableFilterController.$inject = ['Logger', '$scope', '$rootScope', 'Filtering', 'Filter'];
		function fwTableFilterController($log, $scope, $rootScope, Filtering, Filter) {
			
			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwTableFilterController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			var vm = this;
			var filtering : any = {};

			vm.createFiltering = createFiltering;
			vm.getFiltering = getFiltering;
			vm.addFilter = addFilter;


			/* ------------------------------------------- IMPLEMENTACIÓN ------------------------------------------- */

			function createFiltering(initStatus) {
				filtering.status = angular.isUndefined(initStatus) ? false : true;
				filtering.changeFunction = changeStatusFiltering;
				filtering = Filtering.build(filtering);
			}

			function changeStatusFiltering(pBool) {
				// $log.debug('scope in changeStatusFiltering', $scope);
				$rootScope.$broadcast('fw-table-filtering-ready-to-show', {show:pBool, tableId:$scope.$parent.table.id});
			}

			function getFiltering() {
				return filtering;
			}

			function addFilter(pFilter) {
				var filter = Filter.build(pFilter);
				filtering.addFilter(filter);
			}
		}
	};

	return module;
})();