/**
 * @author:			Ezequiel Mansilla
 * @description:	Paginacion para tabla generica
 * @type:			Module
 **/
import * as angular from 'angular';
import Pagination from "./Pagination";
import fwTablePaginationDirective from "./fwTablePaginationDirective";
import fwTablePaginationExtDirective from "./fwTablePaginationExtDirective";
import fwPaginationInitializerDirective from "./fwPaginationInitializerDirective";
(function () {
	'use strict';
	/* Core.Component.Table.Pagination Module */
	const ngModule = angular.module('core.component.table.pagination',[]);

	Pagination.init(ngModule);
	fwTablePaginationDirective.init(ngModule);
	fwTablePaginationExtDirective.init(ngModule);
	fwPaginationInitializerDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];
	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Pagination');
		// $log.debug('ON.-');
	}
})();