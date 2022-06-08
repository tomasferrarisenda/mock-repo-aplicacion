/**
 * @author:			Ezequiel Mansilla
 * @description:	Manejo de Rows
 * @type:			Module
 **/
import * as angular from 'angular';
import Row from "./Row";
import fwTableRowSetDirective from "./fwTableRowSetDirective";
(function () {
	'use strict';
	/* Core.Component.Table.Row Module */
	const ngModule = angular.module('core.component.table.row',[]);

	Row.init(ngModule);
	fwTableRowSetDirective.init(ngModule);
	ngModule.run(run);

	run.$inject = ['Logger'];

	function run ($log) {
		$log = $log.getInstance('Core.Component.Table.Row');
		// $log.debug('ON.-');
	}
})();