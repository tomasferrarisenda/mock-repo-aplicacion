/**
 * @author:			Ezequiel Mansilla
 * @description:	Inicializador de filtros
 * @type:			Directive
 **/
import * as angular from 'angular';
import fwFilterTemplate = require("./fwFilterTemplate.html");
import './fwFilter.scss';

export default (function () {
	'use strict';
	
	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.directive('fwFilterInitializer', fwFilterInitializer);

		fwFilterInitializer.$inject = ['$log', '$rootScope', '$compile', '$templateCache'];
		function fwFilterInitializer ($log, $rootScope, $compile, $templateCache) {
			return {
				restrict : 'E',
				link: link
			};

			function link (scope, element) {
				// $log.debug('fwFilterInitializer linked');

				scope.$on('fw-table-filtering-ready-to-show', function (event, data) {
					if (data.tableId === scope.table.id) showFilters(data.show);

				});

				function showFilters(show) {
					if (show) {
						scope.filter = $compile(fwFilterTemplate)(scope);
						$(scope.filter).insertAfter(element);
						scope.table.filtering.status = show;
					} else {
						scope.table.filtering.status = false;
						$(scope.filter).remove();
					}
				}

				if (scope.table.filtering) showFilters(scope.table.filtering.status);
				scope.filterChange = filterChange;

				function filterChange(pModel, pCol, pTableId) {
					// // $log.debug('filterChange',pModel, pCol, pTableId);
					$rootScope.$broadcast('fw-table-filtering-changed', {
						model : pModel,
						column : pCol,
						tableId : pTableId
					});
				}
			}
		}
	};

	return module;
})();