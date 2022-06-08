/**
 * @author:			Ezequiel Mansilla
 * @description:	Inicializador de paginacion
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwPaginationTemplate = require("./fwPaginationTemplate.html");
export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwPaginationInitializer', fwPaginationInitializer);

		fwPaginationInitializer.$inject = ['$log'];
		function fwPaginationInitializer ($log) : any {
			return {
				restrict : 'E',
				template : fwPaginationTemplate,
				controller : fwPaginationInitializerController,
				link: link
			};

			function link () {
				// $log.debug('fwPaginationInitializer linked');
			}
		}
		
		fwPaginationInitializerController.$inject = ['Logger', '$scope', '$rootScope'];
		function fwPaginationInitializerController($log, $scope, $rootScope) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */

			$log = $log.getInstance('fwPaginationInitializerController');
			// $log.debug('ON.-');

			/* ------------------------------------------ API Y VARIABLES ------------------------------------------ */

			$scope.pageChanged = pageChanged;
			$scope.pageSizeChanged = pageSizeChanged;

			/* ------------------------------------------ IMPLEMENTACION ------------------------------------------ */

			function pageSizeChanged(pageSize, pagination, idTable) {
				if (pageSize) {
					pagination.pageSize = pageSize;
					pageChanged(pagination, idTable);
				}
			}

			function pageChanged(pagination, idTable) {
				if (pagination.isValid()) {
					$scope.mostrar = false;
					$rootScope.$broadcast('fw-table-pagination-change-event', {
						pagination : pagination,
						idTable : idTable
					});
				}
			}
		}
	};

	return module;
})();