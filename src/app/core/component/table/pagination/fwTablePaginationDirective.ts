/**
 * @author:			Ezequiel Mansilla
 * @description:	Paginacion para tablas genericas
 * @type:			Directive
 **/
export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwTablePagination', fwTablePagination);

		fwTablePagination.$inject = ['$log', 'Pagination'];
		function fwTablePagination ($log, Pagination) {
			return {
				restrict : 'E',
				require : '^fwTableContainer',
				scope : {
					pageSize : '<?'
				},
				link: link
			};

			function link (scope, element, attrs, fwTableContainerController) {
				// $log.debug('fwTablePagination linked');

				scope.$on('fw-table-ready-to-pagination-event', function (event, pPagination) {
					if (fwTableContainerController.isYourTable(pPagination.idTable)) {
						// // $log.debug('fwTablePagination event on',data);
						var pagination = Pagination.build({
							type : 'interna',
							pageSize: pPagination.pageSize || scope.pageSize,
							totalItems : pPagination.totalItems,
							currentPage : pPagination.currentPage
						});
						// // $log.debug('fwTablePagination',pagination);
						if (pagination.isValid())
							fwTableContainerController.setPagination(pagination);
					}

				});

				scope.$on('fw-table-pagination-change-event', function (event, data) {
					if (fwTableContainerController.isYourTable(data.idTable)) {
						// // $log.debug('fwTablePagination event on',data);
						var pagination = Pagination.build({
							type : 'interna',
							pageSize : data.pagination.pageSize || scope.pageSize,
							totalItems : data.pagination.totalItems,
							currentPage : data.pagination.currentPage
						});
						// // $log.debug('fwTablePagination',pagination);
						if (pagination.isValid())
							fwTableContainerController.setPagination(pagination);
					}
				});
			}
		}
	};

	return module;
})();