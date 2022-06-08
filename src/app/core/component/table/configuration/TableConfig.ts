/**
 * @author:			Ezequiel Mansilla
 * @description:	Modelo de TableConfig
 * @type:			Service
 **/
import * as angular from 'angular';

export default (function () {
	'use strict';

	const module = { init : (ngModule: any) => {} };

	module.init = function (ngModule) {

		ngModule.factory('TableConfig', TableConfig);

		TableConfig.$inject = ['Logger'];
		
		function TableConfig ($log) {

			/* ------------------------------------------------ LOG ------------------------------------------------ */
			
			$log = $log.getInstance('TableConfig');
			// $log.debug('ON.-');

			class TableConfig {
				exportable : boolean;
				sortable : boolean;
				columnConfig : boolean;
				showTotalItems : boolean;
				showPageSize : boolean;
				paginable : boolean;
				filtrable : boolean;

				constructor(data) {
					this.exportable = data.exportable;			// [Bool] "ExportToExcelEnabled": true
					this.sortable = data.sortable;				// [Bool]
					this.columnConfig = data.columnConfig;		// [Bool] "ShowColumnsFilter": true,
					this.showTotalItems = data.showTotalItems;	// [Bool] "ShowRowCount": true,
					this.showPageSize = data.showPageSize;		// [Bool] "ShowPageSize": true,
					this.paginable = data.paginable;			// [Bool]
					this.filtrable = data.filtrable;			// [Bool]
				}

				public static build (data) {
					data.exportable = (angular.isUndefined(data.exportable)) ? false : data.exportable;
					data.columnConfig = (angular.isUndefined(data.columnConfig)) ? true : data.columnConfig;
	
					// Pagination 
					data.showTotalItems = (angular.isUndefined(data.showTotalItems)) ? true : data.showTotalItems;
					data.showPageSize = (angular.isUndefined(data.showPageSize)) ? true : data.showPageSize;
					data.paginable = (angular.isUndefined(data.paginable)) ? true : data.paginable;
					
					return new TableConfig(data);
				}
	
				public isValid() : boolean {
					return true;
				}
			}
			return TableConfig;
		}
	};

	return module;
})();