/**
 * @author:			Ezequiel Mansilla
 * @description:	Ordenamiento de columna
 * @type:			Module
 **/
import * as angular from 'angular';
import Sorting from "./Sorting";
import fwTableSortingDirective from "./fwTableSortingDirective";
import fwTableSortingExtDirective from "./fwTableSortingExtDirective";
(function () {
	'use strict';
	/* Core.Component.Table.Sorting Module */
	const ngModule = angular.module('core.component.table.sorting',[]);

	Sorting.init(ngModule);
	fwTableSortingDirective.init(ngModule);
	fwTableSortingExtDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Sorting');
		// $log.debug('ON.-');
	}
})();