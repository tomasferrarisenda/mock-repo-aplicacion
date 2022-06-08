/**
 * @author:			Ezequiel Mansilla
 * @description:	Paginacion para tablas genericas
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTablePaginationExt', fwTablePaginationExt);

		fwTablePaginationExt.$inject = ['$log', 'Pagination'];
		function fwTablePaginationExt ($log, Pagination) {
			return {
				restrict : 'E',
				require : '^fwTableContainer',
				scope : {
					pageSize : '<',
					totalItems : '<',
					currentPage : '<?',
					pageChange : '&'
				},
				link: link
			};

			function link (scope, element, attrs, fwTableContainerController) {
				// $log.debug('fwTablePaginationExt linked');

				scope.$on('fw-table-ready-to-pagination-event', function (event, pPagination) {
					if (fwTableContainerController.isYourTable(pPagination.idTable)) {

						// // $log.debug('fwTablePaginationExt event on',data);
						var pagination = Pagination.build({
							type : 'externa',
							pageSize : scope.pageSize,
							totalItems : scope.totalItems,
							currentPage : scope.currentPage
						});
						// // $log.debug('fwTablePaginationExt',pagination);
						if (pagination.isValid())
							fwTableContainerController.setPagination(pagination);
					}


				});

				scope.$on('fw-table-pagination-change-event', function (event, data) {
					if (fwTableContainerController.isYourTable(data.idTable)) {
						scope.pageChange({pagination:data.pagination});
					}
				});
			}
		}
	};

	return module;
})();